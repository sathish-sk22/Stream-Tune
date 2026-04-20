import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar=()=>{
    const {user}=useAuth();
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate(-1);
    };

    const handleForward = () => {
        navigate(1);
    };
    
    return (
        <>
            <div className="w-full flex justify-between items-center font-semifold">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black p-2 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center" onClick={handleBack}>
                        <ChevronLeft className="w-4 h-4 text-white"/>
                    </div>
                    <div className="w-8 h-8 bg-black p-2 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center" onClick={handleForward}>
                        <ChevronRight className="w-4 h-4 text-white"/>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer hover:bg-gray-200 transition-colors">
                        Explore Premium
                    </p>
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-2xl">
                        <User className="w-4 h-4 text-white"/>
                        <span className="text-white text-sm hidden sm:inline">
                            {user?.email?.split("@")[0] || "User"}
                        </span>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 py-1 px-3 rounded-2xl text-[15px] cursor-pointer transition-colors" onClick={()=>{           
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.reload();
                    }}>
                        Logout
                    </button>
                </div> 
            </div>
        </>
    )
}
export { Navbar as default };
