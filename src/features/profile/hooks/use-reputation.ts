import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeUserReputation } from "../api/change-user-reputation";

export const useReputation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      session_owner_id,
      reputation_status,
    }: {
      user_id: string | undefined;
      session_owner_id: string;
      reputation_status: string;
    }) => {
      return changeUserReputation(user_id, session_owner_id, reputation_status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: () => {
      console.log("error");
    },
  });
};
