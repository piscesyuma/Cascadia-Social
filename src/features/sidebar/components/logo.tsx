import Link from "next/link";

import { LogoDarkIcon, LogoLightIcon } from "../assets/logo-icon";

import styles from "./styles/logo.module.scss";

export const Logo = () => {
  return (
    <h1 className={styles.container}>
      <Link href={`/home`} aria-label="Cascadia">
        <LogoDarkIcon />
        <LogoLightIcon />
      </Link>
    </h1>
  );
};
