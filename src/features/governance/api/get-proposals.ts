import axios from "axios";

import { REST_RPC } from "@/config";

export const getProposals = async () => {
  try {
    const { data } = await axios.get(`${REST_RPC}/cosmos/gov/v1/proposals`);
    return data.proposals;
  } catch (error: any) {
    return error.response.data;
  }
};
