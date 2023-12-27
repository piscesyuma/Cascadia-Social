import dayjs from "dayjs";
import * as R from "ramda";
import React from "react";

import { ComponentDefault, OverviewType } from "../types";
import { getProposalType, getStatusInfo } from "../utils";
import { formatDayJs } from "../utils/dayjs";

import ParamsChange from "./params-change";
import ParamsUpdate from "./params-update";
import SoftwareUpgrade from "./software-upgrade";
import styles from "./styles/overivew.module.scss";

const Overview: React.FC<{ overview: OverviewType } & ComponentDefault> = ({
  overview,
}) => {
  const statusInfo = getStatusInfo(overview.status);

  const types = getProposalType(overview.contents);

  const proposalType = types.map((type) => type).join(", ");

  const getExtraDetails = () => {
    return (
      <>
        {overview.contents.map((content: any, index: number) => {
          if (types[index] === "parameterChangeProposal") {
            return (
              <React.Fragment key={index}>
                <div>Changes</div>
                <ParamsChange changes={R.pathOr([], ["changes"], content)} />
              </React.Fragment>
            );
          }
          if (types[index] === "MsgUpdateParams") {
            return (
              <React.Fragment key={index}>
                <div>Changes</div>
                <ParamsUpdate params={R.pathOr([], ["params"], content)} />
              </React.Fragment>
            );
          }
          if (types[index] === "softwareUpgradeProposal") {
            return (
              <React.Fragment key={index}>
                <div>Plan</div>
                <SoftwareUpgrade
                  height={R.pathOr("0", ["plan", "height"], content)}
                  info={R.pathOr("", ["plan", "info"], content)}
                  name={R.pathOr("", ["plan", "name"], content)}
                />
              </React.Fragment>
            );
          }
          return <React.Fragment key={index} />;
        })}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{overview.metadata.title}</div>
        <div className={styles.tag}>{statusInfo.value}</div>
      </div>
      <div className={styles.content}>
        <div>Type</div>
        <div>{proposalType}</div>
        {!!overview.submitTime && (
          <>
            <div>Submit Time</div>
            <div>{formatDayJs(dayjs.utc(overview.submitTime), "locale")}</div>
          </>
        )}
        {!!overview.votingEndTime && (
          <>
            <div>Voting End Time</div>
            <div>
              {formatDayJs(dayjs.utc(overview.votingEndTime), "locale")}
            </div>
          </>
        )}
        {getExtraDetails()}
      </div>

      <div className={styles.content}>
        {!!overview.metadata.authors && (
          <>
            <div>Authors</div>
            <div>{overview.metadata.authors}</div>
          </>
        )}
        {!!overview.metadata.summary && (
          <>
            <div>Summary</div>
            <div>{overview.metadata.summary} </div>
          </>
        )}
        {!!overview.metadata.details && (
          <>
            <div>Details</div>
            <div>{overview.metadata.details}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Overview;
