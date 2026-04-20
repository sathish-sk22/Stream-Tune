import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Register from "./Register";

const AuthWrapper=({children})=>{
    const {isAuthenticated,loading}=useAuth();
    const [showRegister,setShowRegister]=useState(false);

    if(loading){
        return(
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center">
                <div className="text-center text-white text-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4">
                        <p className="text-white">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    if(!isAuthenticated()){
        return showRegister ? (
            <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
            <Login onSwitchToRegister={() => setShowRegister(true)} />
        );
    }
    return(
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900">
            {children}
        </div>
    )
}

export default AuthWrapper;