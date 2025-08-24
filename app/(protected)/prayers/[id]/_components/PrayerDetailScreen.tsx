import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, FAB } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { PrayerContent } from "../../../../../src/domain/prayers/types/prayerContent";
import TitleCard from "./TitleCard";
import PrayerCardList from "./PrayerCardList";
import EmptyState from "./EmptyState";
import { useSelectedPrayerTitleStore } from "../../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { usePrayerContentsQuery } from "@/domain/prayers/hooks/queries/usePrayerQueries";
import FetchError from "@/common/components/error/FetchError";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { useUpdatePrayerTitleMutation, useCreatePrayerContentMutation, useUpdatePrayerContentMutation, useDeletePrayerContentMutation } from "@/domain/prayers/hooks/mutations/usePrayerMuations";
import { color } from "@/common/styles/color";
import PrayerContentAddDialog from "./dialogs/PrayerContentAddDialog";
import PrayerContentEditDialog from "./dialogs/PrayerContentEditDialog";
import PrayerTitleEditDialog from "./dialogs/PrayerTitleEditDialog";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";

interface PrayerDetailScreenProps {
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

function PrayerDetailScreen({ isEditMode, onEditModeChange }: PrayerDetailScreenProps) {
  const { selectedPrayerTitle } = useSelectedPrayerTitleStore();
  const titleText = selectedPrayerTitle?.title ?? "기도 제목을 알 수 없습니다.";
  const { selectedRoom } = useSelectedRoomStore();
  
  // 상태 관리
  const [editingTitle, setEditingTitle] = useState(titleText);
  const [isTitleEditDialogOpen, setIsTitleEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PrayerContent | null>(null);
  const [deletingContent, setDeletingContent] = useState<PrayerContent | null>(null);

  // API 호출
  const {
    data: prayerContents,
    isLoading,
    isError,
    error,
    refetch,
  } = usePrayerContentsQuery(
    selectedRoom?.id ?? null,
    selectedPrayerTitle?.id ?? null
  );

  // Mutations
  const { mutate: updateTitle } = useUpdatePrayerTitleMutation();
  const { mutate: createContent } = useCreatePrayerContentMutation();
  const { mutate: updateContent } = useUpdatePrayerContentMutation();
  const { mutate: deleteContent } = useDeletePrayerContentMutation();

  // 제목 수정 핸들러
  const handleTitleSave = (newTitle: string) => {
    updateTitle({
      prayerTitleId: selectedPrayerTitle?.id ?? null,
      title: newTitle
    });
    setEditingTitle(newTitle);
  };

  // 제목 업데이트
  useEffect(() => {
    setEditingTitle(titleText);
  }, [titleText]);

  const handleAddContent = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditContent = (content: PrayerContent) => {
    setEditingContent(content);
  };

  const handleDeleteContent = (content: PrayerContent) => {
    setDeletingContent(content);
  };

  const confirmDeleteContent = () => {
    if (deletingContent) {
      deleteContent({
        prayerTitleId: selectedPrayerTitle?.id ?? null,
        contentId: deletingContent.id
      });
      setDeletingContent(null);
    }
  };

  if (isLoading && !prayerContents) {
    return <OverlayLoading />;
  }

  if (isError) {
    return (
      <FetchError error={error} onRetry={refetch} isRetrying={isLoading} />
    );
  }

  // 데이터 로딩이 완료된 후에 비어있는지 확인
  if (!prayerContents || prayerContents.length === 0) {
    return (
      <View style={styles.container}>
        {/* 제목 카드 컴포넌트 */}
        <TitleCard 
          title={editingTitle} 
          isEditMode={isEditMode}
          onEdit={() => setIsTitleEditDialogOpen(true)}
        />
        
        <EmptyState />

        {/* 플로팅 액션 버튼 - 기도 내용 추가 */}
        {isEditMode && (
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={handleAddContent}
            label="기도 내용 추가"
          />
        )}

        {/* 기도 내용 추가 다이얼로그 */}
        <PrayerContentAddDialog
          visible={isAddDialogOpen}
          onDismiss={() => setIsAddDialogOpen(false)}
          onAdd={(memberName, content) => {
            createContent({
              prayerTitleId: selectedPrayerTitle?.id ?? null,
              memberName,
              content
            });
            setIsAddDialogOpen(false);
          }}
        />

        {/* 기도 제목 수정 다이얼로그 */}
        <PrayerTitleEditDialog
          visible={isTitleEditDialogOpen}
          onDismiss={() => setIsTitleEditDialogOpen(false)}
          title={editingTitle}
          onSave={handleTitleSave}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 제목 카드 컴포넌트 */}
      <TitleCard 
        title={editingTitle} 
        isEditMode={isEditMode}
        onEdit={() => setIsTitleEditDialogOpen(true)}
      />

      {/* 기도문 목록 컴포넌트 */}
      <PrayerCardList
        prayerContents={prayerContents}
        onEdit={isEditMode ? handleEditContent : undefined}
        onDelete={isEditMode ? handleDeleteContent : undefined}
      />

      {/* 플로팅 액션 버튼 - 기도 내용 추가 */}
      {isEditMode && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleAddContent}
          label="기도 내용 추가"
        />
      )}

      {/* 기도 내용 추가 다이얼로그 */}
      <PrayerContentAddDialog
        visible={isAddDialogOpen}
        onDismiss={() => setIsAddDialogOpen(false)}
        onAdd={(memberName, content) => {
          createContent({
            prayerTitleId: selectedPrayerTitle?.id ?? null,
            memberName,
            content
          });
          setIsAddDialogOpen(false);
        }}
      />

      {/* 기도 내용 수정 다이얼로그 */}
      {editingContent && (
        <PrayerContentEditDialog
          visible={!!editingContent}
          onDismiss={() => setEditingContent(null)}
          content={editingContent}
          onSave={(content) => {
            updateContent({
              prayerTitleId: selectedPrayerTitle?.id ?? null,
              contentId: editingContent.id,
              content
            });
            setEditingContent(null);
          }}
        />
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmationModal
        visible={!!deletingContent}
        onDismiss={() => setDeletingContent(null)}
        onConfirm={confirmDeleteContent}
        icon="alert-circle"
        title="기도 내용 삭제"
        content={`${deletingContent?.memberName}님의 기도 내용을 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
      />

      {/* 기도 제목 수정 다이얼로그 */}
      <PrayerTitleEditDialog
        visible={isTitleEditDialogOpen}
        onDismiss={() => setIsTitleEditDialogOpen(false)}
        title={editingTitle}
        onSave={handleTitleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: RFValue(16),
  },
  titleInputContainer: {
    marginBottom: RFValue(16),
  },
  titleInput: {
    fontSize: RFValue(18),
    backgroundColor: "white",
  },
  fab: {
    position: "absolute",
    margin: RFValue(16),
    right: 0,
    bottom: 0,
    backgroundColor: color.primary,
  },
});

export default PrayerDetailScreen;