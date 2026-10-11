import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { Shield, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff, LayoutGrid } from 'lucide-react';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  const adminAvatar = settings.adminAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const success = await login(id, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid Admin ID or Password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-[#05070A] transition-colors duration-300">
      {/* Background Ambience in Brand Colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-neon-purple/20 via-cyan-500/15 to-transparent rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/90 dark:bg-[#0A0D16]/90 border border-gray-200 dark:border-cyan-500/20 rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative z-10 animate-fade-up flex flex-col items-center text-center">
        
        {/* Round Profile Avatar with Glowing Ring */}
        <div className="relative mb-6 group">
          {/* Outer Glow Ring in Website Neon Purple / Cyan Theme */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-purple via-fuchsia-500 to-cyan-400 opacity-80 blur-md group-hover:opacity-100 transition duration-500 animate-pulse"></div>
          
          {/* Profile Ring Container */}
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-r from-neon-purple via-violet-500 to-cyan-400 shadow-[0_0_25px_rgba(234,179,8,0.4)]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0F1320] flex items-center justify-center border-2 border-white/20">
              <img 
                src={adminAvatar} 
                alt="Admin Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Small Badge Icon at Bottom Right of Profile Circle */}
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-gradient-to-r from-neon-purple to-cyan-400 p-0.5 shadow-lg flex items-center justify-center border border-white/40">
            <div className="w-full h-full bg-[#0A0D16] rounded-full flex items-center justify-center text-cyan-300">
              <LayoutGrid size={14} className="text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Title: ADMIN LOGIN */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white mb-2 uppercase flex items-center justify-center gap-1.5">
          <span>ADMIN</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-fuchsia-400 to-cyan-400">
            LOGIN
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-6 max-w-xs">
          Enter the admin ID & Password to access the dashboard.
        </p>

        {/* Error Box */}
        {error && (
          <div className="w-full mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 text-red-500 text-xs font-bold animate-shake">
            <AlertCircle size={15} /> <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          {/* Admin ID Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
              Admin ID
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-cyan-400/70" />
              <input 
                type="text" 
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-gray-50 dark:bg-[#121624] border border-gray-200 dark:border-white/10 focus:border-neon-purple dark:focus:border-cyan-400 rounded-2xl py-3.5 pl-11 pr-4 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                placeholder="Enter Admin ID"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-cyan-400/70" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-gray-50 dark:bg-[#121624] border border-gray-200 dark:border-white/10 focus:border-neon-purple dark:focus:border-cyan-400 rounded-2xl py-3.5 pl-11 pr-12 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                placeholder="Enter Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Action Button: Access Dashboard */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 mt-3 bg-gradient-to-r from-violet-600 via-neon-purple to-cyan-500 hover:from-violet-500 hover:via-purple-500 hover:to-cyan-400 text-white font-black text-sm rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(234,179,8,0.4)] hover:shadow-[0_6px_35px_rgba(6,182,212,0.6)] active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Accessing Dashboard...</span>
              </>
            ) : (
              <>
                <Shield size={18} className="text-white group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">Access Dashboard</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
