"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, User, ChevronLeft } from "lucide-react";

interface ItemDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  images: string;
  User: {
    id: number;
    username: string;
  }; size: string;
  condition: string;
  brand: string;
  color: string;
  material: string;
  
}

export default function ItemDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMyItem, setIsMyItem] = useState(false);

  const handleSwapRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to request a swap.");
      return;
    }

    if (!item) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/swaps/request/${item.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      alert("A network error occurred.");
    }
  };

  useEffect(() => {
    const itemId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (!itemId) {
      setIsLoading(false);
      setError("No item ID provided.");
      return;
    }

    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/items/${itemId}`
        );
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch item details.");
        }
      } catch (err) {
        setError("A network error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [params.id]);

  useEffect(() => {
    const checkOwnership = () => {
      const token = localStorage.getItem("token");
      if (token && item) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.id === item.User.id) {
            setIsMyItem(true);
          }
        } catch (err) {
          console.error("Invalid JWT format");
        }
      }
    };

    if (item) {
      checkOwnership();
    }
  }, [item]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white flex justify-center items-center">
        Loading item...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark text-red-400 flex justify-center items-center">
        {error}
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-dark text-white flex justify-center items-center">
        Item not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-light rounded-2xl p-4 mb-6">
              <img
    src={`${process.env.NEXT_PUBLIC_API_URL}${item.images?.[0]}`}
                alt={item.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="bg-light rounded-2xl p-8 mb-6">
              <h1 className="text-3xl font-bold text-dark mb-4">{item.title}</h1>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Category:</strong> {item.category}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="font-semibold text-green-600">{item.status}</span>
                </p>
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Description:</h3>
                  <p className="leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    Listed by:
                  </h3>
                  <p className="text-lg text-primary font-medium">{item.User.username}</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSwapRequest}
              disabled={isMyItem || item.status !== "Available"}
              className="btn-secondary w-full text-lg py-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isMyItem
                ? "This is Your Item"
                : item.status === "Available"
                ? "Request Swap"
                : "Unavailable"}
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/browse"
            className="text-accent hover:text-light transition-colors inline-flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Browse
          </Link>
        </div>
      </div>
    </div>
  );
}
