import React from "react";
import { StatusBar, View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

// 색상 직접 정의
const COLORS = {
  white: "#ffffff",
  black: "#000000",
  gray: "#aaaaaa",
  darkGray: "#555555",
  blue: "#3B82F6",
};

// 가상의 기도방 데이터
const prayerRooms = [
  { id: "1", date: "2025-01-25", title: "25일 1월 4째주 개인을 위한 기도" },
  { id: "2", date: "2025-01-25", title: "25일 1월 4째주 나라를 위한 기도" },
  { id: "3", date: "2025-02-01", title: "25일 2월 1째주 개인을 위한 기도" },
  { id: "4", date: "2025-02-01", title: "25일 2월 1째주 나라를 위한 기도" },
];

// 기도방 날짜별로 그룹화하는 함수
function groupByDate(rooms) {
  if (!rooms || !Array.isArray(rooms)) return {};
  
  return rooms.reduce((acc, room) => {
    if (!acc[room.date]) {
      acc[room.date] = [];
    }
    acc[room.date].push(room);
    return acc;
  }, {});
}

export default function PrayerRoomScreen() {
  const params = useLocalSearchParams();
  const roomId = params?.id;
  console.log("render room by id =", roomId);
  const router = useRouter();

  const groupedRooms = groupByDate(prayerRooms);
  const dates = Object.keys(groupedRooms).sort();

  const handleRoomPress = (room) => {
    if (!room) return;
    console.log("Selected room:", room);
    router.push(`/rooms/${room.id}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.black}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          2025 여기 기도방
        </Text>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="menu" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Content with Timeline */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.timelineContainer}>
          {/* Timeline Line */}
          <View style={styles.timelineLine} />

          {/* Prayer Items Grouped by Date */}
          {dates.length > 0 && dates.map((date, dateIndex) => (
            <View key={date} style={styles.dateGroup}>
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>
                  {date}
                </Text>
                <View style={styles.dateLine} />
              </View>

              {/* Prayer Items for this Date */}
              {groupedRooms[date] && groupedRooms[date].map((room, roomIndex) => (
                <View key={room.id} style={styles.prayerItemContainer}>
                  <TouchableOpacity
                    style={[
                      styles.prayerButton,
                      roomIndex === 0 ? styles.primaryButton : null
                    ]}
                    onPress={() => handleRoomPress(room)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.prayerButtonText}>{room.title}</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add spacer except after the last date */}
              {dateIndex < dates.length - 1 && <View style={styles.dateSpacer} />}
            </View>
          ))}

          {/* Final spacer for bottom padding */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.bottomButton}
          activeOpacity={0.7}
        >
          <Text style={styles.bottomButtonText}>
            기도제목 작성하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  timelineContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    top: 40,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.gray,
    zIndex: 1,
  },
  dateGroup: {
    marginBottom: 8,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative',
    zIndex: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
  },
  dateLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: COLORS.darkGray,
    top: 10,
    zIndex: -1,
  },
  prayerItemContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  prayerButton: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButton: {
    borderColor: COLORS.blue,
  },
  prayerButtonText: {
    fontSize: 14,
  },
  dateSpacer: {
    height: 10,
  },
  bottomSpacer: {
    height: 40,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.blue,
    width: '70%',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blue,
  },
});