"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { useSidebarContext } from "@/components/sidebar-context";
import { useAppStore } from "@/lib/store";
import {
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  Save,
  Loader2,
  Check,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { sidebarWidth } = useSidebarContext();
  const { userRole } = useAppStore();
  
  const [activeTab, setActiveTab] = React.useState("profile");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  
  // Form states
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    taskAssigned: true,
    taskCompleted: true,
    mentions: true,
  });
  const [theme, setTheme] = React.useState<"dark" | "light" | "system">("dark");

  React.useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  const handleSave = async () => {
    setSaving(true);
    // Simüle kaydetme - gerçek API eklenebilir
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Bildirimler", icon: Bell },
    { id: "appearance", label: "Görünüm", icon: Palette },
    { id: "security", label: "Güvenlik", icon: Shield },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={contentStyle}>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Ayarlar</h1>
              <p className="text-white/60">
                Hesap ayarlarınızı ve tercihlerinizi yönetin
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar Tabs */}
              <div className="md:w-56 space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left",
                      "transition-all duration-200",
                      activeTab === tab.id
                        ? "bg-primary/20 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                ))}

                {/* Sign Out Button */}
                <motion.button
                  onClick={handleSignOut}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left mt-4",
                    "text-red-400 hover:text-red-300 hover:bg-red-500/10",
                    "transition-all duration-200"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Çıkış Yap</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Profil Bilgileri
                      </h2>

                      {/* Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white">
                          {name?.charAt(0) || email?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-white font-medium">{name || "Kullanıcı"}</p>
                          <p className="text-white/60 text-sm">{email}</p>
                          <p className="text-primary text-xs mt-1 capitalize">
                            {userRole || "member"}
                          </p>
                        </div>
                      </div>

                      {/* Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            Ad Soyad
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                              "w-full px-4 py-3 rounded-xl",
                              "bg-white/5 border border-white/10",
                              "text-white placeholder:text-white/40",
                              "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50",
                              "transition-all duration-200"
                            )}
                            placeholder="Adınızı girin"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">
                            E-posta
                          </label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className={cn(
                              "w-full px-4 py-3 rounded-xl",
                              "bg-white/5 border border-white/10",
                              "text-white/50",
                              "cursor-not-allowed"
                            )}
                          />
                          <p className="text-xs text-white/40 mt-1">
                            E-posta adresi değiştirilemez
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Tab */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Bildirim Tercihleri
                      </h2>

                      <div className="space-y-4">
                        {[
                          { key: "email", label: "E-posta Bildirimleri", desc: "Önemli güncellemeler için e-posta al" },
                          { key: "push", label: "Push Bildirimleri", desc: "Tarayıcı bildirimleri al" },
                          { key: "taskAssigned", label: "Görev Atamaları", desc: "Sana görev atandığında bildirim al" },
                          { key: "taskCompleted", label: "Görev Tamamlanma", desc: "Bir görev tamamlandığında bildirim al" },
                          { key: "mentions", label: "Bahsetmeler", desc: "Biri senden bahsettiğinde bildirim al" },
                        ].map((item) => (
                          <div
                            key={item.key}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                          >
                            <div>
                              <p className="text-white font-medium">{item.label}</p>
                              <p className="text-white/50 text-sm">{item.desc}</p>
                            </div>
                            <button
                              onClick={() =>
                                setNotifications((prev) => ({
                                  ...prev,
                                  [item.key]: !prev[item.key as keyof typeof prev],
                                }))
                              }
                              className={cn(
                                "w-12 h-6 rounded-full transition-colors relative",
                                notifications[item.key as keyof typeof notifications]
                                  ? "bg-primary"
                                  : "bg-white/20"
                              )}
                            >
                              <motion.div
                                className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                                animate={{
                                  left: notifications[item.key as keyof typeof notifications]
                                    ? "calc(100% - 22px)"
                                    : "2px",
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Appearance Tab */}
                  {activeTab === "appearance" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Görünüm Ayarları
                      </h2>

                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">
                          Tema
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: "dark", label: "Koyu", icon: Moon },
                            { id: "light", label: "Açık", icon: Sun },
                            { id: "system", label: "Sistem", icon: Monitor },
                          ].map((t) => (
                            <motion.button
                              key={t.id}
                              onClick={() => setTheme(t.id as typeof theme)}
                              className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border",
                                "transition-all duration-200",
                                theme === t.id
                                  ? "bg-primary/20 border-primary/50"
                                  : "bg-white/5 border-white/10 hover:border-white/20"
                              )}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <t.icon className={cn(
                                "w-6 h-6",
                                theme === t.id ? "text-primary" : "text-white/60"
                              )} />
                              <span className={cn(
                                "text-sm font-medium",
                                theme === t.id ? "text-white" : "text-white/60"
                              )}>
                                {t.label}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                        <p className="text-xs text-white/40 mt-2">
                          Şu an sadece koyu tema desteklenmektedir
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-white mb-4">
                        Güvenlik
                      </h2>

                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-white font-medium mb-1">Şifre Değiştir</p>
                          <p className="text-white/50 text-sm mb-4">
                            Hesap güvenliğiniz için şifrenizi düzenli olarak değiştirin
                          </p>
                          <button
                            className={cn(
                              "px-4 py-2 rounded-lg",
                              "bg-white/10 hover:bg-white/20",
                              "text-white text-sm font-medium",
                              "transition-colors"
                            )}
                          >
                            Şifre Değiştir
                          </button>
                        </div>

                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-white font-medium mb-1">Aktif Oturumlar</p>
                          <p className="text-white/50 text-sm mb-4">
                            Tüm cihazlardaki oturumlarınızı görüntüleyin
                          </p>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">Bu Cihaz</p>
                              <p className="text-white/50 text-xs">Şu an aktif</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                          <p className="text-red-400 font-medium mb-1">Hesabı Sil</p>
                          <p className="text-white/50 text-sm mb-4">
                            Hesabınızı kalıcı olarak silin. Bu işlem geri alınamaz.
                          </p>
                          <button
                            className={cn(
                              "px-4 py-2 rounded-lg",
                              "bg-red-500/20 hover:bg-red-500/30",
                              "text-red-400 text-sm font-medium",
                              "transition-colors"
                            )}
                          >
                            Hesabı Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl",
                        "bg-gradient-to-r from-primary to-accent",
                        "text-white font-medium",
                        "hover:opacity-90 transition-opacity",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : saved ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      {saving ? "Kaydediliyor..." : saved ? "Kaydedildi!" : "Kaydet"}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

