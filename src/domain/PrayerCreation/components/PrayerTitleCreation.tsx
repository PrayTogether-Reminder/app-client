// import React, { useState, useMemo, useEffect, useRef } from "react";
// import {
//   StyleSheet,
//   View,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   BackHandler,
// } from "react-native";
// import {
//   TextInput,
//   Title,
//   Text,
//   Chip,
//   Avatar,
//   Button,
//   Dialog,
//   Portal,
//   IconButton,
//   Divider,
// } from "react-native-paper";
// import { RFValue } from "react-native-responsive-fontsize";
// import { color, flexMarker } from "../../../common/styles/color";
// import { useRoomMembersQuery } from "../../prayerRoom/hooks/queries/roomQueries";
// import { useSelectedRoomStore } from "../../prayerRoom/types/roomStore";
// import { RoomMember } from "../../prayerRoom/types/dto/response/roomMember";
// import { router } from "expo-router";
// import PrayerMemberSelectionModal from "./PrayerMemberSelectionModal";
// import PrayerCustomNameDialog from "./PrayerCustomNameDialog";
// import PrayerCreationCancelDialog from "./PrayerCreationCancelDialog";

// // 멤버 타입 정의
// interface SelectedMember extends RoomMember {
//   isRoomMember: boolean;
// }

// // 기도 포스트 타입 정의
// interface PrayerPost {
//   id: string;
//   title: string;
//   content: string;
//   member: SelectedMember;
//   timestamp: Date;
// }

// export default function PrayerCreationPage() {
//   const [prayerTitle, setPrayerTitle] = useState("");
//   const [prayerContent, setPrayerContent] = useState("");
//   const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(
//     null
//   );
//   const [customNameDialogVisible, setCustomNameDialogVisible] = useState(false);
//   const customNameRef = useRef({ customName: "" });
//   const [memberSelectionModalVisible, setMemberSelectionModalVisible] =
//     useState(false);
//   const room = useSelectedRoomStore().selectedRoom;
//   const { data: roomMembers } = useRoomMembersQuery(room?.id ?? "");

//   // 커스텀 멤버 이름 변경
//   const onChangeCustomName = (name: string) => {
//     customNameRef.current.customName = name;
//   };

//   // 이름순으로 정렬된 멤버 목록
//   const sortedRoomMembers = useMemo(() => {
//     if (!roomMembers) return [];
//     return [...roomMembers].sort((a, b) => a.name.localeCompare(b.name));
//   }, [roomMembers]);

//   // 방 구성원 선택 처리
//   const handleSelectMember = (member: RoomMember) => {
//     setSelectedMember({
//       ...member,
//       isRoomMember: true,
//     });
//     setMemberSelectionModalVisible(false);
//   };

//   // 멤버 선택 모달 열기
//   const openMemberSelectionModal = () => {
//     setMemberSelectionModalVisible(true);
//   };

//   // 멤버 선택 모달 닫기
//   const closeMemberSelectionModal = () => {
//     setMemberSelectionModalVisible(false);
//   };

//   // 직접 입력 다이얼로그 표시
//   const showCustomNameDialog = () => {
//     setCustomNameDialogVisible(true);
//     setMemberSelectionModalVisible(false);
//   };

//   // 직접 입력 다이얼로그 숨기기
//   const hideCustomNameDialog = () => {
//     setCustomNameDialogVisible(false);
//     onChangeCustomName("");
//   };

//   // 직접 입력한 이름 추가
//   const addCustomName = () => {
//     const customName = customNameRef.current.customName;
//     if (customName.trim()) {
//       const newMember: SelectedMember = {
//         id: "customMember",
//         name: customName.trim(),
//         isRoomMember: false,
//       };

//       setSelectedMember(newMember);
//       hideCustomNameDialog();
//     }
//   };

//   // 기도 내용 저장
//   const savePrayer = () => {
//     if (prayerTitle.trim() && prayerContent.trim() && selectedMember) {
//       // 여기서 실제 저장 로직 구현
//       // API 호출이나 store 업데이트 등을 수행

//       // 저장 후 이전 화면으로 돌아가기
//       router.back();
//     }
//   };

//   // 확인 다이얼로그 상태
//   const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

//   // 취소 버튼 처리 - 확인 다이얼로그 표시
//   const handleCancel = () => {
//     setCancelDialogVisible(true);
//   };

//   // 취소 확인 시 처리
//   const confirmCancel = () => {
//     setCancelDialogVisible(false);
//     router.back();
//   };

//   // 취소 취소 시 처리
//   const cancelCancellation = () => {
//     setCancelDialogVisible(false);
//   };

//   // 안드로이드 뒤로가기 버튼 처리
//   useEffect(() => {
//     const backAction = () => {
//       handleCancel();
//       return true; // 기본 동작 방지
//     };

//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       backAction
//     );

//     return () => backHandler.remove(); // 컴포넌트 언마운트 시 이벤트 리스너 제거
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.inner}>
//         <View style={styles.header}>
//           <Title
//             numberOfLines={1}
//             ellipsizeMode="tail"
//             style={styles.headerTitle}
//           >
//             {room?.name}
//           </Title>
//           <IconButton icon="close" onPress={handleCancel} size={RFValue(24)} />
//         </View>

//         <ScrollView style={styles.scrollView}>
//           {/* 기도 제목 입력 */}
//           <TextInput
//             label="기도 제목 (최대 50글자)"
//             value={prayerTitle}
//             onChangeText={(text) => setPrayerTitle(text)}
//             style={styles.titleInput}
//             contentStyle={{ fontSize: RFValue(14) }}
//             mode="outlined"
//             maxLength={50}
//           />

//           <Divider style={styles.divider} />

//           {/* 사람 선택 버튼 */}
//           <Button
//             mode="outlined"
//             icon="account-multiple"
//             onPress={openMemberSelectionModal}
//             style={styles.memberSelectButton}
//             labelStyle={styles.buttonLabel}
//           >
//             기도 대상자 선택하기
//           </Button>

//           {/* 선택한 사람 */}
//           <View style={styles.memberContainer}>
//             {selectedMember ? (
//               <Chip
//                 avatar={
//                   <Avatar.Text
//                     size={RFValue(24)}
//                     label={selectedMember.name.charAt(0)}
//                   />
//                 }
//                 style={styles.selectedMemberChip}
//                 selected
//                 selectedColor={color.secondary}
//                 textStyle={styles.chipText}
//               >
//                 {selectedMember.name}
//               </Chip>
//             ) : null}
//           </View>

//           {/* 기도 내용 입력 */}
//           <View style={styles.contentContainer}>
//             {/* <TextInput
//               label={
//                 selectedMember === null
//                   ? "기도 대상자를 선택하세요."
//                   : `${selectedMember.name}님을 위한 기도문`
//               }
//               value={prayerContent}
//               onChangeText={setPrayerContent}
//               style={styles.contentInput}
//               contentStyle={{ fontSize: RFValue(14) }}
//               mode="outlined"
//               multiline
//               disabled={!selectedMember}
//               // numberOfLines={8}
//             /> */}
//             <Text style={styles.contentInput}>test</Text>
//           </View>
//         </ScrollView>

//         {/* <Divider style={styles.divider} /> */}
//       </View>

//       {/* 저장 버튼 */}
//       <Button
//         mode="contained"
//         onPress={savePrayer}
//         style={styles.saveButton}
//         disabled={
//           !prayerTitle.trim() || !prayerContent.trim() || !selectedMember
//         }
//         color={color.secondary}
//         labelStyle={styles.saveButtonLabel}
//       >
//         기도제목 저장하기
//       </Button>

//       {/* 멤버 선택 모달 */}
//       <PrayerMemberSelectionModal
//         visible={memberSelectionModalVisible}
//         onDismiss={closeMemberSelectionModal}
//         members={sortedRoomMembers}
//         onSelectMember={handleSelectMember}
//         onCustomNamePress={showCustomNameDialog}
//       />

//       {/* 멤버 직접 입력 다이얼로그 */}
//       <PrayerCustomNameDialog
//         visible={customNameDialogVisible}
//         onDismiss={hideCustomNameDialog}
//         customNameRef={customNameRef}
//         onChangeText={onChangeCustomName}
//         onCancel={hideCustomNameDialog}
//         onAdd={addCustomName}
//       />

//       {/* 취소 확인 다이얼로그 */}
//       <PrayerCreationCancelDialog
//         visible={cancelDialogVisible}
//         onDismiss={cancelCancellation}
//         onConfirm={confirmCancel}
//         onCancel={cancelCancellation}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: color.white,
//   },
//   inner: {
//     flex: 9,
//     padding: RFValue(20),
//     backgroundColor: flexMarker.purple,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: RFValue(16),
//     marginTop: RFValue(8),
//   },
//   headerTitle: {
//     fontSize: RFValue(18),
//     fontWeight: "bold",
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: flexMarker.blue,
//     height: "100%",
//   },
//   titleInput: {
//     backgroundColor: color.white,
//     fontSize: RFValue(14),
//     flex: 1,
//   },
//   memberSelectButton: {
//     marginBottom: RFValue(10),
//     borderRadius: RFValue(5),
//     flex: 1,
//   },
//   memberContainer: {
//     height: RFValue(24),
//     justifyContent: "center",
//     alignContent: "center",
//     flex: 1,
//   },
//   buttonLabel: {
//     fontSize: RFValue(14),
//   },
//   selectedMemberChip: {
//     marginVertical: RFValue(8),
//     backgroundColor: `${color.secondary}20`,
//     justifyContent: "center",
//     height: RFValue(36),
//   },
//   chipText: {
//     fontSize: RFValue(14),
//   },
//   contentContainer: {
//     flex: 20,
//     backgroundColor: flexMarker.green,
//   },
//   contentInput: {
//     marginTop: RFValue(8),
//     marginBottom: RFValue(16),
//     fontSize: RFValue(14),
//     height: "100%",
//   },
//   saveButton: {
//     flex: 0.6,
//     marginTop: RFValue(8),
//     marginBottom: RFValue(8),
//     borderRadius: RFValue(24),
//     width: "80%",
//     alignSelf: "center",
//     justifyContent: "center",
//   },
//   saveButtonLabel: {
//     fontSize: RFValue(16),
//     fontWeight: "bold",
//   },
//   divider: {
//     marginVertical: RFValue(8),
//     height: RFValue(1),
//     flex: 1,
//   },
//   cancelDialog: {
//     borderRadius: RFValue(10),
//     padding: RFValue(5),
//   },
//   dialogTitle: {
//     fontSize: RFValue(16),
//     fontWeight: "bold",
//   },
//   dialogActions: {
//     marginTop: RFValue(10),
//     paddingHorizontal: RFValue(10),
//   },
//   dialogButtonLabel: {
//     fontSize: RFValue(14),
//   },
// });
