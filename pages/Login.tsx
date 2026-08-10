import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
       {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-white dark:bg-[#0A0C11] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 animate-fade-up transition-colors duration-300">
        <div className="text-center mb-8">
           <div className="w-16 h-16 bg-gray-100 dark:bg-[#151A25] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-white/5 shadow-lg">
              <Shield size={32} className="text-neon-purple" />
           </div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Access</h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your secure credentials to continue.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-xs font-bold animate-shake">
             <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Admin ID</label>
              <div className="relative">
                 <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="text" 
                   value={id}
                   onChange={(e) => setId(e.target.value)}
                   disabled={isSubmitting}
                   className="w-full bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 disabled:opacity-50"
                   placeholder="Enter Admin ID"
                 />
              </div>
           </div>
           
           <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                 <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type={showPassword ? "text" : "password"} 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   disabled={isSubmitting}
                   className="w-full bg-gray-50 dark:bg-[#151A25] border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-12 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-neon-purple transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 disabled:opacity-50"
                   placeholder="Enter Password"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                   disabled={isSubmitting}
                 >
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
           </div>

           <button 
             type="submit" 
             disabled={isSubmitting}
             className="w-full py-3.5 mt-2 bg-neon-purple hover:bg-purple-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-neon-purple/40 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
           >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login Dashboard</span>
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
