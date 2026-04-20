import { useState } from "react";
import toast from "react-hot-toast";
import assets from "../assets/assets";
import {useAuth} from "../context/AuthContext";

const Register=({onSwitchToLogin})=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const {register}=useAuth();
    

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError("");

        if(!email || !password || !confirmPassword){
            setError("All fields are required.");
            toast.error("All fields are required.");
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            toast.error("Passwords do not match.");
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const result = await register(email, password);
            if (result.success) {
                toast.success(result.message);
                onSwitchToLogin();
                // Redirect to login or dashboard
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } catch (error) {
            setError("An unexpected error occurred.");
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-900 flex items-center justify-center p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl w-full">
                {/* Left Section */}
                <div className="flex flex-col justify-center space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start mb-8">
                            <img src={assets.logo} alt="logo" className="w-20 h-20" />
                            <h1 className="ml-4 text-5xl font-bold text-white">Stream Tune</h1>
                        </div>
                    </div>
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-white mb-4">Join Stream Tune</h2>
                        <p className="text-lg text-gray-300">Create your Stream Tune account to start listening.</p>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="bg-gray-800 p-10 rounded-lg shadow-lg">
                    <h3 className="text-3xl font-bold text-white mb-8">Create Account</h3>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                         
                        <div>
                            <label htmlFor="email" className="block text-gray-300 font-semibold mb-2">Email</label>
                            <input type="email" id="email" className="w-full bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-300 font-semibold mb-2">Password</label>
                            <input type="password" id="password" className="w-full bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-300 font-semibold mb-2">Confirm Password</label>
                            <input type="password" id="confirmPassword" className="w-full bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-8 transition-all duration-300 transform hover:scale-105 btn-animated disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-gray-400">
                            Already have an account?{' '}
                            <button 
                              type="button"
                              onClick={onSwitchToLogin}
                              className="text-green-500 hover:text-green-400 cursor-pointer"
                            >
                                Log in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;