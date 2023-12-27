import Big from "big.js";
import { Contract, ethers } from "ethers";
import numeral from "numeral";

import { RPC } from "@/config";

import { VE_ABI, VE_ADDRESS } from "../config/contract";
import { formatToken } from "../utils";

export const getStakedTotalSupply = async (timestamp: number) => {
  const veContract = new Contract(VE_ADDRESS, VE_ABI, getProvider() as any);

  const t = Big(timestamp).div(1000).toFixed(0);

  try {
    const total = await veContract.totalSupply(t, {
      gasLimit: 350000,
    });

    return total;
  } catch (error) {
    return 1;
  }
};

export const getProvider = () => {
  return new ethers.JsonRpcProvider(RPC);
};

export const getCurrentVP = async (address: string, timestamp: number) => {
  if (!address) return 0;

  const veContract = new Contract(VE_ADDRESS, VE_ABI, getProvider() as any);

  const t = Big(timestamp).div(1000).toFixed(0);

  const balanceOf = await veContract["balanceOf(address,uint256)"](address, t, {
    gasLimit: 350000,
  });

  const balance = numeral(
    formatToken(balanceOf.toString(), "bCC").value,
  ).value();

  return balance || 0;
};
