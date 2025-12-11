-- Migration: Add push notification token fields to users table
-- Run this in your Supabase SQL Editor

-- Add columns for push notification tokens
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS expo_push_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS fcm_web_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS device_platform VARCHAR(20),
ADD COLUMN IF NOT EXISTS last_token_update TIMESTAMP;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_expo_token ON users(expo_push_token) WHERE expo_push_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON users(fcm_web_token) WHERE fcm_web_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.expo_push_token IS 'Expo push notification token for mobile app (iOS/Android)';
COMMENT ON COLUMN users.fcm_web_token IS 'Firebase Cloud Messaging token for web browsers';
COMMENT ON COLUMN users.device_platform IS 'Platform: android, ios, or web';
COMMENT ON COLUMN users.last_token_update IS 'Timestamp of last token registration/update';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('expo_push_token', 'fcm_web_token', 'device_platform', 'last_token_update');
