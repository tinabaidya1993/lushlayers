'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Cake,
  FolderTree,
  MessageCircle,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [totalCakes, setTotalCakes] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);
  const [todaysOrdersCount, setTodaysOrdersCount] = useState<number>(0);
  const [monthlyOrdersCount, setMonthlyOrdersCount] = useState<number>(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const timestamp = Date.now();

      const [cakesRes, catRes, ordersRes] = await Promise.all([
        fetch(`/api/cakes?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/categories?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/orders?t=${timestamp}`, { cache: 'no-store' }),
      ]);

      const [cakesData, catData, ordersData] = await Promise.all([
        cakesRes.json(),
        catRes.json(),
        ordersRes.json(),
      ]);

      // 1. Cakes Count
      if (cakesData.success && Array.isArray(cakesData.cakes)) {
        setTotalCakes(cakesData.cakes.length);
      }

      // 2. Categories Count
      if (catData.success && Array.isArray(catData.categories)) {
        setTotalCategories(catData.categories.length);
      }

      // 3. Real Orders Metrics
      if (ordersData.success && Array.isArray(ordersData.orders)) {
        const rawOrders = ordersData.orders;
        setRecentOrders(rawOrders.slice(0, 5));

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const todayMatches = rawOrders.filter((o: any) => {
          const createdAt = o.createdAt ? new Date(o.createdAt).getTime() : 0;
          return createdAt >= startOfToday;
        });

        const monthMatches = rawOrders.filter((o: any) => {
          const createdAt = o.createdAt ? new Date(o.createdAt).getTime() : 0;
          return createdAt >= startOfMonth;
        });

        setTodaysOrdersCount(todayMatches.length);
        setMonthlyOrdersCount(monthMatches.length);
      } else {
        setRecentOrders([]);
        setTodaysOrdersCount(0);
        setMonthlyOrdersCount(0);
      }
    } catch (err) {
      console.error('Failed to load live dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-gold-700 text-[10px] uppercase tracking-widest font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Lush Layers Admin Console</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-bold ml-2">
              MongoDB Atlas Live
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Lush Layers Admin Dashboard
          </h1>
          <p className="text-xs text-warmgray-500 font-medium">
            Live real-time overview of cake catalog, category collections, and customer WhatsApp orders for Lush Layers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-3 rounded-2xl border border-warmgray-300 hover:border-gold-500 text-charcoal-900 bg-white shadow-sm"
            title="Refresh Real-time Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/cakes"
            className="inline-flex items-center space-x-2 bg-charcoal-900 hover:bg-black text-gold-400 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-2xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Cake</span>
          </Link>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Cakes */}
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-warmgray-500">
            <span className="text-xs uppercase tracking-wider font-bold">Total Cakes</span>
            <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-300 text-gold-700 flex items-center justify-center">
              <Cake className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            {loading ? '...' : totalCakes}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> Active in MongoDB Catalog
          </p>
        </div>

        {/* Total Categories */}
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-warmgray-500">
            <span className="text-xs uppercase tracking-wider font-bold">Categories</span>
            <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-300 text-gold-700 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            {loading ? '...' : totalCategories}
          </p>
          <p className="text-[11px] text-warmgray-500 font-semibold">Active Collections</p>
        </div>

        {/* Today's Queries */}
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-warmgray-500">
            <span className="text-xs uppercase tracking-wider font-bold">Today's Queries</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            {loading ? '...' : todaysOrdersCount}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold">Real Orders Placed Today</p>
        </div>

        {/* Monthly Orders */}
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-warmgray-500">
            <span className="text-xs uppercase tracking-wider font-bold">Monthly Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-300 text-gold-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">
            {loading ? '...' : monthlyOrdersCount}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold">Real Orders This Month</p>
        </div>

      </div>

      {/* LATEST WHATSAPP ORDERS TABLE */}
      <div className="bg-white rounded-3xl border border-warmgray-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">Recent WhatsApp Orders</h3>
            <p className="text-xs text-warmgray-500">Real customer order queries submitted via the website</p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-widest text-gold-700 hover:text-gold-800 flex items-center space-x-1"
          >
            <span>View All Orders ({recentOrders.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-warmgray-400 font-medium flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin text-gold-600" />
            <span>Loading real order data from MongoDB Atlas...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs text-warmgray-500 space-y-2 bg-cream-50/50 rounded-2xl border border-dashed border-warmgray-300">
            <ShoppingBag className="w-8 h-8 text-warmgray-300 mx-auto" />
            <p className="font-bold text-charcoal-900 text-sm">No WhatsApp Orders Yet</p>
            <p className="max-w-md mx-auto text-warmgray-400">
              When customers order cakes or submit inquiries on the website, their real order details will automatically appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-100 text-warmgray-600 uppercase tracking-wider text-[10px] border-b border-warmgray-200">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Cake Design</th>
                  <th className="py-3 px-4">Weight/Size</th>
                  <th className="py-3 px-4">Estimated Price</th>
                  <th className="py-3 px-4">Delivery Date</th>
                  <th className="py-3 px-4 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100 font-medium">
                {recentOrders.map((ord) => (
                  <tr key={ord._id || ord.orderId} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-charcoal-900">#{ord.orderId}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-charcoal-900">{ord.customerDetails?.customerName}</p>
                      <p className="text-[10px] text-warmgray-500 font-mono">{ord.customerDetails?.phoneNumber}</p>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-charcoal-900">
                      {ord.cakeSnapshot?.cakeName}
                    </td>
                    <td className="py-3.5 px-4 text-warmgray-600">{ord.selectedOptions?.weight || 'Standard'}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-gold-700">
                      ₹{(ord.estimatedPrice || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-warmgray-600">{ord.customerDetails?.deliveryDate || 'Flexible'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'New'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : ord.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : ord.status === 'Preparing'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-warmgray-200 text-warmgray-700'
                        }`}
                      >
                        {ord.status || 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
