"use client";

import { notifications } from "@/constants/Data";
import { useState, useEffect } from "react";

export function NotificationSystem() {
  const [currentNotification, setCurrentNotification] = useState<
    (typeof notifications)[0] | null
  >(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotification = () => {
      const randomNotification =
        notifications[Math.floor(Math.random() * notifications.length)];
      setCurrentNotification(randomNotification);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    const interval = setInterval(showNotification, 6000);
    showNotification(); // Show first notification immediately

    return () => clearInterval(interval);
  }, []);

  if (!currentNotification) return null;

  return (
    <div
      className={`fixed bottom-2 md:bottom-4 left-2 md:left-4 z-50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-black text-white rounded-lg p-3 md:p-4 flex items-center space-x-2 md:space-x-3 shadow-lg max-w-xs md:max-w-sm">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm md:text-base">₿</span>
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-orange-500 text-xs md:text-sm">
            Earning
          </div>
          <div className="text-xs md:text-sm leading-tight">
            {currentNotification.name} from {currentNotification.country} has
            just Earned{" "}
            <strong>${currentNotification.amount.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
