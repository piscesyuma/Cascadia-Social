"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { CoinIcon } from "@/assets/coin-icon";
import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import useNumbers, { FNumFormats } from "../hooks/use-numbers";
import { AlignState } from "../types";
import { bnum } from "../utils";

import BalanceBar from "./balance-bar";
import Input from "./numerical-input";
import styles from "./styles/lock-amount.module.scss";

interface ILockAmount {
  state: AlignState;
  setLockAmount: (amount: string) => void;
}
export const LockAmount = ({
  state,
  setLockAmount,
}: ILockAmount): JSX.Element => {
  const { balance, lockAmount, isLoading } = state;
  const { fNum2 } = useNumbers();
  const { address } = useAccount();

  const [isMaxed, setIsMaxed] = useState<boolean>(false);

  const hasAmount = bnum(lockAmount).gt(0);
  const hasBalance = bnum(balance).gt(0);

  const amountExceedsTokenBalance = bnum(lockAmount).gt(balance);

  const maxPercentage =
    !hasBalance || !hasAmount
      ? "0"
      : bnum(lockAmount).div(balance).times(100).toFixed(2);

  const barColor = amountExceedsTokenBalance ? "red" : "primary";

  const setMax = useCallback(() => {
    setLockAmount(bnum(balance).minus(0.0005).toString()); // in case of max amount, minus gas price 0.0005 from balance --- temporarily
  }, [balance, setLockAmount]);

  useEffect(() => {
    setIsMaxed(() => balance === lockAmount);
  }, [balance, lockAmount]);

  return (
    <div className={styles.container}>
      <div
        className={`${amountExceedsTokenBalance && styles.exceed} ${
          styles.wrapper
        }`}
      >
        <div className={styles.inputToken}>
          <div className={styles.token}>
            <CascadiaLogo />
            CC
          </div>
          <div className={styles.inputWrapper}>
            <Input
              className={styles.input}
              value={lockAmount}
              onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
              onUserInput={(value) => setLockAmount(value)}
            />
          </div>
        </div>

        <div className={styles.balance}>
          <button className={styles.btn} onClick={() => setMax()}>
            <CoinIcon />
            Balance:
            {isLoading && !!address ? (
              <ButtonLoadingSpinner width="1" height="1" />
            ) : (
              <div>{fNum2(balance, FNumFormats.token)}</div>
            )}
            {hasBalance && (
              <div>{!isMaxed ? <span></span> : <span>Max</span>}</div>
            )}
          </button>

          {hasBalance && (
            <BalanceBar
              width={maxPercentage}
              bufferWidth={0}
              color={barColor}
              isOver={amountExceedsTokenBalance}
            />
          )}

          {amountExceedsTokenBalance && (
            <div className={styles.exceed}>Exceeds CC balance</div>
          )}
        </div>
      </div>
    </div>
  );
};
