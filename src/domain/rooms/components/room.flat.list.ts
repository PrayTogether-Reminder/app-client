import { styled } from "tamagui";
import { FlatList } from "react-native";
import { Room } from "../components/room.list";

const RoomFlatList = styled(FlatList<Room>, {
  flex: 1,
  padding: "$4",
});

export default RoomFlatList;
