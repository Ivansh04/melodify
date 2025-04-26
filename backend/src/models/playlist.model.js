// backend/src/models/playlist.model.js
import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: String, required: true }, // ✅ Accept Clerk's user string
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true } // includes createdAt and updatedAt
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
