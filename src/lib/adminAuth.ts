'use client';

export interface AdminUser {
  email: string;
  name: string;
  role: 'super_admin' | 'pastry_chef' | 'editor';
}

const ADMIN_TOKEN_KEY = 'lush_layers_admin_token';
const ADMIN_USER_KEY = 'lush_layers_admin_user';

export function getStoredAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(ADMIN_USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return Boolean(token);
}

export function loginAdmin(email: string, pass: string): boolean {
  // Default master admin credentials for demo / management
  if (email.toLowerCase() === 'admin@lushlayers.com' && pass === 'admin123') {
    const user: AdminUser = {
      email: 'admin@lushlayers.com',
      name: 'Head Pastry Chef',
      role: 'super_admin',
    };
    localStorage.setItem(ADMIN_TOKEN_KEY, 'jwt_token_lush_layers_secured_778899');
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  window.location.href = '/admin/login';
}
