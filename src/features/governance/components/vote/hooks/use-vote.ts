import { createTxMsgVote } from "@tharsis/transactions";
import { Contract, ethers } from "ethers";
import numeral from "numeral";
import { toast } from "react-toastify";

import { VE_ABI, VE_ADDRESS, formatToken } from "@/features/governance";

import {
  getSenderObj,
  signAndBroadcastTxMsg,
} from "../functions/sign-broadcast";

export type VoteProps = {
  proposalId: string;
  option: string;
  memo?: string;
};

export const optionVoteSelected: { [key: string]: number } = {
  Yes: 1,
  Abstain: 2,
  No: 3,
  "No with Veto": 4,
};

export const useVote = (configChain: any, address: string) => {
  const requestVote = async ({ proposalId, option, memo = "" }: VoteProps) => {
    if (proposalId === "") {
      toast.dark("Invalid proposalId!");
      return false;
    }

    if (Number.isNaN(proposalId)) {
      toast.dark("Invalid proposalId!");
      return false;
    }

    if (option === "") {
      toast.dark("Invalid option!");
      return false;
    }

    if (Number.isNaN(option)) {
      toast.dark("Invalid option!");
      return false;
    }

    let voteOption = 0;
    if (option in optionVoteSelected) {
      voteOption = optionVoteSelected[option];
    }

    const chain = {
      chainId: configChain.CHAINID,
      cosmosChainId: configChain.NAME,
    };

    const fee = {
      amount: "80000000000000000",
      denom: configChain.DENOM,
      gas: "3000000",
    };

    try {
      const senderObj: any = await getSenderObj(address, configChain.REST_RPC);
      if (senderObj == null) {
        return;
      }

      const msg = await createTxMsgVote(chain, senderObj, fee, memo, {
        proposalId: Number(proposalId),
        option: voteOption,
      });

      const result = await signAndBroadcastTxMsg(
        msg,
        senderObj,
        chain,
        configChain.REST_RPC,
        address,
      );
      return result.data;
    } catch (error) {
      return null;
    }
  };

  const getStakedBalance = async () => {
    if (!address) return 0;

    const veContract = new Contract(VE_ADDRESS, VE_ABI, getProvider() as any);

    const locked = await veContract.locked(address, { gasLimit: 350000 });

    const lockedAmount = numeral(
      formatToken(locked[0].toString(), "bCC").value,
    ).value();

    return lockedAmount;
  };

  const getProvider = () => {
    return new ethers.JsonRpcProvider(configChain.RPC);
  };

  return { requestVote, getStakedBalance };
};
