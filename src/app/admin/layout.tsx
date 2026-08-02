'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Cake,
  FolderTree,
  MessageCircle,
  Image as ImageIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Star
} from 'lucide-react';

import { useScrollLock } from '@/hooks/useScrollLock';

interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Global Scroll Lock when mobile drawer is open
  useScrollLock(mobileDrawerOpen);

  // Check Auth via /api/admin/me
  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    checkAuthSession();
  }, [pathname]);

  // 1 Hour (60 Minutes) Idle Timeout Auto-Logout
  useEffect(() => {
    if (pathname === '/admin/login' || checkingAuth) return;

    let timeoutId: NodeJS.Timeout;

    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      // 1 hour = 60 * 60 * 1000 ms
      timeoutId = setTimeout(() => {
        console.log('Admin session idle for 1 hour. Auto signing out...');
        handleLogout();
      }, 60 * 60 * 1000);
    };

    const userActivityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    userActivityEvents.forEach((evt) => window.addEventListener(evt, resetIdleTimer));

    resetIdleTimer();

    return () => {
      clearTimeout(timeoutId);
      userActivityEvents.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [pathname, checkingAuth]);

  const checkAuthSession = async () => {
    try {
      const res = await fetch('/api/admin/me');
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        setUser(data.user);
      } else {
        router.push('/admin/login');
      }
    } catch (err) {
      router.push('/admin/login');
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout error');
    } finally {
      setUser(null);
      router.push('/admin/login');
      router.refresh();
    }
  };

  // If on login route, render login page directly
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center text-charcoal-900 text-xs font-bold space-y-3">
        <Sparkles className="w-6 h-6 text-gold-600 animate-spin" />
        <span className="uppercase tracking-widest text-gold-700 font-bold">Verifying Admin Security Token...</span>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Cakes', href: '/admin/cakes', icon: Cake },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'WhatsApp Orders', href: '/admin/orders', icon: MessageCircle },
    { name: 'Client Feedback', href: '/admin/feedback', icon: Star },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { name: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 flex font-sans pb-16 lg:pb-0">
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside
        className={`hidden lg:flex bg-white border-r border-warmgray-200 flex-col justify-between transition-all duration-300 z-30 sticky top-0 h-screen ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Sidebar Header Logo */}
          <div className="p-4 border-b border-warmgray-100 flex justify-between items-center">
            <Link href="/admin" className={`flex items-center space-x-2.5 ${collapsed ? 'justify-center' : ''}`}>
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gold-500/40 shadow-sm flex-shrink-0 bg-charcoal-900">
                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="font-serif text-lg font-bold text-charcoal-900 leading-none">Lush Layers</h1>
                  <span className="text-[9px] uppercase tracking-widest text-gold-700 font-bold">Admin Console</span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-warmgray-400 hover:text-charcoal-900 hover:bg-warmgray-100 transition-colors"
              aria-label="Toggle Sidebar"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-charcoal-900 text-gold-400 shadow-sm'
                      : 'text-warmgray-600 hover:bg-cream-100 hover:text-charcoal-900'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-warmgray-500'}`} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom User & Logout */}
        <div className="p-3 border-t border-warmgray-100 space-y-2">
          {!collapsed && (
            <div className="p-3 bg-cream-50 rounded-2xl border border-warmgray-200 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 text-gold-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-charcoal-900 truncate">{user?.name || 'Tina Manna'}</p>
                <p className="text-[10px] text-emerald-700 font-bold truncate">{user?.role || 'Owner & Master Chef'}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition-all ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE SLIDE-OVER DRAWER */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-fade-in scroll-lock-overlay">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-warmgray-200">
                <div className="flex items-center space-x-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gold-500 flex-shrink-0">
                    <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                  </div>
                  <span className="font-serif font-bold text-charcoal-900 text-base">Lush Layers Admin</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-warmgray-400 hover:text-charcoal-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-5 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-charcoal-900 text-gold-400 shadow-sm'
                          : 'text-warmgray-700 hover:bg-cream-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-warmgray-200 space-y-3">
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-gold-800 bg-gold-50 border border-gold-300"
              >
                <span>Back to Website (Lush Layers) ↗</span>
              </Link>
              <div className="flex items-center space-x-3 p-2 bg-cream-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <div className="overflow-hidden text-xs">
                  <p className="font-bold text-charcoal-900 truncate">{user?.name || 'Tina Manna'}</p>
                  <p className="text-[10px] text-emerald-700 font-bold truncate">{user?.role || 'Owner & Master Chef'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-bold text-red-700 bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-warmgray-200 py-3 px-4 sm:px-6 sticky top-0 z-20 flex justify-between items-center shadow-sm">
          
          {/* Left: Mobile Drawer Trigger & Search */}
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-charcoal-900 bg-cream-100 border border-warmgray-300"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-warmgray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search admin dashboard..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-warmgray-300 text-xs text-charcoal-900 placeholder-warmgray-400 focus:outline-none focus:border-gold-500 bg-cream-50"
              />
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 ml-2">
            <Link
              href="/admin/cakes"
              className="inline-flex items-center space-x-1.5 bg-gold-500 hover:bg-gold-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-full shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Cake</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center space-x-1 text-xs font-bold text-gold-800 hover:text-gold-700 px-3 py-2 rounded-full border border-gold-400 bg-gold-50 shadow-xs flex-shrink-0"
            >
              <span>Site ↗</span>
            </Link>
          </div>

        </header>

        {/* Dynamic Page Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>

      </div>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-warmgray-300 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-gold-600 font-bold' : 'text-warmgray-500 font-medium'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] uppercase tracking-wider">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
