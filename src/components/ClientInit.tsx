"use client";

import { useEffect } from "react";
import { initializeStore } from "@/lib/store";

export function ClientInit() {
  useEffect(() => {
    initializeStore();
  }, []);

  return null;
}
