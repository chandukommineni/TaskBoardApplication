'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth-token');
    if (token) {
      setIsAuthenticated(true);
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 m-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo App</h1>
          <p className="text-gray-600 mb-8">Organize your tasks with ease</p>
          
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
            >
              Login
            </Link>
            
            <Link
              href="/auth/register"
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 block text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}