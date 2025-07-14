'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarkIcon, SparklesIcon, RocketLaunchIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const features = [
    { icon: "📱", title: "Responsif", desc: "Bekerja di semua device" },
    { icon: "🎨", title: "Modern UI", desc: "Design yang elegan dan interaktif" },
    { icon: "⚡", title: "Real-time", desc: "Data tersimpan langsung di cloud" },
    { icon: "🔍", title: "Pencarian", desc: "Temukan bookmark dengan mudah" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -50, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-8xl"
              >
                📚
              </motion.div>
              <div className="text-left">
                <h1 className="text-6xl font-bold gradient-text leading-tight">
                  Bookmark
                </h1>
                <h1 className="text-6xl font-bold gradient-text leading-tight">
                  Manager
                </h1>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Simpan, kelola, dan temukan kembali link penting Anda dengan 
              <span className="text-indigo-400 font-semibold"> style dan kemudahan</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                href="/bookmarks"
                className="group relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 flex items-center gap-3 btn-hover"
                >
                  <BookmarkIcon className="w-6 h-6" />
                  Mulai Mengelola Bookmark
                  <RocketLaunchIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index * 0.1) }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-dark rounded-2xl p-6 text-center border border-gray-700/50 hover:border-indigo-400/50 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-center mt-16"
          >
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
              <SparklesIcon className="w-5 h-5 text-indigo-400" />
              <span>Powered by Next.js, TypeScript & Supabase</span>
              <SparklesIcon className="w-5 h-5 text-indigo-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
