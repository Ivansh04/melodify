import express from "express";
import { Song } from "../models/song.model.js"; // ✅ FIXED
import { Album } from "../models/album.model.js"; // ✅ FIXED
import { User } from "../models/user.model.js"; // (Check user.model.js if needed)

const router = express.Router();

// Search route: Finds songs, albums, and users
router.get("/", async (req, res) => {
	try {
		const query = req.query.q;
		if (!query) {
			return res.status(400).json({ message: "Search query is required" });
		}

		// Case-insensitive regex search
		const regex = new RegExp(query, "i");

		// Fetch matching songs, albums, and users
		const songs = await Song.find({ title: regex }).limit(10);
		const albums = await Album.find({ title: regex }).limit(10);
		const users = await User.find({ username: regex }).limit(10);

		res.json({ songs, albums, users });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;
