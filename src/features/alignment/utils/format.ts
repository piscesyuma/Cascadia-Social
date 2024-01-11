import BigNumber from "bignumber.js";
import { format } from "date-fns";
import { formatUnits } from "viem";

import { INPUT_DATE_FORMAT } from "../config";
import { VeCCLockInfoResult } from "../types";

import { toJsTimestamp } from "./time";

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export function bnum(val: string | number | BigNumber): BigNumber {
  const number = typeof val === "string" ? val : val ? val.toString() : "0";
  return new BigNumber(number);
}

export function formatLockInfo(lockInfo: VeCCLockInfoResult) {
  const lockedAmount = lockInfo.locked.amount;
  const cooldown = lockInfo.locked.cooldown;
  const lockedEndDate = lockInfo.locked.end;
  const hasExistingLock = Number(lockedAmount) > 0;
  const cooldownNormalised = toJsTimestamp(Number(cooldown));
  const lockedEndDateNormalised = toJsTimestamp(Number(lockedEndDate));
  const isExpired = hasExistingLock && Date.now() > lockedEndDateNormalised;

  return {
    cooldown: cooldownNormalised,
    lockedEndDate: lockedEndDateNormalised,
    lockedAmount: formatUnits(lockedAmount, 18),
    totalSupply: formatUnits(lockInfo.totalSupply || 0, 18),
    claimStatus: lockInfo.claimStatus,
    epoch: lockInfo.epoch.toString(),
    hasExistingLock,
    isExpired,
  };
}

export function formatDateInput(date: Date | number) {
  return format(date || new Date(), INPUT_DATE_FORMAT);
}
