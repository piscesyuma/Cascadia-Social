export type VeCCLockInfoResult = {
  locked: { amount: bigint; cooldown: bigint; end: bigint } | any;
  epoch: bigint | any;
  totalSupply: bigint | any;
  claimStatus: number | any;
};

export type VeCCLockInfo = {
  cooldown: number;
  lockedEndDate: number;
  lockedAmount: string;
  totalSupply: string;
  claimStatus: number;
  epoch: string;
  hasExistingLock: boolean;
  isExpired: boolean;
};

export interface AlignState {
  isLoading: boolean;
  balance: string;
  lockEndDate: string;
  lockAmount: string;
  submissionDisabled: boolean;
  veCCLockInfo: VeCCLockInfo;
}

export type ActionDetailType = {
  id: string;
  label: string;
};

export type ActionStatusType = {
  isActive: boolean;
  isLoading: boolean;
  disabled: boolean;
  onSubmit: any;
  hash: string | undefined;
} & ActionDetailType;
