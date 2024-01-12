import { useMutation, useQueryClient } from "@tanstack/react-query";

import { changeVote } from "../api/change-vote";

export const useVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tweetId,
      userId,
      vote_status,
    }: {
      tweetId: string | undefined;
      userId: string;
      vote_status: string;
    }) => {
      return changeVote({ tweetId, userId, vote_status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: () => {
      console.log("error");
    },
  });
};
