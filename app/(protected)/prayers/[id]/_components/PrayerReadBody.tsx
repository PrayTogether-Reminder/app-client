import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { useLocalSearchParams } from "expo-router";
import { PrayerContent } from "../../../../../src/domain/prayers/types/prayerContent";
import TitleCard from "./TitleCard";
import PrayerCardList from "./PrayerCardList";
import EmptyState from "./EmptyState";
import { useSelectedPrayerTitleStore } from "../../../../../src/domain/prayers/stores/useSelectedPrayerTitleStore";
import { useSelectedRoomStore } from "../../../../../src/domain/rooms/stores/useSelectedRoomStore";
import { usePrayerContentsQuery } from "@/domain/prayers/hooks/queries/usePrayerQueries";
import FetchError from "@/common/components/error/FetchError";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import { useUpdatePrayerTitleMutation, useCreatePrayerContentMutation, useUpdatePrayerContentMutation, useDeletePrayerContentMutation } from "@/domain/prayers/hooks/mutations/usePrayerMutations";
import { color } from "@/common/styles/color";
import PrayerContentAddDialog from "./dialogs/PrayerContentAddDialog";
import PrayerContentEditDialog from "./dialogs/PrayerContentEditDialog";
import PrayerTitleEditDialog from "./dialogs/PrayerTitleEditDialog";
import ConfirmationModal from "@/common/components/modal/ConfirmationModal";
import { useCopyToClipboard } from "../../../../../src/hooks/useCopyToClipboard";

interface PrayerReadBodyProps {
  prayerTitleId: number;
  isEditMode: boolean;
  onEditModeChange: (value: boolean) => void;
}

function PrayerReadBody({ prayerTitleId, isEditMode, onEditModeChange }: PrayerReadBodyProps) {
  const params = useLocalSearchParams();
  const roomIdFromUrl = params.roomId ? Number(params.roomId) : null;
  const titleFromUrl = params.title ? decodeURIComponent(params.title as string) : null;

  const { selectedPrayerTitle } = useSelectedPrayerTitleStore();
  const { selectedRoom } = useSelectedRoomStore();
  const { copyToClipboard } = useCopyToClipboard();

  // URL 파라미터를 우선 사용하고, 없으면 store에서 가져옴
  const roomId = roomIdFromUrl ?? selectedRoom?.id ?? null;
  const titleId = prayerTitleId ?? selectedPrayerTitle?.id ?? null;
  const titleText = titleFromUrl ?? selectedPrayerTitle?.title ?? "기도 제목을 알 수 없습니다.";

  console.log("PrayerReadBody - roomId:", roomId, "titleId:", titleId, "title:", titleText);
  
  // 상태 관리
  const [editingTitle, setEditingTitle] = useState(titleText);
  const [isTitleEditDialogOpen, setIsTitleEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<PrayerContent | null>(null);
  const [deletingContent, setDeletingContent] = useState<PrayerContent | null>(null);

  // API 호출 - props/URL 파라미터를 우선 사용
  const {
    data: prayerContents,
    isLoading,
    isError,
    error,
    refetch,
  } = usePrayerContentsQuery(
    roomId,
    titleId
  );

  // Mutations
  const { mutate: updateTitle } = useUpdatePrayerTitleMutation();
  const { mutate: createContent } = useCreatePrayerContentMutation();
  const { mutate: updateContent } = useUpdatePrayerContentMutation();
  const { mutate: deleteContent } = useDeletePrayerContentMutation();

  // 제목 수정 핸들러
  const handleTitleSave = (newTitle: string) => {
    if (!titleId) {
      console.error('Prayer title ID is missing');
      return;
    }
    updateTitle({
      prayerTitleId: titleId,
      title: newTitle
    });
    setEditingTitle(newTitle);
  };

  // 전체 내용 복사 핸들러
  const handleCopyAll = () => {
    // 기도 내용이 없으면 기도 제목만 복사
    if (!prayerContents || prayerContents.length === 0) {
      copyToClipboard(`[${editingTitle}]`, {
        successTitle: "복사 완료",
        successMessage: "기도가 복사되었습니다",
      });
      return;
    }

    // 기도 제목과 각 기도 내용을 형식에 맞게 조합
    const contentParts: string[] = [`[${editingTitle}]`, ""];

    prayerContents.forEach((prayer) => {
      contentParts.push(prayer.memberName);
      contentParts.push(prayer.content);
      contentParts.push("");
    });

    // 마지막 빈 줄 제거
    if (contentParts[contentParts.length - 1] === "") {
      contentParts.pop();
    }

    const fullContent = contentParts.join("\n");

    copyToClipboard(fullContent, {
      successTitle: "복사 완료",
      successMessage: "기도가 복사되었습니다",
    });
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
    if (deletingContent && titleId && deletingContent.id) {
      deleteContent({
        prayerTitleId: titleId,
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
          onCopy={handleCopyAll}
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
          existingPrayerContents={prayerContents || []}
          onAdd={(memberName, content) => {
            if (!titleId) {
              console.error('Prayer title ID is missing');
              return;
            }
            createContent({
              prayerTitleId: titleId,
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
        onCopy={handleCopyAll}
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
        existingPrayerContents={prayerContents || []}
        onAdd={(memberName, content) => {
          console.log('PrayerReadBody - prayerContents:', prayerContents);
          if (!titleId) {
            console.error('Prayer title ID is missing');
            return;
          }
          createContent({
            prayerTitleId: titleId,
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
            if (!titleId || !editingContent.id) {
              console.error('Required IDs are missing');
              return;
            }
            updateContent({
              prayerTitleId: titleId,
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

export default PrayerReadBody;