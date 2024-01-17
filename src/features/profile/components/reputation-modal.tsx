import { ConfirmationModal } from "@/components/elements/modal";

export const ReputationModal = ({
  setIsReputationModalOpen,
}: {
  setIsReputationModalOpen: (value: boolean) => void;
}) => {
  return (
    <ConfirmationModal
      heading="Reputation"
      paragraph="Cascadia is a decentralized protocol--your vote carries weight!"
      confirmButtonText="OK"
      confirmButtonClick={() => {
        setIsReputationModalOpen(false);
      }}
      confirmButtonStyle="reputation"
      cancelButtonText="Cancel"
      cancelButtonClick={() => {
        setIsReputationModalOpen(false);
      }}
    />
  );
};
