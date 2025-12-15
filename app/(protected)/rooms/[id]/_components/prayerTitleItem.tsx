import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrayerTitle } from "../../../../../src/domain/prayers/types/prayerTitle";
import { color } from "../../../../../src/common/styles/color";
import { AccentCard } from "@/common/components/card";
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { mutate: deletePrayerTitle } = useDeletePrayerTitleMutation();

  const handleLongPress = () => {
    setDeleteModalVisible(true);
  };

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

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <>
      <AccentCard
        onPress={() => onPress(item)}
        onLongPress={handleLongPress}
        style={styles.prayerItemContainer}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.prayerTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.metaContainer}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={RFValue(13)}
              color="#888888"
              style={styles.clockIcon}
            />
            <Text style={styles.prayerDate}>
              {formatDate(convertLocalToUTC(item.createdTime))}
            </Text>
          </View>
        </View>
      </AccentCard>

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
    marginHorizontal: RFValue(16),
    marginVertical: RFValue(8),
  },
  contentContainer: {
    gap: RFValue(8),
  },
  prayerTitle: {
    fontSize: RFValue(16),
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: RFValue(22),
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  clockIcon: {
    marginRight: RFValue(4),
  },
  prayerDate: {
    fontSize: RFValue(12),
    color: "#888888",
  },
});
