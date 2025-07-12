// in app/admin/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Search, User, Package, ShoppingBag, Edit, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// Define Types for our Admin Data
interface AdminUser { id: number; username: string; email: string; is_admin: boolean; createdAt: string; }
interface AdminListing { id: number; title: string; status: string; User: { username: string }; createdAt: string; }
interface AdminOrder { id: number; status: string; Requester: { username: string }; Responder: { username: string }; RequestedItem: { title: string }; createdAt: string; }

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("listings"); // Default to listings/review

  // State for each type of data
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      setIsLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        // Use Promise.all to fetch everything at once
        const [usersRes, listingsRes, ordersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/listings`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, { headers })
        ]);

        // If any fetch fails (e.g., not an admin), redirect
        if (!usersRes.ok || !listingsRes.ok || !ordersRes.ok) {
          alert('Admin access required.');
          router.push('/dashboard');
          return;
        }

        const usersData = await usersRes.json();
        const listingsData = await listingsRes.json();
        const ordersData = await ordersRes.json();
        
        setUsers(usersData);
        setListings(listingsData);
        setOrders(ordersData);

      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen bg-light flex justify-center items-center">Loading Admin Panel...</div>;
  }
  
  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-dark">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "users"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <User className="w-5 h-5" />
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Package className="w-5 h-5" />
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "listings"
                ? "bg-primary text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Manage Listings
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {activeTab === "users" && (
            <div>
              {/* User Management Table */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark">Manage Users ({users.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {users.map((user) => (
                  <div key={user.id} className="p-6 grid grid-cols-4 gap-4 items-center">
                    <p className="font-semibold text-dark">{user.username}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.is_admin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "listings" && (
             <div>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark">Manage Listings ({listings.length})</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {listings.map((listing) => (
                  <div key={listing.id} className="p-6 grid grid-cols-4 gap-4 items-center">
                    <p className="font-semibold text-dark">{listing.title}</p>
                    <p className="text-gray-600">by {listing.User.username}</p>
                    <p className="text-sm text-gray-500">Listed: {new Date(listing.createdAt).toLocaleDateString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${listing.status === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      {listing.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-dark">Manage Swaps ({orders.length})</h2>
              </div>
               <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 grid grid-cols-4 gap-4 items-center">
                    <p className="font-semibold text-dark">{order.RequestedItem.title}</p>
                    <p className="text-gray-600">{order.Requester.username} → {order.Responder.username}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "accepted" ? "bg-green-100 text-green-800" : order.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}