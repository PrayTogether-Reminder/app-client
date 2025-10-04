import React, { useRef, useState } from "react";
import { View, Pressable, StyleSheet, Animated } from "react-native";
import { Text, Avatar, Card } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { PrayerTitle } from "../../../../../src/domain/prayers/types/prayerTitle";
import { color } from "../../../../../src/common/styles/color";
import {
  convertLocalToUTC,
  formatDate,
} from "../../../../../src/common/services/time/timeService";
import ConfirmationModal from "../../../../../src/common/components/modal/ConfirmationModal";
import { useDeletePrayerTitleMutation } from "../../../../../src/domain/prayers/hooks/mutations/usePrayerMutations";

interface PrayerTitleItemProps {
  item: PrayerTitle;
  onPress: (title: PrayerTitle) => void;
  roomId: number;
}

export default function PrayerTitleItem({
  item,
  onPress,
  roomId,
}: PrayerTitleItemProps): JSX.Element {
  // 애니메이션을 위한 Animated.Value 생성
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 삭제 모달 상태
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 삭제 mutation
  const { mutate: deletePrayerTitle, isPending: isDeleting } = useDeletePrayerTitleMutation();

  // 터치 시작할 때 실행되는 애니메이션 (축소)
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 15,
    }).start();
  };

  // 터치 종료할 때 실행되는 애니메이션 (원래 크기로)
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 15,
    }).start();
  };

  // Long press 핸들러 - 삭제 확인 모달 표시
  const handleLongPress = () => {
    setDeleteModalVisible(true);
  };

  // 삭제 확인 핸들러
  const handleConfirmDelete = () => {
    deletePrayerTitle(
      { prayerTitleId: item.id, roomId },
      {
        onSuccess: () => {
          setDeleteModalVisible(false);
        },
      }
    );
  };

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => onPress(item)}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.prayerItemContainer}
        android_ripple={null} // Android에서 기본 물결 효과 제거
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Card style={styles.prayerCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                {/* <Avatar.Text
                  size={45}
                  label={"카테고리"}
                  style={{ backgroundColor: color.secondary }}
                /> */}
              </View>

              <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                  {/* <Text style={styles.prayerCategory}>{"방 카테고리"}</Text> */}
                  {/* <Text style={styles.prayerTime}>{"횟불"}</Text> */}
                </View>

                <Text style={styles.prayerTitle}>{item.title}</Text>
                <View style={styles.metaContainer}>
                  <Text style={styles.prayerDate}>{`작성 날짜 : ${formatDate(
                    convertLocalToUTC(item.createdTime)
                  )}`}</Text>
                  {/* <Text style={styles.prayerSubtitle}>{"방 서브 제목"}</Text> */}
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </Pressable>

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        visible={deleteModalVisible}
        onDismiss={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        icon="delete-alert"
        iconColor={color.error}
        title="기도 제목 삭제"
        content="이 기도 제목을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
      />
    </>
  );
}

const styles = StyleSheet.create({
  prayerItemContainer: {
    marginHorizontal: 15,
    marginVertical: 8,
  },
  prayerCard: {
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
    flexDirection: "row",
  },
  avatarContainer: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  prayerCategory: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: "#333333",
  },
  prayerTime: {
    fontSize: RFValue(12),
    color: color.gray,
  },
  prayerTitle: {
    fontSize: RFValue(16),
    fontWeight: "700",
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  prayerDate: {
    fontSize: RFValue(12),
    color: "#666666",
    marginRight: 8,
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  prayerSubtitle: {
    fontSize: RFValue(12),
    color: "#666666",
  },
});
