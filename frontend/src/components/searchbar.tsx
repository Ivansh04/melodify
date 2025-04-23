import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	const [query, setQuery] = useState("");

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
		onSearch(e.target.value);
	};

	return (
		<div className='relative w-[250px] sm:w-[300px] md:w-[350px]'>
			{/* Search Input */}
			<div className='relative'>
				<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
				<input
					type='text'
					value={query}
					onChange={handleSearch}
					placeholder='Search for songs, albums...'
					className='w-full pl-10 pr-4 py-2 bg-zinc-800/50 backdrop-blur-md text-white rounded-full border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-400 transition-all'
				/>
			</div>
		</div>
	);
};

export default SearchBar;
