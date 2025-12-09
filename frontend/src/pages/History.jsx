import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Clock, MapPin, AlertTriangle, Info, Filter, Search } from "lucide-react";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";
export default function History() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchHistory();
  }, []);
  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };
  const getEventIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="text-red-500" size={20} />;
      case "info":
        return <Info className="text-blue-500" size={20} />;
      default:
        return <MapPin className="text-gray-500" size={20} />;
    }
  };
  const getEventColor = (type) => {
    switch (type) {
      case "alert":
        return "border-l-red-500 bg-red-50";
      case "info":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };
  const filteredEvents = events
    .filter(event => filter === "all" || event.type === filter)
    .filter(event =>
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event History</h1>
          <p className="text-gray-600">View all past events and alerts</p>
        </div>
        {}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            {}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "all"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("alert")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "alert"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Alerts
              </button>
              <button
                onClick={() => setFilter("info")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === "info"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Info
              </button>
            </div>
          </div>
        </div>
        {}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Found</h3>
              <p className="text-gray-500">There are no events matching your criteria</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 ${getEventColor(
                  event.type
                )} p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getEventIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.title || "Event"}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{event.description}</p>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.latitude && event.longitude && (
                      <div className="mt-2 text-xs text-gray-500">
                        Coordinates: {event.latitude}, {event.longitude}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
