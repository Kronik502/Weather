import React, { useEffect, useState } from 'react';
import '../App.css';

function OfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <div>
      {isOnline ? (
        <p>You are online.</p>
      ) : (
        <p>You are offline. Displaying cached data.</p>
      )}
    </div>
  );
}

export default OfflineMode;
