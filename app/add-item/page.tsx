// In app/add-item/page.tsx

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AddItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "", // Will be a comma-separated string
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define the available categories
  const categories = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];

  // Handle input changes dynamically
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Get the JWT from localStorage
    const token = localStorage.getItem("token");

    // Redirect to login if no token is found
    if (!token) {
      alert("You must be logged in to list an item. Redirecting to login...");
      router.push("/login");
      return;
    }

    try {
      // 2. Make the authenticated POST request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/items/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 3. Add the token to the request headers for authentication
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const newItem = await response.json();
        console.log("✅ Item listed successfully:", newItem);
        alert("Your item has been listed!");
        router.push("/dashboard"); // Redirect to dashboard on success
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to list item:", errorData);
        alert(`Failed to list item: ${errorData.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("⚠️ A network error occurred:", error);
      alert("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-secondary/20 text-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
            <PackagePlus className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">List Your Item</h1>
          <p className="text-gray-600">Fill out the details to add your clothing to the exchange.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g., Vintage Denim Jacket"
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              name="category"
              className="input-field"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the item, its condition, brand, size, etc."
              className="input-field min-h-[100px]"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="e.g., vintage, summer, cotton"
              className="input-field"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Listing..." : "List My Item"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/dashboard" className="text-accent hover:text-dark transition-colors inline-flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}