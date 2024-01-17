"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { CloseIcon } from "@/assets/close-icon";

import { UnLockType } from "../../config";
import useLockEndDate from "../../hooks/use-lock-date";
import { AlignState } from "../../types";
import { formatDateInput } from "../../utils";

import styles from "./styles/index.module.scss";
import { UnLockActions } from "./unlock-actions";
import UnLockSummary from "./unlock-summary";

export const UnLockModal = ({
  state,
  unlockType,
  onClose,
  onGetVeCC,
  onRefetch,
}: {
  state: AlignState;
  unlockType: UnLockType[] | undefined;
  onClose: () => void;
  onGetVeCC: () => void;
  onRefetch: () => Promise<void>;
}) => {
  const { veCCLockInfo } = state;
  const [unlockConfirmed, setUnLockConfirmed] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [unlockEndDate, setUnLockEndDate] = useState<string>("");

  const { maxLockEndDateTimestamp } = useLockEndDate(veCCLockInfo);

  const handleSuccess = useCallback(async () => {
    onRefetch().then(() => {
      setUnLockConfirmed(true);
      onGetVeCC();
    });
  }, [onGetVeCC, onRefetch]);

  useEffect(() => {
    const lockEndDate =
      veCCLockInfo?.cooldown > 0
        ? formatDateInput(maxLockEndDateTimestamp)
        : formatDateInput(veCCLockInfo.lockedEndDate);
    setUnLockEndDate(lockEndDate);
  }, [maxLockEndDateTimestamp, veCCLockInfo]);

  useEffect(() => {
    setTitle(() => {
      if (unlockType?.length === 1) {
        if (!unlockConfirmed) {
          if (unlockType[0] === UnLockType.START_COOLDOWN)
            return "Start Cooldown";
          if (unlockType[0] === UnLockType.WITHDRAW) return "Withdraw";
          if (unlockType[0] === UnLockType.RELOCK) return "Realign";
          if (unlockType[0] === UnLockType.CLAIM) return "Claim";
        } else {
          if (unlockType[0] === UnLockType.START_COOLDOWN)
            return "Start Cooldown Confirmed";
          if (unlockType[0] === UnLockType.WITHDRAW)
            return "Withdraw Confirmed";
          if (unlockType[0] === UnLockType.RELOCK) return "Realign Confirmed";
          if (unlockType[0] === UnLockType.CLAIM) return "Claim Confirmed";
        }
      }
      if (!unlockConfirmed) return "UnLocking Preview";
      else return "UnLocking Confirmed";
    });
  }, [unlockConfirmed, unlockType]);

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
          <UnLockSummary
            unlockEndDate={unlockEndDate}
            unlockType={unlockType}
            veCCLockInfo={veCCLockInfo}
            unlockConfirmed={unlockConfirmed}
          />

          <UnLockActions unlockType={unlockType} onConfirm={handleSuccess} />
        </div>
      </div>
    </motion.div>
  );
};
