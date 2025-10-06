import React, { useRef } from "react";
import {
  StyleSheet,
  Pressable,
  Animated,
  View,
  useWindowDimensions,
} from "react-native";
import { Card, Title, Paragraph, Checkbox, Chip } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import AntDesign from "@expo/vector-icons/AntDesign";
import { backgroundColor, color } from "@/common/styles/color";
import { Friend } from "@/domain/friends/types/Friend";

interface SelectableFriendItemProps {
  friend: Friend;
  isSelected: boolean;
  isAlreadyMember: boolean; // 이미 방 참여 중
  onToggle: (friendId: number) => void;
}

export default function SelectableFriendItem({
  friend,
  isSelected,
  isAlreadyMember,
  onToggle,
}: SelectableFriendItemProps): React.ReactElement {
  const { width } = useWindowDimensions();

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isAlreadyMember) {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!isAlreadyMember) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 10,
      }).start();
    }
  };

  const handlePress = () => {
    if (!isAlreadyMember) {
      onToggle(friend.friendId);
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={isAlreadyMember}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Card
          style={[
            styles.card,
            { borderLeftColor: color.secondary },
            isAlreadyMember && styles.disabledCard,
          ]}
          mode="elevated"
        >
          <Card.Content style={styles.contentContainer}>
            <View style={styles.rowContainer}>
              {/* 체크박스 */}
              <Checkbox.Android
                status={isSelected ? "checked" : "unchecked"}
                disabled={isAlreadyMember}
                color={color.secondary}
              />

              {/* 친구 정보 */}
              <View style={styles.infoContainer}>
                <View style={styles.nameRow}>
                  <AntDesign
                    name="user"
                    size={width * 0.045}
                    color={isAlreadyMember ? color.gray : color.dark}
                  />
                  <Title
                    style={[
                      styles.friendName,
                      isAlreadyMember && styles.disabledText,
                    ]}
                  >
                    {friend.friendName}
                  </Title>
                </View>
                <Paragraph style={styles.friendLabel}>친구</Paragraph>
              </View>

              {/* 참여 중 뱃지 */}
              {isAlreadyMember && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  textStyle={styles.chipText}
                  disabled
                >
                  참여 중
                </Chip>
              )}
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: backgroundColor.white,
    marginBottom: RFValue(12),
    borderLeftWidth: RFValue(6),
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.6,
  },
  contentContainer: {
    paddingVertical: RFValue(8),
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: RFValue(8),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(6),
    marginBottom: RFValue(4),
  },
  friendName: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    lineHeight: RFValue(20),
  },
  disabledText: {
    color: color.gray,
  },
  friendLabel: {
    fontSize: RFValue(12),
    color: color.gray,
    lineHeight: RFValue(16),
  },
  chip: {
    backgroundColor: color.light,
    borderColor: color.gray,
  },
  chipText: {
    fontSize: RFValue(11),
    color: color.gray,
  },
});
