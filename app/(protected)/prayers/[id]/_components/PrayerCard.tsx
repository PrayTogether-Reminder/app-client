// PrayerCard.tsx
import React from "react";
import { View, StyleSheet, Animated, ScrollView } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "../../../../../src/common/styles/color";
import { PrayerContent } from "../../../../../src/domain/prayers/types/prayerContent";

interface PrayerCardProps {
  item: PrayerContent;
  scale: Animated.AnimatedInterpolation<number>;
  onEdit?: (prayer: PrayerContent) => void;
  onDelete?: (prayer: PrayerContent) => void;
  cardHeight: number;
}

export default function PrayerCard({
  item,
  scale,
  onEdit,
  onDelete,
  cardHeight,
}: PrayerCardProps) {
  const cardBorderStyle = { borderLeftColor: color.secondary };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          height: cardHeight,
          transform: [{ scale }],
        },
      ]}
    >
      <Card
        style={[
          styles.prayerCard,
          cardBorderStyle,
          { height: cardHeight * 0.9 },
        ]}
      >
        <Card.Content style={styles.cardContentContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.nameText}>{item.memberName}</Text>
            {(onEdit || onDelete) && (
              <View style={styles.buttonContainer}>
                {onEdit && (
                  <IconButton
                    icon="playlist-edit"
                    onPress={() => onEdit(item)}
                    size={RFValue(28)}
                    style={styles.editButton}
                  />
                )}
                {onDelete && (
                  <IconButton
                    icon="close"
                    onPress={() => onDelete(item)}
                    size={RFValue(28)}
                    style={styles.deleteButton}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.divider} />
          <ScrollView
            style={styles.contentContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
          >
            <Text style={styles.prayerContentText}>{item.content}</Text>
          </ScrollView>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  prayerCard: {
    width: "95%",
    borderRadius: RFValue(16),
    elevation: 4,
    backgroundColor: color.white,
    borderLeftWidth: RFValue(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardContentContainer: {
    height: "100%",
    padding: RFValue(10),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: RFValue(10),
    paddingHorizontal: RFValue(8),
    paddingTop: RFValue(8),
  },
  nameText: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    color: color.secondary,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    margin: 0,
    padding: 0,
  },
  deleteButton: {
    margin: 0,
    padding: 0,
  },
  divider: {
    height: RFValue(1),
    backgroundColor: `${color.secondary}30`,
    marginBottom: RFValue(16),
    marginHorizontal: RFValue(8),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: RFValue(12),
  },
  prayerContentText: {
    fontSize: RFValue(16),
    lineHeight: RFValue(24),
    color: "#333",
  },
});
