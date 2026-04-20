import { useSearch } from "../context/SearchContext";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";
import {SearchIcon} from "lucide-react";

const Search = () => {
    const {searchTerm,searchResults,isSearching} = useSearch();
    const {songs,albums} = searchResults;
    const totalResults = songs.length + albums.length;

    if(!isSearching){
        return(
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <SearchIcon className="w-16 h-16 text-gray-400 mb-4"/>
                <h2 className="text-2xl font-bold text-white mb-2">Search for music</h2>
                <p className="text-gray-400">Find your favourite songs</p>
            </div>
        )
    }

    if(searchTerm.trim()===""){
        return(
             <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <SearchIcon className="w-16 h-16 text-gray-400 mb-4"/>
                <h2 className="text-2xl font-bold text-white mb-2">Start typing for songs</h2>
                <p className="text-gray-400">Find your favourite songs</p>
            </div>
        )
    }

    if(totalResults===0){
        return(
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <SearchIcon className="w-16 h-16 text-gray-400 mb-4"/>
                <h2 className="text-2xl font-bold text-white mb-2">NO results Found</h2>
                <p className="text-gray-400">Try searching for something else</p>
            </div>
        )
    }

    return(
        <div className="space-y-8 py-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
                {searchTerm.trim() === "" ? (
                    <p className="text-gray-400">Find your Albums and Songs Here...</p>
                ) : (
                    <p className="text-gray-400">{totalResults} results for "{searchTerm}"</p>
                )}
            </div>

            {searchTerm.trim() !== "" && totalResults === 0 && (
                <div className="rounded-xl border border-gray-800 bg-[#181818] p-6 text-gray-300">
                    No songs or albums matched "{searchTerm}".
                </div>
            )}

            {albums.length > 0 && (
                <section>
                    <h2 className="mb-4 text-2xl font-bold text-white">Albums</h2>
                    <div className="flex flex-wrap gap-4">
                        {albums.map((album) => (
                            <AlbumItem
                                key={album._id}
                                id={album._id}
                                image={album.imageUrl}
                                name={album.name}
                                desc={album.desc}
                            />
                        ))}
                    </div>
                </section>
            )}

            {songs.length > 0 && (
                <section>
                    <h2 className="mb-4 text-2xl font-bold text-white">Songs</h2>
                    <div className="flex flex-wrap gap-4">
                        {songs.map((song) => (
                            <SongItem
                                key={song._id}
                                id={song._id}
                                image={song.image}
                                name={song.name}
                                desc={song.desc}
                            />
                        ))}
                    </div>
                </section>
            )}

           
        </div>
    )
}

export { Search as default };
