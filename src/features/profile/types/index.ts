import { User, Like, Reputation, Transaction, Follower } from "@prisma/client";

import { ITweet } from "@/features/tweets";
import { IBookmark } from "@/features/tweets";

export interface IUser extends User {
  tweets: ITweet[];
  followers: Follower[];
  following: Follower[];
  transactions: ITransaction[];
  likes: ILike[];
  bookmarks: IBookmark[];
  reputations: IReputation[];
  pinned_tweet: ITweet;
  _count?: {
    followers?: number;
    following?: number;
    transactions?: number;
    tweets?: number;
    likes?: number;
  };
}

export interface IProfile {
  name: string;
  bio: string | undefined;
  location: string | undefined;
  website: string | undefined;
  banner: {
    url: string | undefined;
    file: File | undefined;
  };
  avatar: {
    url: string | undefined;
    file: File | undefined;
  };
}

export interface IBio {
  detail: string | undefined;
}

export interface ILike extends Like {
  user: IUser;
  tweet: ITweet;
}

export interface IReputation extends Reputation {
  user: IUser;
}

export interface ITransaction extends Transaction {
  user: IUser;
}
