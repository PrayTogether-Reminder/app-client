import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {
  Portal,
  Modal,
  Text,
  TextInput,
  Button,
  IconButton,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import Feather from "@expo/vector-icons/Feather";
import { showAlert } from "@/common/components/modal/stores/useAlertStore";
import { useRoomMembersQuery } from "@/domain/rooms/hooks/queries/useRoomQueries";
import { useSelectedRoomStore } from "@/domain/rooms/stores/useSelectedRoomStore";
import PrayerMemberSelectionModal from "../../../creation/_components/modal/PrayerMemberSelectionModal";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { dialogStyles } from "@/styles/dialogStyles";
import { useDialogWithConfirmation } from "@/hooks/useDialogWithConfirmation";
import { useKoreanInput } from "@/hooks/useKoreanInput";

interface PrayerContentAddDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (memberName: string, content: string) => void;
}

export default function PrayerContentAddDialog({
  visible,
  onDismiss,
  onAdd,
}: PrayerContentAddDialogProps) {
  const [memberName, setMemberName] = useState("");
  const [memberSelectionModal, setMemberSelectionModal] = useState(false);
  const [isDirectInput, setIsDirectInput] = useState(false);
  
  const room = useSelectedRoomStore().selectedRoom;
  const { data: roomMembers } = useRoomMembersQuery(room?.id ?? null);

  // 기도 내용용 훅
  const {
    textInputRef,
    handleChange,
    getValue,
    clear,
  } = useKoreanInput({ initialValue: "", visible });

  // 직접 입력용 훅 (멤버 이름)
  const {
    textInputRef: memberInputRef,
    handleChange: handleMemberChange,
    getValue: getMemberValue,
    clear: clearMember,
  } = useKoreanInput({ initialValue: "", visible: visible && isDirectInput });

  const {
    showCancelConfirm,
    handleCancel,
    confirmCancel,
    cancelCancel,
  } = useDialogWithConfirmation({
    onDismiss,
    checkDirty: () => (isDirectInput ? getMemberValue().trim() : memberName.trim()) !== "" || getValue().trim() !== "",
    onConfirmCancel: () => {
      setMemberName("");
      clear();
      clearMember();
    },
  });

  useEffect(() => {
    if (visible) {
      setMemberName("");
      setIsDirectInput(false);
      clear();
      clearMember();
    }
  }, [visible, clear, clearMember]);

  const handleAdd = useCallback(() => {
    const finalMemberName = isDirectInput ? getMemberValue().trim() : memberName.trim();
    
    if (!finalMemberName) {
      showAlert({
        title: "입력 확인",
        message: "기도 대상을 선택해주세요.",
      });
      return;
    }

    const trimmedContent = getValue().trim();
    if (!trimmedContent) {
      showAlert({
        title: "입력 확인",
        message: "기도 내용을 입력해주세요.",
      });
      return;
    }

    onAdd(finalMemberName, getValue());
    setMemberName("");
    clear();
    clearMember();
  }, [memberName, getValue, getMemberValue, isDirectInput, onAdd, clear, clearMember]);

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleCancel}
          dismissable={false}
          dismissableBackButton={true}
          contentContainerStyle={dialogStyles.modalContainer}
          style={dialogStyles.modal}
        >
          <TouchableWithoutFeedback 
            onPress={Keyboard.dismiss}
            accessible={true}
            accessibilityRole="none"
            accessibilityLabel="다이얼로그 배경">
            <View style={dialogStyles.content}>
              <Text style={dialogStyles.title}>기도 내용 추가</Text>

              <View style={dialogStyles.fieldset}>
                <Text style={dialogStyles.label}>기도 대상</Text>
                <View style={{ height: RFValue(45) }}>
                  {isDirectInput ? (
                    <View style={{ flexDirection: 'row', gap: RFValue(8), alignItems: 'center', height: '100%' }}>
                      <TextInput
                        ref={memberInputRef}
                        defaultValue=""
                        onChangeText={handleMemberChange}
                        placeholder="이름을 입력하세요"
                        style={[dialogStyles.input, { flex: 1, height: RFValue(45) }]}
                        contentStyle={{ paddingVertical: RFValue(8) }}
                        mode="outlined"
                        autoFocus
                        accessibilityLabel="기도 대상 이름 입력"
                        accessibilityHint="기도 대상의 이름을 직접 입력하세요"
                      />
                      <IconButton
                        icon="account-multiple"
                        mode="contained"
                        size={RFValue(20)}
                        onPress={() => {
                          setIsDirectInput(false);
                          setMemberName("");
                          clearMember();
                        }}
                        style={{ margin: 0, height: RFValue(45), width: RFValue(45) }}
                        accessibilityLabel="멤버 선택으로 전환"
                      />
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', gap: RFValue(8), height: '100%' }}>
                      <Button
                        mode="outlined"
                        onPress={() => setMemberSelectionModal(true)}
                        style={[dialogStyles.memberButton, { flex: 1, height: RFValue(45) }]}
                        contentStyle={{ height: RFValue(45), paddingVertical: 0 }}
                        labelStyle={{ marginVertical: RFValue(8) }}
                        accessibilityLabel="기도 대상 선택"
                        accessibilityHint="기도 대상을 선택합니다"
                      >
                        {memberName || "선택하세요"}
                      </Button>
                      <IconButton
                        icon="pencil"
                        mode="contained"
                        size={RFValue(20)}
                        onPress={() => setIsDirectInput(true)}
                        style={{ margin: 0, height: RFValue(45), width: RFValue(45) }}
                        accessibilityLabel="직접 입력으로 전환"
                      />
                    </View>
                  )}
                </View>
              </View>

              <View style={dialogStyles.fieldset}>
                <Text style={dialogStyles.label}>기도 내용</Text>
                <TextInput
                  ref={textInputRef}
                  placeholder="기도 내용을 입력하세요"
                  defaultValue=""
                  onChangeText={handleChange}
                  style={dialogStyles.inputMultilineSmall}
                  mode="outlined"
                  multiline
                  numberOfLines={6}
                  accessibilityLabel="기도 내용 입력"
                  accessibilityHint="기도 내용을 입력하세요"
                  accessibilityMultiline={true}
                />
              </View>

              <View style={dialogStyles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={dialogStyles.cancelButton}
                  labelStyle={dialogStyles.buttonLabel}
                >
                  취소
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAdd}
                  style={dialogStyles.addButton}
                  labelStyle={dialogStyles.buttonLabel}
                >
                  추가
                </Button>
              </View>

              <IconButton
                icon={() => <Feather name="x" size={RFValue(24)} color="black" />}
                onPress={handleCancel}
                style={dialogStyles.closeButton}
                size={24}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>

      <PrayerMemberSelectionModal
        visible={memberSelectionModal}
        onDismiss={() => setMemberSelectionModal(false)}
        members={roomMembers || []}
        onSelectMember={(member) => {
          setMemberName(member.name);
          setMemberSelectionModal(false);
        }}
      />

      {/* 변경 취소 확인 모달 */}
      <ConfirmationModal
        visible={showCancelConfirm}
        onDismiss={cancelCancel}
        onConfirm={confirmCancel}
        icon="alert-circle"
        title="작성 취소"
        content="작성한 내용이 저장되지 않습니다. 취소하시겠습니까?"
        confirmText="취소"
        cancelText="계속 작성"
      />
    </>
  );
}