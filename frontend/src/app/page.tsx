'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.push(isAuthenticated ? '/dashboard' : '/signup');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center">
      <p className="text-secondary">Loading...</p>
    </div>
  );
}
