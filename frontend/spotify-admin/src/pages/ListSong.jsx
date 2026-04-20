import { useEffect, useState } from "react";
import { Clock, FileText, Image, Music, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { songsAPI } from "../Service/ApiService";
import Dashboard from "../context/layout/Dashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

const getSongId = (song) => song.id || song._id || song.songId;

const getSongImageSrc = (song) => {
  const rawImage =
    song.image ||
    song.imageUrl ||
    song.cover ||
    song.coverImage ||
    song.thumbnail ||
    song.fileName ||
    song.filePath;

  if (!rawImage || typeof rawImage !== "string") {
    return "";
  }

  if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
    return rawImage;
  }

  if (rawImage.startsWith("/")) {
    return `${API_BASE_URL}${rawImage}`;
  }

  return `${API_BASE_URL}/${rawImage}`;
};

const getAlbumName = (song) => {
  if (typeof song.album === "string") {
    return song.album;
  }

  return song.album?.name || song.albumName || "No album";
};

const formatDuration = (song) => {
  const rawDuration = song.duration || song.durationInSeconds || song.length;

  if (rawDuration === undefined || rawDuration === null || rawDuration === "") {
    return "N/A";
  }

  if (typeof rawDuration === "string" && rawDuration.includes(":")) {
    return rawDuration;
  }

  const totalSeconds = Number(rawDuration);

  if (Number.isNaN(totalSeconds)) {
    return String(rawDuration);
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const getLastUpdatedLabel = (songs, fetchedAt) => {
  const timestamps = songs
    .map((song) => song.updatedAt || song.createdAt)
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());

  const latestDate = timestamps[0] || fetchedAt;

  if (!latestDate) {
    return "Not available";
  }

  const now = Date.now();
  const diffMinutes = Math.floor((now - latestDate.getTime()) / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)} hr ago`;
  }

  return latestDate.toLocaleString();
};

const ListSong = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await songsAPI.list();
      setSongs(response.data?.songs || []);
      setLastFetchedAt(new Date());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (song) => {
    const songId = getSongId(song);

    if (!songId) {
      toast.error("Song id not found");
      return;
    }

    try {
      setDeletingId(songId);
      await songsAPI.remove(songId);
      setSongs((currentSongs) =>
        currentSongs.filter((currentSong) => getSongId(currentSong) !== songId)
      );
      setLastFetchedAt(new Date());
      toast.success("Song deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete song");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <Dashboard activeMenu="List Songs">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Songs Library</h1>
          <p className="text-gray-600">Manage your Songs collection</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-12 items-center gap-4 bg-gradient-to-r from-[#30db5b] to-[#28d44f] px-6 py-5 text-sm font-semibold text-white">
            <div className="col-span-2 flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Cover</span>
            </div>
            <div className="col-span-3">Song Name</div>
            <div className="col-span-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Album</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Duration</span>
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {loading ? (
            <div className="grid min-h-[280px] place-items-center px-6 py-12">
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
            </div>
          ) : songs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Music className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-semibold text-gray-700">No songs found</p>
              <p className="mt-1 text-sm text-gray-500">Add some songs to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {songs.map((song) => {
                const songId = getSongId(song);
                const imageSrc = getSongImageSrc(song);

                return (
                  <div
                    key={songId || song.name}
                    className="grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm text-gray-700 transition-colors hover:bg-gray-50/70"
                  >
                    <div className="col-span-2">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={song.name || "Song cover"}
                          className="h-14 w-14 rounded-xl object-cover shadow-md"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                            const placeholder = event.currentTarget.nextElementSibling;

                            if (placeholder) {
                              placeholder.classList.remove("hidden");
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`${
                          imageSrc ? "hidden" : "flex"
                        } h-14 w-14 items-center justify-center rounded-xl bg-gray-100`}
                      >
                        <Music className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>

                    <div className="col-span-3">
                      <p className="font-semibold text-gray-900">
                        {song.name || "Untitled song"}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <p className="text-gray-600">{getAlbumName(song)}</p>
                    </div>

                    <div className="col-span-2">
                      <span className="font-medium text-gray-500">{formatDuration(song)}</span>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(song)}
                        disabled={deletingId === songId}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete ${song.name || "song"}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white px-6 py-4 text-sm text-gray-600 shadow-[0_14px_35px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Total Songs:
            <span className="ml-1 font-semibold text-gray-900">{songs.length}</span>
          </p>
          <p>
            Last updated:
            <span className="ml-1 font-semibold text-gray-900">
              {getLastUpdatedLabel(songs, lastFetchedAt)}
            </span>
          </p>
        </div>
      </div>
    </Dashboard>
  );
};

export { ListSong as default };
