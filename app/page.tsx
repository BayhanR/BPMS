"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  { id: "projects", src: "/projects.png", label: "Projeler" },
  { id: "projects2", src: "/projects2.png", label: "Proje Detay" },
  { id: "calendarweek", src: "/calendarweek.png", label: "Haftalık Takvim" },
  { id: "calendarmonth", src: "/calendarmonth.png", label: "Aylık Takvim" },
  { id: "team", src: "/teamsection.png", label: "Takım" },
  { id: "dashboard", src: "/dashboard.png", label: "Dashboard" },
];

export default function LandingPage() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = SLIDES[index];

  return (
    <div className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0a0a0a]">
      {/* Sol Taraf - Hero */}
      <div className="relative z-10 w-full lg:w-[45%] min-h-[50vh] lg:min-h-screen flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]">
        {/* Kırmızı glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff1e56]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ff006e]/15 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

        <motion.div
          className="relative z-10 space-y-8"
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
              width={100}
              height={100}
              className="mb-4"
            />
          </motion.div>

          {/* Başlık */}
          <div className="space-y-3">
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Bayhan
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ff1e56] to-[#ff006e]">
                Project Management
              </span>
              System
            </motion.h1>

            <motion.p
              className="text-white/50 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              developed by{" "}
              <a
                href="https://bayhan.tech"
                target="_blank"
                rel="noreferrer"
                className="text-[#ff1e56] hover:underline"
              >
                bayhan.tech
              </a>
            </motion.p>
          </div>

          {/* Açıklama */}
          <motion.p
            className="text-white/60 text-base md:text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Projelerinizi yönetin, takımınızı organize edin, takvimlerinizi planlayın.
            Modern ve güçlü proje yönetim sistemi.
          </motion.p>

          {/* Butonlar */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Link href="/signin">
              <Button className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#ff1e56] to-[#ff006e] text-white font-semibold text-lg shadow-[0_20px_50px_rgba(255,30,86,0.4)] hover:shadow-[0_25px_60px_rgba(255,30,86,0.5)] hover:scale-105 transition-all duration-300">
                <LogIn className="w-5 h-5 mr-2" />
                Giriş Yap
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 border-white/20 bg-white/5 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Üye Ol
              </Button>
            </Link>
          </motion.div>

          {/* Slide göstergeleri */}
          <motion.div
            className="flex items-center gap-2 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <span className="text-white/40 text-sm mr-2">Özellikler:</span>
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-gradient-to-r from-[#ff1e56] to-[#ff006e]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Alt çizgi dekor */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff1e56]/30 to-transparent" />
      </div>

      {/* Sağ Taraf - Görsel Carousel */}
      <div className="relative w-full lg:w-[55%] min-h-[50vh] lg:min-h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Görsel - tam sığdır */}
            <img
              src={current.src}
              alt={current.label}
              className="w-full h-full object-cover"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />

            {/* Label */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#ff1e56] animate-pulse" />
                <span className="text-white font-semibold text-xl drop-shadow-lg">
                  {current.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-white/70 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <span>{index + 1}</span>
                <span>/</span>
                <span>{SLIDES.length}</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#ff1e56]/30 pointer-events-none"
            style={{
              top: `${20 + i * 12}%`,
              left: `${15 + i * 14}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
