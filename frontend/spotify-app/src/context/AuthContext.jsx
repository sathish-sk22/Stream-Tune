import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();
export const API_BASE_URL = import.meta.env.VITE_API_URL ;

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { useAuth };

export const AuthProvider = ({ children }) => {
   

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const register= async (email,password)=>{
        try{
           const response=await axios.post(`${API_BASE_URL}/api/auth/register`,{email,password});
           const success = response.status >= 200 && response.status < 300;
           return{
               success,
               message: response.data?.message || (success ? 'Registration successful' : 'Registration failed')
           };
        }catch(error){
            return {
                success:false,
                message:error.response?.data?.message || 'Network error please try again later'
            }
        }
    }

    const login= async (email,password)=>{
        try{
            const response=await axios.post(`${API_BASE_URL}/api/auth/login`,{email,password});
            if(response.status===200){
                const userData = {
                    email: response.data.email,
                    role: response.data.role
                };
                setUser(userData);
                setToken(response.data.token);
                localStorage.setItem("token",response.data.token);
                localStorage.setItem("user",JSON.stringify(userData));
                setLoading(false);
                return{
                    success:true,
                    message:'Login successful'
                }
            }else{
                return{
                    success:false,
                    message:response.data.message || 'Login failed'
                }
            }
        }catch(error){
            console.error("Login error:", error);
            return {
                success:false,
                message:error.response?.data?.message || 'Network error please try again later'
            }
        }
    }   

    const isAuthenticated =()=>{
        return !!token && !!user;
    }

    const getAuthHeaders=()=>{
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    const contextValue = {
        register,
        login,
        isAuthenticated,
        token,
        user,loading,getAuthHeaders,

    }


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
