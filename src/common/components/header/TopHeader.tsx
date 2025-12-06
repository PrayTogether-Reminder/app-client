import React from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";
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
 * 공통 상단 헤더 컴포넌트
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

  return (
    <Appbar.Header style={styles.header}>
      {/* 왼쪽 액션 */}
      {onBackPress !== undefined && leftActionType === "back" && (
        <Appbar.BackAction
          style={styles.headerBackAction}
          onPress={handleBackPress}
          color={color.primary}
        />
      )}
      {onBackPress !== undefined && leftActionType === "close" && (
        <Appbar.Action
          style={styles.headerBackAction}
          icon="close"
          onPress={handleBackPress}
          color={color.primary}
        />
      )}

      {/* 제목 */}
      <Appbar.Content
        title={title}
        titleStyle={styles.headerTitle}
        style={styles.headerContent}
      />

      {/* 오른쪽 액션 */}
      {rightAction ? (
        <Appbar.Action
          style={[
            styles.headerAction,
            rightAction.isActive && styles.headerActionActive,
          ]}
          icon={rightAction.icon}
          color={rightAction.color || color.primary}
          onPress={rightAction.onPress}
          size={rightAction.size || RFValue(24)}
        />
      ) : (
        <Appbar.Action
          style={styles.headerAction}
          icon=""
          disabled
          color="transparent"
        />
      )}
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.third,
    height: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    elevation: 0,
    minHeight: 0,
  },
  headerContent: {
    marginTop: -RFValue(40),
  },
  headerTitle: {
    color: color.primary,
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: RFValue(22),
  },
  headerAction: {
    alignSelf: "center",
    marginRight: 0,
    marginTop: -RFValue(40),
  },
  headerActionActive: {
    backgroundColor: color.primary + "20",
    borderRadius: RFValue(20),
  },
  headerBackAction: {
    alignSelf: "center",
    marginLeft: 0,
    marginTop: -RFValue(40),
  },
});

export default TopHeader;
