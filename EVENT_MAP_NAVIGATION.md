# Interactive Event Map Navigation Feature

## Overview

Implemented a comprehensive feature that allows users to click on detection events in the modal to automatically focus the map on that location, showing the route and distance from the user's current position.

## Features Implemented

### 1. **Clickable Event Cards** ✅

- Event cards in the "All Detection Events" modal are now fully clickable
- Visual feedback with hover effects (purple border and background)
- Cursor changes to pointer to indicate clickability
- "Click to view on map" hint text added to each card

### 2. **Map Auto-Focus** ✅

When clicking on an event:

- Modal automatically closes
- Page smoothly scrolls to the map section
- Map centers on the clicked event location
- Map zooms in to level 12 for better detail
- Event popup automatically opens

### 3. **User Location Tracking** ✅

- Admin dashboard now requests and tracks user's current location
- User location displayed with a blue person icon marker
- Popup shows "Your Location" when clicked

### 4. **Distance Calculation** ✅

- Haversine formula used for accurate distance calculation
- Distance displayed in two formats:
  - **Meters**: For distances < 1 km
  - **Kilometers**: For distances ≥ 1 km
- Distance shown in two places:
  - **Top-left badge**: Prominent display with red text
  - **Event popup**: Included in the focused event's popup

### 5. **Visual Route Display** ✅

- Red dashed polyline drawn between user location and focused event
- Line specifications:
  - Color: Red
  - Weight: 3px
  - Opacity: 0.7
  - Style: Dashed (10px dash, 10px gap)
- Route provides visual guidance for navigation

## Technical Implementation

### Components Modified

**1. AdminMapView.jsx**

- Added `userLocation` and `focusedEvent` props
- Implemented `calculateDistance()` function using Haversine formula
- Added user icon marker
- Added polyline rendering for routes
- Enhanced `MapUpdater` to handle dynamic zoom levels
- Added distance display badge
- Auto-open popup for focused events

**2. AdminDashboard.jsx**

- Added `focusedEvent` state to track which event is selected
- Added `userLocation` state with geolocation tracking
- Implemented `handleEventClick()` function to:
  - Set the focused event
  - Close the modal
  - Clear search query
  - Scroll to map section
- Updated map section with ID for scroll targeting
- Passed new props to AdminMapView
- Made event cards clickable with visual feedback

### Distance Calculation

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
```

## User Experience Flow

1. **User opens Events Modal**

   - Clicks on "Total Events" stat card
   - Modal displays all detection events

2. **User searches (optional)**

   - Can filter events by device ID or location
   - Real-time filtering as they type

3. **User clicks on an event**

   - Event card highlights on hover
   - Click triggers the focus action

4. **Automatic map navigation**

   - Modal closes smoothly
   - Page scrolls to map section
   - Map animates to event location (1.5s duration)
   - Zooms in to level 12

5. **Visual information displayed**
   - User's location marker appears (if permission granted)
   - Event marker is highlighted
   - Red dashed line connects user to event
   - Distance badge shows in top-left corner
   - Event popup opens automatically with distance info

## Visual Elements

### Distance Badge (Top-Left)

```
┌─────────────────────────┐
│ 📏 Distance: 2.45 km    │
└─────────────────────────┘
```

### Event Popup (Enhanced)

```
🐘 Elephant Detected!
Device: ESP32_001
12/11/2025, 4:55:17 AM
Lat: 22.0800, Lng: 82.1400
📏 2.45km from you
```

### Route Line

- Visual dashed line from user to event
- Easy to follow on map
- Distinct red color for visibility

## Benefits

1. **Quick Navigation**: Jump directly to any event location
2. **Situational Awareness**: See distance and route at a glance
3. **Better Decision Making**: Visual context helps assess threat level
4. **User-Friendly**: Intuitive click-to-view interaction
5. **Complete Information**: All relevant data in one view

## Browser Permissions

The feature requests geolocation permission:

- **Granted**: Full functionality with distance and route
- **Denied**: Map still works, but no distance calculation or route display
- **Not supported**: Gracefully degrades, map functions normally

## Future Enhancements

Potential improvements:

- Add actual routing using OpenStreetMap routing service
- Show estimated travel time
- Add "Get Directions" button
- Support multiple waypoints
- Add route optimization for multiple events
- Include terrain/traffic information

## Testing Checklist

- [x] Event cards are clickable
- [x] Modal closes on event click
- [x] Map scrolls into view
- [x] Map centers on event
- [x] Map zooms appropriately
- [x] User location marker appears
- [x] Distance is calculated correctly
- [x] Distance displays in correct units
- [x] Polyline route renders
- [x] Event popup auto-opens
- [x] Distance shows in popup
- [x] Works without user location
- [x] Handles permission denial gracefully

## Files Modified

1. **`frontend/src/components/AdminMapView.jsx`**

   - Added distance calculation function
   - Added user location support
   - Added route polyline rendering
   - Added distance display badge
   - Enhanced popup with distance info

2. **`frontend/src/pages/AdminDashboard.jsx`**
   - Added geolocation tracking
   - Added event click handler
   - Added focused event state
   - Made event cards clickable
   - Added scroll-to-map functionality
