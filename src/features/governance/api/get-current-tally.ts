import axios from "axios";

import { REST_RPC } from "@/config";

export const getCurrentTallyResult = async (proposalId: string) => {
  try {
    const result = await axios.get(
      `${REST_RPC}/cosmos/gov/v1beta1/proposals/${proposalId}/tally`,
    );
    if (result.status === 200 && result.data.tally) {
      return {
        yesCount: result.data.tally.yes,
        noCount: result.data.tally.no,
        abstainCount: result.data.tally.abstain,
        noWithVetoCount: result.data.tally.no_with_veto,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};
