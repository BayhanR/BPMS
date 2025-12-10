"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Tilt from "react-parallax-tilt";
import { Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumBackground } from "@/components/auth/premium-background";
import { PremiumInput } from "@/components/auth/premium-input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor!");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    setIsLoading(true);

    try {
      // Create user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Bir hata oluştu");
        setIsLoading(false);
        return;
      }

      // Auto sign in after signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
      setIsLoading(false);
      setIsTransitioning(true);
      
      // Blur out animation
      setTimeout(() => {
        router.push("/dashboard");
          router.refresh();
      }, 500);
      } else {
        setError("Hesap oluşturuldu ancak giriş yapılamadı. Lütfen giriş sayfasından deneyin.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("[SIGNUP] Error:", error);
      setError("Bir hata oluştu");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("[GOOGLE SIGNUP] Error:", error);
      setError("Google ile kayıt olurken bir hata oluştu");
    }
  };

  return (
    <>
      <PremiumBackground />

      <div className="absolute left-6 top-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Ana Sayfa
        </Link>
      </div>
      
      <AnimatePresence mode="wait">
        {!isTransitioning ? (
          <motion.div
            key="signup"
            className="flex items-center justify-center min-h-screen p-8"
            initial={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-md"
              style={{ perspective: "1000px" }}
            >
              <Tilt
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                scale={1.02}
                transitionSpeed={1500}
                className="relative"
              >
                <motion.div
                  className="relative rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl p-8 shadow-2xl"
                  style={{
                    boxShadow: "0 20px 60px rgba(255, 30, 86, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                  }}
                  whileHover={{
                    boxShadow: "0 30px 80px rgba(255, 30, 86, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.18) inset",
                  }}
                >
                  {/* Crimson Glow */}
                  <motion.div
                    className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-accent blur-xl opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 space-y-8">
                    {/* Logo */}
                    <motion.div
                      className="flex items-center justify-center gap-3"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        BPMS
                      </h1>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      className="text-center space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="text-3xl font-bold text-white">Hesap Oluştur</h2>
                      <p className="text-white/60">Yeni bir hesap oluşturun</p>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {/* Name */}
                      <PremiumInput
                        type="text"
                        label="Ad Soyad"
                        icon={User}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />

                      {/* Email */}
                      <PremiumInput
                        type="email"
                        label="Email"
                        icon={Mail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                      />

                      {/* Password */}
                      <PremiumInput
                        type="password"
                        label="Şifre"
                        icon={Lock}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />

                      {/* Confirm Password */}
                      <PremiumInput
                        type="password"
                        label="Şifre Tekrar"
                        icon={Lock}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
                        >
                          {error}
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="pt-2"
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:brightness-110 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : (
                            <>
                              Hesap Oluştur
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      {/* Divider */}
                      <div className="relative flex items-center justify-center my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-white/10" />
                        </div>
                        <span className="relative px-4 text-sm text-white/50 bg-transparent">
                          veya
                        </span>
                      </div>

                      {/* Google Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGoogleSignIn}
                          className="w-full h-12 rounded-xl bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all relative overflow-hidden group"
                          style={{
                            boxShadow: "0 4px 16px rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          <svg className="w-5 h-5 mr-2 relative z-10" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span className="relative z-10">Google ile Kayıt Ol</span>
                          <motion.div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)",
                              boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
                            }}
                          />
                        </Button>
                      </motion.div>
                    </motion.form>

                    {/* Footer */}
                    <motion.p
                      className="text-center text-sm text-white/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Zaten hesabınız var mı?{" "}
                      <a
                        href="/signin"
                        className="text-primary hover:text-accent transition-colors font-medium"
                      >
                        Giriş Yap
                      </a>
                    </motion.p>
                  </div>
                </motion.div>
              </Tilt>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="transition"
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]"
            initial={{ opacity: 0, filter: "blur(20px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

