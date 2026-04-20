import { Route, Routes, useLocation} from "react-router-dom";
import DisplayAlbum from "./DisplayAlbum";
import DisplayHome from "./DisplayHome";
import Search from "./Search";
import Navbar from "./Navbar";
import { use, useContext } from "react";
import { useEffect, useRef } from "react";
import { PlayerContext } from "../context/PlayerContext";

const Display=()=>{
    const {  albumData } = useContext(PlayerContext);
    const location = useLocation();
    const displayRef=useRef();
    const isAlbum = location.pathname.includes("album");
    const albumId=isAlbum ? location.pathname.split("/").pop() : null;
    const album = isAlbum ? albumData.find(album => album._id === albumId) : null;
    const bgcolor= album ? album.bgColor : '#121212';
    useEffect(()=>{
        if(isAlbum && album){
            displayRef.current.style.backgroundColor=`linear-gradient(${bgcolor}, #121212)`;
        }else{
            displayRef.current.style.backgroundColor='#121212';
        }
    }, [isAlbum, album, bgcolor]);

    return(
       <div ref={displayRef} className="w-[100%] m-2 bg-[#121212] text-white lg:w-[75%] lg:ml-0 flex flex-col">
         <div  className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800/50 px-6 pt-4 pb-2">
         <Navbar/>
        
        </div>
         <div className="flex-1 px-6 pb-4 overflow-auto">
            <Routes>
                <Route path="/" element={<DisplayHome/>} />
                <Route path="/album/:id" element={<DisplayAlbum album={albumData.find(album => album._id === albumId)}/>}/>
                <Route path="/search" element={<Search/>}/>
            </Routes> 
            </div>
       </div>
    )
}

export default Display;