import { useSession } from "next-auth/react";

import { UpArrowIcon, UpArrowIconActive } from "@/assets/up-arrow-icon";
import { DownArrowIcon, DownArrowIconActive } from "@/assets/down-arrow-icon";
import { useJoinTwitter } from "@/features/auth";

import { useDownvote } from "../../hooks/use-downvote";
import { useUpvote } from "../../hooks/use-upvote";
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
  const hasDownvoted = tweet?.downvotes?.some(
    (downvote) => downvote.user_id === session?.user?.id,
  );

  const hasUpvoted = tweet?.upvotes?.some(
    (upvote) => upvote.user_id === session?.user?.id,
  );

  const setJoinTwitterData = useJoinTwitter((state) => state.setData);

  const mutationDownvote = useDownvote();
  const mutationUpvote = useUpvote();

  return (
    <div className={styles.voteContainer}>
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
          mutationDownvote.mutate({
            tweetId: tweet?.id,
            userId: session?.user?.id,
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
          mutationUpvote.mutate({
            tweetId: tweet?.id,
            userId: session?.user?.id,
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
    </div>
  );
};
