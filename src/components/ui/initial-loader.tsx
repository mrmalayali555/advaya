"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function InitialLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already seen the loader this session
    if (sessionStorage.getItem("hasSeenLoader")) {
      setLoading(false);
      return;
    }

    // Hide the loader after 2.2 seconds and mark as seen
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("hasSeenLoader", "true");
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("page-loader-overlay", !loading && "hidden")}>
      <div className="custom-loader">
        <div className="custom-loading-text">
          Loading<span className="custom-dot">.</span><span className="custom-dot">.</span><span className="custom-dot">.</span>
        </div>
        <div className="custom-loading-bar-background">
          <div className="custom-loading-bar">
            <div className="custom-white-bars-container">
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
              <div className="custom-white-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
