import React from "react";
import { useDisconnect } from "wagmi";

import { DisconnectIcon } from "../assets/disconnect-icon";

import styles from "./styles/disconnect-button.module.scss";

export default function DisconnectButton() {
  const { disconnect } = useDisconnect();
  return (
    <button className={styles.container} onClick={() => disconnect()}>
      <DisconnectIcon />
      <span>Disconnect</span>
    </button>
  );
}
