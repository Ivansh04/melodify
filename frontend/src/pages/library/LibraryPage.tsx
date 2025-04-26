import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Song } from "@/types";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";

interface Playlist {
  _id: string;
  title: string;
  description: string;
  songs: Song[];
}

const LibraryPage = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [expandedPlaylistId, setExpandedPlaylistId] = useState<string | null>(null);

  const fetchSongs = async () => {
    const res = await axiosInstance.get("/songs");
    setSongs(res.data);
  };

  const fetchPlaylists = async () => {
    const res = await axiosInstance.get("/playlists");
    setPlaylists(res.data);
  };

  const createPlaylist = async () => {
    if (!newTitle.trim()) return;
    const res = await axiosInstance.post("/playlists", {
      title: newTitle,
      description: newDescription,
    });
    setPlaylists((prev) => [...prev, res.data]);
    setNewTitle("");
    setNewDescription("");
  };

  const handleAddSong = async (playlistId: string, songId: string) => {
    try {
      const res = await axiosInstance.post(`/playlists/${playlistId}/songs`, {
        songId,
      });
      setPlaylists((prev) =>
        prev.map((p) => (p._id === playlistId ? res.data : p))
      );
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await axiosInstance.delete(`/playlists/${playlistId}`);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleAddSongs = (playlistId: string) => {
    setExpandedPlaylistId((prev) => (prev === playlistId ? null : playlistId));
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-80px)] bg-zinc-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-white p-6">🎶 Your Playlists</h1>

      {/* Create Playlist */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-6 space-y-3 shadow-md">
        <Input
          placeholder="Playlist Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="bg-zinc-700 border border-zinc-600 text-white placeholder:text-zinc-400"
        />
        <Input
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="bg-zinc-700 border border-zinc-600 text-white placeholder:text-zinc-400"
        />
        <Button onClick={createPlaylist} className="w-full bg-orange-500 hover:bg-orange-600 transition">
          ➕ Create Playlist
        </Button>
      </div>

      {/* All Playlists */}
      {playlists.map((playlist) => (
        <div key={playlist._id} className="bg-zinc-800 p-4 mb-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-xl font-semibold text-white p-6">{playlist.title}</h2>
              <p className="text-sm text-zinc-400">{playlist.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" onClick={() => toggleAddSongs(playlist._id)} variant="ghost">
                {expandedPlaylistId === playlist._id ? <ChevronUp /> : <ChevronDown />}
              </Button>
              <Button size="icon" variant="destructive" onClick={() => handleDeletePlaylist(playlist._id)}>
                <Trash2 />
              </Button>
            </div>
          </div>

          {/* Songs in Playlist */}
          <ul className="space-y-1 text-sm text-zinc-300 mb-2">
            {playlist.songs.length > 0 ? (
              playlist.songs.map((song) => (
                <li
  key={song._id}
  onClick={() => {
    usePlayerStore.getState().setCurrentSong(song);
    usePlayerStore.getState().initializeQueue([song]);
  }}
  className="cursor-pointer text-white hover:text-orange-400 transition duration-200"
>
  🎵 {song.title} - {song.artist}
</li>

              ))
            ) : (
              <li className="italic text-zinc-500">No songs added</li>
            )}
          </ul>

          {/* Add Songs */}
          {expandedPlaylistId === playlist._id && (
            <div className="mt-3 space-y-2 bg-zinc-900 p-4 rounded-md">
              <p className="text-sm text-zinc-400 mb-2">Add songs to this playlist</p>
              {songs.map((song) => (
                <div
                  key={song._id}
                  className="flex justify-between items-center bg-zinc-800 p-2 rounded hover:bg-zinc-700 transition text-sm"
                >
                  <div>🎶 {song.title} - {song.artist}</div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-500"
                    onClick={() => handleAddSong(playlist._id, song._id)}
                  >
                    ➕ Add
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </ScrollArea>
  );
};

export default LibraryPage;
