import { IUser } from "../types";

export const following = ({
  user,
  session_owner_id,
}: {
  user: IUser | undefined;
  session_owner_id: string;
}): boolean => {
  return user
    ? user?.followers?.some(
        (follower) => follower.followed_id === session_owner_id,
      )
    : false;
};

export const buying = ({
  user,
  session_owner_id,
}: {
  user: IUser | undefined;
  session_owner_id: string;
}): boolean => {
  return user
    ? user?.following?.some((follower) => follower.id === session_owner_id)
    : false;
};

export const getAmount = ({ user }: { user: IUser | undefined }): number => {
  let price = 10;
  if (user) {
    const filteredTxs = user?.transactions?.filter(
      (transaction) => transaction.description === "Buying",
    );

    if (filteredTxs) {
      for (let i = 0; i < filteredTxs.length; i++) {
        price *= 2;
      }
    }
  }

  return price;
};
