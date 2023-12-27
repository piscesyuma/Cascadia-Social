"use client";
import { useEffect } from "react";

import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { TryAgain } from "@/components/elements/try-again";
import { useProposalVersion } from "@/stores/use-proposal-version";

import { useProposals } from "../hooks/use-proposals";

import { InfiniteProposals } from "./infinite-proposals";

export const Governance = () => {
  const version = useProposalVersion((state) => state.version);
  const {
    data: proposals,
    isLoading,
    isFetching,
    isError,
    isSuccess,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useProposals({ version });

  useEffect(() => {
    refetch();
  }, [refetch, version]);

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <TryAgain />;
  }

  return (
    <InfiniteProposals
      proposals={proposals}
      isSuccess={isSuccess}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    />
  );
};
