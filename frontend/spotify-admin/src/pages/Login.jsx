import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import spotifyLogo from '../assets/spotify-logo.png';
import { Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/add-song', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <Navigate replace to="/add-song" />;
  }

  

  if(loading){
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill all the details');
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Admin logged in Successfully');
        navigate('/add-song');
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <img alt="logo" className="h-12 w-12" src={spotifyLogo} />
            <h1 className="ml-3 text-3xl font-bold text-white">Stream | Tune</h1>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Admin Panel</h2>
          <p className="text-gray-300">Sign in to manage your music library</p>
        </div>

        <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-lg">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full rounded-lg border border-white/10 bg-black/20 py-3 pr-4 pl-10 text-white outline-none placeholder:text-gray-400"
                  id="email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  type="email"
                  required
                  value={email}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full rounded-lg border border-white/10 bg-black/20 py-3 pr-4 pl-10 text-white outline-none placeholder:text-gray-400"
                  id="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={password}
                />
              </div>
            </div>

            

            <button
              className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
