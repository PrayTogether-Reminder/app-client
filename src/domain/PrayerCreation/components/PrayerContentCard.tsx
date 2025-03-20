import React from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
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
    <Card style={[styles.prayerCard, { width: width - RFValue(60) }]}>
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
        {/* ScrollView로 내용 감싸기 */}
        <ScrollView
          style={styles.contentScrollView}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.prayerContentText}>{content}</Text>
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  prayerCard: {
    borderRadius: RFValue(12),
    elevation: 2,
    backgroundColor: color.white,
    borderLeftWidth: RFValue(4),
    borderLeftColor: color.secondary,
    marginRight: RFValue(20),
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
  contentScrollView: {
    flex: 1,
  },
  prayerContentText: {
    fontSize: RFValue(14),
    lineHeight: RFValue(20),
  },
});

export default PrayerContentCard;
