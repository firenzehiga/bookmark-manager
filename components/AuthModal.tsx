'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'login' | 'register' | 'verify';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, verifyOtp, resendOtp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      onClose();
      resetForm();
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('❌ Email atau password salah');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('📧 Silakan verifikasi email Anda terlebih dahulu');
        setStep('verify');
      } else {
        toast.error('❌ Gagal masuk. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email dan password wajib diisi!');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password);
      if (result.needsVerification) {
        toast.success('📧 Kode verifikasi telah dikirim ke email Anda!');
        setStep('verify');
      } else {
        toast.success('🎉 Pendaftaran berhasil!');
        onClose();
        resetForm();
      }
    } catch (error: unknown) {
      console.error('Register error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('already registered')) {
        toast.error('❌ Email sudah terdaftar');
      } else if (errorMessage.includes('Password should be at least')) {
        toast.error('❌ Password terlalu pendek');
      } else {
        toast.error('❌ Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Kode verifikasi harus 6 digit!');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, otpCode);
      toast.success('✅ Email berhasil diverifikasi!');
      onClose();
      resetForm();
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Token has expired')) {
        toast.error('🕐 Kode sudah kedaluwarsa. Silakan minta kode baru.');
      } else if (errorMessage.includes('Invalid token')) {
        toast.error('❌ Kode verifikasi salah');
      } else {
        toast.error('❌ Verifikasi gagal. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email tidak boleh kosong!');
      return;
    }

    setLoading(true);
    try {
      await resendOtp(email);
      toast.success('📧 Kode verifikasi baru telah dikirim!');
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      toast.error('❌ Gagal mengirim ulang kode');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setOtpCode('');
    setStep('login');
  };

  const handleClose = () => {
    onClose();
    resetForm();
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
              {step === 'login' && '🔐 Masuk'}
              {step === 'register' && '📝 Daftar'}
              {step === 'verify' && '📧 Verifikasi Email'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Login Form */}
          {step === 'login' && (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <EnvelopeIcon className="w-4 h-4" />
                  Email
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <LockClosedIcon className="w-4 h-4" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
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
                    Masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </button>

              <p className="text-center text-gray-400 text-sm">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
                >
                  Daftar di sini
                </button>
              </p>
            </motion.form>
          )}

          {/* Register Form */}
          {step === 'register' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <EnvelopeIcon className="w-4 h-4" />
                  Email
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <LockClosedIcon className="w-4 h-4" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Minimal 6 karakter"
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
                    Mendaftar...
                  </>
                ) : (
                  <>
                    <UserIcon className="w-5 h-5" />
                    Daftar
                  </>
                )}
              </button>

              <p className="text-center text-gray-400 text-sm">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
                >
                  Masuk di sini
                </button>
              </p>
            </motion.form>
          )}

          {/* OTP Verification Form */}
          {step === 'verify' && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">📧</div>
                <p className="text-gray-300 text-sm mb-1">
                  Kode verifikasi telah dikirim ke:
                </p>
                <p className="text-indigo-400 font-medium break-all">{email}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Cek folder spam jika tidak menemukan email
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                  🔢 Kode Verifikasi (6 digit)
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="123456"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memverifikasi...
                  </>
                ) : (
                  '✅ Verifikasi'
                )}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-gray-400 hover:text-white text-sm transition-colors underline"
                >
                  📤 Kirim ulang kode
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                >
                  ← Kembali ke pendaftaran
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
