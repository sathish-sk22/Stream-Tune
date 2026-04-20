import { useEffect, useState } from "react";
import { FileText, Image, Palette, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { albumsAPI } from "../Service/ApiService";
import Dashboard from "../context/layout/Dashboard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

const getAlbumId = (album) => album.id || album._id || album.albumId;

const getAlbumImageSrc = (album) => {
  const rawImage =
    album.image ||
    album.imageUrl ||
    album.cover ||
    album.coverImage ||
    album.thumbnail ||
    album.fileName ||
    album.filePath;

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

const getLastUpdatedLabel = (albums, fetchedAt) => {
  const timestamps = albums
    .map((album) => album.updatedAt || album.createdAt)
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

const ListAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await albumsAPI.list();
      setAlbums(response.data?.albums || []);
      setLastFetchedAt(new Date());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (album) => {
    const albumId = getAlbumId(album);

    if (!albumId) {
      toast.error("Album id not found");
      return;
    }

    try {
      setDeletingId(albumId);
      await albumsAPI.remove(albumId);
      setAlbums((currentAlbums) =>
        currentAlbums.filter((currentAlbum) => getAlbumId(currentAlbum) !== albumId)
      );
      setLastFetchedAt(new Date());
      toast.success("Album deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete album");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <Dashboard activeMenu="List Album">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Albums Library</h1>
          <p className="text-gray-600">Manage your album collection</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-12 items-center gap-4 bg-gradient-to-r from-[#30db5b] to-[#28d44f] px-6 py-5 text-sm font-semibold text-white">
            <div className="col-span-2 flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Cover</span>
            </div>
            <div className="col-span-3">Album Name</div>
            <div className="col-span-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Theme</span>
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {loading ? (
            <div className="grid min-h-[280px] place-items-center px-6 py-12">
              <div className="h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-green-500" />
            </div>
          ) : albums.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Image className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <p className="text-lg font-semibold text-gray-700">No albums found</p>
              <p className="mt-1 text-sm text-gray-500">Add some albums to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {albums.map((album) => {
                const albumId = getAlbumId(album);
                const imageSrc = getAlbumImageSrc(album);
                const themeColor = album.bgColor || album.color || "#121212";

                return (
                  <div
                    key={albumId || album.name}
                    className="grid grid-cols-12 items-center gap-4 px-6 py-5 text-sm text-gray-700 transition-colors hover:bg-gray-50/70"
                  >
                    <div className="col-span-2">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={album.name || "Album cover"}
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
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>

                    <div className="col-span-3">
                      <p className="font-semibold text-gray-900">
                        {album.name || "Untitled album"}
                      </p>
                    </div>

                    <div className="col-span-3">
                      <p className="text-gray-600">
                        {album.desc || album.description || "No description provided"}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <div className="inline-flex items-center gap-3">
                        <span
                          className="h-7 w-7 rounded-full border-2 border-white shadow-[0_3px_10px_rgba(15,23,42,0.2)]"
                          style={{ backgroundColor: themeColor }}
                        />
                        <span className="font-medium text-gray-500">{themeColor}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(album)}
                        disabled={deletingId === albumId}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={`Delete ${album.name || "album"}`}
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
            Total Albums:
            <span className="ml-1 font-semibold text-gray-900">{albums.length}</span>
          </p>
          <p>
            Last updated:
            <span className="ml-1 font-semibold text-gray-900">
              {getLastUpdatedLabel(albums, lastFetchedAt)}
            </span>
          </p>
        </div>
      </div>
    </Dashboard>
  );
};

export { ListAlbum as default };
