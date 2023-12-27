import { IProposal } from "../types";
import { getPercentages, getStatusInfo } from "../utils";

import styles from "./styles/proposal.module.scss";

export const Proposal = ({
  proposal,
  onSelect,
}: {
  proposal: IProposal;
  onSelect: () => void;
}) => {
  const {
    title,
    status,
    summary,
    votingStartTime,
    votingEndTime,
    finalTallyResult,
  } = proposal;

  const statusInfo = getStatusInfo(status);

  const percentages =
    finalTallyResult &&
    Object.values(finalTallyResult).length > 0 &&
    getPercentages(finalTallyResult);

  return (
    <div tabIndex={0} role="link" className={styles.container}>
      <div className={styles.header}>
        <div
          tabIndex={0}
          role="link"
          className={styles.title}
          onClick={() => onSelect()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              () => onSelect();
            }
          }}
        >
          {title}
        </div>
        <div className={styles.tag}>{statusInfo.value}</div>
      </div>

      <div className={styles.content}>{summary}</div>

      {votingStartTime && votingEndTime && (
        <div className={styles.votingTime}>
          <div className={styles.startTime}>
            <div>{votingStartTime}</div>
            <div>Start Time</div>
          </div>
          <div className={styles.divider} />
          <div className={styles.endTime}>
            <div>{votingEndTime}</div>
            <div>End Time</div>
          </div>
        </div>
      )}

      {percentages && (
        <>
          <div className={styles.bar}>
            <div
              className={styles.yes}
              style={{ width: `${percentages.yesPercent}%` }}
            />
            <div
              className={styles.no}
              style={{ width: `${percentages.noPercent}%` }}
            />
            <div
              className={styles.abstain}
              style={{ width: `${percentages.abstainPercent}%` }}
            />
          </div>
          <div className={styles.value}>
            <div className={styles.option}>
              <div className={`${styles.yes} ${styles.mark}`} />
              <div>
                <div className={styles.label}>Yes</div>
                <div>{`${percentages.yesPercent}%`}</div>
              </div>
            </div>
            <div className={styles.option}>
              <div className={`${styles.no} ${styles.mark}`} />
              <div>
                <div className={styles.label}>No</div>
                <div>{`${percentages.noPercent}%`}</div>
              </div>
            </div>
            <div className={styles.option}>
              <div className={`${styles.abstain} ${styles.mark}`} />
              <div>
                <div className={styles.label}>Abstain</div>
                <div>{`${percentages.abstainPercent}%`}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
