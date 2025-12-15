"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiagonalScroll } from "@/components/landing/diagonal-scroll";

const FEATURES = [
  "Modern Proje Yönetimi",
  "Gerçek Zamanlı İşbirliği",
  "Gelişmiş Takvim Modülü",
  "Detaylı Raporlama",
];

export default function LandingPage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* Background - Diagonal Scroll - Fullscreen */}
      <div className="absolute inset-0 z-0">
        <DiagonalScroll />
      </div>

      {/* Overlay Content - Hero */}
      <div className="relative z-10 w-full lg:w-[60%] h-full flex flex-col justify-center px-8 md:px-12 lg:px-20">
        {/* Kırmızı glow */}
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#ff1e56]/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 -z-10" />

        <motion.div
          className="space-y-6 md:space-y-8"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image
              src="/bayhantechlogo.png"
              alt="Bayhan Tech Logo"
              width={120}
              height={120}
              className="mb-2 drop-shadow-[0_0_20px_rgba(255,30,86,0.5)]"
            />
          </motion.div>

          {/* Başlık */}
          <div className="space-y-2">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Bayhan
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff1e56] to-[#ff006e] drop-shadow-sm pb-2">
                Project Management
              </span>
              System
            </motion.h1>

            <motion.p
              className="text-white/60 text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              developed by{" "}
              <a
                href="https://bayhan.tech"
                target="_blank"
                rel="noreferrer"
                className="text-[#ff1e56] hover:underline hover:text-[#ff006e] transition-colors"
              >
                bayhan.tech
              </a>
            </motion.p>
          </div>

          {/* Açıklama */}
          <motion.p
            className="text-white/80 text-lg md:text-2xl max-w-2xl leading-relaxed font-light drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Projelerinizi yönetin, takımınızı organize edin, takvimlerinizi planlayın.
            Modern ve güçlü proje yönetim sistemi artık daha hızlı ve güvenli.
          </motion.p>

          {/* Butonlar */}
          <motion.div
            className="flex flex-col sm:flex-row gap-5 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link href="/signin">
              <Button className="h-16 px-10 rounded-2xl bg-[#ff1e56] hover:bg-[#d41544] text-white font-bold text-xl shadow-[0_10px_40px_rgba(255,30,86,0.4)] hover:shadow-[0_20px_50px_rgba(255,30,86,0.6)] hover:-translate-y-1 transition-all duration-300 border-none">
                <LogIn className="w-6 h-6 mr-3" />
                Giriş Yap
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="h-16 px-10 rounded-2xl border-2 border-white/20 bg-black/40 backdrop-blur-md text-white font-semibold text-xl hover:bg-white/10 hover:border-white/50 hover:-translate-y-1 transition-all duration-300"
              >
                <UserPlus className="w-6 h-6 mr-3" />
                Üye Ol
              </Button>
            </Link>
          </motion.div>

          {/* Özellik Listesi */}
          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {FEATURES.map((feature, i) => (
              <span
                key={i}
                className="px-5 py-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md text-sm md:text-base font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-default"
              >
                {feature}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

