import { useNavigate } from "react-router-dom";
const AlbumItem=({image,name,desc,id})=>{
        const navigate=useNavigate();
        return (
            <div className="min-w-[160px] max-w-[160px] p-2 rounded cursor-pointer hover:bg-[#ffffff26] transition-colors" onClick={()=>navigate(`/album/${id}`)}>
                <img src={image} alt={name} className="w-full h-40 object-cover rounded" />
                <p className="font-bold mt-2 mb-1">{name}</p>
                <p className="text-slate-200 text-sm line-clamp-2">{desc}</p>
            </div>
        )
}

export { AlbumItem as default };
