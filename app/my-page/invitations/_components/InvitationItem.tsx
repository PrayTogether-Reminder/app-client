import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  Button,
  useTheme,
  Paragraph,
  Title,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
// import { formatDistanceToNow } from "date-fns"; // 날짜 포맷팅 라이브러리
// import { ko } from "date-fns/locale"; // 한국어 locale

export type Invitation = {
  id: string;
  prayerRoomName: string;
  inviterName: string;
  invitedAt: Date;
};

type InvitationItemProps = {
  invitation: Invitation;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export default function InvitationItem({
  invitation,
  onAccept,
  onReject,
}: InvitationItemProps): React.ReactElement {
  const theme = useTheme();

  // 'X시간 전', 'Y일 전' 등으로 표시
  // const timeAgo = formatDistanceToNow(invitation.invitedAt, {
  //   addSuffix: true,
  //   locale: ko,
  // });

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <Title style={styles.prayerRoomName}>{invitation.prayerRoomName}</Title>
        <Paragraph style={styles.inviterInfo}>
          <Text style={styles.inviterName}>{invitation.inviterName}</Text> 님이
          초대했습니다.
        </Paragraph>
        {/* <Paragraph style={styles.invitedTime}>{timeAgo}</Paragraph> */}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button
          mode="outlined"
          onPress={() => onReject(invitation.id)}
          style={[styles.button, styles.rejectButton]}
          labelStyle={styles.buttonLabel}
          textColor={theme.colors.error} // 거절 버튼은 에러 색상 사용
          icon="close-circle-outline"
        >
          거절
        </Button>
        <Button
          mode="contained"
          onPress={() => onAccept(invitation.id)}
          style={[styles.button, styles.acceptButton]}
          labelStyle={styles.buttonLabel}
          icon="check-circle-outline"
        >
          수락
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: RFValue(12),
    // elevation: 2, // 약간의 그림자 효과
  },
  cardContent: {
    paddingBottom: RFValue(8), // Actions와의 간격 조절
  },
  prayerRoomName: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    marginBottom: RFValue(4),
  },
  inviterInfo: {
    fontSize: RFValue(13),
    color: "#555", // 약간 어두운 회색
  },
  inviterName: {
    fontWeight: "bold",
  },
  invitedTime: {
    fontSize: RFValue(11),
    color: "#888", // 더 연한 회색
    marginTop: RFValue(6),
  },
  actions: {
    justifyContent: "flex-end", // 버튼들을 오른쪽으로 정렬
    paddingTop: RFValue(0), // Content와의 간격 제거
    paddingBottom: RFValue(8),
    paddingHorizontal: RFValue(12),
  },
  button: {
    marginLeft: RFValue(8),
    minWidth: RFValue(80), // 버튼 최소 너비 지정
  },
  rejectButton: {
    borderColor: "#EAEAEA", // 테두리 색 약간 연하게
  },
  acceptButton: {
    // 기본 contained 스타일 사용
  },
  buttonLabel: {
    fontSize: RFValue(13), // 버튼 텍스트 크기 조절
  },
});
