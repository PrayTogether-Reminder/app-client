import React from 'react';
import { useAppUpdateModal } from '@/hooks/useAppUpdateModal';
import EASUpdateManager from './EASUpdateManager';

/**
 * 앱 업데이트 관련 모든 모달을 관리하는 컴포넌트
 * - EAS Update 다운로드 진행 모달
 * - Firebase Remote Config 업데이트 모달
 * - 서버 점검 모달
 */
export function UpdateModalsManager() {
  const { OptionalUpdateModal } = useAppUpdateModal();

  return (
    <>
      {/* EAS Update 다운로드 모달 */}
      <EASUpdateManager />

      {/* 선택적 업데이트 모달 */}
      <OptionalUpdateModal />
    </>
  );
}

export default UpdateModalsManager;