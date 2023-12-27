"use client";
import { motion } from "framer-motion";

import { CloseIcon } from "@/assets/close-icon";

import { ProposalDetail } from "./proposal-detail";
import styles from "./styles/proposal-modal.module.scss";

export const ProposalModal = ({
  proposalId,
  onClose,
}: {
  proposalId: number;
  onClose: () => void;
}) => {
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
          <ProposalDetail id={proposalId} />
        </div>
      </div>
    </motion.div>
  );
};
