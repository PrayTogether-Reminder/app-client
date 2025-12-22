import { StyleSheet, ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CommonBottomSheet } from "@/common/components/bottomSheet";
import { color } from "@/common/styles/color";
import { PrayerTitle, Prayer } from "@/domain/prayers/types/prayerTitle";
import { DangerButton } from "@/common/components/button";

interface PrayerTitleOptionSheetProps {
  visible: boolean;
  onDismiss: () => void;
  prayerTitle: PrayerTitle;
  onDelete: () => void;
}

export default function PrayerTitleOptionSheet({
  visible,
  onDismiss,
  prayerTitle,
  onDelete,
}: PrayerTitleOptionSheetProps) {
  const prayers = prayerTitle.prayers || [];

  const handleDelete = () => {
    onDelete();
  };

  return (
    <CommonBottomSheet visible={visible} onDismiss={onDismiss} height="70%">
      <Text style={styles.title}>{prayerTitle.title}</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        {prayers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>아직 아무도 기도하지 않았어요</Text>
          </View>
        ) : (
          prayers.map((prayer) => (
            <PrayerLogItem key={prayer.memberId} prayer={prayer} />
          ))
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <DangerButton
          onPress={handleDelete}
          icon={({ size, color }) => (
            <MaterialIcons name="delete" size={RFValue(24)} color={color} />
          )}
          style={styles.deleteButton}
        >
          삭제하기
        </DangerButton>
      </View>
    </CommonBottomSheet>
  );
}

interface PrayerLogItemProps {
  prayer: Prayer;
}

function PrayerLogItem({ prayer }: PrayerLogItemProps) {
  return (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <MaterialCommunityIcons
          name="account"
          size={RFValue(24)}
          color={color.secondary}
        />
        <Text style={styles.userName}>{prayer.memberName}</Text>
      </View>
      <Text style={styles.prayCount}>{prayer.prayerCount}번 기도</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: RFValue(26),
    marginBottom: RFValue(8),
  },
  scrollView: {
    flex: 1,
    marginBottom: RFValue(16),
    marginTop: RFValue(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: RFValue(40),
  },
  emptyText: {
    fontSize: RFValue(16),
    color: color.grayLight,
    textAlign: "center",
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(16),
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(8),
  },
  userName: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: color.black,
  },
  prayCount: {
    fontSize: RFValue(14),
    color: color.grayLight,
  },
  buttonContainer: {
    gap: RFValue(8),
  },
  deleteButton: {
    padding: RFValue(4),
  },
});
