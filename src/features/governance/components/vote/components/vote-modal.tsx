"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useBalance } from "wagmi";

import { CloseIcon } from "@/assets/close-icon";

import { IProposalDetail } from "../../../types";
import { generalConfig } from "../config";
import { useVote } from "../hooks/use-vote";

import RadioElementContainer from "./radio";
import styles from "./styles/vote-form.module.scss";
import { VoteButton } from "./vote-button";

export const VoteModal = ({
  state,
  onClose,
  onProposalQuery,
}: {
  state: IProposalDetail;
  onProposalQuery: () => void;
  onClose: () => void;
}) => {
  const { address } = useAccount();
  const balance = useBalance({ address, watch: true });

  const { requestVote, getStakedBalance } = useVote(
    generalConfig.chain,
    `${address}`,
  );

  const [selected, setSelected] = useState<string>("");
  const [txHash, setTxhash] = useState<string>("");
  const [stakedCC, setStakedCC] = useState<number>(0);

  const useVoteProps = {
    proposalId: state.overview.id.toString(),
    option: selected,
  };

  const isSmallBalance = Number(balance.data?.value || 0) / 10 ** 18 < 0.09;

  const handleVote = () => {
    if (txHash) return onClose();

    requestVote(useVoteProps).then((tx) => {
      if (tx?.tx_response?.raw_log.length > 5) {
        toast.dark("Error: Transcation failed.");
      } else if (tx) {
        toast.dark("Transaction confirmed.");
        onProposalQuery();
      } else {
        toast.dark("Error: Transaction failed.");
      }
      setTxhash(tx?.tx_response?.txhash);
    });
  };

  useEffect(() => {
    getStakedBalance().then((amount) => {
      amount && setStakedCC(amount);
    });
    return () => {
      setStakedCC(0);
      setTxhash("");
      setSelected("");
    };
  }, [state, address, getStakedBalance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      role="group"
      className={styles.container}
    >
      <div className={styles.header}>
        <button
          onClick={onClose}
          aria-label="Close"
          data-title="Close"
          className={styles.close}
        >
          <CloseIcon />
        </button>

        <div className={styles.placeholder} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.title}>
            {state.overview.metadata.title || ""}
          </div>

          <RadioElementContainer
            selected={selected}
            setSelected={setSelected}
          />

          <div className={styles.reserved}>
            0.08 CC is reserved for transaction fees on the Cascadia network.
          </div>

          {isSmallBalance && (
            <div className={styles.smallBalance}>
              Lack sufficient balance to carry forth action. Balance needs to be
              above reserved amount
            </div>
          )}

          {txHash && (
            <div>
              <div className={styles.txHash}>
                <div className="link-label">Transaction ID: </div>
                <Link href={`/transactions/${txHash}`} passHref>
                  <span>
                    {txHash.slice(0, 20)} ... {txHash.slice(txHash.length - 20)}
                  </span>
                </Link>
              </div>
            </div>
          )}

          <VoteButton onClick={handleVote} text={txHash ? "Done" : "Confirm"} />
        </div>
      </div>
    </motion.div>
  );
};
