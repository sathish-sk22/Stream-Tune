import { useContext } from "react";
import { Pause, Play } from "lucide-react";
import { PlayerContext } from "../context/PlayerContext";
import { API_BASE_URL } from "../context/AuthContext";

const getSongImageSrc = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/${image}`;
};

const SongItem = ({ image, name, desc, id }) => {
  const { playWithId, track, playStatus, pause } = useContext(PlayerContext);

  const isActiveSong = track?._id === id;
  const imageSrc = getSongImageSrc(image);

  const handlePlaySong = () => {
    if (!id) {
      return;
    }

    playWithId(id);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();

    if (isActiveSong && playStatus) {
      pause();
      return;
    }

    handlePlaySong();
  };

  return (
    <div
      className="group min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] transition-colors"
      onClick={handlePlaySong}
    >
      <div className="relative mb-2">
        <img
          src={imageSrc}
          alt={name}
          className="h-32 w-full rounded object-cover"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-green-500 text-black opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105"
          aria-label={isActiveSong && playStatus ? `Pause ${name}` : `Play ${name}`}
        >
          {isActiveSong && playStatus ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          )}
        </button>
      </div>

      <p className="mb-1 font-bold">{name}</p>
      <p className="text-sm text-slate-200 line-clamp-2">{desc}</p>
    </div>
  );
};

export { SongItem as default };
