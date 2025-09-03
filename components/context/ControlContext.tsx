import React, { createContext, useContext, useMemo, useState } from "react";

type ControlContextValue = {
  currentPointIndex: number;
  setCurrentPointIndex: React.Dispatch<React.SetStateAction<number>>;
};

const ControlContext = createContext<ControlContextValue | undefined>(undefined);

export const ControlProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);

  const value = useMemo<ControlContextValue>(() => ({ currentPointIndex, setCurrentPointIndex }), [currentPointIndex]);

  return <ControlContext.Provider value={value}>{children}</ControlContext.Provider>;
};

export const useControlContext = () => {
  const ctx = useContext(ControlContext);
  if (!ctx) {
    throw new Error("useControlContext must be used within a ControlProvider");
  }
  return ctx;
};

