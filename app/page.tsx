"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, LogIn, LayoutDashboard, FolderKanban } from "lucide-react";
import Link from "next/link";
import { PremiumButton } from "@/components/ui/premium-button";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen p-8 overflow-hidden">
      <motion.div
        className="text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                "0 20px 60px rgba(255, 30, 86, 0.4)",
                "0 30px 80px rgba(255, 30, 86, 0.55)",
                "0 20px 60px rgba(255, 30, 86, 0.4)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            BPMS
          </motion.h1>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            animate={{
              textShadow: [
                "0 0 20px rgba(255, 30, 86, 0.35)",
                "0 0 40px rgba(255, 30, 86, 0.5)",
                "0 0 20px rgba(255, 30, 86, 0.35)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Coming Soon
          </motion.h2>
          <p className="text-xl text-white/60 max-w-md mx-auto mb-8">
            Ultra premium project management SaaS yakında sizlerle...
          </p>
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/signin">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <Button
                className="h-12 px-6 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                style={{
                  boxShadow: "0 4px 16px rgba(255, 255, 255, 0.1)",
                }}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Giriş Yap
              </Button>
            </motion.div>
          </Link>
          
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <Button
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:brightness-110 transition-all shadow-lg shadow-primary/30"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </motion.div>
          </Link>
          
          <Link href="/projects">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <Button
                className="h-12 px-6 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                style={{
                  boxShadow: "0 4px 16px rgba(255, 255, 255, 0.1)",
                }}
              >
                <FolderKanban className="w-5 h-5 mr-2" />
                Projeler
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="mt-12 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-white/50 mb-4">Hızlı Erişim:</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <Link href="/signin" className="text-primary hover:text-accent transition-colors hover:underline">
              /signin
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/signup" className="text-primary hover:text-accent transition-colors hover:underline">
              /signup
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/dashboard" className="text-primary hover:text-accent transition-colors hover:underline">
              /dashboard
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/projects" className="text-primary hover:text-accent transition-colors hover:underline">
              /projects
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/projects/new" className="text-primary hover:text-accent transition-colors hover:underline">
              /projects/new
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/projects/1/board" className="text-primary hover:text-accent transition-colors hover:underline">
              /projects/1/board
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/10 to-accent/15 blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}

