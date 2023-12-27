import axios from "axios";

import { REST_RPC } from "@/config";

export default async function getProposal(id: number) {
  try {
    const { data } = await axios.get(
      `${REST_RPC}/cosmos/gov/v1/proposals/${id}`,
    );
    return data;
  } catch (error: any) {
    console.error(error);
  }
}
