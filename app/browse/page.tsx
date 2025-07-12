import Link from "next/link"

export default function BrowsePage() {
  const featuredItems = [
    { id: 1, name: "Vintage Denim Jacket", image: "/placeholder.svg?height=300&width=300", size: "M" },
    { id: 2, name: "Floral Summer Dress", image: "/placeholder.svg?height=300&width=300", size: "S" },
    { id: 3, name: "Leather Boots", image: "/placeholder.svg?height=300&width=300", size: "8" },
    { id: 4, name: "Wool Sweater", image: "/placeholder.svg?height=300&width=300", size: "L" },
    { id: 5, name: "Silk Blouse", image: "/placeholder.svg?height=300&width=300", size: "M" },
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            ReWear
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/browse" className="hover:text-accent transition-colors">
              Browse
            </Link>
            <Link href="/login" className="hover:text-accent transition-colors">
              Login
            </Link>
            <Link href="/register" className="hover:text-accent transition-colors">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-light mb-4">Discover Sustainable Fashion</h1>
          <p className="text-xl text-gray-300 mb-8">Exchange, swap, and find amazing pre-loved clothing</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Start Swapping
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">Browse Items</button>
          </div>
        </section>

        {/* Featured Items Carousel */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-light mb-6">Featured Items</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="card min-w-[250px] hover:shadow-xl transition-shadow cursor-pointer"
              >
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="grid grid-cols-3 gap-6">
          <div className="card text-center">
            <h3 className="text-3xl font-bold text-primary mb-2">10,000+</h3>
            <p className="text-gray-600">Items Swapped</p>
          </div>
          <div className="card text-center">
            <h3 className="text-3xl font-bold text-primary mb-2">5,000+</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="card text-center">
            <h3 className="text-3xl font-bold text-primary mb-2">50 tons</h3>
            <p className="text-gray-600">Textile Waste Saved</p>
          </div>
        </section>
      </div>
    </div>
  )
}
