import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color, flexMarker } from "../../../common/styles/color";
import { loadEnvFile } from "process";

const { width } = Dimensions.get("window");

interface PrayerCardProps {
  memberName: string;
  content: string;
  onDelete: () => void;
  onEdit: () => void;
}

const PrayerContentCard = ({
  memberName,
  content,
  onDelete,
  onEdit,
}: PrayerCardProps) => {
  return (
    <Card style={[styles.prayerCard]}>
      <Card.Content style={styles.cardContentContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.memberNameText}>{memberName}</Text>
          <View style={styles.buttonPosition}>
            <IconButton
              icon="playlist-edit"
              onPress={onEdit}
              size={RFValue(28)}
              style={styles.editButton}
            />
            <IconButton
              icon="close"
              onPress={onDelete}
              size={RFValue(28)}
              style={styles.deleteButton}
            />
          </View>
        </View>
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
    height: RFValue(200),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(8),
    marginTop: -RFValue(16),
  },
  memberNameText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: color.secondary,
  },
  buttonPosition: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    margin: 0,
    padding: 0,
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
