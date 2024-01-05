import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleUpvote } from "../api/toggle-upvote";

export const useUpvote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tweetId,
      userId,
    }: {
      tweetId: string | undefined;
      userId: string;
    }) => {
      return toggleUpvote({ tweetId, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: () => {
      console.log("error");
    },
  });
};
