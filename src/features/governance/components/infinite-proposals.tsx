"use client";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

import { LoadingSpinner } from "@/components/elements/loading-spinner";
import { Modal } from "@/components/elements/modal";
import { useProposalModal } from "@/stores/use-proposal-modal";

import { IInfiniteProposals } from "../types";

import { Proposal } from "./proposal";
import { ProposalModal } from "./proposal-modal";
import styles from "./styles/infinite-proposals.module.scss";

export const InfiniteProposals = ({
  proposals,
  isSuccess,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
}: {
  proposals: IInfiniteProposals | undefined;
  isSuccess: boolean | undefined;
  isFetchingNextPage: boolean | undefined;
  fetchNextPage: () => Promise<any> | void;
  hasNextPage: boolean | undefined;
}) => {
  const { ref } = useInView({
    onChange: (inView) => {
      inView && hasNextPage && fetchNextPage();
    },
  });

  const isProposalModalOpen = useProposalModal(
    (state) => state.isProposalModalOpen,
  );
  const openProposalModal = useProposalModal(
    (state) => state.openProposalModal,
  );
  const closeProposalModal = useProposalModal(
    (state) => state.closeProposalModal,
  );
  const [selectedProposalId, setSelectedProposalId] = useState<number>();

  const handleSelectProposal = (id: number) => {
    setSelectedProposalId(id);
    openProposalModal();
  };

  return (
    <div className={styles.container}>
      {isSuccess &&
        proposals?.pages?.map((page) => {
          return page?.proposals?.map((proposal, index) =>
            index === page.proposals.length - 1 ? (
              <div
                ref={ref}
                className={styles.proposalContainer}
                key={proposal.id}
              >
                <Proposal
                  proposal={proposal}
                  onSelect={() => handleSelectProposal(proposal.id)}
                />
              </div>
            ) : (
              <div className={styles.proposalContainer} key={proposal.id}>
                <Proposal
                  proposal={proposal}
                  onSelect={() => handleSelectProposal(proposal.id)}
                />
              </div>
            ),
          );
        })}

      <AnimatePresence>
        {isProposalModalOpen && selectedProposalId && (
          <Modal
            onClose={closeProposalModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <ProposalModal
              proposalId={selectedProposalId}
              onClose={closeProposalModal}
            />
          </Modal>
        )}
      </AnimatePresence>

      {isFetchingNextPage && <LoadingSpinner />}
    </div>
  );
};
