// PrayerCard.tsx
import React from "react";
import { View, StyleSheet, Animated, ScrollView, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
            {(onEdit || onDelete) ? (
              <View style={styles.buttonContainer}>
                {onEdit ? (
                  <TouchableOpacity 
                    onPress={() => onEdit(item)}
                    style={styles.iconButton}
                  >
                    <MaterialCommunityIcons 
                      name="pencil" 
                      size={RFValue(18)} 
                      color={color.secondary} 
                    />
                  </TouchableOpacity>
                ) : null}
                {onDelete ? (
                  <TouchableOpacity 
                    onPress={() => onDelete(item)}
                    style={styles.iconButton}
                  >
                    <MaterialCommunityIcons 
                      name="delete" 
                      size={RFValue(18)} 
                      color="#FF6B6B" 
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
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
    alignItems: "center",
    gap: RFValue(8),
  },
  iconButton: {
    padding: RFValue(6),
    borderRadius: RFValue(20),
    backgroundColor: "#F8F9FA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
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
