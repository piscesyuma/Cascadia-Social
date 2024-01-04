"use client";
import { LockType } from "../../config";
import useNumbers, { FNumFormats } from "../../hooks/use-numbers";
import { VeCCLockInfo } from "../../types";

import styles from "./styles/lock-summary.module.scss";

type Props = {
  lockAmount: string;
  expectedVeCCAmount: string;
  lockType: LockType[] | undefined;
  veCCLockInfo: VeCCLockInfo;
};

const LockSummary = ({
  lockAmount,
  lockType,
  expectedVeCCAmount,
  veCCLockInfo,
}: Props) => {
  const { fNum2 } = useNumbers();
  const isExtendLockOnly =
    lockType?.length === 1 && lockType.includes(LockType.EXTEND_LOCK);
  const isIncreaseLockOnly =
    lockType?.length === 1 && lockType.includes(LockType.INCREASE_LOCK);

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div>
          {isExtendLockOnly || isIncreaseLockOnly ? "Total Aligned" : "Total"}
        </div>
        <div>{fNum2(veCCLockInfo.lockedAmount, FNumFormats.token)} bCC</div>
      </div>
      {isIncreaseLockOnly && (
        <div className={styles.item}>
          <div>Increased Alginment</div>
          <div>{fNum2(lockAmount, FNumFormats.token)} bCC</div>
        </div>
      )}
      <div className={styles.item}>
        <div>Total Voting Escrow</div>
        <div>{fNum2(expectedVeCCAmount)} bCC</div>
      </div>
    </div>
  );
};

export default LockSummary;
