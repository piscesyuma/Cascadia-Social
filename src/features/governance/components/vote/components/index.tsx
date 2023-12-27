"use client";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { Modal } from "@/components/elements/modal";
import { ConnectWalletButton } from "@/features/web3";
import { useVoteModal } from "@/stores/use-vote-modal";

import { IProposalDetail } from "../../../types";

import styles from "./styles/vote.module.scss";
import { VoteButton } from "./vote-button";
import { VoteModal } from "./vote-modal";

type VoteType = {
  state: IProposalDetail;
  onProposalQuery: () => void;
};

export const Vote = ({ state, onProposalQuery }: VoteType) => {
  const { address } = useAccount();
  const isVoteModalOpen = useVoteModal((state) => state.isVoteModalOpen);
  const openVoteModal = useVoteModal((state) => state.openVoteModal);
  const closeVoteModal = useVoteModal((state) => state.closeVoteModal);

  const handleVote = () => {
    if (!address || !state.overview.isVotingTime) {
      toast.warning("This proposal passed. You can't vote.");
    } else {
      openVoteModal();
    }
  };

  return (
    <div className={styles.container}>
      {address ? (
        <VoteButton onClick={handleVote} text="vote" />
      ) : (
        <ConnectWalletButton text="Connect Wallet" />
      )}

      <AnimatePresence>
        {isVoteModalOpen && (
          <Modal
            onClose={closeVoteModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <VoteModal
              state={state}
              onClose={closeVoteModal}
              onProposalQuery={onProposalQuery}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
