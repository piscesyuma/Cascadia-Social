import { useMutation, useQueryClient } from "@tanstack/react-query";

import { buyfollower } from "../api/buy-follower";
import { unfollowUser } from "../api/unfollow-user";

export const useBuyFollower = (type: "buyfollower" | "unfollow") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      session_owner_id,
      amount,
    }: {
      user_id: string;
      session_owner_id: string;
      amount: number;
    }) => {
      return type === "buyfollower"
        ? buyfollower(user_id, session_owner_id, amount)
        : unfollowUser(user_id, session_owner_id);
    },

    onSuccess: () => {
      console.log("success");
    },

    onError: () => {
      console.log("error");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
