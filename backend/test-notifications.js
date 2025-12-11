#!/usr/bin/env node

/**
 * Test script for unified notification system
 * Run with: node test-notifications.js
 */

import notificationService from "./src/services/notificationService.js";

console.log("🧪 Testing Unified Notification System\n");

// Test data
const testUsers = [
  {
    id: 1,
    name: "Web User",
    email: "web@test.com",
    fcm_web_token: "test-fcm-token-123",
    expo_push_token: null,
  },
  {
    id: 2,
    name: "Mobile User",
    email: "mobile@test.com",
    fcm_web_token: null,
    expo_push_token: "ExponentPushToken[test-123]",
  },
  {
    id: 3,
    name: "Both Platforms User",
    email: "both@test.com",
    fcm_web_token: "test-fcm-token-456",
    expo_push_token: "ExponentPushToken[test-456]",
  },
];

const elephantData = {
  latitude: 21.1458,
  longitude: 79.0882,
  source_device: "TEST-DEVICE-001",
  detected_at: new Date().toISOString(),
  confidence: 0.95,
};

console.log("📤 Sending test elephant alert...\n");
console.log("Test Users:", testUsers.length);
console.log("  - Web only: 1");
console.log("  - Mobile only: 1");
console.log("  - Both platforms: 1\n");

console.log("Elephant Data:");
console.log(`  Location: ${elephantData.latitude}, ${elephantData.longitude}`);
console.log(`  Device: ${elephantData.source_device}`);
console.log(`  Confidence: ${elephantData.confidence}\n`);

// Test the notification service
try {
  const results = await notificationService.sendElephantAlert(
    testUsers,
    elephantData
  );

  console.log("\n📊 Test Results:\n");
  console.log("Web Notifications:");
  console.log(`  ✅ Sent: ${results.web.sent}`);
  console.log(`  ❌ Failed: ${results.web.failed}`);

  console.log("\nMobile Notifications:");
  console.log(`  ✅ Sent: ${results.mobile.sent}`);
  console.log(`  ❌ Failed: ${results.mobile.failed}`);

  console.log(`\n📈 Total: ${results.totalSent} users notified\n`);

  if (results.web.error) {
    console.log("⚠️  Web Error:", results.web.error);
  }

  if (results.mobile.error) {
    console.log("⚠️  Mobile Error:", results.mobile.error);
  }

  console.log("\n✅ Test completed!\n");

  if (!results.web.sent && !results.mobile.sent) {
    console.log("⚠️  No notifications were sent. This is expected if:");
    console.log("   - Firebase service account key is not configured (web)");
    console.log("   - Test tokens are invalid (mobile)\n");
  }
} catch (error) {
  console.error("\n❌ Test failed:", error.message);
  console.error(error.stack);
}

console.log("💡 Tips:");
console.log("   - Add serviceAccountKey.json for web notifications");
console.log("   - Use real Expo tokens for mobile testing");
console.log("   - Check backend logs for detailed information\n");
