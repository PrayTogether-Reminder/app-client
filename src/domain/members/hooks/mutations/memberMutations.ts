import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "../../services/memberService";
import { UpdateMemberRequest } from "../../types/request/updateMemberRequest";
import QUERY_KEYS from "../../../../common/constants/queryKeys";

// 회원 정보 업데이트 Mutation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMemberRequest) => memberService.updateProfile(data),
    onSuccess: async () => {
      // 프로필 쿼리 무효화하여 최신 데이터 다시 가져오기
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.profiles, QUERY_KEYS.me],
      });
      // 쿼리가 refetch될 때까지 대기
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.profiles, QUERY_KEYS.me],
      });
    },
  });
};
