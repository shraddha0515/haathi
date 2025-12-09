import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { MapPin, Heart, AlertTriangle, TrendingUp, Filter } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URI || "https://sih-saksham.onrender.com";

export default function Hotspots() {
  const { user } = useAuth();
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchHotspots();
    loadFavorites();
  }, []);

  const fetchHotspots = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${API_BASE_URL}/api/hotspots`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHotspots(res.data || []);
    } catch (error) {
      console.error("Error fetching hotspots:", error);
      toast.error("Failed to load hotspots");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem("favoriteHotspots");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (hotspotId) => {
    const newFavorites = favorites.includes(hotspotId)
      ? favorites.filter(id => id !== hotspotId)
      : [...favorites, hotspotId];
    
    setFavorites(newFavorites);
    localStorage.setItem("favoriteHotspots", JSON.stringify(newFavorites));
    toast.success(
      favorites.includes(hotspotId) ? "Removed from favorites" : "Added to favorites"
    );
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "high":
        return <AlertTriangle className="text-red-600" size={20} />;
      case "medium":
        return <TrendingUp className="text-yellow-600" size={20} />;
      case "low":
        return <MapPin className="text-green-600" size={20} />;
      default:
        return <MapPin className="text-gray-600" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotspots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotspots</h1>
          <p className="text-gray-600">Monitor high-risk areas and elephant activity zones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Hotspots</p>
                <p className="text-3xl font-bold text-gray-900">{hotspots.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">High Risk</p>
                <p className="text-3xl font-bold text-red-600">
                  {hotspots.filter(h => h.risk_level?.toLowerCase() === "high").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Favorites</p>
                <p className="text-3xl font-bold text-purple-600">{favorites.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Hotspots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspots.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hotspots Found</h3>
              <p className="text-gray-500">There are currently no hotspots to display</p>
            </div>
          ) : (
            hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getRiskIcon(hotspot.risk_level)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {hotspot.name || "Unnamed Hotspot"}
                      </h3>
                    </div>
                    <button
                      onClick={() => toggleFavorite(hotspot.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        size={20}
                        className={favorites.includes(hotspot.id) ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                  </div>

                  {/* Risk Level Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(
                        hotspot.risk_level
                      )}`}
                    >
                      {hotspot.risk_level || "Unknown"} Risk
                    </span>
                  </div>

                  {/* Description */}
                  {hotspot.description && (
                    <p className="text-gray-700 text-sm mb-4">{hotspot.description}</p>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={16} />
                    <span>{hotspot.location || "Location not specified"}</span>
                  </div>

                  {/* Coordinates */}
                  {hotspot.latitude && hotspot.longitude && (
                    <div className="text-xs text-gray-500">
                      {hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)}
                    </div>
                  )}

                  {/* Last Updated */}
                  {hotspot.updated_at && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Updated: {new Date(hotspot.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
