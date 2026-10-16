"use client";

import React from "react";
import '@/styles/globals.css'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/pwa.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
	<>
	  {children}
	</>
  );
}