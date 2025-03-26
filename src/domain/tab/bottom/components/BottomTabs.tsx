import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { BottomNavigation, useTheme } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RFValue } from "react-native-responsive-fontsize";
import { BottomNaviStatus } from "../types/bottomNaviStatus";
import { backgroundColor } from "../../../../common/styles/color";
import { useBottomNaviStatusStore } from "../stores/useBottomNaviStatusStore";
import { color } from "@/common/styles/color";

export default function BottomTabs() {
  const { status: naviStatus, set: setNaviStatus } = useBottomNaviStatusStore();
  const theme = useTheme();

  const baseIconSize = RFValue(20);
  const activeIconSize = RFValue(24);

  // 각 라우트에 대한 설정
  const routes = [
    {
      key: BottomNaviStatus.ROOMS,
      title: "홈",
      focusedIcon: () => (
        <FontAwesome6
          name="house-chimney"
          size={activeIconSize}
          color={color.secondary}
        />
      ),
      unfocusedIcon: () => (
        <FontAwesome6
          name="house-chimney"
          size={baseIconSize}
          color={color.gray}
        />
      ),
    },
    {
      key: BottomNaviStatus.PROFILES,
      title: "마이 페이지",
      focusedIcon: () => (
        <FontAwesome6
          name="user-gear"
          size={activeIconSize}
          color={color.secondary}
        />
      ),
      unfocusedIcon: () => (
        <FontAwesome6 name="user-gear" size={baseIconSize} color={color.gray} />
      ),
    },
  ];

  // 현재 선택된 인덱스 계산
  const getActiveIndex = () => {
    return routes.findIndex((route) => route.key === naviStatus);
  };

  // 탭 변경 처리
  const handleIndexChange = (index: number) => {
    setNaviStatus(routes[index].key);
  };

  // 렌더 라우트 설정
  const renderScene = BottomNavigation.SceneMap({
    [BottomNaviStatus.ROOMS]: () => <></>,
    [BottomNaviStatus.PROFILES]: () => <></>,
  });

  return (
    <BottomNavigation
      navigationState={{ index: getActiveIndex(), routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      barStyle={styles.bottomBar}
      activeColor={color.secondary}
      inactiveColor={color.gray}
      labeled={false}
      compact={true}
      sceneAnimationType="shifting"
      sceneAnimationEnabled={true}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          secondaryContainer: "transparent",
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: backgroundColor.white,
    height: RFValue(60),
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
