import { VeCCLockInfo } from "../types";
import { bnum } from "../utils";

export default function useLockAmount(veCCLockInfo?: VeCCLockInfo) {
  const isValidLockAmount = (lockAmount: string) =>
    bnum(lockAmount || "0").gt(0);

  const isIncreasedLockAmount = (lockAmount: string) =>
    veCCLockInfo?.hasExistingLock && isValidLockAmount(lockAmount);

  const totalLpTokens = (lockAmount: string) => {
    return veCCLockInfo?.hasExistingLock
      ? bnum(veCCLockInfo.lockedAmount)
          .plus(lockAmount || "0")
          .toString()
      : lockAmount || "0";
  };

  const expectedVeCC = (bpt: string, lockDateStr: string): string => {
    return bnum(bpt).toString();
  };

  return {
    isValidLockAmount,
    isIncreasedLockAmount,
    totalLpTokens,
    expectedVeCC,
  };
}
