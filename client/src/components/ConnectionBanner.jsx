import React, { useEffect, useRef, useState } from "react";
import { useOnline } from "@uiw/react-use-online";

const ConnectionBanner = () => {
  const isOnline = useOnline();
  const wasOffline = useRef(false);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    if (isOnline) {
      if (wasOffline.current) {
        setShowOnline(true);
      }

      wasOffline.current = false;
    } else {
      wasOffline.current = true;
    }
  }, [isOnline]);

  useEffect(() => {
    if (showOnline) {
      const timer = setTimeout(() => setShowOnline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showOnline]);

  return (
    <div className="fixed bottom-0 right-0 w-full z-50 shadow-md">
      {isOnline ? (
        showOnline && (
          <div className="bg-green-600 text-white text-center py-2 animate-banner-enter">
            Back Online
          </div>
        )
      ) : (
        <div className="bg-red-600 text-white text-center py-2 animate-banner-enter">
          You are offline. Some features may not work.
        </div>
      )}
    </div>
  );
};

export default ConnectionBanner;
