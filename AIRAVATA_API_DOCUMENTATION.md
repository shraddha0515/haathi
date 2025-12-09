# Project Airavata - Complete API Documentation

## Base URL
```
Production: https://sih-saksham.onrender.com
Development: http://localhost:5000
```

---

## 🔐 Authentication APIs

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "password": "string (required)",
  "role": "string (optional: 'user' | 'officer' | 'admin', default: 'user')"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "accessToken": "string (JWT token, expires in 15m)",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Cookies Set:**
- `refreshToken` (HttpOnly, 7 days expiry)

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "accessToken": "string (JWT token, expires in 15m)",
  "user": {
    "id": "number",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

**Cookies Set:**
- `refreshToken` (HttpOnly, 7 days expiry)

---

### 3. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Headers:**
- Cookie: `refreshToken` (required)

**Response (200):**
```json
{
  "accessToken": "string (new JWT token)"
}
```

---

### 4. Get Profile
**Endpoint:** `GET /api/auth/me`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

---

### 5. Logout
**Endpoint:** `POST /api/auth/logout`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

**Cookies Cleared:**
- `refreshToken`

---

## 👥 User Management APIs

### 1. Get All Users
**Endpoint:** `GET /api/users`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "timestamp"
  }
]
```

---

### 2. Get Users by Role
**Endpoint:** `GET /api/users/role/:role`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Path Parameters:**
- `role`: 'user' | 'officer' | 'admin'

**Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "timestamp"
  }
]
```

---

### 3. Get User by ID
**Endpoint:** `GET /api/users/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "timestamp"
}
```

---

### 4. Update User
**Endpoint:** `PUT /api/users/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "role": "string (optional: 'user' | 'officer' | 'admin')"
}
```

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "timestamp"
  }
}
```

---

### 5. Delete User
**Endpoint:** `DELETE /api/users/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Response (200):**
```json
{
  "message": "User deleted successfully",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  }
}
```

---

### 6. Search Users
**Endpoint:** `GET /api/users/search`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Query Parameters:**
- `query`: string (search in name/email)
- `role`: 'user' | 'officer' | 'admin' (optional)

**Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string",
    "created_at": "timestamp"
  }
]
```

---

## 📱 Device Management APIs

### 1. Create Device
**Endpoint:** `POST /api/devices/create`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin

**Request Body:**
```json
{
  "device_id": "string (required, unique)",
  "description": "string (optional)",
  "latitude": "number (required, -90 to 90)",
  "longitude": "number (required, -180 to 180)"
}
```

**Response (201):**
```json
{
  "message": "Device registered successfully",
  "device": {
    "id": "number",
    "device_id": "string",
    "description": "string",
    "latitude": "number",
    "longitude": "number",
    "created_at": "timestamp"
  }
}
```

---

### 2. Get All Devices
**Endpoint:** `GET /api/devices`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin | officer

**Response (200):**
```json
[
  {
    "id": "number",
    "device_id": "string",
    "description": "string",
    "latitude": "number",
    "longitude": "number",
    "status": "string ('online' | 'offline')",
    "last_seen": "timestamp",
    "battery_percentage": "number",
    "created_at": "timestamp"
  }
]
```

---

### 3. Get Device by ID
**Endpoint:** `GET /api/devices/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin | officer

**Response (200):**
```json
{
  "id": "number",
  "device_id": "string",
  "description": "string",
  "latitude": "number",
  "longitude": "number",
  "status": "string",
  "last_seen": "timestamp",
  "battery_percentage": "number",
  "created_at": "timestamp"
}
```

---

### 4. Update Device
**Endpoint:** `PUT /api/devices/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin

**Request Body:**
```json
{
  "device_id": "string (optional)",
  "description": "string (optional)",
  "latitude": "number (optional)",
  "longitude": "number (optional)",
  "status": "string (optional)",
  "battery_percentage": "number (optional)"
}
```

**Response (200):**
```json
{
  "id": "number",
  "device_id": "string",
  "description": "string",
  "latitude": "number",
  "longitude": "number",
  "status": "string",
  "battery_percentage": "number",
  "last_seen": "timestamp",
  "created_at": "timestamp"
}
```

---

### 5. Delete Device
**Endpoint:** `DELETE /api/devices/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin

**Response (200):**
```json
{
  "message": "Device deleted successfully"
}
```

---

## 🐘 Event/Detection APIs

### 1. Receive Event (IoT Device Endpoint)
**Endpoint:** `POST /api/events/receive`

**Request Body:**
```json
{
  "device_id": "string (required)",
  "latitude": "number (required)",
  "longitude": "number (required)",
  "confidence": "number (optional, 0-1)",
  "battery_percentage": "number (optional, 0-100)"
}
```

**Response (201):**
```json
{
  "message": "Event stored & broadcasted",
  "data": {
    "id": "number",
    "source_device": "string",
    "latitude": "number",
    "longitude": "number",
    "confidence": "number",
    "battery_percentage": "number",
    "detected_at": "timestamp"
  }
}
```

**Side Effects:**
- Updates device status and battery
- Broadcasts via WebSocket
- Sends push notifications to all users
- Creates notifications in database
- Checks proximity alerts for hotspots

---

### 2. Get Latest Event by Device
**Endpoint:** `GET /api/events/latest/:device_id`

**Response (200):**
```json
{
  "id": "number",
  "source_device": "string",
  "latitude": "number",
  "longitude": "number",
  "confidence": "number",
  "battery_percentage": "number",
  "detected_at": "timestamp"
}
```

---

### 3. Get Event History by Device
**Endpoint:** `GET /api/events/history/:device_id`

**Response (200):**
```json
[
  {
    "id": "number",
    "source_device": "string",
    "latitude": "number",
    "longitude": "number",
    "confidence": "number",
    "battery_percentage": "number",
    "detected_at": "timestamp"
  }
]
```

**Note:** Returns last 500 events

---

### 4. Get All Events
**Endpoint:** `GET /api/events`

**Response (200):**
```json
[
  {
    "id": "number",
    "source_device": "string",
    "latitude": "number",
    "longitude": "number",
    "confidence": "number",
    "battery_percentage": "number",
    "detected_at": "timestamp"
  }
]
```

---

## 📍 Hotspot Management APIs

### 1. Create Hotspot
**Endpoint:** `POST /api/hotspots`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin | officer

**Request Body:**
```json
{
  "name": "string (required)",
  "type": "string (required)",
  "description": "string (optional)",
  "latitude": "number (required)",
  "longitude": "number (required)",
  "metadata": "object (optional, key-value pairs)"
}
```

**Response (201):**
```json
{
  "message": "Hotspot created successfully",
  "hotspot": {
    "id": "number",
    "name": "string",
    "type": "string",
    "description": "string",
    "latitude": "number",
    "longitude": "number",
    "created_by": "number",
    "is_active": "boolean",
    "created_at": "timestamp"
  }
}
```

**Side Effects:**
- Creates alert zone with 500m radius
- Broadcasts via WebSocket

---

### 2. Get All Hotspots
**Endpoint:** `GET /api/hotspots`

**Query Parameters:**
- `type`: string (filter by type)
- `active`: boolean (filter by active status)
- `near_lat`: number (latitude for proximity search)
- `near_lng`: number (longitude for proximity search)
- `radius_km`: number (search radius in km)

**Response (200):**
```json
[
  {
    "id": "number",
    "name": "string",
    "type": "string",
    "description": "string",
    "latitude": "number",
    "longitude": "number",
    "is_active": "boolean",
    "created_at": "timestamp",
    "created_by_name": "string",
    "metadata": [
      {
        "key": "string",
        "value": "any"
      }
    ]
  }
]
```

---

### 3. Get Hotspot by ID
**Endpoint:** `GET /api/hotspots/:id`

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "type": "string",
  "description": "string",
  "latitude": "number",
  "longitude": "number",
  "is_active": "boolean",
  "created_at": "timestamp",
  "created_by_name": "string",
  "metadata": [],
  "radius_meters": "number",
  "alert_level": "string"
}
```

---

### 4. Update Hotspot
**Endpoint:** `PUT /api/hotspots/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin | officer

**Request Body:**
```json
{
  "name": "string (optional)",
  "type": "string (optional)",
  "description": "string (optional)",
  "latitude": "number (optional)",
  "longitude": "number (optional)",
  "is_active": "boolean (optional)"
}
```

**Response (200):**
```json
{
  "id": "number",
  "name": "string",
  "type": "string",
  "description": "string",
  "latitude": "number",
  "longitude": "number",
  "is_active": "boolean",
  "updated_at": "timestamp"
}
```

---

### 5. Delete Hotspot
**Endpoint:** `DELETE /api/hotspots/:id`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin

**Response (200):**
```json
{
  "message": "Hotspot deleted successfully"
}
```

---

## 🔔 Notification APIs

### 1. Register FCM Token
**Endpoint:** `POST /api/notifications/register-token`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Request Body:**
```json
{
  "fcm_token": "string (required)",
  "device_type": "string (optional, default: 'web')"
}
```

**Response (200):**
```json
{
  "message": "FCM token registered"
}
```

---

### 2. Send Notification to All Users
**Endpoint:** `POST /api/notifications/send-all`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)
- Role: admin

**Request Body:**
```json
{
  "title": "string (required)",
  "body": "string (required)",
  "data": "object (optional)"
}
```

**Response (200):**
```json
{
  "message": "Notification sent to all users"
}
```

**Side Effects:**
- Sends push notifications to all registered devices
- Creates notification records in database
- Broadcasts via WebSocket

---

### 3. Get User Notifications
**Endpoint:** `GET /api/notifications/my`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Query Parameters:**
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response (200):**
```json
[
  {
    "id": "number",
    "user_id": "number",
    "title": "string",
    "body": "string",
    "data": "object",
    "read": "boolean",
    "created_at": "timestamp"
  }
]
```

---

### 4. Mark Notification as Read
**Endpoint:** `PUT /api/notifications/:id/read`

**Headers:**
- `Authorization: Bearer {accessToken}` (required)

**Response (200):**
```json
{
  "message": "Notification marked as read"
}
```

---

## 🔌 WebSocket Events

### Connection
```javascript
const socket = io('https://sih-saksham.onrender.com');
```

### Events to Listen:

1. **new_event** - New elephant detection
```json
{
  "id": "number",
  "source_device": "string",
  "latitude": "number",
  "longitude": "number",
  "detected_at": "timestamp"
}
```

2. **notification** - New notification
```json
{
  "title": "string",
  "body": "string",
  "data": "object",
  "timestamp": "string"
}
```

3. **hotspot_created** - New hotspot created
```json
{
  "id": "number",
  "name": "string",
  "type": "string",
  "latitude": "number",
  "longitude": "number"
}
```

4. **hotspot_updated** - Hotspot updated
5. **hotspot_deleted** - Hotspot deleted
6. **proximity_alert** - Elephant near hotspot

---

## 🔒 Authentication & Authorization

### Access Token
- Type: JWT
- Expiry: 15 minutes
- Header: `Authorization: Bearer {token}`

### Refresh Token
- Type: JWT
- Expiry: 7 days
- Storage: HTTP-only cookie
- Endpoint: `/api/auth/refresh`

### Roles
1. **user** - Basic access
2. **officer** - Can manage hotspots
3. **admin** - Full access

---

## 📊 Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Error message describing what went wrong"
}
```

**401 Unauthorized:**
```json
{
  "error": "No token provided" | "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## 📝 Notes

1. All timestamps are in ISO 8601 format
2. Coordinates use WGS84 (SRID 4326)
3. All authenticated endpoints require valid access token
4. Refresh token is automatically sent via cookies
5. WebSocket connection requires authentication
6. Push notifications require FCM token registration
7. Proximity alerts trigger automatically when events are received
8. Session persists for 7 days with automatic token refresh
