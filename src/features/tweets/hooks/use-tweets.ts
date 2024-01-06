"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

import { ITweet } from "..";
import { getTweets } from "../api/get-tweets";

interface IInfiniteTweets {
  nextId: string;
  tweets: ITweet[];
}

export const useTweets = ({
  queryKey = ["tweets"],
  type,
  id,
  sortByVote,
}: {
  queryKey?: string[];
  type?: string;
  id?: string;
  sortByVote?: string;
}) => {
  return useInfiniteQuery<IInfiniteTweets>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: ({ pageParam }) => {
      return getTweets({
        pageParam,
        limit: 20,
        type,
        id,
        sortByVote,
      });
    },
    initialPageParam: "",

    getNextPageParam: (lastPage) => {
      return lastPage?.nextId;
    },
    refetchOnWindowFocus: false,
  });
};
