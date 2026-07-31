'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Calendar,
  User,
  Phone
} from 'lucide-react';
import { BOUTIQUE_WHATSAPP_NUMBER } from '@/lib/whatsapp';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders?status=${statusFilter}`);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn('MongoDB orders fetch fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    const nameMatch = (order.customerDetails?.customerName || '').toLowerCase().includes(query);
    const phoneMatch = (order.customerDetails?.phoneNumber || '').includes(query);
    const idMatch = (order.orderId || '').toLowerCase().includes(query);
    return nameMatch || phoneMatch || idMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Out for Delivery':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Completed':
        return 'bg-emerald-200 text-emerald-900 border-emerald-400';
      default:
        return 'bg-warmgray-100 text-warmgray-700 border-warmgray-300';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-3xl font-bold text-charcoal-900">WhatsApp Order Enquiries</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>MongoDB Atlas Live</span>
            </span>
          </div>
          <p className="text-xs text-warmgray-500 font-medium">
            Live WhatsApp order submissions saved automatically to MongoDB Atlas before WhatsApp redirection.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-full border border-warmgray-300 hover:border-gold-500 text-charcoal-900"
          title="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-warmgray-200 shadow-sm">
        <div className="flex-1 flex items-center space-x-2 bg-cream-50 px-3 py-2 rounded-xl border border-warmgray-200">
          <Search className="w-4 h-4 text-warmgray-400" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-charcoal-900 focus:outline-none font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-cream-50 rounded-xl border border-warmgray-200 text-xs font-bold text-charcoal-900 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="New">New Enquiries</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-warmgray-200 space-y-4 my-8 text-xs text-charcoal-900">
            
            <div className="flex justify-between items-center border-b border-warmgray-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-700">Order #{selectedOrder.orderId}</span>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  {selectedOrder.cakeSnapshot?.cakeName}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-warmgray-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-cream-50 rounded-2xl border border-warmgray-200 flex items-center space-x-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-warmgray-200 flex-shrink-0">
                  <Image src={selectedOrder.cakeSnapshot?.image} alt="Cake" fill className="object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm text-charcoal-900">{selectedOrder.cakeSnapshot?.cakeName}</p>
                  <p className="text-warmgray-500 font-semibold">{selectedOrder.selectedOptions?.weight} • {selectedOrder.selectedOptions?.flavor}</p>
                  <p className="font-serif font-bold text-gold-700 text-sm">₹{selectedOrder.estimatedPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-warmgray-200 pt-3">
                <h4 className="font-bold uppercase tracking-wider text-warmgray-600 text-[10px]">Customer Details</h4>
                <p><strong>Name:</strong> {selectedOrder.customerDetails?.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerDetails?.phoneNumber}</p>
                <p><strong>Address:</strong> {selectedOrder.customerDetails?.deliveryAddress}</p>
                <p><strong>Date & Time:</strong> {selectedOrder.customerDetails?.deliveryDate} ({selectedOrder.customerDetails?.deliveryTime})</p>
                {selectedOrder.selectedOptions?.cakeMessage && (
                  <p><strong>Plaque Message:</strong> "{selectedOrder.selectedOptions.cakeMessage}"</p>
                )}
              </div>

              {selectedOrder.selectedOptions?.referenceImageUrl && (
                <div className="pt-2">
                  <h4 className="font-bold uppercase tracking-wider text-warmgray-600 text-[10px] mb-1">Reference Image (Cloudinary)</h4>
                  <a href={selectedOrder.selectedOptions.referenceImageUrl} target="_blank" rel="noopener noreferrer" className="text-gold-700 font-bold underline">
                    View Reference Photo →
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-warmgray-200 flex justify-between items-center">
              <a
                href={`https://wa.me/${selectedOrder.customerDetails?.phoneNumber?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.customerDetails?.customerName}! Regard your Lush Layers cake order #${selectedOrder.orderId}...`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply on WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Orders Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-warmgray-200 shadow-sm overflow-hidden">
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-100 border-b border-warmgray-200 uppercase tracking-wider text-warmgray-600 font-bold">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Cake & Weight</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warmgray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id || order.orderId} className="hover:bg-cream-50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-bold text-charcoal-900">#{order.orderId}</span>
                    <p className="text-[10px] text-warmgray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 font-semibold text-charcoal-900">
                    {order.customerDetails?.customerName}
                    <p className="text-[10px] text-warmgray-500 font-mono">{order.customerDetails?.phoneNumber}</p>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-charcoal-900">{order.cakeSnapshot?.cakeName}</span>
                    <p className="text-[10px] text-warmgray-500">{order.selectedOptions?.weight}</p>
                  </td>
                  <td className="p-4 font-mono font-bold text-gold-700">₹{(order.estimatedPrice || 0).toLocaleString()}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border focus:outline-none ${getStatusBadge(order.status)}`}
                    >
                      <option value="New">New</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-warmgray-600 hover:text-gold-600 rounded-lg"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden divide-y divide-warmgray-200">
          {filteredOrders.map((order) => (
            <div key={order._id || order.orderId} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-xs text-gold-700">#{order.orderId}</span>
                  <h4 className="font-serif font-bold text-sm text-charcoal-900">{order.customerDetails?.customerName}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-warmgray-600 font-semibold">{order.cakeSnapshot?.cakeName} • ₹{(order.estimatedPrice || 0).toLocaleString()}</p>
              <div className="pt-1 flex justify-end space-x-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="py-1 px-3 rounded-xl border border-warmgray-300 text-xs font-bold"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
