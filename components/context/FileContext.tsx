import React, { createContext, useContext, useMemo, useState } from "react";

type FileContextValue = {
  hasFile: boolean;
  points: number[];
  setPoints: (points: number[]) => void;
  setHasFile: (hasFile: boolean) => void;
};

const FileContext = createContext<FileContextValue | undefined>(undefined);

export const FileProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasFile, setHasFile] = useState(false);
  const [points, setPoints] = useState<number[]>([]);

  const value = useMemo<FileContextValue>(() => ({ hasFile, points, setPoints, setHasFile }), [points, hasFile]);

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const useFileContext = () => {
  const ctx = useContext(FileContext);
  if (!ctx) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return ctx;
};

