import React, { useState, useEffect } from "react";
import { Bell, Calendar, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

export default function Header() {
  const { t, i18n } = useTranslation();
  const { openMapModal } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const today = new Date().toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close notifications panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-panel') && !event.target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/api/notifications/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notificationsData = Array.isArray(res.data) ? res.data : [];
      setNotifications(notificationsData);
      const unread = notificationsData.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const unreadNotifications = notifications.filter(n => !n.read);

      // Mark all unread notifications as read
      await Promise.all(
        unreadNotifications.map(notification =>
          axios.put(
            `${API_BASE_URL}/api/notifications/${notification.id}/read`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
        )
      );

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all as read:", err);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow-sm border-b border-green-200 px-6 py-3 sticky top-0 z-50">
      {/* Empty div for spacing */}
      <div className="flex items-center gap-3">
        
      </div>
      {/* Date/Time */}
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm text-green-700">
        <Calendar size={16} />
        {today}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-5">
        {/* Notification Button */}
        <div className="relative">
          <button
            className="notification-button relative p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-[4px] py-[1px] rounded-full min-w-[16px] text-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {showNotifications && (
            <div className="notification-panel absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''
                        }`}
                      onClick={() => {
                        // Mark as read
                        if (!notification.read) {
                          handleMarkAsRead(notification.id);
                        }
                        // Open map modal if notification has event data
                        if (notification.data && openMapModal) {
                          openMapModal(notification.data);
                          setShowNotifications(false);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.body}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-500 mt-1 font-medium">
                        Click to view on map →
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center px-3 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium text-green-700"
          title="Switch Language"
        >
          <Globe size={18} className="mr-1" />
          {i18n.language === "en" ? "EN" : "HI"}
        </button>
      </div>
    </header>
  );
}
