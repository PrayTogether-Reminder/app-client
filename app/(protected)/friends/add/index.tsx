import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Top1Body10 from "@/common/layout/Top1Body10";
import OverlayLoading from "@/common/components/loading/OverlayLoading";
import FriendAddTop from "./_components/FriendAddTop";
import FriendAddForm from "./_components/FriendAddForm";
import { useSendFriendInvitationMutation } from "@/domain/friends/hooks/mutations/useFriendMutations";

export default function FriendAddScreen(): React.ReactElement {
  const router = useRouter();
  const { mutate: sendInvitation, isPending } =
    useSendFriendInvitationMutation();

  const handleSubmit = useCallback(
    (email: string) => {
      sendInvitation(email, {
        onSuccess: () => {
          router.back();
        },
      });
    },
    [sendInvitation, router]
  );

  return (
    <View style={styles.container}>
      <Top1Body10
        tops={[<FriendAddTop />]}
        bodies={[<FriendAddForm onSubmit={handleSubmit} isPending={isPending} />]}
      />

      {isPending && <OverlayLoading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});