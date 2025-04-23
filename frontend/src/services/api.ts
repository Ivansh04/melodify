import { axiosInstance } from "@/lib/axios";

export const fetchAllSongs = async () => {
	try {
		const response = await axiosInstance.get("/songs");
		return response.data;
	} catch (error) {
		console.error("Error fetching all songs:", error);
		throw error;
	}
};

export const fetchFeaturedSongs = async () => {
	try {
		const response = await axiosInstance.get("/songs/featured");
		return response.data;
	} catch (error) {
		console.error("Error fetching featured songs:", error);
		throw error;
	}
};

export const fetchMadeForYouSongs = async () => {
	try {
		const response = await axiosInstance.get("/songs/made-for-you");
		return response.data;
	} catch (error) {
		console.error("Error fetching made-for-you songs:", error);
		throw error;
	}
};

export const fetchTrendingSongs = async () => {
	try {
		const response = await axiosInstance.get("/songs/trending");
		return response.data;
	} catch (error) {
		console.error("Error fetching trending songs:", error);
		throw error;
	}
};

// New search function
export const searchAll = async (query: string) => {
	try {
		const response = await axiosInstance.get(`/search?q=${query}`); // Correct API path
		return response.data; // Returns songs, albums, and users
	} catch (error) {
		console.error("Error searching:", error);
		throw error;
	}
};
