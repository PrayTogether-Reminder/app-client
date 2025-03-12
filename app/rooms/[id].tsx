import React, { useRef, useEffect } from "react";
import {
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Provider as PaperProvider,
  DefaultTheme,
  Appbar,
  Text,
  Button,
  Surface,
  Avatar,
  Card,
  useTheme,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useRouter, useLocalSearchParams } from "expo-router";
import { color } from "../../src/common/styles/color";

// Theme customization
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3B82F6",
    secondary: "#f1f5f9",
    background: "#ffffff",
    surface: "#ffffff",
    text: "#000000",
    disabled: "#aaaaaa",
    placeholder: "#555555",
  },
};

// 기도방 데이터 타입 정의
interface PrayerRoom {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  time: string;
  category: string;
}

// 가상의 기도방 데이터
const prayerRooms: PrayerRoom[] = [
  {
    id: "1",
    date: "2025-01-25",
    title: "개인을 위한 기도",
    subtitle: "25일 1월 4째주",
    time: "09:30 AM",
    category: "개인",
  },
  {
    id: "2",
    date: "2025-01-25",
    title: "나라를 위한 기도",
    subtitle: "25일 1월 4째주",
    time: "10:45 AM",
    category: "나라",
  },
  {
    id: "3",
    date: "2025-02-01",
    title: "개인을 위한 기도",
    subtitle: "1일 2월 1째주",
    time: "09:00 AM",
    category: "개인",
  },
  {
    id: "4",
    date: "2025-02-01",
    title: "나라를 위한 기도",
    subtitle: "1일 2월 1째주",
    time: "11:00 AM",
    category: "나라",
  },
];

// 기도방 날짜별로 그룹화하는 함수
function groupByDate(rooms: PrayerRoom[]): Record<string, PrayerRoom[]> {
  if (!rooms || !Array.isArray(rooms)) return {};

  return rooms.reduce((acc: Record<string, PrayerRoom[]>, room: PrayerRoom) => {
    if (!acc[room.date]) {
      acc[room.date] = [];
    }
    acc[room.date].push(room);
    return acc;
  }, {});
}

// 카테고리에 따른 아바타 색상
const getCategoryColor = (category: string): string => {
  switch (category) {
    case "개인":
      return "#3B82F6"; // 파란색
    case "나라":
      return "#10B981"; // 초록색
    default:
      return "#F59E0B"; // 기본 노란색
  }
};

// 카테고리 첫 글자 가져오기
const getCategoryInitial = (category: string): string => {
  return category.charAt(0);
};

function PrayerRoomContent(): JSX.Element {
  const params = useLocalSearchParams() as any;
  const roomId = params?.id;
  console.log("render room by id =", roomId);
  const router = useRouter();
  const paperTheme = useTheme();
  const scrollViewRef = useRef<ScrollView | null>(null);

  // 기도방 목록 날짜 기준 정렬
  const sortedRooms = [...prayerRooms].sort((a, b) => {
    // 날짜 오름차순 정렬 (과거순, 최신이 맨 아래)
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // 컴포넌트가 마운트된 후 스크롤을 맨 아래로 이동
  useEffect(() => {
    // 약간의 지연 후 실행하여 레이아웃이 완전히 렌더링된 후 스크롤 되도록 함
    const timeoutId = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: false });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleRoomPress = (room: PrayerRoom): void => {
    if (!room) return;
    console.log("Selected room:", room);
    router.push(`/rooms/${room.id}` as any);
  };

  // 새 기도제목 작성 후 돌아왔을 때 맨 아래로 스크롤
  const scrollToBottom = (): void => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <Surface style={styles.container}>
      <StatusBar
        backgroundColor={paperTheme.colors.background}
        barStyle="dark-content"
      />

      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="2025 여기 기도방"
          titleStyle={styles.headerTitle}
        />
        <Appbar.Action icon="menu" color={color.primary} onPress={() => {}} />
      </Appbar.Header>

      {/* Content with Chat-like UI */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {sortedRooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            onPress={() => handleRoomPress(room)}
            style={styles.prayerItemContainer}
          >
            <Card style={styles.prayerCard}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.avatarContainer}>
                  <Avatar.Text
                    size={45}
                    label={getCategoryInitial(room.category)}
                    style={{ backgroundColor: getCategoryColor(room.category) }}
                  />
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.headerRow}>
                    <Text style={styles.roomCategory}>{room.category}</Text>
                    <Text style={styles.roomTime}>{room.time}</Text>
                  </View>

                  <Text style={styles.roomTitle}>{room.title}</Text>
                  <View style={styles.metaContainer}>
                    <Text style={styles.roomDate}>{room.date}</Text>
                    <Text style={styles.roomSubtitle}>{room.subtitle}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Button */}
      <Surface style={styles.bottomButtonContainer}>
        <Button
          mode="contained"
          color={paperTheme.colors.primary}
          uppercase={false}
          style={styles.bottomButton}
          labelStyle={styles.bottomButtonText}
          icon="pencil"
          onPress={() => {
            // 새 기도제목 작성 화면으로 이동 (이후 구현)
            console.log("기도제목 작성하기");
            // 예시: router.push('/create-prayer');

            // 작성 후 돌아왔을 때 스크롤 아래로 이동하도록 효과 추가
            setTimeout(scrollToBottom, 300);
          }}
        >
          기도제목 작성하기
        </Button>
      </Surface>
    </Surface>
  );
}

export default function PrayerRoomScreen(): JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <PrayerRoomContent />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  prayerItemContainer: {
    marginHorizontal: 15,
    marginVertical: 8,
  },
  prayerCard: {
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 12,
    flexDirection: "row",
  },
  avatarContainer: {
    marginRight: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  roomCategory: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: "#333333",
  },
  roomTime: {
    fontSize: RFValue(12),
    color: "#888888",
  },
  roomTitle: {
    fontSize: RFValue(16),
    fontWeight: "500",
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roomDate: {
    fontSize: RFValue(12),
    color: "#666666",
    marginRight: 8,
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roomSubtitle: {
    fontSize: RFValue(12),
    color: "#666666",
  },
  bottomSpacer: {
    height: 80,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  bottomButton: {
    borderRadius: 30,
    width: "80%",
    paddingVertical: 5,
  },
  bottomButtonText: {
    fontSize: RFValue(16),
    fontWeight: "500",
  },
});
