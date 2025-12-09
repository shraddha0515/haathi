import express from "express";
console.log("Express imported successfully");

import dotenv from "dotenv";
console.log("Dotenv imported successfully");

dotenv.config();
console.log("Dotenv configured");

import db from "./src/config/db.js";
console.log("DB imported successfully");

import authRoutes from "./src/routes/auth.js";
console.log("Auth routes imported");

import userRoutes from "./src/routes/users.js";
console.log("User routes imported");

console.log("All imports successful!");
process.exit(0);
