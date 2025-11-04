// PrayerCard.tsx
import React from "react";
import { View, StyleSheet, Animated, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
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

  const handleCopy = () => {
    const fullContent = `${item.memberName}\n최근 작성자: ${item.writerName}\n\n${item.content}`;
    Clipboard.setString(fullContent);
    Toast.show({
      type: "success",
      text1: "복사 완료",
      text2: "기도 내용이 복사되었습니다",
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 60,
    });
  };

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
          { height: cardHeight * 0.9, width: "95%" },
        ]}
      >
        <Card.Content style={styles.cardContentContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.nameText}>{item.memberName}</Text>
              <Text style={styles.writerText}>최근 작성자: {item.writerName}</Text>
            </View>
            {/* 편집 모드가 아닐 때는 복사 버튼, 편집 모드일 때는 수정/삭제 버튼 */}
            <View style={styles.buttonContainer}>
              {(onEdit || onDelete) ? (
                <>
                  <TouchableOpacity
                    onPress={() => onEdit && onEdit(item)}
                    style={styles.iconButton}
                    activeOpacity={Platform.OS === 'ios' ? 0.8 : 0.2}
                    disabled={!onEdit}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={RFValue(18)}
                      color={color.secondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onDelete && onDelete(item)}
                    style={[styles.iconButton, { marginLeft: RFValue(8) }]}
                    activeOpacity={Platform.OS === 'ios' ? 0.8 : 0.2}
                    disabled={!onDelete}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={RFValue(18)}
                      color="#FF6B6B"
                    />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  onPress={handleCopy}
                  style={styles.iconButton}
                  activeOpacity={Platform.OS === 'ios' ? 0.8 : 0.2}
                >
                  <MaterialCommunityIcons
                    name="content-copy"
                    size={RFValue(18)}
                    color={color.secondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.divider} />
          <ScrollView
            style={styles.contentContainer}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16}
          >
            <Text style={styles.prayerContentText}>
              {item.content}
            </Text>
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
    width: "100%",
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
    alignItems: "flex-start",
    marginBottom: RFValue(10),
    paddingHorizontal: RFValue(8),
    paddingTop: RFValue(8),
    minHeight: RFValue(50), // 고정 높이를 minHeight로 변경
  },
  titleSection: {
    flex: 1,
    marginRight: RFValue(8),
  },
  nameText: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    color: color.secondary,
  },
  writerText: {
    fontSize: RFValue(13),
    color: "#666",
    marginTop: RFValue(2),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: RFValue(80), // minWidth 대신 고정 width
    height: RFValue(40), // 고정 높이
    flexShrink: 0, // 크기 축소 방지
  },
  iconButton: {
    padding: RFValue(6),
    borderRadius: RFValue(20),
    backgroundColor: "#F8F9FA",
    // iOS에서 shadow가 UI 움직임을 유발할 수 있어 제거
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // elevation: 3,
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
