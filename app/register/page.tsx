"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { User } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration attempt:", formData)
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="flex gap-8 max-w-4xl w-full">
        {/* Registration Form */}
        <div className="card flex-1">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">Join ReWear</h1>
            <p className="text-gray-600">Create your sustainable fashion account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="input-field"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Register
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Info Panel */}
        <div className="card flex-1">
          <h3 className="text-xl font-bold text-primary mb-4">Why Join ReWear?</h3>
          <div className="space-y-4 text-gray-600">
            <div>
              <h4 className="font-semibold text-dark">Form-based login/signup</h4>
              <p className="text-sm">Quick and easy registration process</p>
            </div>
            <div>
              <h4 className="font-semibold text-dark">Option for social login</h4>
              <p className="text-sm">Connect with your existing social accounts</p>
            </div>
            <div>
              <h4 className="font-semibold text-dark">Redirects to dashboard upon success</h4>
              <p className="text-sm">Get started immediately after registration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
