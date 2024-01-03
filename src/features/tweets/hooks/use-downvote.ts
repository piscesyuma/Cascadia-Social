import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleDownvote } from "../api/toggle-downvote";

export const useDownvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tweetId,
      userId,
    }: {
      tweetId: string | undefined;
      userId: string;
    }) => {
      return toggleDownvote({ tweetId, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: () => {
      console.log("error");
    },
  });
};
