// In app/my-swaps/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, ChevronLeft } from "lucide-react";
import io from 'socket.io-client';
import toast from 'react-hot-toast';

// Corrected Type
interface MadeSwap {
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
  RequestedItem: {
    id: number;
    title: string;
    images: string[]; // Corrected: images is an array
  };
  createdAt: string;
}

export default function MySwapsPage() {
  const router = useRouter();
  const [swaps, setSwaps] = useState<MadeSwap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

    const fetchMadeSwaps = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/swaps/made`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSwaps(data);
        } else {
          console.error("Failed to fetch swap history");
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMadeSwaps(); // Initial fetch

    // Listen for real-time updates
    socket.on('swap_status_update', () => {
      toast.success("A swap's status has been updated!");
      fetchMadeSwaps(); // Refetch to get the new status
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-dark text-white flex justify-center items-center">Loading your swap history...</div>;
  }

  return (
    <div className="min-h-screen bg-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-secondary/20 text-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
            <ArrowLeftRight className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-light mb-2">My Swap Requests</h1>
          <p className="text-gray-400">Here is the status of all the items you've requested.</p>
        </div>

        <div className="bg-light rounded-lg shadow-lg p-6 space-y-4">
          {swaps.length > 0 ? (
            swaps.map(swap => (
              <div key={swap.id} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <img src={swap.RequestedItem.images?.[0] || '/placeholder.svg'} alt={swap.RequestedItem.title} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <Link href={`/item/${swap.RequestedItem.id}`} className="font-semibold text-dark hover:text-primary transition-colors">{swap.RequestedItem.title}</Link>
                    <p className="text-sm text-gray-500">Requested on {new Date(swap.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusClass(swap.status)}`}>
                  {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">You haven't made any swap requests yet.</p>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-accent hover:text-light transition-colors inline-flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}