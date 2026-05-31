"use client";
import React, { createContext, useContext } from "react";
import { AboutData } from "../types";

const DataContext = createContext<AboutData | null>(null);

export const DataProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: AboutData;
}) => <DataContext.Provider value={value}>{children}</DataContext.Provider>;

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};
