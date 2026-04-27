import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      if (isLogin) {
        // 2. Set token in storage AND in React state
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token); // <--- THIS triggers the instant redirect!
      } else {
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const endpoint = isLogin ? '/auth/login' : '/auth/signup';
//     try {
//       const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
//       if (isLogin) {
//         localStorage.setItem('token', res.data.token);
//         alert(`Welcome back, ${res.data.user.name}!`);
//       } else {
//         alert("Registration successful! Please login.");
//         setIsLogin(true);
//       }
//     } catch (err) {
//       alert(err.response?.data || "Something went wrong");
//     }
//   };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Nexus</h1>
          <p className="text-slate-400">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-500" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            {isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;