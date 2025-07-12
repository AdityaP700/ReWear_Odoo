import Link from "next/link"
import { Search, Plus } from "lucide-react"

export default function LandingPage() {
  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"]

  const featuredItems = [
    { id: 1, name: "Vintage Denim Jacket", image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Floral Summer Dress", image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Leather Boots", image: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Wool Sweater", image: "/placeholder.svg?height=200&width=200" },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-light text-dark"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Hero Images Section */}
        <section>
          <h2 className="text-2xl font-bold text-light mb-6">Featured Items</h2>
          <div className="bg-light rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center text-dark">
              <h3 className="text-3xl font-bold mb-4">Sustainable Fashion Exchange</h3>
              <p className="text-lg mb-6">
                Discover amazing pre-loved clothing and give your wardrobe a sustainable makeover
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/browse" className="btn-primary">
                  Start Swapping
                </Link>
                <Link href="/browse" className="btn-secondary">
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-bold text-light mb-6">Categories</h2>
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/browse?category=${category.toLowerCase()}`}
                className="card hover:shadow-xl transition-shadow cursor-pointer text-center py-8"
              >
                <h3 className="text-lg font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Product Listings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-light">Recent Listings</h2>
            <button className="bg-secondary text-white p-3 rounded-full hover:bg-secondary/90 transition-colors">
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="card hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold">{item.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
