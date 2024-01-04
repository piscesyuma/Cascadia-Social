"use client";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

import { CloseIcon } from "@/assets/close-icon";

import { LockType } from "../../config";
import useLockAmount from "../../hooks/use-lock-amount";
import useLockEndDate from "../../hooks/use-lock-date";
import { AlignState } from "../../types";

import { LockActions } from "./lock-actions";
import LockAmount from "./lock-amount";
import LockSummary from "./lock-summary";
import styles from "./styles/lock-form.module.scss";

export const LockModal = ({
  state,
  setLockAmount,
  onClose,
  onGetVeCC,
}: {
  state: AlignState;
  setLockAmount: (lockAmount: string) => void;
  onClose: () => void;
  onGetVeCC: () => void;
}) => {
  const { lockAmount, lockEndDate, veCCLockInfo } = state;
  const [lockType, setLockType] = useState<LockType[]>();
  const [lockConfirmed, setLockConfirmed] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const { isExtendedLockEndDate } = useLockEndDate(veCCLockInfo);
  const { expectedVeCC, isIncreasedLockAmount, totalLpTokens } =
    useLockAmount(veCCLockInfo);
  const expectedVeCCAmount = expectedVeCC(
    totalLpTokens(lockAmount),
    lockEndDate,
  );

  const handleSuccess = useCallback(() => {
    setLockConfirmed(true);
    onGetVeCC();
  }, [onGetVeCC]);

  const isIncreaseAndExtend =
    veCCLockInfo?.hasExistingLock && !veCCLockInfo?.isExpired;

  useEffect(() => {
    const newLockType = () => {
      if (isIncreaseAndExtend) {
        if (
          isIncreasedLockAmount(lockAmount) &&
          isExtendedLockEndDate(lockEndDate)
        ) {
          return [LockType.INCREASE_LOCK, LockType.EXTEND_LOCK];
        }
        if (isExtendedLockEndDate(lockEndDate)) {
          return [LockType.EXTEND_LOCK];
        }
        if (isIncreasedLockAmount(lockAmount)) {
          return [LockType.INCREASE_LOCK];
        }
      }
      return [LockType.CREATE_LOCK];
    };

    if (JSON.stringify(newLockType()) !== JSON.stringify(lockType)) {
      setLockType(newLockType);
    }
  }, [
    lockAmount,
    lockEndDate,
    veCCLockInfo.lockedAmount,
    isIncreasedLockAmount,
    isExtendedLockEndDate,
    lockType,
    isIncreaseAndExtend,
  ]);

  useEffect(() => {
    setTitle(() => {
      if (lockType?.length === 1) {
        if (!lockConfirmed) {
          if (lockType[0] === LockType.CREATE_LOCK) return "Alignment";
          if (lockType[0] === LockType.EXTEND_LOCK) return "Extend Alignment";
          if (lockType[0] === LockType.INCREASE_LOCK)
            return "Increase Alignment";
        } else {
          if (lockType[0] === LockType.CREATE_LOCK)
            return "Alignment Confirmed";
          if (lockType[0] === LockType.EXTEND_LOCK)
            return "Extend Alignment confirmed";
          if (lockType[0] === LockType.INCREASE_LOCK)
            return "Increase Alignment confirmed";
        }
      }
      if (!lockConfirmed) return "Alignment Preview";
      else return "Alignment Confirmed";
    });
  }, [lockConfirmed, lockType]);

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
          <LockAmount lockAmount={state.lockAmount} />

          <LockSummary
            lockAmount={state.lockAmount}
            expectedVeCCAmount={expectedVeCCAmount}
            lockType={lockType}
            veCCLockInfo={veCCLockInfo}
          />

          <LockActions
            lockAmount={state.lockAmount}
            lockType={lockType}
            onConfirm={handleSuccess}
            setLockAmount={setLockAmount}
          />
        </div>
      </div>
    </motion.div>
  );
};
