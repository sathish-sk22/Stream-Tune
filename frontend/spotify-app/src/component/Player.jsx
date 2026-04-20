import { useContext } from "react";
import {
  Shuffle,
  SkipBack,
  Pause,
  Play,
  SkipForward,
  Repeat,
  ListMusic,
  Mic,
  MonitorSpeaker,
  Volume2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { PlayerContext } from "../context/PlayerContext";

const Player = () => {
  const {
    track,
    seekBar,
    seekbg,
    playStatus,
    play,
    pause,
    time,
    previous,
    next,
    seekSong,
  } = useContext(PlayerContext);

  if (!track) return null;

  return (
    <div className="h-[10%] bg-black text-white px-4 flex items-center justify-between border-t border-white/10">
      <div className="w-[25%] flex items-center gap-3 min-w-0">
        <img
          src={track.image}
          alt={track.name}
          className="w-14 h-14 object-cover rounded"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{track.name}</p>
          <p className="text-sm text-gray-300 truncate">{track.desc}</p>
        </div>
      </div>

      <div className="w-[50%] flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-5 text-gray-300">
          <Shuffle className="w-4 h-4 cursor-pointer hover:text-white" />
          <SkipBack
            onClick={previous}
            className="w-4 h-4 cursor-pointer hover:text-white"
          />
          {playStatus ? (
            <Pause
              onClick={pause}
              className="w-5 h-5 cursor-pointer text-white"
            />
          ) : (
            <Play
              onClick={play}
              className="w-5 h-5 cursor-pointer text-white"
            />
          )}
          <SkipForward
            onClick={next}
            className="w-4 h-4 cursor-pointer hover:text-white"
          />
          <Repeat className="w-4 h-4 cursor-pointer hover:text-white" />
        </div>

        <div className="w-full flex items-center gap-3 text-sm text-gray-300">
          <p className="w-10 text-right">
            {time.currentTime.minute}:{String(time.currentTime.second).padStart(2, "0")}
          </p>

          <div
            ref={seekbg}
            onClick={seekSong}
            className="flex-1 h-1 bg-gray-500/60 rounded-full cursor-pointer"
          >
            <hr
              ref={seekBar}
              className="h-1 border-none w-0 bg-white rounded-full"
            />
          </div>

          <p className="w-10">
            {track.duration || "3:23"}
          </p>
        </div>
      </div>

      <div className="w-[25%] hidden lg:flex items-center justify-end gap-3 text-gray-300">
        <ListMusic className="w-4 h-4 cursor-pointer hover:text-white" />
        <Mic className="w-4 h-4 cursor-pointer hover:text-white" />
        <MonitorSpeaker className="w-4 h-4 cursor-pointer hover:text-white" />
        <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
        <Minimize2 className="w-4 h-4 cursor-pointer hover:text-white" />
        <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};

export default Player;
