import { useSession } from "next-auth/react";

import { DownArrowIcon, DownArrowIconActive } from "@/assets/down-arrow-icon";
import { UpArrowIcon, UpArrowIconActive } from "@/assets/up-arrow-icon";
import { useJoinTwitter } from "@/features/auth";

import { useVote } from "../../hooks/use-vote";
import { ITweet } from "../../types";

import styles from "./styles/actions.module.scss";

export const UpvoteAndDownVoteButtons = ({
  tweet,
  smallIcons = true,
  showStats = false,
}: {
  tweet?: ITweet;
  smallIcons?: boolean;
  showStats?: boolean;
}) => {
  const { data: session } = useSession();
  const hasDownvoted = tweet?.votes?.some(
    (votes) =>
      votes.user_id === session?.user?.id && votes.vote_status === "down",
  );

  const hasUpvoted = tweet?.votes?.some(
    (votes) =>
      votes.user_id === session?.user?.id && votes.vote_status === "up",
  );

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const mutation = useVote();

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
              user: tweet?.author?.name || "user",
            });
          }
          mutation.mutate({
            tweetId: tweet?.id,
            userId: session?.user?.id,
            vote_status: "up",
          });
        }}
        className={`${styles.container} ${styles.upvote} ${
          hasUpvoted ? styles.upvoted : ""
        } `}
      >
        <span
          className={`${styles.icon} ${
            smallIcons ? styles.smallIcon : styles.bigIcons
          }`}
        >
          {hasUpvoted ? <UpArrowIconActive /> : <UpArrowIcon />}
        </span>
      </button>
      {showStats && tweet?.vote_count !== undefined && (
        <span
          className={
            hasDownvoted
              ? styles.statsDownvoted
              : hasUpvoted
                ? styles.statsUpvoted
                : styles.stats
          }
        >
          {tweet?.vote_count}
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
              user: tweet?.author?.name || "user",
            });
          }
          mutation.mutate({
            tweetId: tweet?.id,
            userId: session?.user?.id,
            vote_status: "down",
          });
        }}
        className={`${styles.container} ${styles.downvote} ${
          hasDownvoted ? styles.downvoted : ""
        } `}
      >
        <span
          className={`${styles.icon} ${
            smallIcons ? styles.smallIcon : styles.bigIcons
          }`}
        >
          {hasDownvoted ? <DownArrowIconActive /> : <DownArrowIcon />}
        </span>
      </button>
    </div>
  );
};
