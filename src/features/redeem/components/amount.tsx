"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { CoinIcon } from "@/assets/coin-icon";
import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import useNumbers, { FNumFormats } from "../hooks/use-numbers";
import { RedeemState } from "../types";
import { bnum } from "../utils";

import BalanceBar from "./balance-bar";
import Input from "./numerical-input";
import styles from "./styles/amount.module.scss";

interface IAmount {
  state: RedeemState;
  setAmount: (amount: string) => void;
}

export const Amount = ({ state, setAmount }: IAmount): JSX.Element => {
  const { amount, isLoading, redeemInfo } = state;

  const { fNum2 } = useNumbers();
  const { address } = useAccount();

  const hasAmount = bnum(amount).gt(0);
  const hasBalance = bnum(redeemInfo.cCCBalance).gt(0);

  const amountExceedsTokenBalance = bnum(amount).gt(redeemInfo.cCCBalance);

  const maxPercentage =
    !hasBalance || !hasAmount
      ? "0"
      : bnum(amount).div(redeemInfo.cCCBalance).times(100).toFixed(2);

  const barColor = amountExceedsTokenBalance ? "red" : "primary";

  const setMax = useCallback(() => {
    setAmount(redeemInfo.cCCBalance);
  }, [redeemInfo.cCCBalance, setAmount]);

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
            cCC
          </div>
          <div className={styles.inputWrapper}>
            <Input
              className={styles.input}
              value={amount}
              onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
              onUserInput={(value) => setAmount(value)}
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
              <div>{fNum2(redeemInfo.cCCBalance, FNumFormats.token)}</div>
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
            <div className={styles.exceed}>Exceeds cCC balance</div>
          )}
        </div>
      </div>
    </div>
  );
};
