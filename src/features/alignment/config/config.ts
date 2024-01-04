export const WEEK_TIMESTAMP = 604800;

export const MIN_LOCK_PERIOD_IN_DAYS = 7;

export const MAX_LOCK_PERIOD_IN_DAYS = 365; // 1y

export const GWEI_UNIT = 1e9;

export const PRETTY_DATE_FORMAT = "d MMM yyyy";

export const INPUT_DATE_FORMAT = "yyyy-MM-dd";

export enum FiatCurrency {
  usd = "usd",
}

export const WALLET_SCREEN_ENDPOINT =
  "https://farm.cascadia.foundation/check-wallet";

export enum LockType {
  CREATE_LOCK = "createLock",
  EXTEND_LOCK = "extendLock",
  INCREASE_LOCK = "increaseLock",
}

export enum UnLockType {
  START_COOLDOWN = "startCooldown",
  WITHDRAW = "withdraw",
  RELOCK = "relock",
  CLAIM = "claim",
}
