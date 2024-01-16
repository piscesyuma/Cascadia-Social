"use client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { LoadingCircle } from "@/components/elements/loading-spinner";
import useHasMounted from "@/hooks/use-mounted";

import { BackArrowIcon } from "../assets/back-arrow-icon";
import { PRETTY_DATE_FORMAT } from "../config";
import { useAlign } from "../hooks/use-align";
import useNumbers, { FNumFormats } from "../hooks/use-numbers";
import { bnum } from "../utils";

import styles from "./styles/balance.module.scss";
import TimeCounter from "./time-counter";

export const Balance = ({ changeTab }: { changeTab: () => void }) => {
  const hasMounted = useHasMounted();
  const { address } = useAccount();

  const [showCooldown, setShowCooldown] = useState<boolean>(false);

  const { state, handleGetVeCC } = useAlign();
  const { isLoading, veCCLockInfo } = state;

  const { fNum2 } = useNumbers();

  const percentVeBAL = () => {
    if (veCCLockInfo != null) {
      const totalSupply = bnum(veCCLockInfo.totalSupply);

      if (totalSupply.gt(0)) {
        return bnum(veCCLockInfo.lockedAmount).div(totalSupply).toString();
      }
    }

    return "0";
  };

  useEffect(() => {
    if (veCCLockInfo.cooldown === 0 && veCCLockInfo.lockedEndDate > 0)
      setShowCooldown(true);
    else setShowCooldown(false);
  }, [address, veCCLockInfo]);

  useEffect(() => {
    handleGetVeCC();
  }, [handleGetVeCC]);

  if (!hasMounted) return <div></div>;

  return (
    <section aria-label="balance" className={styles.container}>
      <div className={styles.header}>
        <div className={styles.balance}>
          <div className={styles.title}>Alignment: </div>
          {isLoading && !!address ? (
            <LoadingCircle />
          ) : (
            <>
              {address ? (
                <>
                  <div className={styles.value}>
                    {fNum2(veCCLockInfo.lockedAmount, FNumFormats.tokenFixed)}
                  </div>
                  <div className={styles.unit}>bCC</div>
                </>
              ) : (
                <div className={styles.value}>---</div>
              )}
            </>
          )}
        </div>
        <button className={styles.next} onClick={() => changeTab()}>
          <BackArrowIcon />
        </button>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.detail}>
          <div className={styles.total}>
            <div className={styles.value}>
              {veCCLockInfo?.hasExistingLock
                ? fNum2(percentVeBAL(), {
                    style: "percent",
                    maximumFractionDigits: 4,
                  })
                : "-"}
            </div>
            <div className={styles.label}>% of total bCC</div>
          </div>
          <div className={styles.duration}>
            <div className={styles.value}>
              {veCCLockInfo?.hasExistingLock && veCCLockInfo.cooldown === 0
                ? format(
                    veCCLockInfo.lockedEndDate || new Date(),
                    PRETTY_DATE_FORMAT,
                  )
                : "-"}
            </div>
            <div className={styles.label}>Duration</div>
          </div>
        </div>

        {showCooldown && <TimeCounter countDown={veCCLockInfo.lockedEndDate} />}
      </div>
    </section>
  );
};
