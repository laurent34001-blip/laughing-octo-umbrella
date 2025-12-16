import React, { useState, useEffect } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onLoadingComplete }) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Attendre 2.5 secondes avant de déclencher la disparition
    const timer = setTimeout(() => {
      setIsHiding(true);
      // Attendre la fin de l'animation (1s) avant d'appeler le callback
      setTimeout(() => {
        onLoadingComplete();
      }, 1000);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className={`splash-screen ${isHiding ? "hide" : ""}`}>
      <div className="splash-content">
        {/* Animated Logo */}
        <div className="splash-logo">
          <div className="logo-circle">
            <span className="logo-text">DC</span>
          </div>
        </div>

        {/* App Name */}
        <h1 className="splash-title">DealConnect</h1>

        {/* Loading Indicator */}
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
}
