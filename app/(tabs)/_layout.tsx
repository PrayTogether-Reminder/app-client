// app/(tabs)/_layout.tsx
import { color } from "@/common/styles/color";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

export default function TabsLayout() {
  const { width, height } = useWindowDimensions();

  const baseIconSize = width * 0.06;
  const activeIconSize = width * 0.07;
  const heightPercent = (1 / 12.3) * 100; // value by Top1Body10Botton1.tsx

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [styles.bottomBar, { height: `${heightPercent}%` }],
        tabBarItemStyle: [styles.bottomBarItem],
        tabBarActiveTintColor: color.secondary,
        tabBarInactiveTintColor: color.gray,
        tabBarLabelStyle: { display: "none" },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="rooms/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                {
                  width: width * 0.12,
                  height: height * 0.05,
                },
              ]}
            >
              <FontAwesome6
                name={focused ? "door-open" : "door-closed"}
                size={focused ? activeIconSize : baseIconSize}
                color={focused ? color.secondary : color.gray}
                style={styles.icon}
              />
            </View>
          ),
          title: "기도방 목록",
        }}
      />
      <Tabs.Screen
        name="profiles/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                {
                  width: width * 0.12,
                  height: height * 0.05,
                },
              ]}
            >
              <FontAwesome6
                name="user-gear"
                size={focused ? activeIconSize : baseIconSize}
                color={focused ? color.secondary : color.gray}
                style={styles.icon}
              />
            </View>
          ),
          title: "마이 페이지",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBarItem: {
    height: "70%",
    alignSelf: "center",
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {},
});
