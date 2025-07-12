"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Recycle, ShoppingBag, Users, ArrowRight } from "lucide-react";

// Define a type for the item data
interface ProductItem {
  id: number;
  title: string;
  images: string[];
}

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Using more professional and relevant images for the carousel
  const carouselImages = [
    "https://images.unsplash.com/photo-1555529771-835f59ee5020?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop&q=80",
  ];

  const categories = [
    { name: "Tops", icon: "👕" },
    { name: "Dresses", icon: "👗" },
    { name: "Outerwear", icon: "🧥" },
    { name: "Pants", icon: "👖" },
    { name: "Shoes", icon: "👟" },
    { name: "Accessories", icon: "👜" }
  ];

  // Fetching logic remains the same
  useEffect(() => {
    const fetchLandingPageItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch landing page items:", error);
      }
    };
    fetchLandingPageItems();
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white font-sans">
      {/* Hero Carousel */}
      <section className="relative w-full h-[60vh] overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselImages.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img src={src} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            </div>
          ))}
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Reimagine Your <span className="text-green-400">Wardrobe</span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-8 text-gray-200 leading-relaxed">
            Join the community swapping pre-loved clothes to create a more sustainable future.
          </p>
          <Link 
            href="/browse" 
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Browse Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <button 
          onClick={prevSlide} 
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6"/>
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg"
        >
          <ChevronRight className="w-6 h-6"/>
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing pieces across all categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link 
                href="/browse" 
                key={category.name} 
                className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <p className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Listings Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Listings</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fresh arrivals from our community
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link 
                key={product.id} 
                href={`/item/${product.id}`} 
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.images?.[0] || "/placeholder.svg"} 
                    alt={product.title} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 truncate text-lg group-hover:text-green-600 transition-colors">
                    {product.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/browse" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Items
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Recycle className="w-8 h-8 text-green-600" />,
              title: "Sustainable Exchange",
              description: "Reduce waste by giving your clothes a second life through our community-driven platform."
            },
            {
              icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
              title: "Quality Finds",
              description: "Discover unique, pre-loved pieces that match your style and values."
            },
            {
              icon: <Users className="w-8 h-8 text-green-600" />,
              title: "Growing Community",
              description: "Join thousands of fashion enthusiasts making a positive environmental impact."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-20 mt-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Join our sustainable fashion community today and make a difference.
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