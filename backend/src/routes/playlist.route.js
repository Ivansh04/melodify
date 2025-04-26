// backend/src/routes/playlist.route.js
import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute); // All routes require login

// Playlist CRUD
router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.delete("/:playlistId", deletePlaylist);

// Playlist song management
router.post("/:playlistId/songs", addSongToPlaylist); // ✅ correct route
router.post("/remove-song", removeSongFromPlaylist);  // optional cleanup

export default router;
