import Big from "big.js";
import numeral from "numeral";
import * as R from "ramda";

import { CountType, FormatGraphType, TokenUnit } from "../types";

export const BAR_COLOR: any = {
  0: "#03360D",
  1: "#0063C7",
  2: "#c6c6c6",
  3: "#0000000d",
};

export const isVotingTimeWithinRange = (date: string) => {
  if (date === undefined) {
    return false;
  }
  const now = new Date();
  const nowUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  );
  const endPeriodVote = new Date(date);
  const endPeriodVoteUTC = Date.UTC(
    endPeriodVote.getUTCFullYear(),
    endPeriodVote.getUTCMonth(),
    endPeriodVote.getUTCDate(),
    endPeriodVote.getUTCHours(),
    endPeriodVote.getUTCMinutes(),
    endPeriodVote.getUTCSeconds(),
  );
  const canVote =
    new Date(endPeriodVoteUTC).getTime() > new Date(nowUTC).getTime();
  return canVote;
};

export const getStatusInfo = (
  status: string,
): { value: string; tag: string } => {
  const statusDict: any = {
    PROPOSAL_STATUS_DEPOSIT_PERIOD: {
      value: "deposit",
      tag: "three",
    },
    PROPOSAL_STATUS_INVALID: {
      value: "invalid",
      tag: "three",
    },
    PROPOSAL_STATUS_VOTING_PERIOD: {
      value: "voting",
      tag: "three",
    },
    PROPOSAL_STATUS_PASSED: {
      value: "passed",
      tag: "black",
    },
    PROPOSAL_STATUS_REJECTED: {
      value: "rejected",
      tag: "black",
    },
    PROPOSAL_STATUS_FAILED: {
      value: "failed",
      tag: "black",
    },
  };

  if (statusDict[status]) {
    return statusDict[status];
  }
  return {
    value: status,
    tag: "zero",
  };
};

export const getPercentages = (finalTallyResult: CountType) => {
  const barCount = Object.values(finalTallyResult).reduce(
    (acc: number, cur: string) => acc + Number(cur),
    0,
  );
  const yesPercent =
    barCount === 0
      ? 0
      : numeral((Number(finalTallyResult.yesCount) / barCount) * 100).format(
          "0.[00]",
        );
  const noPercent =
    barCount === 0
      ? 0
      : numeral((Number(finalTallyResult.noCount) / barCount) * 100).format(
          "0.[00]",
        );
  const abstainPercent =
    barCount === 0
      ? 0
      : numeral(
          (Number(finalTallyResult.abstainCount) / barCount) * 100,
        ).format("0.[00]");

  return {
    yesPercent,
    noPercent,
    abstainPercent,
  };
};

export const formatToken = (value: number | string, denom = ""): TokenUnit => {
  if (typeof value !== "string" && typeof value !== "number") {
    value = "0";
  }

  if (typeof value === "number") {
    value = `${value}`;
  }

  const results: TokenUnit = {
    value,
    displayDenom: denom,
    baseDenom: denom,
    exponent: 18,
  };

  const ratio = 10 ** 18;
  results.value = Big(value).div(ratio).toFixed(18);
  return results;
};

export const getProposalType = (contents: any) => {
  const types = [];

  for (let i = 0; i < contents.length; i++) {
    const content = contents[i];
    const proposalType: string = R.pathOr("", ["@type"], content);

    let type = "";

    if (proposalType === "/cosmos.gov.v1beta1.TextProposal") {
      type = "textProposal";
    } else if (
      proposalType === "/cosmos.params.v1beta1.ParameterChangeProposal"
    ) {
      type = "parameterChangeProposal";
    } else if (proposalType === "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade") {
      type = "softwareUpgradeProposal";
    } else if (
      proposalType === "/cosmos.upgrade.v1beta1.CommunityPoolSpendProposal"
    ) {
      type = "communityPoolSpendProposal";
    } else if (proposalType === "/cosmos.upgrade.v1beta1.MsgCancelUpgrade") {
      type = "cancelUpgrade";
    } else {
      const spliteString = proposalType.split(".");
      type = spliteString[spliteString.length - 1];
    }

    types.push(type);
  }
  return types;
};

export const formatGraphData = ({ data, total }: FormatGraphType) => {
  const keys = R.keys(data);

  const formattedData = keys.map((x, i) => {
    const selectedData = data[x] as TokenUnit;
    return {
      name: x,
      value: Big(selectedData.value).toNumber(),
      display: formatNumber(selectedData.value, 2),
      percentage: total.gt(0)
        ? Number(
            Big(selectedData.value).div(total.toString()).times(100).toFixed(2),
          )
        : 0,
      color: BAR_COLOR[i],
      daemon: selectedData.displayDenom,
    };
  });

  const notEmpty = formattedData.some((x) => x.value > 0);

  if (!notEmpty) {
    formattedData.push({
      name: "empty",
      value: 0,
      color: BAR_COLOR[3],
      percentage: 100,
      display: "",
      daemon: "",
    });
  }

  return formattedData;
};

export const formatNumber = (tokenUnit: string, toFixed: number): string => {
  // split whole number and decimal if any
  const split = `${tokenUnit}`.split(".");
  // whole number
  const wholeNumber = R.pathOr("", [0], split);
  // decimal
  const decimal: any = R.pathOr("", [1], split);
  // add commas for fullnumber ex: 1000 -> 1,000
  const formatWholeNumber = numeral(wholeNumber).format("0,0");

  // in the event that there is actually decimals and tofixed has not been set to 0
  // we will handle the decimal
  if (decimal && toFixed !== 0) {
    // if toFixed is null then we want to return the whole decimal
    // otherwise we respect the toFixed input
    if (toFixed == null) {
      toFixed = decimal.length;
    }
    // we remove any ending 0s ex - 100 -> 1
    const formatDecimal = removeEndingZeros(decimal.substring(0, toFixed));
    // merge the full number together and return it.
    // If for some insane reason after removing all the 0s we ended up with
    // '' in the decimal place we just return the full number
    return `${formatWholeNumber}${
      formatDecimal.length ? "." : ""
    }${formatDecimal}`;
  }

  // else we return whole number
  return formatWholeNumber;
};

export const removeEndingZeros = (value: string) => {
  let end = value.length;
  for (let i = value.length; i > 0; i -= 1) {
    const currentDigit = value[i - 1];
    if (currentDigit !== "0") {
      break;
    }
    end -= 1;
  }
  return value.substring(0, end);
};

export const shouldShowData = (status: string) =>
  [
    "PROPOSAL_STATUS_VOTING_PERIOD",
    "PROPOSAL_STATUS_PASSED",
    "PROPOSAL_STATUS_REJECTED",
    "PROPOSAL_STATUS_FAILED",
  ].includes(status);

export function indexOfMax(arr: number[]) {
  // given an array of numbers, convert them to
  // numbers and returns index of greatest value
  if (arr === undefined || arr?.length === 0) {
    return -1;
  }

  let max = arr[0];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
