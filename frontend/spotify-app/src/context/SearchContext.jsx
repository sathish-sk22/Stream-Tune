import { useState, useContext, useEffect, createContext } from 'react';
import { PlayerContext } from './PlayerContext';

export const SearchContext=createContext();

export const SearchProvider=({children})=>{
    const [searchTerm,setSearchTerm]=useState("");
    const [searchResults,setSearchResults]=useState({songs:[],albums:[]});
    const [isSearching,setIsSearching]=useState(false);
    const { songsData = [], albumData = [] } = useContext(PlayerContext);

    useEffect(()=>{
        if(searchTerm.trim()===""){
            setSearchResults({songs:[],albums:[]});
            return;
        }
        const normalizedSearchTerm = searchTerm.toLowerCase();
        const filteredSongs=songsData.filter((song)=>
            song.name.toLowerCase().includes(normalizedSearchTerm) ||
            song.desc.toLowerCase().includes(normalizedSearchTerm)
        );
        const filteredAlbums=albumData.filter((album)=>
            album.name.toLowerCase().includes(normalizedSearchTerm) ||
            album.desc.toLowerCase().includes(normalizedSearchTerm)
        );
        setSearchResults({songs:filteredSongs,albums:filteredAlbums});
    },[searchTerm,songsData,albumData]);

    const clearSearch=()=>{
        setSearchTerm("");
        setSearchResults({songs:[],albums:[]});
        setIsSearching(false);
    }

    const contextValue={
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        clearSearch
    };

    return(
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch=()=>{
    const context=useContext(SearchContext);
    if(!context){
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
