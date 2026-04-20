import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import assets from '../assets/assets';
import { Clock } from 'lucide-react';

const DisplayAlbum = ({album}) => {
   
    useParams();
   
    const { songsData, track, playWithId } = useContext(PlayerContext);
    const albumSongs = songsData.filter((song) => song.album === album.name);
    const totalDurationInSeconds = albumSongs.reduce((total, song) => {
        const [minutes = "0", seconds = "0"] = (song.duration || "0:00").split(":");
        return total + (Number(minutes) * 60) + Number(seconds);
    }, 0);
    const totalMinutes = Math.floor(totalDurationInSeconds / 60);
    const remainingSeconds = totalDurationInSeconds % 60;
    const totalDurationLabel = totalMinutes > 0
        ? `${totalMinutes} min ${remainingSeconds > 0 ? `${remainingSeconds} sec` : ""}`.trim()
        : `${remainingSeconds} sec`;

    
    return album ? (
        <>
            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
                <img src={album.imageUrl} alt={album.name} className="w-48 h-64 rounded" />
                <div className="flex flex-col">
                    <p>Playlist</p>
                    <h2 className="text-5xl font-bold mb-4 md:text-7xl">{album.name}</h2>
                    <h4>{album.desc}</h4>
                    <p className="mt-1">
                        <img src={assets.logo} alt="logo" className="w-6 h-6 inline-block mr-1" />
                        <b>Spotify</b> . 1,234,567 likes . <b>{albumSongs.length} songs</b>, {totalDurationLabel}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                <p className="">
                    <b className="mr-4">#</b>
                </p>
                <p>Title</p>
                <p className="hidden sm:block">Date Added</p>
                <Clock className="m-auto w-4"></Clock>
            </div>
            <hr />
            {albumSongs.map((song, index) => (
                <div
                    key={song._id}
                    onClick={() => playWithId(song._id)}
                    className={`grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4 mb-4 pl-2 items-center rounded cursor-pointer transition-colors ${
                        track?._id === song._id ? "bg-gray-800/80 text-green-400" : "hover:bg-gray-800"
                    }`}
                >
                    <p className="text-white">
                        <b className='mr-4 text-[#a7a7a7]'>{index+1}</b>
                        <img src={song.image} alt={song.name} className="inline w-10 mr-5" />
                        {song.name}
                    </p>
                    <p className="text-[15px]">{album.name}</p>
                    <p className="text-[15px] hidden sm:block">5 days ago</p>
                    <p>{song.duration || '3:45'}</p>
                </div>
            ))}
        </>
    ) : null;
}

export { DisplayAlbum as default };
