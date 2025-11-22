# 🧪 Bayhan PMS - Test Rehberi

## 🚀 Sunucuyu Başlatma

```bash
npm run dev
```

Sunucu `http://localhost:3004` adresinde çalışacak.

## 📍 Test Edilebilecek Sayfalar

### Ana Sayfa
- **URL:** `http://localhost:3004/`
- **Açıklama:** Landing page - Coming Soon ekranı
- **Özellikler:** Logo, "Coming Soon" mesajı, navigation linkleri

### Authentication
- **URL:** `http://localhost:3004/signin`
- **Açıklama:** Premium login sayfası
- **Özellikler:** 
  - Mesh gradient arka plan
  - Floating particles
  - 3D tilt card
  - Google login butonu
  - Focus'ta grow + glow input'lar
  - Başarılı girişte blur transition

- **URL:** `http://localhost:3004/signup`
- **Açıklama:** Premium kayıt sayfası
- **Özellikler:** Aynı premium özellikler + şifre tekrar alanı

### Dashboard
- **URL:** `http://localhost:3004/dashboard`
- **Açıklama:** Ana dashboard
- **Özellikler:**
  - Stats cards (glassmorphism)
  - Recent projects grid
  - Hover animations
  - Sidebar + Topbar

### Projects
- **URL:** `http://localhost:3004/projects`
- **Açıklama:** 3D stacked cards - Tüm projeler
- **Özellikler:**
  - Üst üste binen 3D kartlar
  - Fareye göre parallax
  - Hover'da öne çıkma
  - Spring physics animations

### New Project (Template Gallery)
- **URL:** `http://localhost:3004/projects/new`
- **Açıklama:** Template seçimi - 20 şablon
- **Özellikler:**
  - 3D stacked template cards
  - Template seçimi
  - Loading state
  - Redirect to project

### Kanban Board
- **URL:** `http://localhost:3004/projects/1/board`
- **Açıklama:** Kanban board - Drag & drop
- **Özellikler:**
  - dnd-kit ile drag & drop
  - 3D task cards
  - Task detail modal
  - New task modal
  - Socket.io hazır

### Activity Feed
- **URL:** `http://localhost:3004/projects/1/activity`
- **Açıklama:** Activity feed - Infinite scroll
- **Özellikler:**
  - Glass cards
  - Infinite scroll
  - Activity timeline

## 🎯 Test Senaryoları

### 1. Landing Page → Navigation
- Landing page'deki butonlara tıkla
- "Giriş Yap" → `/signin`
- "Dashboard" → `/dashboard`
- "Projeler" → `/projects`
- Alt kısımdaki hızlı linkleri test et

### 2. Sign In → Dashboard Transition
1. `/signin` sayfasına git
2. Email ve şifre gir (herhangi bir değer)
3. "Giriş Yap" butonuna tıkla
4. **Blur out → Blur in** transition'ı gözlemle
5. Dashboard'a yönlendirilir

### 3. Projects - 3D Stacked Cards
1. `/projects` sayfasına git
2. Fareyi kartların üzerinde hareket ettir
3. **Parallax efektini** gözlemle
4. Bir karta hover yap
5. **Öne çıkma + glow** efektini gözlemle

### 4. Template Gallery
1. `/projects/new` sayfasına git
2. Stacked template kartlarını gör
3. Bir template'e hover yap
4. "Use Template" butonuna tıkla
5. Loading state'i gör
6. Yeni projeye redirect olur

### 5. Kanban Board
1. `/projects/1/board` sayfasına git
2. Bir task kartına **tıkla** → Task detail modal açılır
3. Task kartını **sürükle-bırak** yap
4. Floating orb butonuna tıkla → New task modal
5. Column'daki "Add Task" butonuna tıkla

### 6. Mobile Responsive
1. Tarayıcıyı mobile boyutuna getir (F12 → Toggle device toolbar)
2. **Hamburger button** (sol üst) görünür
3. Tıkla → Sidebar açılır
4. Cards **vertical stack** olur
5. Sidebar dışına tıkla → Kapanır

### 7. Notifications
1. Topbar'daki **bell icon**'a tıkla
2. Notifications dropdown açılır
3. Spring animation gözlemle
4. Bir notification'a tıkla → Mark as read

### 8. Activity Feed
1. `/projects/1/activity` sayfasına git
2. Aşağı scroll yap
3. **Infinite scroll** tetiklenir
4. Yeni activity'ler yüklenir

## 🎨 Animasyon Testleri

### Spring Physics
- Tüm animasyonlar **stiffness: 100-200, damping: 20** civarı
- **Akıcı ve yumuşak** olmalı

### Button Hover
- Herhangi bir butona hover yap
- **Scale 1.05 + Y: -2px + glow** gözlemle

### Card Hover
- Glass card'lara hover yap
- **Scale + glow + rise** efektlerini gör

### Page Transitions
- Sayfa geçişlerinde **blur + scale + rotateX** gör
- **Spring physics** ile yumuşak

## 📱 Mobile Test

### Breakpoints
- **Mobile:** < 768px → Hamburger menu, vertical stack
- **Tablet:** 768px - 1024px → Responsive grid
- **Desktop:** > 1024px → Full layout

### Mobile Features
- Sidebar → Hamburger button
- Cards → Vertical stack
- Topbar → Compact layout
- Modals → Full screen (mobile)

## 🐛 Bilinen Durumlar

### Mock Data
- Tüm veriler mock (örnek)
- Authentication mock (herhangi bir değerle giriş yapılabilir)
- Socket.io mock (server URL yok)

### Test İçin
- Dashboard'a direkt gidilebilir (`/dashboard`)
- Projects'e direkt gidilebilir (`/projects`)
- Kanban board'a direkt gidilebilir (`/projects/1/board`)

## ✅ Test Checklist

- [ ] Landing page navigation linkleri çalışıyor
- [ ] Sign in sayfası açılıyor
- [ ] Sign up sayfası açılıyor
- [ ] Dashboard görüntüleniyor
- [ ] Projects - 3D cards çalışıyor
- [ ] Template gallery açılıyor
- [ ] Kanban board açılıyor
- [ ] Task detail modal açılıyor
- [ ] Drag & drop çalışıyor
- [ ] Mobile responsive çalışıyor
- [ ] Notifications dropdown açılıyor
- [ ] Activity feed infinite scroll çalışıyor
- [ ] Page transitions smooth
- [ ] Tüm animasyonlar akıcı
- [ ] Button hover efektleri çalışıyor

## 🎯 Hızlı Test URL'leri

```
http://localhost:3004/                    → Landing
http://localhost:3004/signin              → Login
http://localhost:3004/signup              → Register
http://localhost:3004/dashboard           → Dashboard
http://localhost:3004/projects            → Projects (3D Cards)
http://localhost:3004/projects/new        → Template Gallery
http://localhost:3004/projects/1/board    → Kanban Board
http://localhost:3004/projects/1/activity → Activity Feed
http://localhost:3004/projects/1          → Project Detail
```

Happy Testing! 🚀

