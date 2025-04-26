import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";

// Create a new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const playlist = await Playlist.create({ title, description, userId, songs: [] });
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Playlist creation error:", error);
    next(error);
  }
};

// Get all playlists of current user
export const getUserPlaylists = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const playlists = await Playlist.find({ userId }).populate("songs");
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

// Add a song to a playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const { playlistId } = req.params;

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $addToSet: { songs: songId } },
      { new: true }
    ).populate("songs");

    res.json(updatedPlaylist);
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    next(error);
  }
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: songId } },
      { new: true }
    ).populate("songs");

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const userId = req.auth.userId;

    await Playlist.findOneAndDelete({ _id: playlistId, userId });
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    next(error);
  }
};
