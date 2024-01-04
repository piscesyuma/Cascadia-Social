"use client";
import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";

import { Modal } from "@/components/elements/modal";

import { useFaucet } from "../hooks/use-faucet";

import { ClaimButton } from "./button";
import Input from "./input";
import { Popup } from "./popup";
import styles from "./styles/form.module.scss";

export const Form = (): JSX.Element => {
  const [address, setAddress] = useState<`0x${string}`>();
  const [showTweetPopup, setShowTweetPopup] = useState(false);

  const { mutate, isPending } = useFaucet({ setShowTweetPopup });

  const handleSubmit = useCallback(async () => {
    if (!address) {
      toast.error("Please input valid wallet address");
      return;
    }

    mutate({ address });
  }, [address, mutate]);

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Input
          className={styles.input}
          value={address?.toString() || ""}
          onKeyDown={(evt) => evt.key === "e" && evt.preventDefault()}
          onUserInput={(value) => setAddress(value as `0x${string}`)}
        />

        <ClaimButton
          isLoading={isPending}
          disabled={!address}
          onClick={handleSubmit}
        />
      </div>

      <AnimatePresence>
        {showTweetPopup && (
          <Modal
            onClose={() => setShowTweetPopup(false)}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <Popup onClose={() => setShowTweetPopup(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
