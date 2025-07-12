import { Search } from "lucide-react"
import Link from "next/link"

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const thumbnails = [
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
    "/placeholder.svg?height=100&width=100",
  ]

  return (
    <div className="min-h-screen bg-dark">
      {/* Header with Search */}
      <header className="p-4 border-b border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-light text-dark"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-12">
          {/* Left Side - Product Image */}
          <div>
            <div className="bg-light rounded-2xl p-8 mb-6">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Product Image"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {thumbnails.map((thumb, index) => (
                <div key={index} className="bg-light rounded-lg p-2">
                  <img
                    src={thumb || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div>
            <div className="bg-light rounded-2xl p-8 mb-6">
              <h1 className="text-3xl font-bold text-dark mb-4">Vintage Denim Jacket</h1>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Size:</strong> Medium
                </p>
                <p>
                  <strong>Brand:</strong> Levi's
                </p>
                <p>
                  <strong>Condition:</strong> Excellent
                </p>
                <p>
                  <strong>Color:</strong> Classic Blue
                </p>
                <p>
                  <strong>Material:</strong> 100% Cotton Denim
                </p>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description:</h3>
                  <p className="leading-relaxed">
                    Classic vintage denim jacket in excellent condition. This timeless piece features the iconic Levi's
                    styling with button closure, chest pockets, and a comfortable fit. Perfect for layering and adding a
                    vintage touch to any outfit. Minimal wear with authentic vintage character.
                  </p>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Swap Preferences:</h3>
                  <p>Looking for: Sweaters, Blouses, or Dresses in size S-M</p>
                </div>
              </div>
            </div>

            <button className="btn-secondary w-full text-lg py-4">Available for Swap</button>
          </div>
        </div>

        {/* Back to Browse */}
        <div className="mt-8">
          <Link href="/browse" className="text-accent hover:text-light transition-colors">
            ← Back to Browse
          </Link>
        </div>
      </div>
    </div>
  )
}
