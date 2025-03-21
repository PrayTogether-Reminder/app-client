import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../common/styles/color";

const { width } = Dimensions.get("window");

interface PrayerCardProps {
  memberName: string;
  content: string;
  onDelete: () => void;
}

const PrayerContentCard = ({
  memberName,
  content,
  onDelete,
}: PrayerCardProps) => {
  return (
    <Card style={[styles.prayerCard]}>
      <Card.Content style={styles.cardContentContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.memberNameText}>{memberName}</Text>
          <IconButton
            icon="close"
            onPress={onDelete}
            size={RFValue(18)}
            style={styles.deleteButton}
          />
        </View>
        {/* ScrollView를 사용하되 제스처 처리 개선 */}
        <ScrollView
          style={styles.contentContainer}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={16}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <Text style={styles.prayerContentText}>{content}</Text>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  prayerCard: {
    width: "85%",
    borderRadius: RFValue(12),
    elevation: 2,
    backgroundColor: color.white,
    borderLeftWidth: RFValue(4),
    borderLeftColor: color.secondary,
  },
  cardContentContainer: {
    padding: RFValue(12),
    height: RFValue(160),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(8),
  },
  memberNameText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: color.secondary,
  },
  deleteButton: {
    margin: 0,
    padding: 0,
  },
  contentContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: RFValue(4),
  },
  prayerContentText: {
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
  },
});

export default PrayerContentCard;
