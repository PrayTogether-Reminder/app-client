import React, { useRef } from "react";
import { StyleSheet, Animated, Pressable, View } from "react-native";
import { Card, Text, Checkbox } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { backgroundColor, color } from "@/common/styles/color";
import type { MemberSearchResult } from "@/domain/members/types/response/searchMembersResponse";

type SelectableMemberItemProps = {
  member: MemberSearchResult;
  isSelected: boolean;
  onToggle: (memberId: number) => void;
  disabled?: boolean;
};

export default function SelectableMemberItem({
  member,
  isSelected,
  onToggle,
  disabled = false,
}: SelectableMemberItemProps) {
  const phoneDisplay = member.phoneNumberSuffix
    ? `(${member.phoneNumberSuffix})`
    : "(번호 미등록)";

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => !disabled && onToggle(member.id)}
      disabled={disabled}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Card
          style={[
            styles.card,
            isSelected && styles.cardSelected,
          ]}
          mode="elevated"
        >
          <Card.Content style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{member.name}</Text>
              <Text style={styles.phone}>{phoneDisplay}</Text>
            </View>
            <Checkbox
              status={isSelected ? "checked" : "unchecked"}
              onPress={() => !disabled && onToggle(member.id)}
              disabled={disabled}
              color={color.secondary}
            />
          </Card.Content>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColor.white,
    marginBottom: RFValue(8),
    marginHorizontal: RFValue(16),
    borderLeftWidth: RFValue(4),
    borderLeftColor: "#E0E0E0",
    elevation: 2,
  },
  cardSelected: {
    borderLeftColor: color.secondary,
    backgroundColor: "#F8F9FF",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(8),
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: color.black,
    marginBottom: RFValue(4),
  },
  phone: {
    fontSize: RFValue(13),
    color: color.gray,
  },
});
