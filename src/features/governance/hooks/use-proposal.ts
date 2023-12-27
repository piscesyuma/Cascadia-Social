import { useQuery } from "@tanstack/react-query";
import Big from "big.js";
import * as R from "ramda";
import { useAccount } from "wagmi";

import { getCurrentTallyResult } from "../api/get-current-tally";
import { getMetadata } from "../api/get-metadata";
import getProposal from "../api/get-proposal";
import old_proposals from "../config/proposals.json";
import { getCurrentVP, getStakedTotalSupply } from "../functions";
import { IProposalDetail } from "../types";
import { formatToken, isVotingTimeWithinRange } from "../utils";

export const useProposal = ({
  id,
  version,
  initialData,
}: {
  id: number;
  version: string;
  initialData?: IProposalDetail;
}) => {
  const { address } = useAccount();

  const formatProposal = async (data: any) => {
    const stateChange: any = {};

    if (!data.proposal) {
      stateChange.exists = false;
      return stateChange;
    }

    // =========================
    // overview
    // =========================
    let defaultMetadata = {
      title: R.pathOr("", ["proposal", "title"], data) as string,
      summary: R.pathOr("", ["proposal", "summary"], data) as string,
      details: R.pathOr("", ["proposal", "description"], data) as string,
      authors: R.pathOr(
        "",
        ["proposal", "messages", 0, "author"],
        data,
      ) as string,
    };

    defaultMetadata = await getMetadata(
      R.pathOr("", ["proposal", "metadata"], data),
      defaultMetadata,
    );

    const contents: any = [];

    const messages = R.pathOr([], ["proposal", "messages"], data);

    for (let i = 0; i < messages.length; i++) {
      const messageType = R.pathOr("", ["@type"], messages[i]);

      if (messageType.includes("MsgExecLegacyContent")) {
        defaultMetadata = {
          title: R.pathOr("", ["content", "title"], messages[i]),
          summary: R.pathOr("", ["content", "description"], messages[i]),
          details: "",
          authors: "",
        };
      }

      contents.push(R.pathOr(messages[i], ["content"], messages[i]));
    }

    const isVotingTime = isVotingTimeWithinRange(data.voting_end_time);

    const overview = {
      proposer: R.pathOr("", ["proposal", "proposer"], data),
      contents,
      id: R.pathOr("", ["proposal", "id"], data),
      metadata: defaultMetadata,
      status: R.pathOr("", ["proposal", "status"], data),
      submitTime: R.pathOr("", ["proposal", "submit_time"], data),
      depositEndTime: R.pathOr("", ["proposal", "deposit_end_time"], data),
      votingStartTime: R.pathOr("", ["proposal", "voting_start_time"], data),
      votingEndTime: R.pathOr("", ["proposal", "voting_end_time"], data),
      isVotingTime,
    };

    // =========================
    // voteGraph
    // =========================

    const totalSupply = await getStakedTotalSupply(
      new Date(R.pathOr("", ["proposal", "submit_time"], data)).getTime(),
    );

    const currentVP = await getCurrentVP(address || "", new Date().getTime());

    const quorumRaw = R.pathOr(
      "0.333",
      [0, "tallyParams", "quorum"],
      data.quorum,
    );

    const tallyResult = isVotingTime
      ? await getCurrentTallyResult(R.pathOr("", ["proposal", "id"], data))
      : R.pathOr("", ["proposal", "final_tally_result"], data);

    const voteGraph = {
      votes: {
        yes: formatToken(R.pathOr("0", ["yes_count"], tallyResult), "bCC"),
        no: formatToken(R.pathOr("0", ["no_count"], tallyResult), "bCC"),
        abstain: formatToken(
          R.pathOr("0", ["abstain_count"], tallyResult),
          "bCC",
        ),
      },
      bonded: formatToken(totalSupply.toString(), "bCC"),
      currentVP: formatToken(currentVP.toString(), "bCC"),
      quorum: Big(quorumRaw).times(100).toFixed(2),
    };

    stateChange.overview = overview;
    stateChange.voteGraph = voteGraph;

    return stateChange;
  };

  return useQuery<IProposalDetail>({
    queryKey: ["proposal", id, version],
    queryFn: async () => {
      let data = null;

      if (version === "active") {
        data = await getProposal(id);
      } else {
        const proposal = old_proposals.find((_item) => _item.id === Number(id));
        data = { proposal };
      }

      const formattedProposal = await formatProposal(data);
      return formattedProposal;
    },
    refetchOnWindowFocus: false,
    initialData: initialData ?? undefined,
  });
};
