import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { TryAgain } from "@/components/elements/try-again";
import { useProposalVersion } from "@/stores/use-proposal-version";

import { useProposal } from "../hooks/use-proposal";
import { shouldShowData } from "../utils";

import Overview from "./overview";
import styles from "./styles/proposal-detail.module.scss";
import VotesGraph from "./vote-graph";

export const ProposalDetail = ({ id }: { id: number }) => {
  const version = useProposalVersion((state) => state.version);
  const {
    data: proposal,
    isPending,
    isError,
    refetch,
  } = useProposal({
    id,
    version,
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <TryAgain />;
  }

  return (
    <div className={styles.container}>
      <Overview overview={proposal.overview} />
      {shouldShowData(proposal.overview.status) && (
        <VotesGraph state={proposal} onProposalQuery={refetch} />
      )}
    </div>
  );
};
