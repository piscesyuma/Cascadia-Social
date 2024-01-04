"use client";
import { useState } from "react";

import { Balance } from "./balance";
import { AddAlignment } from "./form";
import { UnLockAlignment } from "./unlock-form";

export const Alignment = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <section aria-label="alignment">
      {selectedTab === 0 ? (
        <Balance changeTab={() => setSelectedTab(1)} />
      ) : (
        <>
          <AddAlignment changeTab={() => setSelectedTab(0)} />
          <UnLockAlignment />
        </>
      )}
    </section>
  );
};
