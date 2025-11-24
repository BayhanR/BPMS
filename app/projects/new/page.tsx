"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import Tilt from "react-parallax-tilt";
import {
  ArrowLeft,
  Workflow,
  Calendar,
  Users,
  Target,
  FolderKanban,
  MessageSquare,
  TrendingUp,
  BarChart3,
  FileText,
  Shield,
  Code,
  Database,
  Settings,
  ShoppingCart,
  Layers,
  GitBranch,
  Zap,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebarContext } from "@/components/sidebar-context";

const templates = [
  {
    id: "crm-pipeline",
    name: "CRM Pipeline",
    description: "Müşteri ilişkileri yönetimi için kanban tarzı pipeline şablonu. Lead'lerden müşteriye dönüşüm sürecini takip edin.",
    color: "#8b5cf6",
    icon: Workflow,
  },
  {
    id: "content-calendar",
    name: "Content Calendar",
    description: "İçerik planlama ve takvimi için özel şablon. Blog yazıları, sosyal medya gönderileri ve kampanyaları organize edin.",
    color: "#6366f1",
    icon: Calendar,
  },
  {
    id: "recruitment",
    name: "Recruitment",
    description: "İşe alım süreçlerini yönetmek için tasarlanmış şablon. Başvurulardan onbording'e kadar tüm adımları takip edin.",
    color: "#ec4899",
    icon: Users,
  },
  {
    id: "sprint-planning",
    name: "Sprint Planning",
    description: "Agile takımlar için sprint planlama şablonu. User story'ler, görevler ve sprint hedeflerini yönetin.",
    color: "#06b6d4",
    icon: Target,
  },
  {
    id: "product-roadmap",
    name: "Product Roadmap",
    description: "Ürün geliştirme yol haritası için şablon. Feature'ları, milestone'ları ve release planlarını organize edin.",
    color: "#10b981",
    icon: FolderKanban,
  },
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Müşteri desteği ticket'larını yönetmek için şablon. SLA takibi, prioritization ve çözüm süreçlerini takip edin.",
    color: "#f59e0b",
    icon: MessageSquare,
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    description: "Pazarlama kampanyalarını planlamak ve yürütmek için şablon. Kampanya aşamaları, içerikler ve metrikleri yönetin.",
    color: "#ef4444",
    icon: TrendingUp,
  },
  {
    id: "data-analytics",
    name: "Data Analytics",
    description: "Veri analizi projeleri için şablon. Dashboard'lar, raporlar ve insight'ları organize edin.",
    color: "#a855f7",
    icon: BarChart3,
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Teknik dokümantasyon projeleri için şablon. API docs, kullanıcı kılavuzları ve wiki sayfalarını yönetin.",
    color: "#3b82f6",
    icon: FileText,
  },
  {
    id: "security-audit",
    name: "Security Audit",
    description: "Güvenlik denetimi ve compliance projeleri için şablon. Vulnerability'ler, riskler ve iyileştirmeleri takip edin.",
    color: "#ef4444",
    icon: Shield,
  },
  {
    id: "api-development",
    name: "API Development",
    description: "API geliştirme projeleri için şablon. Endpoint'ler, versioning ve integration testlerini yönetin.",
    color: "#06b6d4",
    icon: Code,
  },
  {
    id: "database-migration",
    name: "Database Migration",
    description: "Veritabanı migrasyon projeleri için şablon. Schema değişiklikleri, data migration ve rollback planlarını takip edin.",
    color: "#10b981",
    icon: Database,
  },
  {
    id: "devops-pipeline",
    name: "DevOps Pipeline",
    description: "CI/CD pipeline'ları yönetmek için şablon. Build, test, deploy süreçlerini ve infrastructure as code'u organize edin.",
    color: "#f97316",
    icon: Settings,
  },
  {
    id: "e-commerce",
    name: "E-Commerce",
    description: "E-ticaret projeleri için şablon. Product catalog, order management ve inventory tracking'i yönetin.",
    color: "#ec4899",
    icon: ShoppingCart,
  },
  {
    id: "ui-design-system",
    name: "UI Design System",
    description: "Design system projeleri için şablon. Component'ler, pattern'ler ve style guide'ları organize edin.",
    color: "#8b5cf6",
    icon: Layers,
  },
  {
    id: "feature-development",
    name: "Feature Development",
    description: "Yeni feature geliştirme projeleri için şablon. Design, development, testing ve launch süreçlerini yönetin.",
    color: "#6366f1",
    icon: GitBranch,
  },
  {
    id: "performance-optimization",
    name: "Performance Optimization",
    description: "Performans optimizasyonu projeleri için şablon. Benchmark'lar, profiling ve optimization task'larını takip edin.",
    color: "#f59e0b",
    icon: Zap,
  },
  {
    id: "product-launch",
    name: "Product Launch",
    description: "Ürün lansmanı projeleri için şablon. Pre-launch checklist, launch planı ve post-launch tracking'i yönetin.",
    color: "#10b981",
    icon: Rocket,
  },
  {
    id: "research-project",
    name: "Research Project",
    description: "Araştırma projeleri için şablon. Hypothesis, experiments, findings ve conclusions'ı organize edin.",
    color: "#14b8a6",
    icon: Sparkles,
  },
  {
    id: "blank-template",
    name: "Blank Template",
    description: "Sıfırdan başlamak için boş şablon. Kendi workflow'unuzu ve task'larınızı özelleştirin.",
    color: "#6b7280",
    icon: Sparkles,
  },
];

type TemplateData = (typeof templates)[number];

export default function NewProjectPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);
  const { sidebarWidth } = useSidebarContext();
  const contentStyle = React.useMemo(
    () => ({
      paddingLeft: sidebarWidth,
      transition: "padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    }),
    [sidebarWidth]
  );

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Mock: Yeni proje oluştur
    // Gerçek uygulamada burada API call yapılacak
    setTimeout(() => {
      const newProjectId = `project-${Date.now()}`;
      router.push(`/projects/${newProjectId}`);
    }, 300);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={contentStyle}>
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link href="/projects">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      <ArrowLeft className="w-5 h-5 text-white" />
                    </Button>
                  </motion.div>
                </Link>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Yeni Proje</h1>
                  <p className="text-white/60">Bir şablon seçin veya boş bir proje oluşturun</p>
                </div>
              </div>
            </div>

            {/* Template Menu */}
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
                <TemplateHeroCard template={templates[0]} onSelect={handleTemplateSelect} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {templates.slice(1,5).map((template, index) => (
                    <TemplateMiniCard
                      key={template.id}
                      template={template}
                      index={index}
                      onSelect={handleTemplateSelect}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.slice(5,14).map((template, index) => (
                  <TemplateMenuCard
                    key={template.id}
                    template={template}
                    index={index}
                    onSelect={handleTemplateSelect}
                  />
                ))}
              </div>
            </div>

            {/* Loading State (Mock) */}
            {selectedTemplate && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 p-8 text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-4 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">Proje Oluşturuluyor...</h3>
                  <p className="text-white/60">Template uygulanıyor, lütfen bekleyin.</p>
                </motion.div>
              </motion.div>
            )}

            {/* Quick Access - All Templates List (Optional) */}
            <div className="mt-8 md:mt-16">
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-6">Tüm Şablonlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {templates.map((template, index) => {
                  const Icon = template.icon;
                  return (
                    <motion.button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className="group relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 text-left hover:bg-white/10 transition-all overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Gradient Overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${template.color}, ${template.color}80)`,
                        }}
                      />
                      
                      <div
                        className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center relative z-10"
                        style={{
                          background: `linear-gradient(135deg, ${template.color}, ${template.color}80)`,
                        }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 relative z-10">{template.name}</h3>
                      <p className="text-xs text-white/50 line-clamp-2 relative z-10">{template.description}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function TemplateHeroCard({
  template,
  onSelect,
}: {
  template: TemplateData;
  onSelect: (id: string) => void;
}) {
  const Icon = template.icon;

  return (
    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={1500}>
      <motion.button
        onClick={() => onSelect(template.id)}
        className="relative w-full h-full text-left rounded-[32px] border border-white/10 bg-gradient-to-br from-[#24060d] via-[#120508] to-[#080808] backdrop-blur-2xl p-8 overflow-hidden shadow-[0_40px_140px_rgba(255,30,86,0.35)]"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 160, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${template.color}55, transparent 50%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.15), transparent 40%)`,
          }}
        />
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10"
              style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}99)` }}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60 uppercase tracking-wide">Featured Template</p>
              <h2 className="text-3xl font-bold text-white">{template.name}</h2>
            </div>
          </div>
          <p className="text-white/70 text-base mb-8 leading-relaxed max-w-2xl">{template.description}</p>

          <div className="mt-auto grid grid-cols-2 gap-4 text-sm text-white/70">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/50 text-xs mb-1">Zaman çizelgesi</p>
              <p className="text-lg font-semibold text-white">Sprint 18</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/50 text-xs mb-1">Takım</p>
              <p className="text-lg font-semibold text-white">Core Product</p>
            </div>
          </div>

          <motion.div
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold bg-gradient-to-r from-rose-500 to-indigo-500 shadow-lg shadow-rose-500/25"
            whileHover={{ scale: 1.05, x: 4 }}
          >
            Use Template
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </motion.div>
        </div>
      </motion.button>
    </Tilt>
  );
}

function TemplateMiniCard({
  template,
  index,
  onSelect,
}: {
  template: TemplateData;
  index: number;
  onSelect: (id: string) => void;
}) {
  const Icon = template.icon;
  return (
    <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03} transitionSpeed={1200}>
      <motion.button
        onClick={() => onSelect(template.id)}
        className="relative w-full text-left rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -6 }}
      >
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{ opacity: 0.2 }}
          whileHover={{ opacity: 0.4 }}
          style={{
            background: `linear-gradient(135deg, ${template.color}, transparent)`,
          }}
        />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}88)` }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Popular</p>
              <h3 className="text-lg font-semibold text-white">{template.name}</h3>
            </div>
          </div>
          <p className="text-xs text-white/60 line-clamp-3">{template.description}</p>
        </div>
      </motion.button>
    </Tilt>
  );
}

function TemplateMenuCard({
  template,
  index,
  onSelect,
}: {
  template: TemplateData;
  index: number;
  onSelect: (id: string) => void;
}) {
  const Icon = template.icon;
  return (
    <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.02} transitionSpeed={1000}>
      <motion.button
        onClick={() => onSelect(template.id)}
        className="relative w-full text-left rounded-2xl border border-white/10 bg-[#0f1117]/70 backdrop-blur-2xl p-5 overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        whileHover={{ y: -4 }}
      >
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${template.color}, ${template.color}88)` }}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{template.name}</h3>
            <p className="text-xs text-white/50">3D Action Ready</p>
          </div>
        </div>
        <p className="text-xs text-white/60 mb-4 relative z-10 line-clamp-2">{template.description}</p>
        <div className="flex items-center justify-between text-xs text-white/50 relative z-10">
          <span>20+ task preset</span>
          <span className="text-white">Use →</span>
        </div>
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.button>
    </Tilt>
  );
}