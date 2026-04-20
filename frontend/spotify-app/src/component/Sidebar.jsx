import { ArrowRight, Home,Library,Search,X,Plus} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSearch } from "../context/SearchContext";

const Sidebar=()=>{
    const [showSearchInput,setShowSearchInput]=useState(false);
    const navigate = useNavigate();
    const {searchTerm,setSearchTerm,setIsSearching,clearSearch}=useSearch();

    const handleSearchClick=()=>{
        setIsSearching(true);
        setShowSearchInput(true);
        navigate('/search');
    } 
    
    const handleSearchChange=(e)=>{
        setSearchTerm(e.target.value);
        if(e.target.value.trim()===""){
            setIsSearching(false);
        }else{
            setIsSearching(true);
        }
    }
    const handleSearchClear=()=>{
        clearSearch();
        setShowSearchInput(false);
        navigate('/');
    }
    return (
        <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
            <div className="bg-[#121212] h-[15%] rounded flex flex-col justify-around">
                <div 
                onClick={()=>navigate('/')}
                className="flex items-center gap-3 pl-8 cursor-pointer transition-colors">
                   <Home className="w-6 h-6"/>
                   <p className="font-bold text-white hover:text-green-400 transition-colors">Home</p>
                </div>
                <div className="px-4 py">
                    {!showSearchInput ? (
                        <div  
                        className="flex items-center gap-3 pl-4 cursor-pointer transition-colors" onClick={handleSearchClick}>
                            <Search className="w-5 h-5"/>
                            <p className="font-bold text-white hover:text-green-400 transition-colors">Search</p>
                        </div>
                    ):(
                        <div className="flex items-center gap-4 pl-4">
                            <Search className="w-5 h-5 text-gray-400"/>
                             <input type="text" placeholder="Search..." className="flex-1 bg-[#2a2a2a] text-white placeholder-gray-400 px-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-400" autoFocus={true} value={searchTerm} onChange={handleSearchChange}/>
                                <button className="p-1 hover:bg-gray-700 rounded-full transition-colors" onClick={handleSearchClear} >
                                    <X className="w-4 h-4 text-gray-400 hover:text-white"/>
                                </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-[#121212] h-[85%] rounded flex flex-col">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Library className="w-8 h-8"/>
                        <p className="font-semibold">Your Library</p>    
                    </div>
                    <div className="flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 cursor-pointer hover:text-green-400 transition-colors"/>
                        <Plus className="w-5 h-5 cursor-pointer hover:text-green-400 transition-colors"/>
                    </div>
                </div>
                <div className="p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4">
                    <h1>Create your first playlist</h1>
                    <p className="font-light">It's easy, we'll help you</p>
                    <button className="cursor-pointer px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:bg-gray-200 transition-colors flex items-center gap-1">
                        Create Playlist
                    </button>
                </div>
                <div className="p-4 bg-[#212424] m-2 rounded font-semibold flex flex-col items-start justify-start pl-4 mt-4">
                    <h1 >Let's find some podcasts to follow</h1>
                    <p className="font-light">Discover new shows and episodes</p>
                    <button className=" cursor-pointer px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4 hover:bg-gray-200 transition-colors flex items-center gap-1"> 
                        Browse Podcasts
                    </button>
                </div>
            </div>
        </div>
    )
}

export { Sidebar as default };
