// In app/dashboard/page.tsx

"use client"; // <-- This is now a client component to allow fetching data

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Plus } from "lucide-react";
import Link from "next/link";

// Define types for our data to make the code safer and easier to work with
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

export default function DashboardPage() {
  const router = useRouter();
  
  // Create state variables to hold the dynamic data
  const [user, setUser] = useState<UserProfile | null>(null);
  const [myListings, setMyListings] = useState<ItemListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use useEffect to fetch data when the component loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, the user isn't logged in. Redirect them.
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setMyListings(data.listings);
        } else {
          // Handle cases where the token is invalid or expired
          console.error("Failed to fetch dashboard data");
          router.push("/login");
        }
      } catch (error) {
        console.error("A network error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]); // Add router to dependency array as it's used inside

  // Display a loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading Dashboard...</p>
      </div>
    );
  }

  // Display a message if user data couldn't be loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-red-500">Could not load user data. Please <Link href="/login" className="underline">log in</Link> again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with Search */}
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
                    {/* Display first letter of username */}
                    <span className="font-bold">{user.username.charAt(0).toUpperCase()}</span>
                </div>
            </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* DYNAMIC User Profile Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {/* DYNAMIC USERNAME */}
                  <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
                  {/* DYNAMIC EMAIL */}
                  <p className="text-gray-600">{user.email}</p>
                  {/* DYNAMIC JOIN DATE */}
                  <p className="text-gray-500 text-sm">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">{myListings.length}</p>
                    <p className="text-gray-500 text-sm">Listings</p>
                  </div>
                  <div className="text-center">
                    {/* DYNAMIC POINTS */}
                    <p className="text-lg font-medium text-gray-900">{user.points_balance}</p>
                    <p className="text-gray-500 text-sm">Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC My Listings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Listings</h2>
            <Link href="/add-item" className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              <Plus className="w-5 h-5" />
            </Link>
          </div>
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {myListings.map((item) => (
                <Link key={item.id} href={`/item/${item.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-40 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${ item.status === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800" }`}>
                      {item.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">You haven't listed any items yet.</p>
              <Link href="/add-item" className="mt-4 inline-block btn-primary">List Your First Item</Link>
            </div>
          )}
        </section>

        {/* My Purchases (Still Static for now) */}
        <section>
          {/* ... your static myPurchases section can remain here for now ... */}
        </section>
      </div>
    </div>
  );
}