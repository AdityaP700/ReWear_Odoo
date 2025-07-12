"use client";

import { useState, useEffect } from "react";
import { Search, User, Package, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Types
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

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center text-lg">Loading Admin Panel...</div>;
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark">Admin Panel</h1>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium ${
              activeTab === "users" ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <User className="w-4 h-4" /> Users
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium ${
              activeTab === "orders" ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Package className="w-4 h-4" /> Orders
          </button>
          <button
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium ${
              activeTab === "listings" ? "bg-primary text-white" : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Listings
          </button>
        </div>

        {/* Users */}
        {activeTab === "users" && (
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="px-6 py-4 border-b font-semibold">Users ({users.length})</div>
            {users.map(user => (
              <div key={user.id} className="px-6 py-4 border-t flex justify-between text-sm">
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-gray-500">{user.email}</div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.is_admin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.is_admin ? "Admin" : "User"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Listings */}
        {activeTab === "listings" && (
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="px-6 py-4 border-b font-semibold">Listings ({listings.length})</div>
            {listings.map(listing => (
              <div key={listing.id} className="px-6 py-4 border-t grid grid-cols-5 gap-4 text-sm items-center">
                <div>
                  <div className="font-medium">{listing.title}</div>
                  <div className="text-gray-500">by {listing.User.username}</div>
                </div>
                <div>{listing.category || "Uncategorized"}</div>
                <div>{new Date(listing.createdAt).toLocaleDateString()}</div>
                <div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      listing.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : listing.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>
                <div className="flex gap-2 justify-end">
                  {listing.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleListingStatusChange(listing.id, "Available")}
                        className="bg-green-500 text-white text-xs px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleListingStatusChange(listing.id, "Rejected")}
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-lg overflow-hidden border">
            <div className="px-6 py-4 border-b font-semibold">Orders ({orders.length})</div>
            {orders.map(order => (
              <div key={order.id} className="px-6 py-4 border-t grid grid-cols-4 gap-4 text-sm">
                <div>{order.RequestedItem.title}</div>
                <div>From: {order.Requester.username}</div>
                <div>To: {order.Responder.username}</div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
