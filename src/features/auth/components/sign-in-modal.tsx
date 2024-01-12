"use client";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useCallback, useState } from "react";
import * as Yup from "yup";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { CloseIcon } from "@/assets/close-icon";
import { TextInput } from "@/components/elements/text-input";
import { ConnectWalletButton } from "@/features/web3";

import { DiscordLogo } from "../assets/discord-logo";
import { GoogleLogo } from "../assets/google-logo";
import { TwitterLogo } from "../assets/twitter-logo";

import { AuthButton } from "./AuthButton";
import styles from "./styles/login-form.module.scss";

export const SignInModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState({
    discord: false,
    google: false,
    github: false,
    twitter: false,
    apple: false,
  });

  const handleSignIn = useCallback((provider: string) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    signIn(provider, {
      callbackUrl: "/home",
    }).finally(() => {
      setIsLoading((prev) => ({ ...prev, [provider]: false }));
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      role="group"
      className={styles.container}
    >
      <div className={styles.header}>
        <button
          onClick={onClose}
          aria-label="Close"
          data-title="Close"
          className={styles.close}
        >
          <CloseIcon />
        </button>

        <div className={styles.logo}>
          <CascadiaLogo />
        </div>

        <div className={styles.placeholder} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2 className={styles.title}>Sign in to Cascadia</h2>

          <div className={styles.authButtons}>
            <AuthButton
              onClick={() => handleSignIn("google")}
              icon={<GoogleLogo />}
              text="Sign in with Google"
              disabled={isLoading.google}
              isLoading={isLoading.google}
            />

            <AuthButton
              onClick={() => handleSignIn("twitter")}
              icon={<TwitterLogo />}
              text="Sign in with Twitter"
              disabled={isLoading.twitter}
              isLoading={isLoading.twitter}
            />

            <AuthButton
              onClick={() => handleSignIn("discord")}
              icon={<DiscordLogo />}
              text="Sign in with Discord"
              disabled={isLoading.discord}
              isLoading={isLoading.discord}
            />
          </div>

          <div className={styles.divider}>
            <span className={styles.line}></span>
            <span className={styles.text}>or</span>
            <span className={styles.line}></span>
          </div>

          <div className={styles.authButtons}>
            <ConnectWalletButton type="signin" text="Sign in with Wallet" />
          </div>

          <div className={styles.divider}>
            <span className={styles.line}></span>
            <span className={styles.text}>or</span>
            <span className={styles.line}></span>
          </div>

          <Formik
            initialValues={{ email: "", password: "", tenantKey: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .max(30, "Must be 30 characters or less")
                .email("Invalid email address")
                .required("Please enter your email"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              const res = await signIn("credentials", {
                redirect: false,
                email: values.email,
                callbackUrl: "/home",
              });
              if (res?.error) {
                setError(res.error as any);
              } else {
                setError(null);
              }
              if (res?.url) router.push(res?.url);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <div>
                  <div>
                    {error && (
                      <div className={styles.inputContainer}>
                        <div className={styles.errorMessage}>{error}</div>
                      </div>
                    )}

                    <div className={styles.inputContainer}>
                      <TextInput
                        onChange={(e) =>
                          formik.setFieldValue("email", e.target.value)
                        }
                        value={formik.values.email}
                        placeholder="Phone, email, or username"
                        id="text"
                        name="Name"
                        isError={
                          !!formik.errors.email && !!formik.touched.email
                        }
                        errorMessage={
                          (formik.errors.email &&
                            formik.touched.email &&
                            formik.errors.email) ||
                          ""
                        }
                      />
                    </div>

                    <div>
                      <button type="submit" className={styles.submit}>
                        {formik.isSubmitting ? "Please wait..." : "Next"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>

          <button className={styles.forgotPassword}>Forgot password?</button>
        </div>
      </div>
    </motion.div>
  );
};
