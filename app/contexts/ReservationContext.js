"use client";

import { createContext, use, useState } from "react";

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  const initialRange = { from: undefined, to: undefined };
  const [range, setRange] = useState(initialRange);
  function handleSelectRange(range) {
    setRange({ from: range?.from, to: range?.to });
  }
  function resetRange() {
    setRange(initialRange);
  }

  return (
    <ReservationContext.Provider
      value={{ range, handleSelectRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = use(ReservationContext);

  if (!context) throw new Error("Context was used outside the provider");

  return context;
}
