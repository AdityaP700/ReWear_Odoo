"use client";
import type React from "react";
import { useState, useCallback } from "react";
import { Search, Upload, X, Plus } from "lucide-react";
import Link from "next/link";

export default function AddItemPage() {
  const [images, setImages] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    size: "",
    condition: "",
    brand: "",
    color: "",
    material: "",
    swapPreferences: "",
  });

  const previousListings = [
    { id: 1, name: "Vintage Jacket", image: "/placeholder.svg?height=120&width=120", status: "Swapped" },
    { id: 2, name: "Summer Dress", image: "/placeholder.svg?height=120&width=120", status: "Available" },
    { id: 3, name: "Wool Sweater", image: "/placeholder.svg?height=120&width=120", status: "Pending" },
    { id: 4, name: "Leather Boots", image: "/placeholder.svg?height=120&width=120", status: "Available" },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const newFiles = Array.from(e.dataTransfer.files).slice(0, 5 - images.length);
        setImages((prev) => [...prev, ...newFiles]);
      }
    },
    [images.length],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5 - images.length);
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please log in to list an item.");

    // 1. First, save the text data
    const textData = { ...formData, description };
    const textResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(textData),
    });

    if (!textResponse.ok) {
      return alert("Failed to save item details.");
    }

    const newItem = await textResponse.json();

    // 2. If text data was saved and we have images, upload them
    if (images.length > 0) {
      const imageFormData = new FormData();
      images.forEach((image) => {
        imageFormData.append("images", image);
      });

      const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items/${newItem.id}/images`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        return alert("Item details saved, but failed to upload images.");
      }
    }

    alert("Item listed successfully!");
    // window.location.href = `/item/${newItem.id}`;
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-700" style={{ backgroundColor: "#2d3748" }}>
      {/* Header with Search */}
      <header className="bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-semibold text-white">ReWear</span>
            </Link>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for items, brands, or categories..."
                  className="w-full pl-12 pr-4 py-2 rounded-md bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">List Your Item</h1>
          <p className="text-gray-300">Share your pre-loved fashion with the ReWear community</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Side - Image Upload */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Add Images</label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    dragActive
                      ? "border-green-700 bg-green-700/10"
                      : images.length > 0
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-600 hover:border-green-700 hover:bg-green-700/10"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{ minHeight: "400px" }}
                >
                  {images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-300 mb-2">Drop images here or click to upload</p>
                      <p className="text-gray-500 mb-4">Support for JPG, PNG files (max 5 images)</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button
                        type="button"
                        className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition-colors"
                      >
                        Choose Files
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {images.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <div className="border-2 border-dashed border-gray-600 rounded-md h-32 flex items-center justify-center hover:border-green-700 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-white mb-4">Product Details</label>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Item Title"
                    className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Category</option>
                      <option value="tops">Tops</option>
                      <option value="bottoms">Bottoms</option>
                      <option value="dresses">Dresses</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="shoes">Shoes</option>
                      <option value="accessories">Accessories</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Size"
                      className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      required
                    >
                      <option value="">Condition</option>
                      <option value="like-new">Like New</option>
                      <option value="excellent">Excellent</option>
                      <option value="very-good">Very Good</option>
                      <option value="good">Good</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Brand"
                      className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Color"
                      className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />

                    <input
                      type="text"
                      placeholder="Material"
                      className="px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-white mb-4">Description & Swap Preferences</label>
                <textarea
                  placeholder="Describe your item in detail. Include any special features, styling tips, or reasons you're swapping it. What items are you looking for in return?"
                  className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-orange-600 transition-colors shadow-md"
                >
                  List Item for Swap
                </button>
              </div>
            </div>
          </div>

          {/* Previous Listings */}
          <div className="border-t border-gray-600 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Your Previous Listings</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previousListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-2">{item.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === "Available"
                          ? "bg-green-100 text-green-800"
                          : item.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-400 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}