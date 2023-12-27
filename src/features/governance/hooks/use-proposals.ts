"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as R from "ramda";

import { getCurrentTallyResult } from "../api/get-current-tally";
import { getMetadata } from "../api/get-metadata";
import { getProposals } from "../api/get-proposals";
import old_proposals from "../config/proposals.json";
import { IProposal } from "../types";
import { isVotingTimeWithinRange } from "../utils";
import dayjs, { formatDayJs } from "../utils/dayjs";

interface IInfiniteTweets {
  nextId: string;
  proposals: IProposal[];
}

export const useProposals = ({
  queryKey = ["proposals"],
  version,
}: {
  queryKey?: string[];
  version: string;
}) => {
  const formatProposals = async (proposals: any) => {
    const items = await Promise.all(
      proposals.toReversed().map(async (x: any) => {
        // const summary = DOMPurify.sanitize(x.description);

        const isVotingTime = isVotingTimeWithinRange(x.voting_end_time);

        let defaultMetadata = {
          title: R.pathOr("", ["title"], x) as string,
          summary: R.pathOr("", ["summary"], x) as string,
          details: R.pathOr("", ["description"], x) as string,
          authors: R.pathOr("", ["messages", 0, "authors"], x) as string,
        };

        const messageType = R.pathOr("", ["messages", 0, "@type"], x);

        if (messageType.includes("MsgExecLegacyContent")) {
          defaultMetadata = {
            title: R.pathOr("", ["messages", 0, "content", "title"], x),
            summary: R.pathOr("", ["messages", 0, "content", "description"], x),
            details: "",
            authors: "",
          };
        } else {
          defaultMetadata = await getMetadata(
            R.pathOr("", ["metadata"], x),
            defaultMetadata,
          );
        }

        const finalTallyResult = {
          yesCount: R.pathOr("0", ["final_tally_result", "yes_count"], x),
          noCount: R.pathOr("0", ["final_tally_result", "no_count"], x),
          abstainCount: R.pathOr(
            "0",
            ["final_tally_result", "abstain_count"],
            x,
          ),
          noWithVetoCount: R.pathOr(
            "0",
            ["final_tally_result", "no_with_veto_count"],
            x,
          ),
        };

        const tallyResult = isVotingTime
          ? await getCurrentTallyResult(x.id)
          : finalTallyResult;

        return {
          id: R.pathOr("", ["id"], x),
          metadata: defaultMetadata,
          status: R.pathOr("", ["status"], x),
          finalTallyResult: tallyResult,
          votingStartTime: R.pathOr("", ["voting_start_time"], x),
          votingEndTime: R.pathOr("", ["voting_end_time"], x),
        };
      }),
    );

    const formattedItems = items
      .filter((i) => i.status !== "PROPOSAL_STATUS_REJECTED")
      .map((x) => {
        return {
          title: x.metadata.title,
          summary:
            x.metadata.summary.length > 200
              ? `${x.metadata.summary.slice(0, 200)}...`
              : x.metadata.summary,
          status: x.status,
          id: x.id,
          votingStartTime: x.votingStartTime
            ? formatDayJs(dayjs.utc(x.votingStartTime), "locale")
            : "",
          votingEndTime: x.votingEndTime
            ? formatDayJs(dayjs.utc(x.votingEndTime), "locale")
            : "",
          finalTallyResult: x.finalTallyResult,
        };
      });

    return formattedItems;
  };

  return useInfiniteQuery<IInfiniteTweets>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: async () => {
      let data;
      if (version === "active") {
        data = await getProposals();
      } else {
        data = old_proposals;
      }

      let proposals: {
        title: any;
        summary: any;
        status: any;
        id: any;
        votingStartTime: string;
        votingEndTime: string;
        finalTallyResult: any;
      }[] = [];

      if (Array.isArray(data)) {
        proposals = await formatProposals(data);
      }

      const result: any = {
        proposals,
        // nextId: R.pathOr("undefined", ["pagination", "next_key"], data), // disable temparily
      };

      return result;
    },
    initialPageParam: "",

    getNextPageParam: (lastPage) => {
      return lastPage?.nextId;
    },
    refetchOnWindowFocus: false,
  });
};
