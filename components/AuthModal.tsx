'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'email' | 'success';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { signInWithMagicLink } = useAuth();

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      await signInWithMagicLink(email);
      toast.success('📧 Magic link telah dikirim ke email Anda!');
      setStep('success');
    } catch (error: unknown) {
      console.error('Send magic link error:', error);
      toast.error('❌ Gagal mengirim magic link. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendMagicLink = async () => {
    if (!email) return;

    setLoading(true);
    try {
      await signInWithMagicLink(email);
      toast.success('📧 Magic link baru telah dikirim!');
    } catch (error: unknown) {
      console.error('Resend magic link error:', error);
      toast.error('❌ Gagal mengirim ulang magic link.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {step === 'email' && '🔐 Masuk dengan Magic Link'}
              {step === 'success' && '📧 Cek Email Anda'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Email Form */}
          {step === 'email' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSendMagicLink}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🪄</div>
                <p className="text-gray-300 text-sm">
                  Masukkan email Anda untuk menerima magic link
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <EnvelopeIcon className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="nama@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Mengirim Magic Link...
                  </>
                ) : (
                  '🪄 Kirim Magic Link'
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Dengan melanjutkan, Anda menyetujui untuk menerima email dari kami.
                  <br />
                  Akun akan dibuat otomatis jika belum ada.
                </p>
              </div>
            </motion.form>
          )}

          {/* Success Message */}
          {step === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">�</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Magic Link Terkirim!
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Kami telah mengirim magic link ke:
                </p>
                <p className="text-indigo-400 font-medium break-all mb-4">{email}</p>
              </div>

              <div className="bg-gray-800/50 border border-gray-600 rounded-xl p-4">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span>
                  Langkah selanjutnya:
                </h4>
                <ol className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-mono">1.</span>
                    Buka aplikasi email Anda
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-mono">2.</span>
                    Cari email dari aplikasi bookmark manager
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-mono">3.</span>
                    Klik tombol &quot;Sign In&quot; di dalam email
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-mono">4.</span>
                    Anda akan otomatis login
                  </li>
                </ol>
              </div>

              <div className="text-center space-y-3">
                <p className="text-xs text-gray-400">
                  Tidak menerima email? Cek folder spam atau coba kirim ulang
                </p>
                <button
                  type="button"
                  onClick={handleResendMagicLink}
                  disabled={loading}
                  className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors underline"
                >
                  📤 Kirim ulang magic link
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                >
                  ← Ganti email
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
