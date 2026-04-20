import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import AlbumItem from "./AlbumItem";
import SongItem from "./SongItem";

const DisplayHome=()=>{
    const { songsData, albumData } = useContext(PlayerContext);
    
    return (
        <>
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl">Featured Charts</h1>
                <div className="flex overflow-auto">
                    {albumData.map((item,index) => (
                        <AlbumItem key={index} 
                            name={item.name}
                            desc={item.desc}
                            id={item._id}
                            image={item.imageUrl}
                        />
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl">Recently Played</h1>
                <div className="flex overflow-auto">
                    {songsData.map((item,index) => (
                        <SongItem key={index} 
                            name={item.name}
                            desc={item.desc}
                            id={item._id}
                            image={item.image}

                        />
                    ))}
                </div>
            </div>
        </>
    )
}

export { DisplayHome as default };