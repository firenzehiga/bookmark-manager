'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowContent(true);
    }
  }, [loading]);

  if (loading || !showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-gray-400 mb-6">
            Silakan login untuk mengakses halaman ini dan mengelola bookmark Anda
          </p>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300">
              Untuk menggunakan Bookmark Manager, Anda perlu:
            </p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1 text-left">
              <li>• Klik tombol &ldquo;Masuk&rdquo; di navbar</li>
              <li>• Daftar akun baru atau login</li>
              <li>• Verifikasi email dengan kode yang dikirim</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
