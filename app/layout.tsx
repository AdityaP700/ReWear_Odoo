// app/layout.tsx
import type { Metadata } from "next";
import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./my-swaps/Navbar"; // Updated import path
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReWear - Sustainable Fashion Exchange",
  description: "Exchange unused clothing through direct swaps or point-based redemption system",
  generator: 'ReWear Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-50 to-white`}>
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: '#fff',
              color: '#374151',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        
        {/* Global Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold">ReWear</span>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                  Join the sustainable fashion revolution. Exchange, swap, and discover amazing pre-loved clothing while making a positive impact on our planet.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297C4.243 14.814 3.5 13.455 3.5 11.987c0-1.467.743-2.827 1.621-3.705.88-.807 2.031-1.297 3.328-1.297 1.297 0 2.448.49 3.328 1.297.878.878 1.621 2.238 1.621 3.705 0 1.468-.743 2.827-1.621 3.704-.88.807-2.031 1.297-3.328 1.297z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><a href="/" className="text-gray-400 hover:text-green-400 transition-colors">Home</a></li>
                  <li><a href="/browse" className="text-gray-400 hover:text-green-400 transition-colors">Browse</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-green-400 transition-colors">About</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="/help" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</a></li>
                  <li><a href="/privacy" className="text-gray-400 hover:text-green-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-400 hover:text-green-400 transition-colors">Terms of Service</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-green-400 transition-colors">FAQ</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
              <p className="text-gray-400">
                © 2025 ReWear. All rights reserved. Made with 💚 for a sustainable future.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}