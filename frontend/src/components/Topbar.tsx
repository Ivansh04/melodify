import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import SearchBar from "../components/searchbar";
import { searchAll } from "@/services/api";
import { useState } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore"; // ✅ Import player store

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	const navigate = useNavigate(); // ✅ Navigation for albums
	const { setCurrentSong, initializeQueue } = usePlayerStore(); // ✅ Use player store

	const [searchResults, setSearchResults] = useState<{ songs: any[]; albums: any[] }>({
		songs: [],
		albums: [],
	});

	const handleSearch = async (query: string) => {
		if (!query.trim()) return;
		try {
			const results = await searchAll(query);
			setSearchResults({
				songs: results.songs || [],
				albums: results.albums || [],
			});
		} catch (error) {
			console.error("Search error:", error);
		}
	};

	// ✅ Handle clicking a song to play it
	const handleSongClick = (song: any) => {
		setCurrentSong(song);
		initializeQueue([song]); // Set queue to just this song
	};

	// ✅ Handle clicking an album to navigate
	const handleAlbumClick = (albumId: string) => {
		navigate(`/albums/${albumId}`);
	};

	return (
		<div className='flex flex-col items-center p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10 w-full'>
			<div className='flex w-full justify-between items-center'>
				<div className='flex gap-2 items-center'>
					<img src='/spotify.png' className='size-8' alt='Spotify logo' />
					Melodify
				</div>

				{/* Search Bar */}
				<SearchBar onSearch={handleSearch} />

				<div className='flex items-center gap-4'>
					{isAdmin && (
						<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
							<LayoutDashboardIcon className='size-4 mr-2' />
							Admin Dashboard
						</Link>
					)}

					<SignedOut>
						<SignInOAuthButtons />
					</SignedOut>

					<UserButton />
				</div>
			</div>

			{/* Display Search Results */}
			{(searchResults.songs.length > 0 || searchResults.albums.length > 0) && (
				<div className='w-full bg-zinc-800 p-2 rounded-md mt-2'>
					<h3 className='text-white text-sm mb-2'>Search Results:</h3>
					<ul className='space-y-1'>
						{/* Songs */}
						{searchResults.songs.map((song) => (
							<li
								key={song._id}
								className='text-white text-xs p-1 hover:bg-zinc-700 rounded-md cursor-pointer'
								onClick={() => handleSongClick(song)} // ✅ Click to play
							>
								🎵 {song.title} - {song.artist}
							</li>
						))}

						{/* Albums */}
						{searchResults.albums.map((album) => (
							<li
								key={album._id}
								className='text-white text-xs p-1 hover:bg-zinc-700 rounded-md cursor-pointer'
								onClick={() => handleAlbumClick(album._id)} // ✅ Click to navigate
							>
								📀 {album.title} (Album)
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Topbar;
