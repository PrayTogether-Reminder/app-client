import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { TextInput, Chip, Avatar, Button, Divider } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color, flexMarker } from "../../../common/styles/color";
import { RoomMember } from "../../prayerRoom/types/dto/response/roomMember";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// 멤버 타입 정의
interface SelectedMember extends RoomMember {
  isRoomMember: boolean;
}

interface PrayerCreationBodyProps {
  prayerTitle: string;
  setPrayerTitle: (text: string) => void;
  prayerContent: string;
  setPrayerContent: (text: string) => void;
  selectedMember: SelectedMember | null;
  openMemberSelectionModal: () => void;
}

export default function PrayerCreationBody({
  prayerTitle,
  setPrayerTitle,
  prayerContent,
  setPrayerContent,
  selectedMember,
  openMemberSelectionModal,
}: PrayerCreationBodyProps) {
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
        기도 대상자 선택하기
      </Button>

      {/* 선택한 사람 */}
      <View style={styles.memberContainer}>
        {selectedMember ? (
          <Chip
            avatar={
              <Avatar.Text
                size={RFValue(24)}
                label={selectedMember.name.charAt(0)}
              />
            }
            style={styles.selectedMemberChip}
            selected
            selectedColor={color.secondary}
            textStyle={styles.chipText}
          >
            {selectedMember.name}
          </Chip>
        ) : null}
      </View>

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
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    padding: RFValue(20),
    paddingBottom: RFValue(40),
  },
  titleInput: {
    backgroundColor: color.white,
    fontSize: RFValue(14),
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
  selectedMemberChip: {
    backgroundColor: `${color.secondary}20`,
    justifyContent: "center",
    height: RFValue(36),
  },
  chipText: {
    fontSize: RFValue(14),
  },
  contentContainer: {
    marginBottom: RFValue(20),
  },
  contentInput: {
    backgroundColor: color.primary,
    fontSize: RFValue(14),
    height: RFValue(150),
  },
  divider: {
    marginVertical: RFValue(16),
    height: RFValue(1),
  },
});
