import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toggleSortByVote } from "../api/toggle-sort-by-vote";

export const useSortByVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      sort_by_vote,
    }: {
      userId: string;
      sort_by_vote: boolean;
    }) => {
      return toggleSortByVote({ userId, sort_by_vote });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
    onError: () => {
      console.log("error");
    },
  });
};
