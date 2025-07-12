"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Plus } from "lucide-react";
import Link from "next/link";

// Types
interface UserProfile {
  username: string;
  email: string;
  points_balance: number;
  createdAt: string;
}

interface ItemListing {
  id: number;
  name: string;
  title: string;
  image: string;
  status: string;
}

interface SwapRequest {
  id: number;
  RequestedItem: {
    title: string;
    image: string;
  };
  Requester: {
    username: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [myListings, setMyListings] = useState<ItemListing[]>([]);
  const [receivedSwaps, setReceivedSwaps] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 // In app/dashboard/page.tsx - A better debugging version of useEffect

useEffect(() => {
  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [dashboardResponse, swapsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/swaps/received`, { headers }),
      ]);

      // --- Enhanced Debugging Block ---
      // Check each response individually to find the culprit.
      if (!dashboardResponse.ok) {
        const errorText = await dashboardResponse.text();
        console.error(`❌ /api/dashboard failed with status ${dashboardResponse.status}:`, errorText);
        router.push("/login"); // Fail safely
        return;
      }

      if (!swapsResponse.ok) {
        const errorText = await swapsResponse.text();
        console.error(`❌ /api/swaps/received failed with status ${swapsResponse.status}:`, errorText);
        // We can still try to load the rest of the dashboard even if swaps fail.
        // So we won't redirect, just log the error.
      }
      // --- End of Debugging Block ---

      const dashboardData = await dashboardResponse.json();
      setUser(dashboardData.user);
      setMyListings(dashboardData.listings);

      // Only try to set swaps if the response was ok
      if (swapsResponse.ok) {
        const swapsData = await swapsResponse.json();
        setReceivedSwaps(swapsData);
      }

    } catch (error) {
      console.error("A network or Promise.all error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchDashboardData();
}, [router]); // Dependency array is correct
  const handleSwapResponse = async (
    swapId: number,
    action: "accept" | "reject"
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/swaps/respond/${swapId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }),
        }
      );
      const data = await response.json();
      alert(data.message);
      window.location.reload();
    } catch (err) {
      alert("A network error occurred.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-500">
          Could not load user data. Please{" "}
          <Link href="/login" className="underline">
            log in
          </Link>{" "}
          again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-semibold text-gray-900">
              ReWear
            </Link>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your items..."
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div className="p-2 bg-green-100 text-green-600 rounded-full">
              <span className="font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Info */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-500 text-sm">
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">
                      {myListings.length}
                    </p>
                    <p className="text-gray-500 text-sm">Listings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">
                      {user.points_balance}
                    </p>
                    <p className="text-gray-500 text-sm">Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pending Swaps */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Pending Swap Requests
          </h2>
          {receivedSwaps.length > 0 ? (
            <div className="space-y-4">
              {receivedSwaps.map((swap) => (
                <div
                  key={swap.id}
                  className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-gray-800">
                      <span className="font-semibold text-green-600">
                        {swap.Requester.username}
                      </span>{" "}
                      wants to swap for your item:{" "}
                      <span className="font-semibold">
                        {swap.RequestedItem.title}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSwapResponse(swap.id, "accept")}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleSwapResponse(swap.id, "reject")}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">You have no pending swap requests.</p>
            </div>
          )}
        </section>

        {/* My Listings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              My Listings
            </h2>
            <Link
              href="/add-item"
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {myListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">
                You haven't listed any items yet.
              </p>
              <Link href="/add-item" className="mt-4 inline-block btn-primary">
                List Your First Item
              </Link>
            </div>
          )}
        </section>

        {/* My Purchases (Future Work) */}
      </div>
    </div>
  );
}
