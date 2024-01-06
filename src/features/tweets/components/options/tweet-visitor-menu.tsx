import { useSession } from "next-auth/react";

import { ReportIcon } from "@/assets/report-icon";
import { SadFaceIcon } from "@/assets/sad-face-icon";
import { SortIcon } from "@/assets/sort-icon";
import { MenuItem } from "@/components/elements/menu";

import { BlockIcon } from "../../assets/block-icon";
import { EmbedIcon } from "../../assets/embed-icon";
import { UnfollowIcon } from "../../assets/follow-icon";
import { MuteIcon } from "../../assets/mute-icon";
import { ITweet } from "../../types";

export const TweetVisitorMenu = ({
  tweet,
  setIsMenuOpen,
}: {
  tweet: ITweet;
  setIsMenuOpen: (value: boolean) => void;
}) => {
  const { data: session } = useSession();

  const sortByVote = localStorage.getItem("sortByVote") || "";

  const saveToLocalStorage = (sortByVote: string) => {
    localStorage.setItem("sortByVote", sortByVote);
  };

  return (
    <>
      <MenuItem
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <SadFaceIcon /> Not interested in this Tweet
      </MenuItem>

      {session && (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <UnfollowIcon /> Unfollow @{tweet?.author?.email?.split("@")[0]}
        </MenuItem>
      )}

      {session && (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <MuteIcon /> Mute @{tweet?.author?.email?.split("@")[0]}
        </MenuItem>
      )}

      {session && (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
          }}
        >
          <BlockIcon /> Block @{tweet?.author?.email?.split("@")[0]}
        </MenuItem>
      )}

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
        <ReportIcon /> Report Tweet
      </MenuItem>

      {sortByVote === "sort_by_vote" ? (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
            saveToLocalStorage("sort_by_date");
          }}
        >
          <SortIcon /> Sort by date
        </MenuItem>
      ) : (
        <MenuItem
          onClick={() => {
            setIsMenuOpen(false);
            saveToLocalStorage("sort_by_vote");
          }}
        >
          <SortIcon /> Sort by vote
        </MenuItem>
      )}
    </>
  );
};
