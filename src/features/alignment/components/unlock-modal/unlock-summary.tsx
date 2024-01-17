"use client";
import { format } from "date-fns";
import React from "react";

import { PRETTY_DATE_FORMAT, UnLockType } from "../../config";
import useNumbers, { FNumFormats } from "../../hooks/use-numbers";
import { VeCCLockInfo } from "../../types";

import styles from "./styles/unlock-summary.module.scss";

type Props = {
  unlockEndDate: string;
  unlockType: UnLockType[] | undefined;
  veCCLockInfo: VeCCLockInfo;
  unlockConfirmed: boolean;
};

const UnLockSummary = ({
  unlockEndDate,
  unlockType,
  veCCLockInfo,
  unlockConfirmed,
}: Props) => {
  const { fNum2 } = useNumbers();

  return (
    <>
      <div className={styles.container}>
        {!unlockType?.includes(UnLockType.CLAIM) ? (
          <>
            <div className={styles.item}>
              <div>Total Aligned</div>
              <div>
                {fNum2(veCCLockInfo.lockedAmount, FNumFormats.token)} bCC
              </div>
            </div>

            {!unlockConfirmed && unlockEndDate && (
              <div className={styles.item}>
                <div>End Date</div>
                <div>{format(new Date(unlockEndDate), PRETTY_DATE_FORMAT)}</div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.item}>
            <div>Claim cCC token</div>
          </div>
        )}
      </div>
    </>
  );
};

export default UnLockSummary;
