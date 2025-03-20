import React, { useState, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { TextInput, Button, Divider, Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";
import { SelectedMember } from "../types/SelectedMember";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PrayerCard from "./PrayerContentCard";
import { usePrayerCreationStore } from "./../stores/usePrayerCreationStore";
import { PrayerCreationItem } from "../types/PrayerCreationItem";
import PrayerDeleteDialog from "./dialog/PrayerDeleteDialog";
import { useSelectedRoomStore } from "../../prayerRoom/types/selectedRoomStore";
import { useRoomMembersQuery } from "../../prayerRoom/hooks/queries/roomQueries";
import { RoomMember } from "../../prayerRoom/types/dto/response/roomMember";
import PrayerCustomNameDialog from "./dialog/PrayerCustomNameDialog";
import PrayerMemberSelectionModal from "./modal/PrayerMemberSelectionModal";

// 화면 너비 가져오기
const { width } = Dimensions.get("window");

interface PrayerCreationBodyProps {
  prayerTitle: string;
  setPrayerTitle: (text: string) => void;
}

export default function PrayerCreationBody({
  prayerTitle,
  setPrayerTitle,
}: PrayerCreationBodyProps) {
  const {
    add: addPrayer,
    delete: deletePrayer,
    update: updateParyer,
    prayerList,
  } = usePrayerCreationStore();

  // 현재 보고 있는 기도문 인덱스
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prayerDelete, setPrayerDelete] = useState<PrayerCreationItem | null>(
    null
  );
  const [prayerDeleteDialog, setPrayerDeleteDialog] = useState(false);
  const [prayerContent, setPrayerContent] = useState("");
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
    null
  );
  const room = useSelectedRoomStore().selectedRoom;
  const { data: roomMembers } = useRoomMembersQuery(room?.id ?? "");
  const { clear: clearPrayer } = usePrayerCreationStore();
  const customNameRef = useRef({ customName: "" });
  const [customNameDialogVisible, setCustomNameDialogVisible] = useState(false);
  const [memberSelectionModalVisible, setMemberSelectionModalVisible] =
    useState(false);

  // 멤버 선택 모달 열기
  const openMemberSelectionModal = () => {
    setMemberSelectionModalVisible(true);
  };

  // 멤버 선택 모달 닫기
  const closeMemberSelectionModal = () => {
    setMemberSelectionModalVisible(false);
  };

  // 멤버 직접 입력 다이얼로그 열기
  const showCustomNameDialog = () => {
    setCustomNameDialogVisible(true);
    setMemberSelectionModalVisible(false);
  };

  // 멤버 직접 입력 다이얼로그 닫기
  const hideCustomNameDialog = () => {
    setCustomNameDialogVisible(false);
    onChangeCustomName("");
  };

  // 커스텀 멤버 이름 변경
  const onChangeCustomName = (name: string) => {
    customNameRef.current.customName = name;
  };

  // 이름순으로 정렬된 멤버 목록
  const sortedRoomMembers = useMemo(() => {
    //todo: 이미 작성된 이름은 제외.
    if (!roomMembers) return [];
    return [...roomMembers].sort((a, b) => a.name.localeCompare(b.name));
  }, [roomMembers]);

  // 방 구성원 선택 처리
  const handleSelectMember = (member: RoomMember) => {
    setSelectedMember({
      ...member,
      // isRoomMember: true,
    });
    setMemberSelectionModalVisible(false);
  };

  // 직접 입력한 이름 추가
  const addCustomName = () => {
    const customName = customNameRef.current.customName;
    if (customName.trim()) {
      const newMember: SelectedMember = {
        id: "customMember",
        name: customName.trim(),
        // isRoomMember: false,
      };

      setSelectedMember(newMember);
      hideCustomNameDialog();
    }
  };

  // 기도문 추가 함수
  const handleAddPrayer = () => {
    if (!prayerContent.trim() || !selectedMember) return;
    const newPrayer: PrayerCreationItem = {
      memberId: selectedMember.id,
      content: prayerContent,
      memberName: selectedMember.name,
    };

    addPrayer(newPrayer);

    // 기도 내용만 초기화
    setPrayerContent("");
    setSelectedMember(null);
    setCurrentIndex(0);
  };

  // 기도문 삭제 Dialog
  const showPrayerDeleteDialog = (prayer: PrayerCreationItem) => {
    setPrayerDelete(prayer);
    setPrayerDeleteDialog(true);
  };

  // 기도문 삭제 취소
  const cancelPrayerDelete = () => {
    setPrayerDeleteDialog(false);
  };

  // 기도문 삭제 확인
  const confirmPrayerDelete = () => {
    setPrayerDeleteDialog(false);
    if (prayerDelete) {
      deletePrayer(prayerDelete);
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (width - RFValue(60)));
    setCurrentIndex(index);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={Platform.OS === "ios" ? 60 : 50}
      keyboardShouldPersistTaps="handled"
    >
      {/* 기도 제목 입력 */}
      <TextInput
        label="기도 제목 (최대 50글자)"
        value={prayerTitle}
        onChangeText={setPrayerTitle}
        style={styles.titleInput}
        contentStyle={{ fontSize: RFValue(14) }}
        mode="outlined"
        maxLength={50}
      />

      <Divider style={styles.divider} />

      {/* 사람 선택 버튼 */}
      <Button
        mode="outlined"
        icon="account-multiple"
        onPress={openMemberSelectionModal}
        style={styles.memberSelectButton}
        labelStyle={styles.buttonLabel}
      >
        {selectedMember === null
          ? "기도 대상자 선택"
          : `${selectedMember?.name}`}
      </Button>

      {/* 기도 내용 입력 */}
      <View style={styles.contentContainer}>
        <TextInput
          label={
            selectedMember === null
              ? "기도 대상자를 선택하세요."
              : `${selectedMember.name}님을 위한 기도문`
          }
          value={prayerContent}
          onChangeText={setPrayerContent}
          style={styles.contentInput}
          contentStyle={{
            fontSize: RFValue(14),
            textAlignVertical: "top", // 텍스트가 상단에서 시작하도록
          }}
          mode="outlined"
          multiline
          disabled={!selectedMember}
          scrollEnabled={true} // 내용이 많아질 경우 스크롤 가능
          numberOfLines={8}
        />
      </View>

      {/* 기도문 추가 버튼 */}
      <Button
        mode="contained"
        onPress={handleAddPrayer}
        style={[
          styles.addButton,
          (!prayerContent.trim() || !selectedMember) &&
            styles.addButton_disabled,
        ]}
        labelStyle={styles.addButtonLabel}
        disabled={!prayerContent.trim() || !selectedMember}
      >
        기도문 추가
      </Button>

      <Divider style={styles.divider} />

      {/* 작성된 기도문 목록 섹션 */}
      <View style={styles.prayersListContainer}>
        <Text style={styles.prayersListTitle}>작성된 기도문</Text>

        {prayerList.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              아직 작성된 기도문이 없습니다.
            </Text>
            <Text style={styles.emptyListSubText}>
              위 양식을 작성하고 추가해보세요.
            </Text>
          </View>
        ) : (
          <View style={styles.carouselContainer}>
            <FlatList
              data={prayerList}
              keyExtractor={(item) => item.memberName}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={width - RFValue(60)}
              decelerationRate="fast"
              onScroll={handleScroll}
              contentContainerStyle={styles.flatListContent}
              renderItem={({ item }) => (
                <PrayerCard
                  memberName={item.memberName}
                  content={item.content}
                  onDelete={() => showPrayerDeleteDialog(item)}
                />
              )}
            />

            {/* 페이지 카운터 (1/2 형식) */}
            {prayerList.length > 0 && (
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                  {currentIndex + 1}/{prayerList.length}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* 기도문 삭제 확인 Dialog */}
      <PrayerDeleteDialog
        visible={prayerDeleteDialog}
        onDismiss={cancelPrayerDelete}
        onConfirm={confirmPrayerDelete}
        memberName={prayerDelete?.memberName}
      />

      {/* 멤버 선택 Modal */}
      <PrayerMemberSelectionModal
        visible={memberSelectionModalVisible}
        onDismiss={closeMemberSelectionModal}
        members={sortedRoomMembers}
        onSelectMember={handleSelectMember}
        onCustomNamePress={showCustomNameDialog}
      />

      {/* 멤버 직접 입력 Dialog */}
      <PrayerCustomNameDialog
        visible={customNameDialogVisible}
        onDismiss={hideCustomNameDialog}
        customNameRef={customNameRef}
        onChangeText={onChangeCustomName}
        onCancel={hideCustomNameDialog}
        onAdd={addCustomName}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: RFValue(20),
    paddingBottom: RFValue(24),
  },
  titleInput: {
    backgroundColor: color.white,
    fontSize: RFValue(14),
    marginTop: -RFValue(8),
  },
  memberSelectButton: {
    borderRadius: RFValue(24),
    backgroundColor: color.white,
  },
  memberContainer: {
    height: RFValue(24),
    justifyContent: "center",
    marginVertical: RFValue(8),
  },
  buttonLabel: {
    fontSize: RFValue(14),
    color: color.secondary,
  },
  contentContainer: {},
  contentInput: {
    backgroundColor: color.white,
    fontSize: RFValue(14),
    height: RFValue(150),
  },
  divider: {
    marginVertical: RFValue(16),
    height: RFValue(1),
  },
  addButton: {
    marginTop: RFValue(16),
    backgroundColor: color.secondary,
    borderRadius: RFValue(8),
  },
  addButton_disabled: {
    backgroundColor: color.gray,
  },
  addButtonLabel: {
    fontSize: RFValue(14),
    color: color.white,
  },
  prayersListContainer: {},
  prayersListTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(16),
    color: color.secondary,
  },
  emptyListContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFValue(40),
    backgroundColor: `${color.secondary}10`,
    borderRadius: RFValue(8),
  },
  emptyListText: {
    fontSize: RFValue(16),
    color: color.secondary,
    marginBottom: RFValue(8),
  },
  emptyListSubText: {
    fontSize: RFValue(14),
    color: color.secondary,
    opacity: 0.7,
  },
  carouselContainer: {
    marginHorizontal: -RFValue(20), // 부모 패딩 제거
    paddingHorizontal: RFValue(20),
  },
  flatListContent: {
    paddingRight: RFValue(40),
  },
  counterContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(4),
  },
  counterText: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.secondary,
  },
});
