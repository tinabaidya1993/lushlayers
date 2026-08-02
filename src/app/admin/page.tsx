'use client';

import React from 'react';
import Link from 'next/link';
import { CAKES_DATA, CATEGORIES } from '@/data/cakes';
import {
  Cake,
  FolderTree,
  MessageCircle,
  TrendingUp,
  Plus,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const totalCakes = CAKES_DATA.length;
  const totalCategories = CATEGORIES.length;
  const todaysOrders = 14;
  const monthlyOrders = 186;

  // Mock Recent WhatsApp Orders
  const recentOrders = [
    {
      id: 'ORD-9081',
      customer: 'Sophia Sterling',
      phone: '+91 98765 43210',
      cake: 'Velvet Noir Truffle',
      weight: '1.5 kg',
      price: 4800,
      date: '2026-07-31',
      time: '12:00 PM - 02:00 PM',
      status: 'New',
    },
    {
      id: 'ORD-9080',
      customer: 'Marcus Vance',
      phone: '+91 98123 77889',
      cake: 'The Golden Aurora Tier',
      weight: '5 kg (3 Tiers)',
      price: 28000,
      date: '2026-08-02',
      time: '05:00 PM - 08:00 PM',
      status: 'Confirmed',
    },
    {
      id: 'ORD-9079',
      customer: 'Ananya Roy',
      phone: '+91 97766 55443',
      cake: 'Rosé Champagne & Pistachio',
      weight: '1.5 kg',
      price: 5200,
      date: '2026-07-31',
      time: '02:00 PM - 05:00 PM',
      status: 'Preparing',
    },
    {
      id: 'ORD-9078',
      customer: 'David Chen',
      phone: '+91 91122 33445',
      cake: 'Vegan Salted Caramel & Pecan',
      weight: '2 kg',
      price: 5900,
      date: '2026-07-30',
      time: '10:00 AM - 12:00 PM',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-gold-700 text-[10px] uppercase tracking-widest font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Lush Layers Admin Console</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal-900">
            Lush Layers Admin Dashboard
          </h1>
          <p className="text-xs text-warmgray-500 font-medium">
            Live overview of cake inventory, category collections, and WhatsApp order queries for Lush Layers by Owner Tina Manna.
          </p>
        </div>

        <div className="flex items-center space-x-3">
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
          <p className="font-serif text-3xl font-bold text-charcoal-900">{totalCakes}</p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" /> Active in Lush Layers Catalog
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
          <p className="font-serif text-3xl font-bold text-charcoal-900">{totalCategories}</p>
          <p className="text-[11px] text-warmgray-500 font-semibold">Wedding, Signature, Birthday, Vegan</p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-warmgray-500">
            <span className="text-xs uppercase tracking-wider font-bold">Today's Queries</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">{todaysOrders}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">WhatsApp Direct Orders</p>
        </div>

        {/* Monthly Orders */}
        <div className="bg-white rounded-3xl p-6 border border-warmgray-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-warmgray-500">
            <span className="text-xs uppercase tracking-wider font-bold">Monthly Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-gold-50 border border-gold-300 text-gold-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-charcoal-900">{monthlyOrders}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">+18% vs last month</p>
        </div>

      </div>

      {/* LATEST WHATSAPP ORDERS TABLE */}
      <div className="bg-white rounded-3xl border border-warmgray-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">Recent WhatsApp Orders</h3>
            <p className="text-xs text-warmgray-500">Latest customer queries received through the order form</p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-widest text-gold-700 hover:text-gold-800 flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 text-warmgray-600 uppercase tracking-wider text-[10px] border-b border-warmgray-200">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cake Design</th>
                <th className="py-3 px-4">Weight/Size</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Delivery Date</th>
                <th className="py-3 px-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-100 font-medium">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-charcoal-900">{ord.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-charcoal-900">{ord.customer}</p>
                    <p className="text-[10px] text-warmgray-500">{ord.phone}</p>
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-charcoal-900">{ord.cake}</td>
                  <td className="py-3.5 px-4 text-warmgray-600">{ord.weight}</td>
                  <td className="py-3.5 px-4 font-serif font-bold text-gold-700">₹{ord.price.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-warmgray-600">{ord.date}</td>
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
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
