export interface IProposal {
  id: number;
  title: string;
  summary: string;
  status: string;
  finalTallyResult: CountType;
  votingStartTime: string;
  votingEndTime: string;
}

export interface CountType {
  yesCount: string;
  abstainCount: string;
  noCount: string;
  noWithVetoCount: string;
}

export interface IInfiniteProposals {
  pages: { proposals: IProposal[]; nextId?: string | undefined }[];
  pageParams: any;
}

export interface IProposalDetail {
  overview: OverviewType;
  voteGraph: VotesGraphState;
}

export interface OverviewType {
  id: number;
  proposer: string;
  metadata: MetadataType;
  status: string;
  submitTime: string;
  depositEndTime: string;
  votingStartTime: string | null;
  votingEndTime: string | null;
  contents: any;
  isVotingTime?: boolean;
}

export interface MetadataType {
  title: string;
  summary: string;
  details: string;
  authors: string;
}

export interface VotesGraphState {
  votes: VotesType;
  bonded: TokenUnit;
  currentVP: TokenUnit;
  quorum: number;
}

export interface VotesType {
  empty: string;
  yes: TokenUnit;
  no: TokenUnit;
  abstain: TokenUnit;
}

export interface TokenUnit {
  displayDenom: string;
  baseDenom: string;
  exponent: number;
  value: string;
}

export interface ComponentDefault {
  className?: string;
}

export type FormatGraphType = {
  data: VotesType;
  total: Big;
};
