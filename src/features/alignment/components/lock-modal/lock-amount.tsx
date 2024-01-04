"use client";
import React from "react";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { CoinIcon } from "@/assets/coin-icon";

import useNumbers, { FNumFormats } from "../../hooks/use-numbers";

import styles from "./styles/lock-amount.module.scss";

const LockAmount = ({ lockAmount }: { lockAmount: string }) => {
  const { fNum2 } = useNumbers();

  return (
    <div className={styles.container}>
      <div className={styles.token}>
        <CoinIcon />
        {fNum2(lockAmount, FNumFormats.token)} CC
      </div>
      <div className={styles.logo}>
        <CascadiaLogo />
      </div>
    </div>
  );
};

export default LockAmount;
