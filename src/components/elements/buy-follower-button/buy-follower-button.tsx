"use client";
import { AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Modal } from "@/components/elements/modal";
import { useJoinTwitter } from "@/features/auth";

import { BuyfollowerModal } from "./buy-follower-modal";
import styles from "./styles/buy-follower-button.module.scss";

export const BuyFollowerButton = ({
  user_id,
  username,
  session_owner_id,
  isBuying = false,
  amount = 10,
}: {
  username: string | undefined;
  user_id: string;
  session_owner_id: string;
  isBuying?: boolean;
  amount?: number;
}) => {
  const { data: session } = useSession();

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonText = isBuying ? "Buying" : "Buy";

  const handleBuyFollower = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!session) {
      setJoinTwitterData({
        isModalOpen: true,
        action: "buy",
        user: username,
      });
    } else {
      if (!isBuying) {
        setIsModalOpen(true);
      }
    }
  };

  return (
    <div className={styles.container}>
      <button
        aria-label={`${buttonText} @${username}`}
        aria-describedby="follow-button-description"
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          handleBuyFollower(e);
        }}
        onMouseEnter={(e) => {
          e.currentTarget.textContent = isBuying ? "Unfollow" : "Buy";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.textContent = isBuying ? "Buying" : "Buy";
        }}
        className={isBuying ? styles.following : styles.buy}
      >
        {isBuying ? "Buying" : "Buy"}
      </button>

      <div
        id="follow-button-description"
        className="visually-hidden"
      >{`Click to ${isBuying ? "unfollow" : "buy"} ${username}`}</div>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            disableScroll={true}
            background="var(--clr-modal-background)"
            closeOnBackdropClick={true}
          >
            <BuyfollowerModal
              username={username}
              user_id={user_id}
              session_owner_id={session_owner_id}
              amount={amount}
              setIsModalOpen={setIsModalOpen}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
