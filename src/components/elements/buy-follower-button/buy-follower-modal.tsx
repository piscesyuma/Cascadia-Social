import { useBuyFollower } from "@/features/profile";

import { ConfirmationModal } from "../modal";

export const BuyfollowerModal = ({
  username = "user",
  user_id,
  session_owner_id,
  amount,
  setIsModalOpen,
}: {
  username: string | undefined;
  user_id: string;
  session_owner_id: string;
  amount: number;
  setIsModalOpen: (value: boolean) => void;
}) => {
  const mutation = useBuyFollower("buyfollower");

  return (
    <ConfirmationModal
      heading={`Buy follower @${username}?`}
      paragraph={`You can purchase this follower for ${amount} cents.`}
      confirmButtonText="Buying follower"
      confirmButtonClick={() => {
        mutation.mutate({
          user_id,
          session_owner_id,
          amount: amount,
        });
        setIsModalOpen(false);
      }}
      confirmButtonStyle="buyfollower"
      cancelButtonText="Cancel"
      cancelButtonClick={() => setIsModalOpen(false)}
    />
  );
};
