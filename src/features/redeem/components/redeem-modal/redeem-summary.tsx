"use client";
import numeral from "numeral";

import { RedeemType } from "../../config";
import { RedeemState } from "../../types";

import styles from "./styles/redeem-summary.module.scss";

const RedeemSummary = ({
  state,
  redeemType,
}: {
  state: RedeemState;
  redeemType: RedeemType[] | undefined;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div>Total cCC Balance</div>
        <div>{numeral(state.redeemInfo.cCCBalance).format("0,0.00[00]")}</div>
      </div>

      {redeemType && redeemType.includes(RedeemType.REDEEM) && (
        <>
          <div className={styles.item}>
            <div>CC Price: </div>
            <div>{state.redeemInfo.ccPrice}</div>
          </div>

          <div className={styles.item}>
            <div>Total WETH Balance: </div>
            <div>{state.redeemInfo.wETHBalance}</div>
          </div>

          <div className={styles.item}>
            <div>WETH Price: </div>
            <div>{state.redeemInfo.wETHPrice}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default RedeemSummary;
