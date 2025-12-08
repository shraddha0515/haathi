# Leaflet Location Troubleshooting Guide

## Common Issues & Solutions

### 1. **Browser Permission Denied**
**Problem:** The browser blocks location access.

**Solutions:**
- **Check the address bar** for a location permission icon (usually a location pin or "i" icon)
- Click it and set location permission to "Allow"
- **Chrome:** Settings → Privacy and security → Site Settings → Location → Allow
- **Firefox:** Click the lock icon → Permissions → Access Your Location → Allow
- **Edge:** Similar to Chrome

### 2. **HTTPS Requirement**
**Problem:** Geolocation API requires HTTPS (except on localhost).

**Solutions:**
- If testing locally, use `http://localhost:5173` (works fine)
- If deployed, ensure your site uses HTTPS
- For development, Vite dev server already uses localhost, so this should work

### 3. **Location Services Disabled**
**Problem:** Device location services are turned off.

**Solutions:**
- **Windows:** Settings → Privacy → Location → Turn on
- **Mac:** System Preferences → Security & Privacy → Privacy → Location Services
- **Mobile:** Enable location in device settings

### 4. **Browser Compatibility**
**Problem:** Old browsers may not support geolocation.

**Solutions:**
- Update to latest browser version
- Check browser compatibility at [caniuse.com/geolocation](https://caniuse.com/geolocation)

### 5. **Timeout Issues**
**Problem:** Location request times out (especially indoors).

**Solutions:**
- The code now has a 10-second timeout
- Try moving near a window for better GPS signal
- On desktop, ensure WiFi is enabled (helps with location accuracy)

## Testing Your Location

### Quick Test in Browser Console:
```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => console.log("✅ Location:", pos.coords.latitude, pos.coords.longitude),
  (err) => console.error("❌ Error:", err.message)
);
```

### What to Check:
1. **Browser Console** (F12) - Look for:
   - ✅ "Location acquired: [lat], [lon]" = Working!
   - ❌ "Geolocation error: ..." = See error message

2. **UI Indicators:**
   - Blue banner: "Getting your location..." = Waiting for permission
   - Yellow banner: Shows specific error message
   - Green badge on map: "Location Active" = Working!

3. **Map:**
   - Should show a person icon at your location
   - Map should center on your position

## Current Implementation Features

✅ **Enhanced Error Handling:** Shows specific error messages
✅ **Loading States:** Visual feedback while getting location
✅ **Permission Prompts:** Guides user to allow location
✅ **High Accuracy:** Uses `enableHighAccuracy: true`
✅ **Live Tracking:** Uses `watchPosition` for continuous updates
✅ **Console Logging:** Easy debugging in browser console

## Still Not Working?

1. **Check Browser Console** (F12) for error messages
2. **Try incognito/private mode** (rules out extension conflicts)
3. **Test on different browser** (Chrome, Firefox, Edge)
4. **Restart browser** after changing permissions
5. **Check if other sites can access location** (e.g., Google Maps)

## Developer Notes

The geolocation code is in:
- `frontend/src/pages/UserDashboard.jsx` (lines 18-61)

Key configuration:
```javascript
{
  enableHighAccuracy: true,  // Use GPS if available
  timeout: 10000,            // Wait up to 10 seconds
  maximumAge: 0              // Don't use cached position
}
```
