import React, { useEffect } from "react";
import { Slot, useRouter, usePathname } from "expo-router";
import FcmInitializer from "@/common/services/fcm/fcmInitializer";
import { useProfileQuery } from "@/domain/members/hooks/queries/memberQueries";

export default function ProtectedLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profile, isLoading } = useProfileQuery();

  useEffect(() => {
    // 전화번호 입력 페이지가 아니고, 프로필 로딩이 완료되고, phoneNumber가 null이면 페이지로 이동
    if (
      !isLoading &&
      profile &&
      !profile.phoneNumber &&
      pathname !== "/phone-registration"
    ) {
      router.replace("/phone-registration");
    }
  }, [profile, isLoading, pathname, router]);

  return (
    <>
      <FcmInitializer />
      <Slot />
    </>
  );
}
