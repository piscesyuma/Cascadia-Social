import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { CoinIcon } from "@/assets/coin-icon";
import { Modal } from "@/components/elements/modal";
import useHasMounted from "@/hooks/use-mounted";
import { useUnLockModal } from "@/stores/use-unlock-modal";

import { ClockIcon } from "../assets/clock-icon";
import { DownIcon } from "../assets/down-icon";
import { UnLockType } from "../config";
import { useAlign } from "../hooks/use-align";
import { bnum } from "../utils";

import { AlignButton } from "./align-button";
import styles from "./styles/unlock-form.module.scss";
import { UnLockModal } from "./unlock-modal";

export const UnLockAlignment = (): JSX.Element => {
  const hasMounted = useHasMounted();
  const [unlockType, setUnLockType] = useState<UnLockType[]>();
  const [showCooldown, setShowCooldown] = useState<boolean>(false);
  const [canStartCooldown, setCanStartCooldown] = useState<boolean>(false);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [canWithdraw, setCanWithdraw] = useState<boolean>(false);

  const isUnLockModalOpen = useUnLockModal((state) => state.isUnLockModalOpen);
  const openUnLockModal = useUnLockModal((state) => state.openUnLockModal);
  const closeUnLockModal = useUnLockModal((state) => state.closeUnLockModal);

  const { address } = useAccount();
  const { state, handleGetVeCC, handleRefetch } = useAlign();
  const { veCCLockInfo } = state;

  const handleShowPreviewModal = (unlockType: UnLockType) => {
    setUnLockType([unlockType]);
    openUnLockModal();
  };

  useEffect(() => {
    if (veCCLockInfo.cooldown === 0 && veCCLockInfo.lockedEndDate > 0)
      setShowCooldown(true);
    else setShowCooldown(false);

    if (
      veCCLockInfo.hasExistingLock &&
      veCCLockInfo.cooldown > 0 &&
      veCCLockInfo.lockedEndDate > 0 &&
      bnum(veCCLockInfo.lockedAmount).gt(0.0001)
    )
      setCanStartCooldown(true);
    else setCanStartCooldown(false);

    if (
      bnum(veCCLockInfo.lockedAmount).gt(0.0001) &&
      veCCLockInfo.claimStatus === 0
    )
      setCanClaim(true);
    else setCanClaim(false);

    if (
      veCCLockInfo.hasExistingLock &&
      veCCLockInfo.cooldown === 0 &&
      veCCLockInfo.lockedEndDate < new Date().getTime()
    )
      setCanWithdraw(true);
    else setCanWithdraw(false);
  }, [address, veCCLockInfo]);

  useEffect(() => {
    handleGetVeCC();
  }, [handleGetVeCC]);

  if (!hasMounted || !address) return <div></div>;

  return (
    <div className={styles.container}>
      {showCooldown && address && (
        <AlignButton
          direction="col"
          text="Realign"
          icon={<ClockIcon />}
          onClick={() => handleShowPreviewModal(UnLockType.RELOCK)}
        />
      )}
      {canStartCooldown && address && (
        <AlignButton
          direction="col"
          text="Cooldown"
          icon={<ClockIcon />}
          onClick={() => handleShowPreviewModal(UnLockType.START_COOLDOWN)}
        />
      )}
      <AlignButton
        text="Claim"
        direction="col"
        icon={<CoinIcon />}
        disabled={!canClaim || !address}
        onClick={() => handleShowPreviewModal(UnLockType.CLAIM)}
      />
      <AlignButton
        text="Withdraw"
        direction="col"
        icon={<DownIcon />}
        disabled={!canWithdraw || !address}
        onClick={() => handleShowPreviewModal(UnLockType.WITHDRAW)}
      />

      <AnimatePresence>
        {isUnLockModalOpen && (
          <Modal
            onClose={closeUnLockModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <UnLockModal
              state={state}
              unlockType={unlockType}
              onRefetch={handleRefetch}
              onGetVeCC={handleGetVeCC}
              onClose={closeUnLockModal}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
