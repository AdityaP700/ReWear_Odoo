"use client";

import { useState, useEffect } from "react";
import { Search, User, Package, ShoppingBag, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// --- Type Definitions (no changes needed) ---
interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  createdAt: string;
}
interface AdminListing {
  id: number;
  title: string;
  status: string;
  category?: string;
  User: { username: string };
  createdAt: string;
}
interface AdminOrder {
  id: number;
  status: string;
  Requester: { username: string };
  Responder: { username: string };
  RequestedItem: { title: string };
  createdAt: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("listings");

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fetching and Handlers (your existing logic is perfect) ---
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      setIsLoading(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, listingsRes, ordersRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/listings`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, { headers }),
        ]);

        if (!usersRes.ok || !listingsRes.ok || !ordersRes.ok) {
          toast.error("Admin access required");
          router.push("/dashboard");
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
        toast.error("Error fetching admin data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

  const handleListingStatusChange = async (listingId: number, newStatus: "Available" | "Rejected") => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Authentication expired. Please log in again.");

    // Optimistic UI update
    setListings(prev => prev.filter(l => l.id !== listingId));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/items/${listingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Item marked as ${newStatus}`);
      } else {
        toast.error("Failed to update item status.");
      }
    } catch (error) {
      console.error("Error updating listing status:", error);
      toast.error("Network error occurred.");
    }
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-lg font-semibold text-gray-700">Loading Admin Panel...</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Consistent Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
              />
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex justify-center items-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full"><User className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full"><ShoppingBag className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{listings.length}</p>
                <p className="text-sm font-medium text-gray-500">Total Listings</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full"><Package className="w-6 h-6 text-purple-600" /></div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-sm font-medium text-gray-500">Total Swaps</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content Area */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            {/* Tab Navigation */}
            <nav className="flex border-b border-gray-200 mb-6">
                <button onClick={() => setActiveTab("listings")} className={`px-4 py-3 font-medium text-sm ${activeTab === 'listings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Manage Listings</button>
                <button onClick={() => setActiveTab("users")} className={`px-4 py-3 font-medium text-sm ${activeTab === 'users' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Manage Users</button>
                <button onClick={() => setActiveTab("orders")} className={`px-4 py-3 font-medium text-sm ${activeTab === 'orders' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>Manage Swaps</button>
            </nav>

            {/* Tab Content */}
            <div>
              {activeTab === "listings" && (
                <div>
                  <div className="grid grid-cols-5 gap-4 px-4 py-2 font-semibold text-xs text-gray-500 uppercase">
                    <span>Title</span><span>User</span><span>Category</span><span>Status</span><span className="text-right">Actions</span>
                  </div>
                  {listings.length > 0 ? listings.map(listing => (
                    <div key={listing.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-t border-gray-200 items-center text-sm">
                      <span className="font-medium text-gray-800">{listing.title}</span>
                      <span className="text-gray-600">{listing.User.username}</span>
                      <span className="text-gray-600">{listing.category}</span>
                      <span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          listing.status === "Available" ? "bg-green-100 text-green-800"
                          : listing.status === "Pending" ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-200 text-gray-700"
                        }`}>{listing.status}</span>
                      </span>
                      <div className="flex gap-2 justify-end">
                        {listing.status === 'Pending' && (
                          <>
                            <button onClick={() => handleListingStatusChange(listing.id, 'Available')} className="p-2 text-green-600 hover:bg-green-50 rounded-md"><CheckCircle className="w-5 h-5"/></button>
                            <button onClick={() => handleListingStatusChange(listing.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><XCircle className="w-5 h-5"/></button>
                          </>
                        )}
                      </div>
                    </div>
                  )) : <p className="text-center text-gray-500 py-8">No listings found.</p>}
                </div>
              )}
              {activeTab === "users" && (
                <div>
                  <div className="grid grid-cols-3 gap-4 px-4 py-2 font-semibold text-xs text-gray-500 uppercase">
                    <span>Username</span><span>Email</span><span className="text-right">Role</span>
                  </div>
                  {users.length > 0 ? users.map(user => (
                    <div key={user.id} className="grid grid-cols-3 gap-4 px-4 py-3 border-t border-gray-200 items-center text-sm">
                      <span className="font-medium text-gray-800">{user.username}</span>
                      <span className="text-gray-600">{user.email}</span>
                      <span className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.is_admin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}>{user.is_admin ? "Admin" : "User"}</span>
                      </span>
                    </div>
                  )) : <p className="text-center text-gray-500 py-8">No users found.</p>}
                </div>
              )}
              {activeTab === "orders" && (
                <div>
                  <div className="grid grid-cols-4 gap-4 px-4 py-2 font-semibold text-xs text-gray-500 uppercase">
                    <span>Item</span><span>From</span><span>To</span><span className="text-right">Status</span>
                  </div>
                  {orders.length > 0 ? orders.map(order => (
                    <div key={order.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-gray-200 items-center text-sm">
                      <span className="font-medium text-gray-800">{order.RequestedItem.title}</span>
                      <span className="text-gray-600">{order.Requester.username}</span>
                      <span className="text-gray-600">{order.Responder.username}</span>
                      <span className="text-right">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          order.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : order.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>{order.status}</span>
                      </span>
                    </div>
                  )) : <p className="text-center text-gray-500 py-8">No swaps found.</p>}
                </div>
              )}
            </div>
        </div>
      </main>
    </div>
  );
}