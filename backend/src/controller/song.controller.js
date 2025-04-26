import { Song } from "../models/song.model.js";

// ✅ Get all songs
export const getAllSongs = async (req, res, next) => {
	try {
		const songs = await Song.find().sort({ createdAt: -1 });
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// ✅ Get featured songs
export const getFeaturedSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 6 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// ✅ Get personalized songs
export const getMadeForYouSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// ✅ Get trending songs
export const getTrendingSongs = async (req, res, next) => {
	try {
		const songs = await Song.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					title: 1,
					artist: 1,
					imageUrl: 1,
					audioUrl: 1,
				},
			},
		]);
		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// ✅ Search Songs
export const searchSongs = async (req, res, next) => {
	try {
		const { query } = req.query;
		if (!query) {
			return res.status(400).json({ message: "Query parameter is required" });
		}

		const songs = await Song.find({
			$or: [
				{ title: { $regex: query, $options: "i" } },
				{ artist: { $regex: query, $options: "i" } },
			],
		});

		res.json(songs);
	} catch (error) {
		next(error);
	}
};

// ✅ Get full song by ID (with lyrics)
export const getSongById = async (req, res, next) => {
	try {
		const song = await Song.findById(req.params.id);
		if (!song) return res.status(404).json({ message: "Song not found" });
		res.json(song);
	} catch (error) {
		next(error);
	}
};

// ✅ Get only lyrics by song ID
export const getLyricsBySongId = async (req, res, next) => {
	try {
	  const { songId } = req.params;
	  const song = await Song.findById(songId);
	  if (!song) {
		return res.status(404).json({ message: "Song not found" });
	  }
	  res.json({ lyrics: song.lyrics || [] });
	} catch (error) {
	  next(error);
	}
  };