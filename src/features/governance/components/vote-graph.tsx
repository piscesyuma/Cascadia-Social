import Big from "big.js";
import numeral from "numeral";
import React from "react";

import { IProposalDetail } from "../types";
import { formatGraphData } from "../utils";

import Arc from "./arc";
import styles from "./styles/vote-graph.module.scss";
import { Vote } from "./vote/components";

type VoteGraphType = {
  className?: string;
  state: IProposalDetail;
  onProposalQuery: () => void;
};

const VotesGraph = ({ state, onProposalQuery }: VoteGraphType) => {
  const { voteGraph } = state;
  const { votes, bonded, currentVP } = voteGraph;

  const total = Big(votes.yes.value)
    .plus(votes.no.value)
    .plus(votes.abstain.value);

  const formattedData = formatGraphData({
    data: votes,
    total,
  });

  const totalVotedFormat = numeral(total.toFixed(2)).format("0,0.[00]");

  const totalBondedFormat = numeral(bonded.value).format("0,0.[00]");

  const totalVotedPercent =
    total.gt(0) && Number(bonded.value) > 0
      ? `${numeral(
          Big(total.toFixed(2)).div(bonded.value).times(100).toFixed(2),
        ).format("0.[00]")}%`
      : "0%";

  const currentVPFormat = numeral(Number(currentVP.value).toFixed(10)).format(
    "0,0.00[00]",
  );

  const DrawCircleContent = () => {
    return <></>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.total}>
        <div className={styles.totalAmount}>
          {totalVotedFormat} / {totalBondedFormat}
        </div>
        <div className={styles.totalPercent}>
          <div className={styles.label}>Voted / Total</div>
          <div className={styles.percent}>{totalVotedPercent}</div>
        </div>
      </div>
      <div>
        <DrawCircleContent />
        <Arc range={360} items={formattedData} />
      </div>
      <div className={styles.currentVP}>
        <div>Current Voting Power</div>
        <div>{currentVPFormat}</div>
      </div>
      <div className={styles.legend}>
        {formattedData
          .filter((x) => x.name !== "empty")
          .map((x) => {
            let style = styles.yes;
            switch (x.name) {
              case "yes":
                style = styles.yes;
                break;
              case "no":
                style = styles.no;
                break;
              case "abstain":
                style = styles.abstain;
                break;
              default:
                style = styles.yes;
                break;
            }
            return (
              <div key={x.name} className={`${style} ${styles.voteItem}`}>
                <div className={styles.label}>
                  {x.name} {`( ${x.percentage}% )`}
                </div>
                <div>{x.display}</div>
              </div>
            );
          })}
      </div>
      <Vote state={state} onProposalQuery={onProposalQuery} />
    </div>
  );
};

export default VotesGraph;
