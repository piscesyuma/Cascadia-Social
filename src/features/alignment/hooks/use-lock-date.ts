import { addDays, addYears, startOfDay } from "date-fns";

import {
  MAX_LOCK_PERIOD_IN_DAYS,
  MIN_LOCK_PERIOD_IN_DAYS,
  WEEK_TIMESTAMP,
} from "../config";
import { VeCCLockInfo } from "../types";
import { toUtcTime } from "../utils";

function getMaxLockEndDateTimestamp(date: number) {
  const maxLockTimestamp = addDays(date, MAX_LOCK_PERIOD_IN_DAYS);

  const timestamp =
    Math.floor(maxLockTimestamp.getTime() / 1000 / WEEK_TIMESTAMP) *
    WEEK_TIMESTAMP *
    1000;

  return timestamp;
}

export default function useLockEndDate(veCCLockInfo?: VeCCLockInfo | null) {
  const todaysDate = toUtcTime(addYears(new Date(), 0));

  const minLockEndDateTimestamp = startOfDay(
    addDays(
      veCCLockInfo?.hasExistingLock ? veCCLockInfo.lockedEndDate : todaysDate,
      MIN_LOCK_PERIOD_IN_DAYS,
    ),
  ).getTime();

  const maxLockEndDateTimestamp = getMaxLockEndDateTimestamp(todaysDate);

  const isValidLockEndDate = (lockEndDate: string) => {
    const lockEndDateTimestamp =
      lockEndDate === "" ? 0 : startOfDay(new Date(lockEndDate)).getTime();
    return (
      lockEndDateTimestamp >= minLockEndDateTimestamp &&
      lockEndDateTimestamp <= maxLockEndDateTimestamp
    );
  };

  const isExtendedLockEndDate = (lockEndDate: string) => {
    const lockEndDateTimestamp =
      lockEndDate === "" ? 0 : startOfDay(new Date(lockEndDate)).getTime();
    const isValidLockEndDate =
      lockEndDateTimestamp >= minLockEndDateTimestamp &&
      lockEndDateTimestamp <= maxLockEndDateTimestamp;
    return veCCLockInfo?.hasExistingLock && isValidLockEndDate;
  };

  return {
    todaysDate,
    minLockEndDateTimestamp,
    maxLockEndDateTimestamp,
    isValidLockEndDate,
    isExtendedLockEndDate,
  };
}
