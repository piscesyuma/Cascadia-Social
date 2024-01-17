import Image from "next/image";
import { signIn } from "next-auth/react";

import { DiscordLogo } from "../assets/discord-logo";
import { GoogleLogo } from "../assets/google-logo";
import { TwitterLogo } from "../assets/twitter-logo";

import { AuthButton } from "./AuthButton";
import styles from "./styles/register-form.module.scss";

export const RegisterForm = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>New to Cascadia?</h2>
        <Image src="/hippo.png" alt="hippo" width={40} height={40} />
      </div>
      <p className={styles.description}>
        Sign up now to get your own personalized timeline!
      </p>

      <div className={styles.buttons}>
        <AuthButton
          onClick={() =>
            signIn("google", {
              callbackUrl: "/home",
            })
          }
          icon={<GoogleLogo />}
          text="Sign up with Google"
        />

        <AuthButton
          onClick={() =>
            signIn("twitter", {
              callbackUrl: "/home",
            })
          }
          icon={<TwitterLogo />}
          text="Sign up with Twitter"
        />

        <AuthButton
          onClick={() =>
            signIn("discord", {
              callbackUrl: "/home",
            })
          }
          icon={<DiscordLogo />}
          text="Sign up with Discord"
        />
      </div>
    </div>
  );
};
