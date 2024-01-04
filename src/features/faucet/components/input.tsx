import React from "react";
import { isAddress } from "viem";

import styles from "./styles/input.module.scss";

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean | string;
  fontSize?: string;
  align?: "right" | "left";
  className?: string;
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) {
  const enforcer = (nextUserInput: string) => {
    if (isAddress(nextUserInput)) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <input
      className={styles.input}
      {...rest}
      value={value}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      inputMode="text"
      title="Wallet address"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^0x[a-fA-F0-9]{40}$"
      placeholder={placeholder || "0xcbA8CC..."}
      minLength={42}
      maxLength={42}
      spellCheck="false"
    />
  );
});

export default Input;
