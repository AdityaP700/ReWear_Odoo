"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Recycle, ShoppingBag, TrendingUp, Star, Users, ArrowRight, Search, Filter } from "lucide-react";

// Define Types
interface BrowseItem { 
  id: number; 
  title: string; 
  images: string[]; 
}

const testimonials = [
  {
    name: "Sarah Johnson",
    text: "ReWear has completely changed how I shop for clothes. I've found amazing pieces and made great friends!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
  },
  {
    name: "Michael Chen",
    text: "The quality of items is fantastic, and I love contributing to a more sustainable fashion industry.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
  },
  {
    name: "Emma Rodriguez",
    text: "Such a great platform! I've decluttered my closet and found some amazing new pieces.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
  },
];

export default function BrowsePage() {
  const [items, setItems] = useState<BrowseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAllItems = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`);
        if (res.ok) {
          setItems(await res.json());
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

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4 bg-gradient-to-r from-green-500 to-green-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Discover <span className="text-green-200">Sustainable</span> Fashion
          </h1>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Exchange, swap, and find amazing pre-loved clothing while making a positive impact on our planet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link 
              href="/register" 
              className="group inline-flex items-center justify-center gap-3 bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              <ShoppingBag className="w-5 h-5" />
              Start Swapping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter Bar */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-100 transition-colors border border-green-200">
                <Filter className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>
        </section>

        {/* Available Items Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Available Items</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse through our collection of carefully curated pre-loved fashion
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p className="text-gray-500 text-lg">Loading amazing items...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/item/${item.id}`} 
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.images?.[0]}`}
                      alt={item.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 truncate text-lg group-hover:text-green-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "Check back later for new arrivals!"}
              </p>
            </div>
          )}
        </section>
        
        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from our satisfied community members
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-green-100" 
                  />
                  <div>
                    <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                    <p className="text-green-600 text-sm font-medium">Verified User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Together, we're making a real difference in sustainable fashion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShoppingBag, 
                value: "10,000+", 
                label: "Items Swapped", 
                subtext: "And counting every day!",
                color: "bg-blue-100 text-blue-600"
              },
              { 
                icon: Users, 
                value: "5,000+", 
                label: "Active Users", 
                subtext: "Growing community",
                color: "bg-purple-100 text-purple-600"
              },
              { 
                icon: Recycle, 
                value: "50 tons", 
                label: "Textile Waste Saved", 
                subtext: "Environmental impact",
                color: "bg-green-100 text-green-600"
              },
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 ${metric.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <metric.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{metric.value}</h3>
                <p className="text-xl font-semibold text-gray-800 mb-1">{metric.label}</p>
                <p className="text-gray-600">{metric.subtext}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started is simple and rewarding
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "List Your Items",
                description: "Upload photos and details of clothes you no longer wear",
                icon: "📸"
              },
              {
                step: "02",
                title: "Browse & Connect",
                description: "Discover amazing pieces from other community members",
                icon: "🔍"
              },
              {
                step: "03",
                title: "Swap & Enjoy",
                description: "Exchange items and refresh your wardrobe sustainably",
                icon: "🔄"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-sm shadow-lg">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Start your sustainable fashion journey today and be part of the change.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-3 bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}