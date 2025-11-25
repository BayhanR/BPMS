"use client";

import * as React from "react";
import { motion } from "framer-motion";

// Global button hover effects - Tüm butonlara otomatik uygulanır
export function GlobalButtonStyles() {
  React.useEffect(() => {
    // CSS ile global button hover styles
    const style = document.createElement("style");
    style.textContent = `
      button:not(:disabled):hover,
      [role="button"]:not(:disabled):hover {
        transform: scale(1.05) translateY(-2px);
        filter: drop-shadow(0 8px 24px rgba(255, 30, 86, 0.35));
      }
      
      button:not(:disabled):active,
      [role="button"]:not(:disabled):active {
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

