import { CascadiaLogo } from "@/assets/cascadia-logo";

import styles from "./styles/loading-screen.module.scss";

export const LoadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <CascadiaLogo />
      </div>
    </div>
  );
};
