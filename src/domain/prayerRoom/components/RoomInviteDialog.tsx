import React, { useRef, useState } from "react";
import { StyleSheet, Dimensions, Alert, View } from "react-native";
import { Portal, Dialog, TextInput, Button } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize"; // Import RFValue
import { color } from "../../../common/styles/color";
import { validateEmail } from "../../../common/services/email/emailService";
import { useInviteRoomMemberMutation } from "./../hooks/mutations/roomMutations";
import { useSelectedRoomStore } from "../stores/useSelectedRoomStore";

interface RoomInviteDialogProps {
  visible: boolean;
  closeInvite: () => void;
  emailRef: React.MutableRefObject<{ email: string }>;
}

const { height, width } = Dimensions.get("window");

const RoomInviteDialog = ({
  visible,
  closeInvite,
  emailRef,
}: RoomInviteDialogProps) => {
  const { mutate: inviteMember } = useInviteRoomMemberMutation();
  const room = useSelectedRoomStore().selectedRoom;

  const onChangeEmail = (text: string) => {
    emailRef.current.email = text;
  };

  // 초대 처리
  const handleInvite = () => {
    if (!emailRef.current) {
      Alert.alert("이메일을 입력해주세요.");
      return;
    }

    const fullEmail = emailRef.current.email;
    const email = fullEmail.trim();
    if (!validateEmail(email)) {
      Alert.alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    console.log("초대할 이메일:", email);

    inviteMember(
      { roomId: room?.id as string, email },
      {
        onSettled(data, error, variables, context) {
          if (data) {
            closeInvite();
          }
        },
      }
    );
  };

  return (
    <Portal>
      <Dialog style={styles.dialog} visible={visible} onDismiss={closeInvite}>
        <Dialog.Title style={styles.title}>기도방 초대하기</Dialog.Title>
        <Dialog.Content style={styles.content}>
          <TextInput
            label="이메일 주소"
            onChangeText={onChangeEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.emailInput}
          />
        </Dialog.Content>
        <Dialog.Actions style={styles.actions}>
          <Button
            style={styles.cancelBtn}
            labelStyle={styles.buttonLabel}
            onPress={closeInvite}
          >
            취소
          </Button>
          <Button
            style={styles.inviteBtn}
            labelStyle={styles.buttonLabel}
            onPress={handleInvite}
            mode="contained"
          >
            초대
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: color.white,
    marginTop: -height * 0.2,
    width: "90%",
    alignSelf: "center",
  },
  title: {
    fontSize: RFValue(24), // Dialog title text size
  },
  content: {
    paddingBottom: RFValue(10),
  },
  emailInput: {
    marginVertical: RFValue(10),
    backgroundColor: color.white,
  },
  actions: {
    paddingHorizontal: RFValue(15),
    paddingBottom: RFValue(15),
    justifyContent: "space-between",
  },
  inviteBtn: {
    backgroundColor: color.secondary,
    paddingHorizontal: RFValue(10),
    borderRadius: RFValue(8),
    minWidth: RFValue(100),
  },
  cancelBtn: {
    backgroundColor: color.white,
    paddingHorizontal: RFValue(10),
    borderRadius: RFValue(8),
    minWidth: RFValue(100),
  },
  buttonLabel: {
    fontSize: RFValue(16), // Changed from static 16 to responsive RFValue(16)
    fontWeight: "bold",
    paddingVertical: 2, // 버튼 내 텍스트 패딩으로 버튼 높이 증가
  },
});

export default React.memo(RoomInviteDialog);
