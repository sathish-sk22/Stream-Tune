import { useEffect, useState } from "react";
import { FileAudio, Image } from "lucide-react";
import toast from "react-hot-toast";
import { songsAPI } from "../Service/ApiService";
import Dashboard from "../context/layout/Dashboard";

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      setImagePreview("");
      return undefined;
    }

    const previewUrl = URL.createObjectURL(image);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [image]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please select a song image");
      return;
    }

    if (!audio) {
      toast.error("Please select an audio file");
      return;
    }

    if (!name.trim() || !desc.trim() || !album.trim()) {
      toast.error("Please fill all song details");
      return;
    }

    const formData = new FormData();
    const request = {
      name: name.trim(),
      desc: desc.trim(),
      album: album.trim(),
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    formData.append("audio", audio);
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await songsAPI.add(formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Song added successfully");
        setImage(null);
        setAudio(null);
        setName("");
        setDesc("");
        setAlbum("");
        return;
      }

      toast.error("Something went wrong while adding song");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add song");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard activeMenu="Add Song">
      {loading ? (
        <div className="grid min-h-[80vh] place-items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
        </div>
      ) : (
        <form
          onSubmit={onSubmitHandler}
          className="mt-5 flex max-w-xl flex-col items-start gap-6 text-gray-600"
        >
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-gray-700">Upload Image</p>
              <input
                type="file"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
                accept="image/*"
                id="song-image"
                hidden
              />
              <label
                htmlFor="song-image"
                className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-400 transition-colors hover:border-green-400"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Song preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Image className="h-10 w-10 text-gray-500" />
                )}
              </label>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-gray-700">Upload Audio</p>
              <input
                type="file"
                onChange={(event) => setAudio(event.target.files?.[0] || null)}
                accept="audio/*"
                id="song-audio"
                hidden
              />
              <label
                htmlFor="song-audio"
                className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400 transition-colors hover:border-green-400"
              >
                <FileAudio className="h-10 w-10 text-gray-500" />
              </label>
              {audio ? <p className="max-w-36 text-sm text-gray-500">{audio.name}</p> : null}
            </div>
          </div>

          <div className="w-full">
            <label htmlFor="song-name" className="mb-2 block text-sm font-medium text-gray-700">
              Song Name
            </label>
            <input
              id="song-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Type here"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="song-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Song Description
            </label>
            <textarea
              id="song-description"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="Write content here"
              rows="4"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="song-album"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Album Name
            </label>
            <input
              id="song-album"
              type="text"
              value={album}
              onChange={(event) => setAlbum(event.target.value)}
              placeholder="Type here"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Add Song
          </button>
        </form>
      )}
    </Dashboard>
  );
};

export { AddSong as default };
