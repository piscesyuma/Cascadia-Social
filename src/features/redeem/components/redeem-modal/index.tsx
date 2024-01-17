"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { CloseIcon } from "@/assets/close-icon";

import { RedeemType } from "../../config";
import { RedeemState } from "../../types";

import { RedeemActions } from "./redeem-actions";
import RedeemAmount from "./redeem-amount";
import RedeemSummary from "./redeem-summary";
import styles from "./styles/redeem-form.module.scss";

export const RedeemModal = ({
  state,
  setAmount,
  redeemType,
  onClose,
  onGetRedeem,
}: {
  state: RedeemState;
  setAmount: (amount: string) => void;
  redeemType: RedeemType[] | undefined;
  onClose: () => void;
  onGetRedeem: () => void;
}) => {
  const { amount, wETHAmount } = state;
  const [redeemConfirmed, setRedeemConfirmed] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const handleSuccess = useCallback(() => {
    setRedeemConfirmed(true);
    onGetRedeem();
  }, [onGetRedeem]);

  useEffect(() => {
    setTitle(() => {
      if (redeemType && redeemType.length > 0) {
        if (!redeemConfirmed) {
          if (redeemType.includes(RedeemType.REDEEM)) return "Redeem";
          if (redeemType.includes(RedeemType.BURN)) return "Burn";
        } else {
          if (redeemType.includes(RedeemType.REDEEM)) return "Redeem Confirmed";
          if (redeemType.includes(RedeemType.BURN)) return "Burn confirmed";
        }
      }
      if (!redeemConfirmed) return "Redeem Preview";
      else return "Redeem Confirmed";
    });
  }, [redeemConfirmed, redeemType]);

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
        <div className={styles.title}>{title}</div>

        <button
          onClick={onClose}
          aria-label="Close"
          data-title="Close"
          className={styles.close}
        >
          <CloseIcon />
        </button>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <RedeemAmount amount={amount} />

          <RedeemSummary state={state} redeemType={redeemType} />

          <RedeemActions
            amount={amount}
            wETHAmount={wETHAmount}
            redeemType={redeemType}
            redeemConfirmed={redeemConfirmed}
            onConfirm={handleSuccess}
            setAmount={setAmount}
          />
        </div>
      </div>
    </motion.div>
  );
};
