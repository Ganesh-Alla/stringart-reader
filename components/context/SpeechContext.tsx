import React, { createContext, useContext, useMemo, useState } from "react";
import { Option } from "../ui/select";

type SpeechContextValue = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  speechLang: 'en-US' | 'te-IN';
  setSpeechLang: (speechLang: 'en-US' | 'te-IN') => void;
  delayMs: Option;
  setDelayMs: (delayMs: Option) => void;
};

const SpeechContext = createContext<SpeechContextValue | undefined>(undefined);

export const SpeechProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [delayMs, setDelayMs] = useState<Option>({ label: '2 seconds', value: '2000' });
    const [speechLang, setSpeechLang] = useState<'en-US' | 'te-IN'>('en-US');

  const value = useMemo<SpeechContextValue>(() => ({ isPlaying, setIsPlaying, speechLang, setSpeechLang, delayMs, setDelayMs }), [isPlaying, speechLang, delayMs]);

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
};

export const useSpeechContext = () => {
  const ctx = useContext(SpeechContext);
  if (!ctx) {
    throw new Error("useSpeechContext must be used within a SpeechProvider");
  }
  return ctx;
};

