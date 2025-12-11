import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { 
  requestNotificationPermission, 
  showElephantDetectionNotification,
  showProximityAlertNotification,
  areNotificationsEnabled 
} from '../utils/notificationUtils';
import { toast } from 'react-toastify';

const TestNotifications = () => {
  const { socket, connected, notificationsEnabled } = useSocket();
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionStatus(Notification.permission);
    if (granted) {
      toast.success('✅ Notification permission granted!');
    } else {
      toast.error('❌ Notification permission denied');
    }
  };

  const testElephantNotification = () => {
    const mockEvent = {
      id: 999,
      source_device: 'TEST-DEVICE-001',
      latitude: 28.6139,
      longitude: 77.2090,
      detected_at: new Date().toISOString(),
      confidence: 0.95,
    };

    showElephantDetectionNotification(mockEvent);
    toast.info('🧪 Test notification sent!');
  };

  const testProximityAlert = () => {
    const mockAlert = {
      hotspot: {
        id: 1,
        name: 'Village Settlement',
        type: 'residential',
        distance_meters: 250,
      },
      detection: {
        latitude: 28.6139,
        longitude: 77.2090,
        deviceId: 'TEST-DEVICE-001',
      },
    };

    showProximityAlertNotification(mockAlert);
    toast.info('🧪 Test proximity alert sent!');
  };

  const simulateSocketEvent = () => {
    if (!socket || !connected) {
      toast.error('❌ Socket not connected!');
      return;
    }

    // The backend would normally emit this, but we can test the client-side handling
    const mockEvent = {
      id: 999,
      source_device: 'TEST-DEVICE-001',
      latitude: 28.6139,
      longitude: 77.2090,
      detected_at: new Date().toISOString(),
      confidence: 0.95,
    };

    // Manually trigger the event handler (simulating backend emission)
    toast.info('🧪 Simulating socket event...');
    console.log('Simulated event:', mockEvent);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔔 Notification Testing Dashboard
        </h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Socket Status</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-lg font-semibold">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notification Permission</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                permissionStatus === 'granted' ? 'bg-green-500' : 
                permissionStatus === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-lg font-semibold capitalize">{permissionStatus}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notifications Enabled</h3>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${notificationsEnabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-lg font-semibold">
                {notificationsEnabled ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          
          {permissionStatus !== 'granted' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 mb-3">
                ⚠️ Notification permission is required to receive alerts. Click the button below to enable.
              </p>
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                Request Notification Permission
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={testElephantNotification}
              disabled={!areNotificationsEnabled()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🐘 Test Elephant Detection
            </button>

            <button
              onClick={testProximityAlert}
              disabled={!areNotificationsEnabled()}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ⚠️ Test Proximity Alert
            </button>

            <button
              onClick={simulateSocketEvent}
              disabled={!connected}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🔌 Simulate Socket Event
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">📋 How to Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>First, grant notification permission by clicking the button above</li>
            <li>Click "Test Elephant Detection" to see a browser notification</li>
            <li>Click "Test Proximity Alert" to see a proximity warning</li>
            <li>To test real detection, send a POST request to your backend:
              <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-x-auto">
{`curl -X POST http://localhost:5000/api/events \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "TEST-001",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "confidence": 0.95,
    "battery_percentage": 85
  }'`}
              </pre>
            </li>
          </ol>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">🐛 Debug Information</h3>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>Browser:</strong> {navigator.userAgent}</div>
            <div><strong>Notification API:</strong> {typeof Notification !== 'undefined' ? 'Supported' : 'Not Supported'}</div>
            <div><strong>Socket ID:</strong> {socket?.id || 'N/A'}</div>
            <div><strong>API URL:</strong> {import.meta.env.VITE_API_BASE_URI || 'https://sih-saksham.onrender.com'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;
