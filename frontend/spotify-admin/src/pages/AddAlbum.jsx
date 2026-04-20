import { useEffect, useState } from "react";
import { Image } from "lucide-react";
import toast from "react-hot-toast";
import { albumsAPI } from "../Service/ApiService";
import Dashboard from "../context/layout/Dashboard";

const AddAlbum = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [color, setColor] = useState("#121212");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
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
      toast.error("Please select an album image");
      return;
    }

    if (!name.trim() || !desc.trim() || !color.trim()) {
      toast.error("Please fill all album details");
      return;
    }

    const formData = new FormData();
    const request = {
      name: name.trim(),
      desc: desc.trim(),
      bgColor: color.trim(),
    };

    formData.append(
      "request",
      new Blob([JSON.stringify(request)], { type: "application/json" })
    );
    formData.append("file", image);

    try {
      setLoading(true);
      const response = await albumsAPI.add(formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Album added successfully");
        setImage(null);
        setName("");
        setDesc("");
        setColor("#121212");
        return;
      }

      toast.error("Something went wrong while adding album");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add album");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dashboard activeMenu="Add Album">
      {loading ? (
        <div className="grid min-h-[80vh] place-items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-green-600" />
        </div>
      ) : (
        <form
          onSubmit={onSubmitHandler}
          className="mt-5 flex max-w-xl flex-col items-start gap-6 text-gray-600"
        >
          <div className="flex flex-col gap-4">
            <p className="text-base font-medium text-gray-700">Upload Image</p>
            <input
              type="file"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
              accept="image/*"
              id="album-image"
              hidden
            />
            <label
              htmlFor="album-image"
              className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-400 transition-colors hover:border-green-400"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Album preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image className="h-10 w-10 text-gray-500" />
              )}
            </label>
          </div>

          <div className="w-full">
            <label htmlFor="album-name" className="mb-2 block text-sm font-medium text-gray-700">
              Album Name
            </label>
            <input
              id="album-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Type here"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label htmlFor="album-description" className="mb-2 block text-sm font-medium text-gray-700">
              Album Description
            </label>
            <textarea
              id="album-description"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="Write content here"
              rows="4"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label htmlFor="album-color" className="mb-2 block text-sm font-medium text-gray-700">
              Background Colour
            </label>
            <div className="flex items-center gap-4">
              <input
                id="album-color"
                type="color"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                className="h-14 w-20 cursor-pointer rounded border border-gray-300 bg-white p-1"
              />
              <input
                type="text"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                placeholder="#121212"
                className="w-40 rounded-md border border-gray-300 px-4 py-3 uppercase outline-none focus:border-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-md bg-green-600 px-8 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Add Album
          </button>
        </form>
      )}
    </Dashboard>
  );
};

export { AddAlbum as default };
