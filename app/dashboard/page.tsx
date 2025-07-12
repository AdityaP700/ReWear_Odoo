import { Search, User, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const myListings = [
    { id: 1, name: "Denim Jacket", image: "/placeholder.svg?height=150&width=150", status: "Available" },
    { id: 2, name: "Summer Dress", image: "/placeholder.svg?height=150&width=150", status: "Pending" },
    { id: 3, name: "Wool Sweater", image: "/placeholder.svg?height=150&width=150", status: "Available" },
    { id: 4, name: "Leather Boots", image: "/placeholder.svg?height=150&width=150", status: "Swapped" },
  ]

  const myPurchases = [
    { id: 1, name: "Silk Blouse", image: "/placeholder.svg?height=150&width=150", date: "2024-01-15" },
    { id: 2, name: "Cotton Pants", image: "/placeholder.svg?height=150&width=150", date: "2024-01-10" },
    { id: 3, name: "Vintage Coat", image: "/placeholder.svg?height=150&width=150", date: "2024-01-05" },
    { id: 4, name: "Designer Bag", image: "/placeholder.svg?height=150&width=150", date: "2023-12-28" },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* Header with Search */}
      <header className="p-4 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            ReWear
          </Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your items..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-light text-dark"
            />
          </div>
          <button className="bg-secondary text-white p-2 rounded-full">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Section */}
        <section className="bg-light rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-6 bg-gray-100 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* My Listings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-light">My Listings</h2>
            <Link
              href="/add-item"
              className="bg-secondary text-white p-2 rounded-full hover:bg-secondary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {myListings.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="card hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1">{item.name}</h3>
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
              </Link>
            ))}
          </div>
        </section>

        {/* My Purchases */}
        <section>
          <h2 className="text-2xl font-bold text-light mb-6">My Purchases</h2>
          <div className="grid grid-cols-4 gap-4">
            {myPurchases.map((item) => (
              <div key={item.id} className="card">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600">Acquired: {item.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
