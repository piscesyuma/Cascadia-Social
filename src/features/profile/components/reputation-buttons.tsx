import { useSession } from "next-auth/react";

import { DownArrowIcon, DownArrowIconActive } from "@/assets/down-arrow-icon";
import { UpArrowIcon, UpArrowIconActive } from "@/assets/up-arrow-icon";
import { useJoinTwitter } from "@/features/auth";

import { useReputation } from "../hooks/use-reputation";
import { IUser } from "../types";

import styles from "./styles/reputation-buttons.module.scss";

export const ReputationButtons = ({ user }: { user?: IUser }) => {
  const { data: session } = useSession();

  const hasDownvoted = user?.reputations?.some(
    (reputation) =>
      reputation.session_owner_id === session?.user?.id &&
      reputation.reputation_status === "down",
  );

  const hasUpvoted = user?.reputations?.some(
    (reputation) =>
      reputation.session_owner_id === session?.user?.id &&
      reputation.reputation_status === "up",
  );

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const mutation = useReputation();

  return (
    <div className={styles.voteContainer}>
      <button
        aria-label={hasUpvoted ? "Unupvote" : "Upvote"}
        data-title={hasUpvoted ? "Unupvote" : "Upvote"}
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!session) {
            setJoinTwitterData({
              isModalOpen: true,
              action: "upvote",
              user: user?.name || "user",
            });
          }
          mutation.mutate({
            user_id: user?.id,
            session_owner_id: session?.user?.id,
            reputation_status: "up",
          });
        }}
        className={`${styles.container} ${styles.upvote} ${
          hasUpvoted ? styles.upvoted : ""
        } `}
      >
        <span className={styles.icon}>
          {hasUpvoted ? <UpArrowIconActive /> : <UpArrowIcon />}
        </span>
      </button>
      {user?.reputation_count !== undefined && (
        <span
          className={
            hasDownvoted
              ? styles.statsDownvoted
              : hasUpvoted
                ? styles.statsUpvoted
                : styles.stats
          }
        >
          {user?.reputation_count}
        </span>
      )}
      <button
        aria-label={hasDownvoted ? "Undownvote" : "Downvote"}
        data-title={hasDownvoted ? "Undownvote" : "Downvote"}
        tabIndex={0}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!session) {
            setJoinTwitterData({
              isModalOpen: true,
              action: "downvote",
              user: user?.name || "user",
            });
          }
          mutation.mutate({
            user_id: user?.id,
            session_owner_id: session?.user?.id,
            reputation_status: "down",
          });
        }}
        className={`${styles.container} ${styles.downvote} ${
          hasDownvoted ? styles.downvoted : ""
        } `}
      >
        <span className={styles.icon}>
          {hasDownvoted ? <DownArrowIconActive /> : <DownArrowIcon />}
        </span>
      </button>
    </div>
  );
};
