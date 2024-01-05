import { useSession } from "next-auth/react";

import { CommentIcon } from "@/assets/comment-icon";
import { PinIcon } from "@/assets/pin-icon";
import { SortIcon } from "@/assets/sort-icon";
import { TrashIcon } from "@/assets/trash-icon";
import { MenuItem } from "@/components/elements/menu";
import { useUser } from "@/features/profile";

import { EditIcon } from "../../assets/edit-icon";
import { EmbedIcon } from "../../assets/embed-icon";
import { usePinTweet } from "../../hooks/use-pin-tweet";
import { useSortByVote } from "../../hooks/use-sort-by-vote";
import { ITweet } from "../../types";

import styles from "./styles/tweet-options.module.scss";

export const TweetOwnerMenu = ({
  tweet,
  setIsMenuOpen,
  setIsDeleteModalOpen,
}: {
  tweet: ITweet;
  setIsMenuOpen: (value: boolean) => void;
  setIsDeleteModalOpen: (value: boolean) => void;
}) => {
  const { data: session } = useSession();
  const { data: user } = useUser({ id: session?.user?.id });
  const pinMutation = usePinTweet();
  const mutationSortByVote = useSortByVote();

  return (
    <>
      <MenuItem
        onClick={() => {
          setIsMenuOpen(false);
          setIsDeleteModalOpen(true);
        }}
      >
        <div className={styles.delete}>
          <TrashIcon /> Delete
        </div>
      </MenuItem>

      {tweet?.id === user?.pinned_tweet?.id ? (
        <MenuItem
          onClick={() => {
            pinMutation.mutate({
              tweetId: tweet.id,
              userId: session?.user?.id,
              action: "unpin",
            });
            setIsMenuOpen(false);
          }}
        >
          <PinIcon /> Unpin
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            pinMutation.mutate({
              tweetId: tweet.id,
              userId: session?.user?.id,
              action: "pin",
            });
            setIsMenuOpen(false);
          }}
        >
          <PinIcon /> Pin to your profile
        </MenuItem>
      )}

      <MenuItem
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <CommentIcon /> Change who can reply
      </MenuItem>

      <MenuItem
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <EmbedIcon /> Embed Tweet
      </MenuItem>

      <MenuItem
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <CommentIcon /> Change who can reply
      </MenuItem>

      <MenuItem
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <EditIcon /> Edit with Premium
      </MenuItem>

      {session?.user?.sort_by_vote ? (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
            mutationSortByVote.mutate({
              userId: session?.user?.id,
              sort_by_vote: !session?.user?.sort_by_vote,
            });
          }}
        >
          <SortIcon /> Sort by date
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
            mutationSortByVote.mutate({
              userId: session?.user?.id,
              sort_by_vote: !session?.user?.sort_by_vote,
            });
          }}
        >
          <SortIcon /> Sort by vote
        </MenuItem>
      )}
    </>
  );
};
