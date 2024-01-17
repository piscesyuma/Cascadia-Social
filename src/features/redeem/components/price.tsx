"use client";
import numeral from "numeral";

import { Tooltip } from "@/components/elements/tooltip";

import { RedeemState } from "../types";
import { bnum } from "../utils";

import styles from "./styles/price.module.scss";

export const Price = ({ state }: { state: RedeemState }): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.discount}>
        <div className={styles.label}>Discount:</div>
        <div>{state.redeemInfo.discount}</div>
        <div>%</div>
      </div>

      <div className={styles.weth}>
        <div className={styles.label}>WETH:</div>
        <div>
          <Tooltip
            text={`${state.amount} * ${state.redeemInfo.ccPrice} * 100 / ${state.redeemInfo.wETHPrice} / ${state.redeemInfo.discount}`}
          >
            {numeral(state.wETHAmount).format("0,0.0[000]")}
          </Tooltip>
        </div>

        <div>
          {`( $ ${numeral(
            bnum(state.wETHAmount).times(state.redeemInfo.wETHPrice),
          ).format("0,0.0[000]")} )`}
        </div>
      </div>
    </div>
  );
};
