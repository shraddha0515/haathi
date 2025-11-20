import express from "express";
import { getElephants } from "../controllers/elephantController.js";

const router = express.Router();

router.get("/", getElephants);

export default router;
