"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { StackedTemplateCard } from "@/components/3d-stacked-template-card";
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

export default function NewProjectPage() {
  const router = useRouter();
  const [mouseX, setMouseX] = React.useState(0);
  const [mouseY, setMouseY] = React.useState(0);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };

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
    <div className="flex h-screen overflow-hidden" onMouseMove={handleMouseMove}>
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-80 ml-0">
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

            {/* Template Gallery - 3D Stacked Cards */}
            <div className="relative h-[500px] md:h-[700px] flex items-center justify-center perspective-1000 mb-8 overflow-hidden">
              <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
                {templates.map((template, index) => (
                  <StackedTemplateCard
                    key={template.id}
                    template={template}
                    index={index}
                    total={templates.length}
                    mouseX={mouseX}
                    mouseY={mouseY}
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
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center"
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
