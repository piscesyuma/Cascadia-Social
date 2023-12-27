import { signatureToPubkey } from "@hanchon/signature-to-pubkey";
import {
  generateEndpointAccount,
  generateEndpointGetDelegations,
  generateEndpointBroadcast,
  generatePostBodyBroadcast,
  generateEndpointDistributionRewardsByAddress,
} from "@tharsis/provider";
import {
  createTxRawEIP712,
  signatureToWeb3Extension,
  Chain,
  Sender,
  TxGenerated,
} from "@tharsis/transactions";
import axios from "axios";
import { ethers } from "ethers";

import { generalConfig } from "../config";
/**
 * Convert an eth address to cascadia address
 * @param {string} addr eth address to be converted
 * @param {string} nodeAddr rest_rpc url of cascadia chain
 * @return {string} converted cascadia address
 */
export async function ethToCascadia(
  addr: string,
  nodeAddr: string,
): Promise<string> {
  if (addr && addr.includes("cascadia")) {
    return addr;
  }

  try {
    const { data } = await axios.get(
      `${nodeAddr}/cascadia/evm/v1/cosmos_account/${addr}`,
    );
    return data.cosmos_address;
  } catch (err) {
    return "";
  }
}

/**
 * get delegations with cascadia address
 * @param {string} addr cascadia address
 * @param {string} nodeAddr rest_rpc url of cascadia chain
 * @return {object} sender object
 */
export async function getDelegations(
  addr: string,
  nodeAddr: string,
): Promise<any> {
  try {
    const { data } = await axios.get(
      `${nodeAddr}/cosmos/staking/v1beta1/delegations/${addr}`,
    );
    return data.delegation_responses;
  } catch (err) {
    // console.log(err);
    return null;
  }
}

/**
 * Uses the eth hex address, converts it to a canto address,
 * then gets the sender object.
 * @param {string} addr eth address
 * @param {string} nodeAddr rest_rpc url of cascadia chain
 * @return {object} sender object
 */
export async function getSenderObj(
  addr: string,
  nodeAddr: string,
): Promise<any> {
  try {
    const accountCanto = await ethToCascadia(addr, nodeAddr);
    const endPointAccount = generateEndpointAccount(accountCanto ?? "");
    const { data } = await axios.get(nodeAddr + endPointAccount);
    const res = await reformatSender(data.account.base_account);
    return res;
  } catch (error) {
    return error;
  }
}

/**
 * Uses the eth hex address, converts it to a canto address,
 * then gets the delegation response object.
 * @param {string} addr eth address
 * @param {string} nodeAddr rest_rpc url of cascadia chain
 * @param {string} validatorAddr validator address of cascadia chain
 * @return {object} delegation amount in delegation_responses except for pagination
 */
export async function getDelegationObject(
  addr: string,
  nodeAddr: string,
  validatorAddr: string,
) {
  const accountCascadia = await ethToCascadia(addr, nodeAddr);
  const endPointAccount = generateEndpointGetDelegations(accountCascadia ?? "");
  const { data } = await axios.get(nodeAddr + endPointAccount);
  for (let i = 0; i < data.delegation_responses.length; i += 1) {
    if (
      data.delegation_responses[i].delegation.validator_address ===
      validatorAddr
    ) {
      return data.delegation_responses[i];
    }
  }
  return 0;
}

export async function getRewardObject(
  addr: string,
  nodeAddr: string,
  validatorAddr: string,
) {
  const accountCascadia = await ethToCascadia(addr, nodeAddr);
  const endPointAccount = generateEndpointDistributionRewardsByAddress(
    accountCascadia ?? "",
  );
  const { data } = await axios.get(
    `${nodeAddr}${endPointAccount}/${validatorAddr}`,
  );
  return data.rewards.length === 0 ? "0" : data.rewards[0].amount;
}

export async function signAndBroadcastTxMsg(
  msg: TxGenerated,
  senderObj: Sender,
  chain: Chain,
  nodeAddress: string,
  address: string,
) {
  return signAndBroadcastTxMsgWithMetamask(
    msg,
    senderObj,
    chain,
    nodeAddress,
    address,
  );
}

export async function signAndBroadcastTxMsgWithMetamask(
  msg: TxGenerated,
  senderObj: Sender,
  chain: Chain,
  nodeAddress: string,
  address: string,
) {
  const provider = new ethers.JsonRpcProvider(generalConfig.chain.RPC);
  const signature = await provider.send("eth_signTypedData_v4", [
    address,
    JSON.stringify(msg.eipToSign),
  ]);

  const raw = generateRawTx(chain, senderObj, signature, msg);

  const res = await axios.post(
    `${nodeAddress + generateEndpointBroadcast()}`,
    generatePostBodyBroadcast(raw),
  );

  return res;
}

async function reformatSender(addressData: any) {
  let pubkey: string;
  if (addressData.pub_key === null) {
    const provider = new ethers.JsonRpcProvider(generalConfig.chain.RPC);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage("generate_pubkey");

    pubkey = signatureToPubkey(
      signature,
      Buffer.from([
        50, 215, 18, 245, 169, 63, 252, 16, 225, 169, 71, 95, 254, 165, 146,
        216, 40, 162, 115, 78, 147, 125, 80, 182, 25, 69, 136, 250, 65, 200, 94,
        178,
      ]),
    );
  } else {
    pubkey = addressData.pub_key.key;
  }

  return {
    accountNumber: addressData.account_number,
    pubkey,
    sequence: addressData.sequence,
    accountAddress: addressData.address,
  };
}

function generateRawTx(chain: any, senderObj: any, signature: any, msg: any) {
  const extension = signatureToWeb3Extension(chain, senderObj, signature);

  return createTxRawEIP712(
    msg.legacyAmino.body,
    msg.legacyAmino.authInfo,
    extension,
  );
}
