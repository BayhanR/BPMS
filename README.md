# Bayhan Project Management System (BPMS)

Ultra premium proje yönetim SaaS'ı - Apple Vision Pro + Linear 2025 + Arc browser tarzı tasarım.

## 🚀 Özellikler

- **Next.js 15** App Router ile modern React geliştirme
- **TypeScript** ile tip güvenliği
- **Tailwind CSS** ile utility-first styling
- **shadcn/ui** ile premium componentler
- **Glassmorphism 2.0** tasarım sistemi
- **3D Depth Effects** ile interaktif kartlar
- **Smooth Scroll** (Lenis) ile premium deneyim
- **Dark/Light Mode** desteği (next-themes)
- **Framer Motion** ile akıcı animasyonlar
- **React Parallax Tilt** ile 3D tilt efektleri

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build
npm start
```

## 🎨 Tasarım Sistemi

### Renk Paleti
- Primary: `#8b5cf6` (Purple)
- Secondary: `#6366f1` (Indigo)
- Gradient: `from #6b21a8 to #1e1b4b`

### Glassmorphism
Tüm card componentleri glassmorphism efekti ile:
- Backdrop blur
- Semi-transparent backgrounds
- Gradient borders
- Inner/outer glows

### 3D Stacked Cards
Projects sayfasında üst üste binen 3D kartlar:
- Mouse hareketine göre parallax
- Hover'da öne çıkma (scale + glow)
- Spring physics ile animasyonlar
- Depth-based blur ve scale

## 📁 Klasör Yapısı

```
app/
├── layout.tsx           # Root layout (dark mode + lenis)
├── page.tsx             # Landing page (Coming Soon)
├── (auth)/
│   └── signin/          # Login sayfası
├── dashboard/           # Dashboard sayfası
└── projects/
    ├── page.tsx         # Projects list (3D stacked cards)
    ├── new/             # Template gallery
    └── [id]/            # Project detail
        ├── layout.tsx   # Project sidebar
        └── page.tsx     # Project dashboard

components/
├── 3d-stacked-project-card.tsx  # Premium 3D card component
├── floating-glass-card.tsx      # Reusable glass card
├── sidebar.tsx                  # Collapsible sidebar
├── topbar.tsx                   # Top navigation bar
└── ui/                          # shadcn/ui components
```

## 🔧 Teknolojiler

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **React Parallax Tilt** - 3D tilt effects
- **Lenis** - Smooth scrolling
- **next-themes** - Theme management
- **Lucide React** - Icons

## 🎯 Sayfalar

### Landing Page (`/`)
- Mor-indigo gradient background
- Logo ve "Coming Soon" mesajı
- Animated orbs ve glow effects

### Sign In (`/signin`)
- Linear tarzı floating form
- 3D tilt card
- Purple glow effects
- Glassmorphism design

### Dashboard (`/dashboard`)
- Stats cards (glassmorphism)
- Recent projects grid
- Hover animations
- Premium UI components

### Projects (`/projects`)
- **3D Stacked Cards** - Üst üste binen kartlar
- Mouse hareketine göre parallax
- Hover'da öne çıkma ve glow
- Spring physics animations

### New Project (`/projects/new`)
- Template gallery
- 20 adet template kartı
- 3D stacked card sistemi
- Grid layout alternatifi

### Project Detail (`/projects/[id]`)
- Project sidebar navigation
- Dashboard view
- Stats ve metrics

## 🎨 Component Detayları

### StackedProjectCard
Premium 3D card component:
- Depth-based scaling ve blur
- Mouse tracking ile parallax
- Spring physics animations
- Gradient borders ve glows
- Hover interactions

### FloatingGlassCard
Reusable glass card:
- Backdrop blur
- Hover scale animations
- Configurable glow intensity
- Border gradients

## 📝 Notlar

- Tüm animasyonlar performans odaklı
- Responsive design ile tüm cihazlarda çalışır
- Dark mode varsayılan olarak aktif
- Smooth scroll tüm sayfalarda aktif

## 🚧 Geliştirme Durumu

Proje iskeleti tamamlandı. İleriye dönük eklemeler:
- Authentication logic
- Database entegrasyonu
- API routes
- Real-time updates
- Advanced filtering

## 📄 Lisans

MIT

