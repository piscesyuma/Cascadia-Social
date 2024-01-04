import { useMutation } from "@tanstack/react-query";
import { Dispatch } from "react";
import { toast } from "react-toastify";

import { claim } from "../api/claim";

export const useFaucet = ({
  setShowTweetPopup,
}: {
  setShowTweetPopup: Dispatch<boolean>;
}) => {
  return useMutation({
    mutationFn: ({ address }: { address: string }) => {
      return claim({ address });
    },
    onSuccess: ({ transactionHash, error }) => {
      if (transactionHash) {
        toast.success(
          `Transaction sent with hash: ${transactionHash.slice(0, 20)}...`,
        );
        setShowTweetPopup(true);
      } else {
        if (error.includes("invalid address")) {
          toast.error("Invalid address");
        } else if (error.includes("many requests")) {
          toast.error("Too many requests from this IP address");
        } else {
          toast.error("Transaction error!");
        }
      }
    },
    onError: (error: any) => {
      console.log("error", error);
      toast.error("Transaction error!");
    },
    onSettled: () => {},
  });
};
