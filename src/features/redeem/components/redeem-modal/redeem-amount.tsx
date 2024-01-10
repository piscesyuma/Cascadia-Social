"use client";
import React from "react";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { CoinIcon } from "@/assets/coin-icon";

import useNumbers, { FNumFormats } from "../../hooks/use-numbers";

import styles from "./styles/redeem-amount.module.scss";

const RedeemAmount = ({ amount }: { amount: string }) => {
  const { fNum2 } = useNumbers();

  return (
    <div className={styles.container}>
      <div className={styles.token}>
        <CoinIcon />
        {fNum2(amount, FNumFormats.token)} cCC
      </div>
      <div className={styles.logo}>
        <CascadiaLogo />
      </div>
    </div>
  );
};

export default RedeemAmount;
