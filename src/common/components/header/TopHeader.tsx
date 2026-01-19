import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "../../styles/color";

export interface TopHeaderProps {
  /** 헤더 제목 */
  title: string;
  /** 뒤로가기 버튼 클릭 핸들러. undefined면 뒤로가기 버튼 표시 안 함 */
  onBackPress?: () => void;
  /** 오른쪽 액션 버튼 설정 */
  rightAction?: {
    icon: string;
    onPress: () => void;
    size?: number;
    color?: string;
    /** 활성화 상태 (배경색 표시) */
    isActive?: boolean;
  };
  /** 왼쪽 액션 타입 */
  leftActionType?: "back" | "close";
}

/**
 * 공통 상단 헤더 컴포넌트 (커스텀 구현)
 *
 * @example
 * // 뒤로가기 + 제목
 * <TopHeader title="기도방 초대 목록" onBackPress={() => router.back()} />
 *
 * // 뒤로가기 + 제목 + 액션
 * <TopHeader
 *   title="기도방"
 *   onBackPress={() => router.back()}
 *   rightAction={{ icon: "menu", onPress: openMenu }}
 * />
 *
 * // 제목 + 닫기
 * <TopHeader
 *   title="기도 제목 작성"
 *   leftActionType="close"
 *   rightAction={{ icon: "close", onPress: handleClose }}
 * />
 */
export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  onBackPress,
  rightAction,
  leftActionType = "back",
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const leftIcon = leftActionType === "back" ? "arrow-left" : "close";

  return (
    <View style={styles.header}>
      {/* 왼쪽 액션 */}
      <View style={styles.actionContainer}>
        {onBackPress !== undefined && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={leftIcon}
              size={RFValue(24)}
              color={color.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 제목 */}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* 오른쪽 액션 */}
      <View style={styles.actionContainer}>
        {rightAction ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              rightAction.isActive && styles.actionButtonActive,
            ]}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={rightAction.icon as any}
              size={rightAction.size || RFValue(24)}
              color={rightAction.color || color.primary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButton} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.third,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(4),
  },
  actionContainer: {
    width: RFValue(44),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    width: RFValue(40),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(20),
  },
  actionButtonActive: {
    backgroundColor: color.primary + "20",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: color.primary,
    fontSize: RFValue(18),
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TopHeader;
