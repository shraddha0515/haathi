// Browser Notification Utilities

/**
 * Request permission for browser notifications
 * @returns {Promise<boolean>} - true if permission granted
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

/**
 * Show a browser notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 */
export const showNotification = (title, options = {}) => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [200, 100, 200],
      requireInteraction: true, // Keep notification visible until user interacts
      ...options,
    });

    // Auto-close after 10 seconds if user doesn't interact
    setTimeout(() => {
      notification.close();
    }, 10000);

    return notification;
  }
};

/**
 * Show elephant detection notification
 * @param {object} eventData - Event data from backend
 */
export const showElephantDetectionNotification = (eventData) => {
  const { device_id, latitude, longitude, detected_at } = eventData;
  
  showNotification("🐘 Elephant Detected!", {
    body: `Device ${device_id} detected movement at coordinates (${latitude?.toFixed(4)}, ${longitude?.toFixed(4)})`,
    tag: `elephant-${eventData.id}`, // Prevents duplicate notifications
    data: eventData,
    icon: "/favicon.ico",
  });

  // Play alert sound
  playAlertSound();
};

/**
 * Show proximity alert notification
 * @param {object} alertData - Alert data from backend
 */
export const showProximityAlertNotification = (alertData) => {
  const { hotspot, detection } = alertData;
  
  showNotification("⚠️ Proximity Alert!", {
    body: `Elephant detected near ${hotspot.name} (${Math.round(hotspot.distance_meters)}m away)`,
    tag: `proximity-${hotspot.id}`,
    data: alertData,
    icon: "/favicon.ico",
  });

  // Play alert sound
  playAlertSound();
};

/**
 * Play an alert sound
 */
export const playAlertSound = () => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error("Error playing alert sound:", error);
  }
};

/**
 * Check if notifications are supported and enabled
 * @returns {boolean}
 */
export const areNotificationsEnabled = () => {
  return "Notification" in window && Notification.permission === "granted";
};
