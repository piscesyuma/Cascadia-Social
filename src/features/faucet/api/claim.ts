import axios from "axios";

import { FAUCET_URL } from "@/config";

export const claim = async ({ address }: { address: string }) => {
  try {
    const response = await axios.post(`${FAUCET_URL}/api/faucet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const responseData: any = response.data;

    return responseData;
  } catch (error: any) {
    return error.response.data;
  }
};
