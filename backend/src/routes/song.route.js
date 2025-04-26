// backend/src/routes/song.route.js
import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeForYouSongs,
  getTrendingSongs,
  searchSongs,
  getLyricsBySongId,
  getSongById,
} from "../controller/song.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; // ✅ Only protectRoute now

const router = Router();

// ✅ Removed requireAdmin – now all authenticated users can access all songs
router.get("/", protectRoute, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/:songId/lyrics", getLyricsBySongId);
router.get("/:id", getSongById);

export default router;
