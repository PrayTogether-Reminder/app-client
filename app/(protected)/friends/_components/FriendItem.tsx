import React, { useRef } from "react";
import {
  StyleSheet,
  Pressable,
  Animated,
  View,
  useWindowDimensions,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import AntDesign from "@expo/vector-icons/AntDesign";
import { backgroundColor, color } from "@/common/styles/color";
import { Friend } from "@/domain/friends/types/Friend";

interface FriendItemProps {
  friend: Friend;
  onLongPress: (friend: Friend) => void;
}

export default function FriendItem({
  friend,
  onLongPress,
}: FriendItemProps): React.ReactElement {
  const { width } = useWindowDimensions();

  // Animation setup
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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
      onLongPress={() => onLongPress(friend)}
      delayLongPress={500}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <Card
          style={[styles.card, { borderLeftColor: color.secondary }]}
          mode="elevated"
        >
          <Card.Content style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Title style={styles.friendName}>{friend.friendName}</Title>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.detailRow}>
                <AntDesign name="user" size={width * 0.045} color={color.gray} />
                <Paragraph style={styles.detailText}>친구</Paragraph>
              </View>
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
  contentContainer: {
    gap: RFValue(8),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  friendName: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    flex: 1,
    lineHeight: RFValue(20),
  },
  infoRow: {
    flexDirection: "column",
    gap: RFValue(4),
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: RFValue(6),
  },
  detailText: {
    fontSize: RFValue(12),
    color: color.gray,
    lineHeight: RFValue(16),
  },
});