"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  Recycle,
  TrendingUp,
  Heart,
  ShoppingBag,
} from "lucide-react";

// API Item Type
interface BrowseItem {
  id: number;
  title: string;
  image: string;
}

// Static Testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    text: "ReWear has completely changed how I shop for clothes. I've found amazing pieces and made great friends!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
  },
];

export default function BrowsePage() {
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        } else {
          console.error("Failed to fetch browse items");
        }
      } catch (err) {
        console.error("A network error occurred:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllItems();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Recycle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">ReWear</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-green-600">
              Home
            </Link>
            <Link href="/browse" className="text-green-600 font-medium border-b-2 border-green-600">
              Browse
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-green-600">
              Login
            </Link>
            <Link href="/register" className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"} text-center py-16 px-4`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Discover <span className="text-green-600">Sustainable</span> Fashion
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Exchange, swap, and find amazing pre-loved clothing while making a positive impact on our planet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 font-medium flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" /> Start Swapping
            </Link>
            <button className="border border-green-600 text-green-600 px-8 py-3 rounded-md font-medium hover:bg-green-50 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" /> Browse Items
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Dynamic Available Items Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">Available Items</h2>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextSlide} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-500">Loading items...</p>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-100 rounded-lg">
              <p className="text-gray-600">No items available. Check back later!</p>
            </div>
          )}
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">
            What Our Community Says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900 font-medium">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">Verified User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: ShoppingBag, value: "10,000+", label: "Items Swapped", subtext: "And counting every day!" },
            { icon: Users, value: "5,000+", label: "Active Users", subtext: "Growing community" },
            { icon: Recycle, value: "50 tons", label: "Textile Waste Saved", subtext: "Environmental impact" },
          ].map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <metric.icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 mb-2">{metric.value}</h3>
              <p className="text-gray-600">{metric.label}</p>
              <p className="text-gray-500 text-sm mt-1">{metric.subtext}</p>
            </div>
          ))}
        </section>
      </div>

      {/* Footer CTA */}
      <section className="bg-green-600 py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-lg text-green-100 mb-6">
            Start your sustainable fashion journey today.
          </p>
          <Link href="/register" className="bg-white text-green-600 px-8 py-3 rounded-md font-medium hover:bg-green-50 transition-colors">
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
