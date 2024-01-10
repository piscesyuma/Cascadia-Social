export type RedeemInfo = {
  claimStatus: number;
  cCCBalance: string;
  wETHBalance: string;
  ccPrice: string;
  wETHPrice: string;
  discount: string;
};

export interface RedeemState {
  isLoading: boolean;
  amount: string;
  wETHAmount: string;
  redeemInfo: RedeemInfo;
}

export type IData =
  | {
      result: any;
      status: string;
    }
  | any;

export type RedeemData = {
  data: IData[];
};

export type ActionDetailType = {
  id: string;
  label: string;
  tooltip: string;
};

export type ActionStatusType = {
  isActive: boolean;
  isLoading: boolean;
  disabled: boolean;
  onSubmit: any;
  hash: string | undefined;
} & ActionDetailType;
