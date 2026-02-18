import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PrayerTitle } from "@/domain/prayers/types/prayerTitle";
import { color } from "@/common/styles/color";
import { AccentCard } from "@/common/components/card";
import { AvatarStack } from "@/common/components/avatar";
import {
  convertLocalToUTC,
  formatDate,
} from "@/common/services/time/timeService";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { useDeletePrayerTitleMutation } from "@/domain/prayers/hooks/mutations/usePrayerMutations";
import PrayerTitleOptionSheet from "./sheets/PrayerTitleOptionSheet";
import Animated, { Layout, SlideInDown, SlideOutDown } from "react-native-reanimated";

interface PrayerTitleItemProps {
  item: PrayerTitle;
  onPress: (title: PrayerTitle) => void;
  roomId: number;
}

export default function PrayerTitleItem({
  item,
  onPress,
  roomId,
}: PrayerTitleItemProps): React.JSX.Element {
  const [showSheet, setShowSheet] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { mutate: deletePrayerTitle } = useDeletePrayerTitleMutation();
  const prayers = item.prayers ?? [];
  const hasParticipants = prayers.length > 0;
  const noParticipantText = "아직 기도한 사람이 없어요";

  const handleLongPress = () => {
    setShowSheet(true);
  };

  const handleCloseSheet = () => {
    setShowSheet(false);
  };

  const handleOpenDeleteModal = () => {
    setShowSheet(false);
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
      <Animated.View
        layout={Layout.springify().damping(18).stiffness(160)}
        entering={SlideInDown.duration(350)}
        exiting={SlideOutDown.duration(250)}
      >
        <AccentCard
          onPress={() => onPress(item)}
          onLongPress={handleLongPress}
          style={styles.prayerItemContainer}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.prayerTitle} numberOfLines={2}>
              {item.title}
            </Text>

            <View style={styles.participantRow}>
              {hasParticipants ? (
                <>
                  <AvatarStack
                    names={prayers.map((prayer) => prayer.memberName ?? "익명")}
                    maxDisplayed={3}
                    size={26}
                  />
                  <Text style={styles.participantText} numberOfLines={1}>
                    {prayers.length}명이 기도했어요
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.emptyAvatarPlaceholder}>
                    <MaterialCommunityIcons
                      name="hand-heart"
                      size={RFValue(18)}
                      color={color.grayLight}
                    />
                  </View>
                  <Text
                    style={[styles.participantText, styles.emptyParticipantText]}
                    numberOfLines={1}
                  >
                    {noParticipantText}
                  </Text>
                </>
              )}
            </View>

            <View style={styles.metaContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={RFValue(13)}
                color={color.grayLight}
                style={styles.clockIcon}
              />
              <Text style={styles.prayerDate}>
                {formatDate(convertLocalToUTC(item.createdTime))}
              </Text>
            </View>
          </View>
        </AccentCard>
      </Animated.View>

      <PrayerTitleOptionSheet
        visible={showSheet}
        onDismiss={handleCloseSheet}
        prayerTitle={item}
        onDelete={handleOpenDeleteModal}
      />

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
    color: color.grayLight,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(10),
  },
  participantText: {
    flex: 1,
    fontSize: RFValue(12),
    color: color.gray,
  },
  emptyParticipantText: {
    color: color.grayLight,
  },
  emptyAvatarPlaceholder: {
    width: RFValue(28),
    height: RFValue(28),
    borderRadius: RFValue(14),
    borderWidth: 1,
    borderColor: color.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.white,
  },
});
