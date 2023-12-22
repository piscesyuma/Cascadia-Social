"use client";
import { Formik } from "formik";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import * as Yup from "yup";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { CloseIcon } from "@/assets/close-icon";
import { TextInput } from "@/components/elements/text-input";
import { ConnectWalletButton } from "@/features/web3";

import { AppleLogo } from "../assets/apple-logo";
import { GithubLogo } from "../assets/github-logo";
import { GoogleLogo } from "../assets/google-logo";

import { AuthButton } from "./AuthButton";
import styles from "./styles/login-form.module.scss";

export const SignInModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const [error, setError] = useState(null);

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
              onClick={() => {
                signIn("google", {
                  callbackUrl: "/home",
                });
              }}
              icon={<GoogleLogo />}
              text="Sign in with Google"
            />
            <AuthButton
              onClick={() =>
                signIn("github", {
                  callbackUrl: "/home",
                })
              }
              icon={<GithubLogo />}
              text="Sign in with Github"
            />

            <AuthButton icon={<AppleLogo />} text="Sign in with Apple" />
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
