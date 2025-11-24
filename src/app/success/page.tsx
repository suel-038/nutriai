'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Simulate payment confirmation
    localStorage.setItem('paid', 'true');
    // Redirect to main app
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Pagamento Confirmado!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Redirecionando para seu app de dieta...
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      </div>
    </div>
  );
}