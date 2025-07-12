"use client";
import { Search, User, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const myListings = [
    { id: 1, name: "Denim Jacket", image: "/placeholder.svg?height=150&width=150", status: "Available" },
    { id: 2, name: "Summer Dress", image: "/placeholder.svg?height=150&width=150", status: "Pending" },
    { id: 3, name: "Wool Sweater", image: "/placeholder.svg?height=150&width=150", status: "Available" },
    { id: 4, name: "Leather Boots", image: "/placeholder.svg?height=150&width=150", status: "Swapped" },
  ];

  const myPurchases = [
    { id: 1, name: "Silk Blouse", image: "/placeholder.svg?height=150&width=150", date: "2024-01-15" },
    { id: 2, name: "Cotton Pants", image: "/placeholder.svg?height=150&width=150", date: "2024-01-10" },
    { id: 3, name: "Vintage Coat", image: "/placeholder.svg?height=150&width=150", date: "2024-01-05" },
    { id: 4, name: "Designer Bag", image: "/placeholder.svg?height=150&width=150", date: "2023-12-28" },
  ];

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
            <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Jane Doe</h2>
                  <p className="text-gray-600">jane.doe@example.com</p>
                  <p className="text-gray-500 text-sm">Member since Jan 2023</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">25</p>
                    <p className="text-gray-500 text-sm">Swaps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-900">150</p>
                    <p className="text-gray-500 text-sm">Points</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-md p-4">
                <p className="text-gray-600 text-sm">
                  Passionate about sustainable fashion. I love finding unique pre-loved pieces and giving them a new home!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* My Listings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">My Listings</h2>
            <Link
              href="/add-item"
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {myListings.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      item.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* My Purchases */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Purchases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {myPurchases.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">Acquired: {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}