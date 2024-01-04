import { FAUCET_URL } from "@/config";

export const claim = async ({ address }: { address: string }) => {
  try {
    const response = await fetch(`${FAUCET_URL}/api/faucet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address }),
    });

    const responseData: any = await response.json();

    return responseData;
  } catch (error: any) {
    return error.response.data;
  }
};
