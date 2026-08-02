'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight, KeyRound, CheckCircle2, X, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@lushlayers.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Authentication successful! Redirecting to Executive Dashboard...');
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1000);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to authentication server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 via-white to-cream-200 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Gold Accent Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-luxury border border-warmgray-200 relative z-10 space-y-6 animate-fade-in">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold-500/40 shadow-sm mx-auto bg-charcoal-900 mb-2">
            <Image
              src="/logo.jpg"
              alt="Lush Layers Official Seal"
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Admin Security Portal</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-charcoal-900 font-bold tracking-tight">
            Lush Layers Portal
          </h1>
          <p className="text-xs text-warmgray-500 font-medium">
            Management Console & Boutique Controls
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl text-red-700 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-charcoal-900">
          
          <div>
            <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lushlayers.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-warmgray-300 focus:border-gold-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-warmgray-600 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl border border-warmgray-300 focus:border-gold-500 focus:outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warmgray-400 hover:text-charcoal-900"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex justify-between items-center text-xs pt-1 font-medium">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-warmgray-300 text-gold-500 focus:ring-gold-400"
              />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-gold-700 font-bold hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

        </form>

        {/* Master Credentials Note & Back to Site */}
        <div className="space-y-3 pt-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-2xl border border-warmgray-300 bg-cream-50 text-charcoal-900 font-bold text-xs hover:border-gold-500 hover:text-gold-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Lush Layers Website</span>
          </Link>

          <div className="p-3 bg-cream-50 rounded-2xl border border-warmgray-200 text-center text-[10px] text-warmgray-600 font-semibold">
            🔑 Default Credentials: <code className="text-charcoal-900 font-bold">admin@lushlayers.com</code> / <code className="text-charcoal-900 font-bold">admin123</code>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-warmgray-200 text-xs space-y-4">
            <div className="flex justify-between items-center border-b border-warmgray-100 pb-2">
              <h3 className="font-serif font-bold text-base text-charcoal-900">Password Reset Instructions</h3>
              <button onClick={() => setShowForgotPassword(false)} className="text-warmgray-400 hover:text-charcoal-900">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-warmgray-600 leading-relaxed font-medium">
              For security compliance, password resets are handled via MongoDB Atlas master secret key or by contacting your administrator.
            </p>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-2.5 rounded-full bg-gold-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Understood
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
