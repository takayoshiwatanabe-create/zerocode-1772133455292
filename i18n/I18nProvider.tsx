import React, { ReactNode } from "react";
import { I18nManager } from "react-native";
import { isRTL } from "./index";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  // Set RTL for the entire app based on detected language
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    I18nManager.allowRTL(isRTL);
    // Note: Forcing RTL might require a reload for some components to fully adjust.
    // In a real app, you might want to prompt the user to restart or handle this more gracefully.
  }

  return <>{children}</>;
}

