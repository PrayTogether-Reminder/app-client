import AntDesign from "@expo/vector-icons/AntDesign";
import { Fragment, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useWindowDimensions } from "react-native";
import { color } from "../../../../common/styles/color";
import RoomCreationDialog from "../dialogs/RoomCreationDialog";

export default function RoomCreationFloatingButton() {
  const { width } = useWindowDimensions();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Fragment>
      <FAB
        icon={({ size, color }) => (
          <View style={styles.iconContainer}>
            <AntDesign name="plus" size={RFValue(32)} color="white" />
          </View>
        )}
        style={[styles.fab, { backgroundColor: color.secondary }]}
        onPress={() => setDialogOpen(true)}
        customSize={RFValue(56)}
      />

      <RoomCreationDialog open={dialogOpen} setOpen={setDialogOpen} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: RFValue(24),
    right: RFValue(24),
    height: RFValue(56),
    width: RFValue(56),

    borderRadius: RFValue(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

    justifyContent: "center", // 세로 방향 중앙 정렬
    alignItems: "center", // 가로 방향 중앙 정렬
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: RFValue(40),
    height: RFValue(40),
    transform: [{ translateX: RFValue(-5.5) }, { translateY: RFValue(-5.5) }],
  },
});
