"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Users, Recycle, TrendingUp, Heart, ShoppingBag } from "lucide-react";

export default function BrowsePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const featuredItems = [
    {
      id: 1,
      name: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      size: "M",
      price: "$45",
      rating: 4.8,
      liked: false,
    },
    // ... (other items unchanged for brevity)
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "ReWear has completely changed how I shop for clothes. I've found amazing pieces and made great friends!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
    },
    // ... (other testimonials unchanged)
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredItems.length - 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredItems.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, featuredItems.length - 2)) % Math.max(1, featuredItems.length - 2));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">ReWear</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                Home
              </a>
              <a href="#" className="text-green-600 font-medium border-b-2 border-green-600">
                Browse
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
                Login
              </a>
              <button className="bg-green-600 text-white px-5 py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
                Sign Up
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative px-4 sm:px-6 lg:px-8 py-16 text-center transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Discover <span className="text-green-600">Sustainable</span> Fashion
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Exchange, swap, and find amazing pre-loved clothing while making a positive impact on our planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 transition-colors">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Start Swapping
              </span>
            </button>
            <button className="border border-green-600 text-green-600 px-8 py-3 rounded-md font-medium hover:bg-green-50 transition-colors">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Browse Items
              </span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Items Carousel */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">Featured Items</h2>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextSlide} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {featuredItems.map((item) => (
                <div key={item.id} className="w-1/3 flex-shrink-0 px-2">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
                      <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                        <Heart className={`w-5 h-5 ${item.liked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                      </button>
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-medium">
                        Size {item.size}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <span className="text-lg font-semibold text-green-600">{item.price}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                        <span className="text-gray-600 text-sm ml-2">{item.rating}</span>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-8">What Our Community Says</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
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
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
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
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-white mb-4">Ready to Join the Revolution?</h2>
          <p className="text-lg text-green-100 mb-6">Start your sustainable fashion journey today.</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-md font-medium hover:bg-green-50 transition-colors">
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}