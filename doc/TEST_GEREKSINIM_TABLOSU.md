# BPMS Detaylı Test Gereksinim Tablosu

## 📋 Test Stratejisi

**Önemli:** Testleri bu sırayla yap - her adım bir öncekine bağlı. Böylece sürekli sign in/out yapmana gerek kalmaz.

---

## 🔐 PHASE 1: Authentication & Onboarding (İlk Giriş)

### 1.1 Landing Page (`/`)
- [ ] **Sayfa yükleniyor mu?**
  - [ ] BPMS logosu görünüyor mu?
  - [ ] "Bayhan Project Management System" yazısı var mı?
  - [ ] "developed by bayhan.tech" linki var mı? (tıklanınca bayhan.tech'e gidiyor mu?)
  - [ ] Arka planda resimler otomatik geçiş yapıyor mu? (4 saniyede bir)
  - [ ] Partiküller hareket ediyor mu?

- [ ] **"Giriş Yap" Butonu**
  - [ ] Buton görünüyor mu?
  - [ ] Tıklanınca `/signin` sayfasına gidiyor mu?
  - [ ] Hover'da scale animasyonu çalışıyor mu?
  - [ ] Flash efekti var mı?

- [ ] **"Üye Ol" Butonu**
  - [ ] Buton görünüyor mu?
  - [ ] Tıklanınca `/signup` sayfasına gidiyor mu?
  - [ ] Hover'da scale animasyonu çalışıyor mu?
  - [ ] Flash efekti var mı?

### 1.2 Sign In Page (`/signin`)
- [ ] **Sayfa Yükleme**
  - [ ] Sayfa yükleniyor mu?
  - [ ] "Ana Sayfa" linki sol üstte var mı? (tıklanınca `/` gidiyor mu?)
  - [ ] BPMS logosu ve "Hoş Geldiniz" yazısı var mı?
  - [ ] Arka plan partikülleri sabit mi? (tuşa basınca oynamıyor mu?)

- [ ] **Form Alanları**
  - [ ] Email input var mı?
  - [ ] Password input var mı?
  - [ ] Placeholder'lar doğru mu?
  - [ ] Input'lara yazı yazılabiliyor mu?

- [ ] **"Giriş Yap" Butonu**
  - [ ] Buton görünüyor mu?
  - [ ] Boş form ile submit edilince hata veriyor mu?
  - [ ] Yanlış email/şifre ile hata mesajı gösteriyor mu?
  - [ ] Doğru bilgilerle giriş yapılıyor mu?
  - [ ] Giriş yapınca `/dashboard` veya `/workspaces`'e yönlendiriyor mu?
  - [ ] Loading animasyonu çalışıyor mu?

- [ ] **Google ile Giriş**
  - [ ] "Google ile Giriş Yap" butonu var mı?
  - [ ] Google logosu ortada mı? (sol üste yapışmış değil mi?)
  - [ ] Tıklanınca Google OAuth açılıyor mu?
  - [ ] Flash efekti çalışıyor mu?

- [ ] **Footer Link**
  - [ ] "Hesabınız yok mu? Kayıt Ol" linki var mı?
  - [ ] Tıklanınca `/signup`'a gidiyor mu?

### 1.3 Sign Up Page (`/signup`)
- [ ] **Sayfa Yükleme**
  - [ ] Sayfa yükleniyor mu?
  - [ ] "Ana Sayfa" linki var mı?
  - [ ] "Hesap Oluştur" başlığı var mı?

- [ ] **Form Alanları**
  - [ ] Ad Soyad input var mı?
  - [ ] Email input var mı?
  - [ ] Şifre input var mı?
  - [ ] Şifre Tekrar input var mı?
  - [ ] Tüm input'lara yazı yazılabiliyor mu?

- [ ] **Validasyon**
  - [ ] Şifreler eşleşmiyorsa hata veriyor mu?
  - [ ] Şifre 6 karakterden kısa ise hata veriyor mu?
  - [ ] Email formatı yanlışsa hata veriyor mu?

- [ ] **"Hesap Oluştur" Butonu**
  - [ ] Buton görünüyor mu?
  - [ ] Form submit edilince hesap oluşturuluyor mu?
  - [ ] Otomatik giriş yapılıyor mu?
  - [ ] `/dashboard` veya `/workspaces`'e yönlendiriyor mu?
  - [ ] Loading animasyonu çalışıyor mu?

- [ ] **Google ile Kayıt**
  - [ ] "Google ile Kayıt Ol" butonu var mı?
  - [ ] Google logosu ortada mı?
  - [ ] Tıklanınca Google OAuth açılıyor mu?

- [ ] **Footer Link**
  - [ ] "Zaten hesabınız var mı? Giriş Yap" linki var mı?
  - [ ] Tıklanınca `/signin`'e gidiyor mu?

---

## 🏢 PHASE 2: Workspace Management (Workspace Yönetimi)

### 2.1 Workspace Selection (`/workspaces`)
- [ ] **Sayfa Yükleme**
  - [ ] Giriş yapmadan erişilemiyor mu? (middleware redirect)
  - [ ] Giriş yapınca workspace'ler listeleniyor mu?
  - [ ] "Workspace Seç" başlığı var mı?

- [ ] **Workspace Listesi**
  - [ ] Mevcut workspace'ler görünüyor mu?
  - [ ] Her workspace kartında:
    - [ ] Workspace adı var mı?
    - [ ] Rol badge'i var mı? (Admin/Editor/Viewer)
    - [ ] Üye sayısı gösteriliyor mu?
    - [ ] Proje sayısı gösteriliyor mu?
    - [ ] Hover'da border rengi değişiyor mu?
    - [ ] Tıklanınca workspace seçiliyor mu?
    - [ ] Seçilince `/dashboard`'a gidiyor mu?

- [ ] **Yeni Workspace Oluştur**
  - [ ] "Yeni Workspace" kartı var mı?
  - [ ] Tıklanınca modal açılıyor mu?
  - [ ] Modal'da:
    - [ ] Workspace adı input var mı?
    - [ ] "Oluştur" butonu var mı?
    - [ ] "İptal" butonu var mı?
    - [ ] Boş isim ile hata veriyor mu?
    - [ ] Workspace oluşturulunca listede görünüyor mu?
    - [ ] Oluşturulunca otomatik seçiliyor mu?

- [ ] **Link ile Katıl**
  - [ ] "Link ile Katıl" kartı var mı?
  - [ ] Tıklanınca modal açılıyor mu?
  - [ ] Modal'da:
    - [ ] Davet linki input var mı?
    - [ ] "Katıl" butonu var mı?
    - [ ] Geçersiz link ile hata veriyor mu?
    - [ ] Geçerli link ile workspace'e katılıyor mu?
    - [ ] Katılınca listede görünüyor mu?

- [ ] **Empty State**
  - [ ] Workspace yoksa "Henüz workspace yok" mesajı var mı?
  - [ ] "Workspace Oluştur" butonu var mı?
  - [ ] "Link ile Katıl" butonu var mı?

### 2.2 Workspace Invite (`/team` sayfasından)
- [ ] **Davet Oluşturma**
  - [ ] "Üye Davet Et" butonu var mı? (sadece admin görüyor mu?)
  - [ ] Tıklanınca modal açılıyor mu?
  - [ ] Modal'da:
    - [ ] E-posta input var mı? (opsiyonel)
    - [ ] Rol seçimi var mı? (Editor/Viewer)
    - [ ] "Davet Oluştur" butonu var mı?
    - [ ] Davet oluşturulunca link gösteriliyor mu?
    - [ ] Link'te localhost yazmıyor mu? (window.location.origin kullanılıyor mu?)
    - [ ] "Kopyala" butonu çalışıyor mu?
    - [ ] Kopyalanınca "Kopyalandı!" yazıyor mu?
    - [ ] Input'a tıklanınca tüm link seçiliyor mu?

---

## 📊 PHASE 3: Dashboard & Navigation (Ana Sayfa & Navigasyon)

### 3.1 Dashboard (`/dashboard`)
- [ ] **Sayfa Yükleme**
  - [ ] Workspace seçmeden erişilemiyor mu? (redirect to `/workspaces`)
  - [ ] Workspace seçilince dashboard yükleniyor mu?
  - [ ] Sidebar görünüyor mu?
  - [ ] Topbar görünüyor mu?

- [ ] **Sidebar**
  - [ ] BPMS logosu var mı?
  - [ ] Menü öğeleri:
    - [ ] Dashboard (aktif mi?)
    - [ ] Projeler
    - [ ] Takvim
    - [ ] Takım
    - [ ] Ayarlar
    - [ ] Admin (sadece admin görüyor mu?)
  - [ ] Tüm linkler çalışıyor mu?
  - [ ] Collapse/Expand çalışıyor mu?

- [ ] **Topbar**
  - [ ] Arama kutusu var mı?
  - [ ] Tema toggle butonu var mı?
  - [ ] Bildirim ikonu var mı?
  - [ ] Profil dropdown var mı?
  - [ ] Workspace adı gösteriliyor mu? (sol tarafta)
  - [ ] Workspace adı doğru mu?

- [ ] **Dashboard İçeriği**
  - [ ] İstatistik kartları görünüyor mu?
    - [ ] Toplam Proje
    - [ ] Aktif Görev
    - [ ] Takım Üyesi
    - [ ] Tamamlanma Oranı
  - [ ] İstatistikler gerçek verilerden mi geliyor? (mock değil)
  - [ ] "Son Projeler" bölümü var mı?
  - [ ] Proje kartları tıklanabilir mi?
  - [ ] Tıklanınca proje detayına gidiyor mu?

### 3.2 Navigation Test
- [ ] **Sidebar Linkler**
  - [ ] Dashboard → `/dashboard`
  - [ ] Projeler → `/projects`
  - [ ] Takvim → `/calendar`
  - [ ] Takım → `/team`
  - [ ] Ayarlar → `/settings`
  - [ ] Admin → `/admin` (sadece admin)

- [ ] **Topbar Actions**
  - [ ] Arama kutusuna yazı yazılabiliyor mu?
  - [ ] Tema toggle çalışıyor mu?
  - [ ] Bildirim dropdown açılıyor mu?
  - [ ] Profil dropdown açılıyor mu?

---

## 📁 PHASE 4: Projects (Projeler)

### 4.1 Projects List (`/projects`)
- [ ] **Sayfa Yükleme**
  - [ ] Workspace seçmeden erişilemiyor mu?
  - [ ] Projeler listeleniyor mu?
  - [ ] Gerçek verilerden mi geliyor? (mock değil)

- [ ] **Proje Kartları**
  - [ ] Her proje kartında:
    - [ ] Proje adı var mı?
    - [ ] Proje açıklaması var mı?
    - [ ] Proje ikonu var mı?
    - [ ] Proje rengi doğru mu?
    - [ ] Task sayısı gösteriliyor mu?
    - [ ] Progress bar var mı?
    - [ ] Tıklanınca proje detayına gidiyor mu?

- [ ] **Yeni Proje Butonu**
  - [ ] "Yeni Proje" butonu var mı? (sadece admin/editor görüyor mu?)
  - [ ] Tıklanınca `/projects/new`'e gidiyor mu?
  - [ ] Viewer rolünde görünmüyor mu?

- [ ] **Empty State**
  - [ ] Proje yoksa "Henüz proje yok" mesajı var mı?
  - [ ] "Yeni Proje Oluştur" butonu var mı?
  - [ ] Tıklanınca `/projects/new`'e gidiyor mu?

- [ ] **View Mode**
  - [ ] Deck/List görünüm değiştirme var mı?
  - [ ] Her iki mod da çalışıyor mu?

### 4.2 New Project (`/projects/new`)
- [ ] **Sayfa Yükleme**
  - [ ] Sayfa yükleniyor mu?
  - [ ] Scroll çalışıyor mu? (aşağı inebiliyor musun?)

- [ ] **Template Seçimi**
  - [ ] Template kartları görünüyor mu?
  - [ ] Her template'te:
    - [ ] İsim var mı?
    - [ ] Açıklama var mı?
    - [ ] İkon var mı?
    - [ ] Renk var mı?
    - [ ] Tıklanınca seçiliyor mu?

- [ ] **Proje Oluşturma**
  - [ ] Template seçilince proje oluşturuluyor mu?
  - [ ] Loading animasyonu çalışıyor mu?
  - [ ] Hata durumunda hata mesajı gösteriliyor mu?
  - [ ] Başarılı olunca proje detayına gidiyor mu?
  - [ ] Veritabanına yazılıyor mu?

### 4.3 Project Detail (`/projects/[id]`)
- [ ] **Sayfa Yükleme**
  - [ ] Proje detayları yükleniyor mu?
  - [ ] Gerçek verilerden mi geliyor?

- [ ] **İstatistikler**
  - [ ] Completed tasks sayısı doğru mu?
  - [ ] In Progress tasks sayısı doğru mu?
  - [ ] Team Members sayısı doğru mu?
  - [ ] Days Left hesaplanıyor mu?

- [ ] **Project Sidebar**
  - [ ] "Kanban Board" linki var mı?
  - [ ] "Aktivite" linki var mı?
  - [ ] Tıklanınca ilgili sayfaya gidiyor mu?

### 4.4 Project Activity (`/projects/[id]/activity`)
- [ ] **Sayfa Yükleme**
  - [ ] Aktivite logları yükleniyor mu?
  - [ ] Gerçek verilerden mi geliyor? (mock değil)

- [ ] **Activity Feed**
  - [ ] Her aktivite gösteriliyor mu?
  - [ ] Kullanıcı bilgisi var mı?
  - [ ] Tarih/saat gösteriliyor mu?
  - [ ] Aktivite tipi gösteriliyor mu?

- [ ] **Empty State**
  - [ ] Aktivite yoksa "Henüz aktivite yok" mesajı var mı?

---

## 📋 PHASE 5: Kanban Board (Kanban Tahtası)

### 5.1 Kanban Board (`/projects/[id]/board`)
- [ ] **Sayfa Yükleme**
  - [ ] Sayfa yükleniyor mu? (siyah ekran yok mu?)
  - [ ] F5 atmadan yükleniyor mu?
  - [ ] Proje seçilince board yükleniyor mu?

- [ ] **Kolonlar**
  - [ ] "Yapılacak" kolonu var mı?
  - [ ] "Yapılıyor" kolonu var mı?
  - [ ] "Tamamlandı" kolonu var mı?
  - [ ] Her kolonda task sayısı gösteriliyor mu?

- [ ] **Task Kartları**
  - [ ] Task'lar görünüyor mu?
  - [ ] Gerçek verilerden mi geliyor? (mock değil)
  - [ ] Her task kartında:
    - [ ] Task başlığı var mı?
    - [ ] Task açıklaması var mı?
    - [ ] Priority badge var mı?
    - [ ] Assignee avatar var mı?
    - [ ] Due date gösteriliyor mu?
    - [ ] Tıklanınca task detay modal açılıyor mu?

- [ ] **Drag & Drop**
  - [ ] Task'lar sürüklenebiliyor mu?
  - [ ] Başka kolona bırakılabiliyor mu?
  - [ ] Bırakılınca status güncelleniyor mu?
  - [ ] Veritabanına yazılıyor mu?
  - [ ] Sayfa yenilenince değişiklik kalıyor mu?

- [ ] **Yeni Task Ekleme**
  - [ ] "Yeni Görev" butonu var mı? (sadece admin/editor)
  - [ ] Tıklanınca modal açılıyor mu?
  - [ ] Modal'da:
    - [ ] Başlık input var mı?
    - [ ] Açıklama textarea var mı?
    - [ ] Priority dropdown var mı?
    - [ ] Assignee dropdown var mı? (workspace üyeleri)
    - [ ] Due date picker var mı?
    - [ ] "Oluştur" butonu var mı?
    - [ ] Task oluşturulunca listede görünüyor mu?
    - [ ] Veritabanına yazılıyor mu?

- [ ] **Task Detay Modal**
  - [ ] Task'a tıklanınca modal açılıyor mu?
  - [ ] Modal'da:
    - [ ] Task başlığı düzenlenebiliyor mu?
    - [ ] Task açıklaması düzenlenebiliyor mu?
    - [ ] Status değiştirilebiliyor mu?
    - [ ] Priority değiştirilebiliyor mu?
    - [ ] Assignee değiştirilebiliyor mu?
    - [ ] Due date değiştirilebiliyor mu?
    - [ ] Değişiklikler kaydediliyor mu?
    - [ ] Veritabanına yazılıyor mu?

---

## 📅 PHASE 6: Calendar (Takvim)

### 6.1 Calendar Page (`/calendar`)
- [ ] **Sayfa Yükleme**
  - [ ] Workspace seçmeden erişilemiyor mu?
  - [ ] Takvim yükleniyor mu?
  - [ ] Gerçek task'lar gösteriliyor mu? (mock değil)

- [ ] **View Toggle**
  - [ ] Haftalık görünüm var mı?
  - [ ] Aylık görünüm var mı?
  - [ ] Geçiş yapılabiliyor mu?

- [ ] **Haftalık Görünüm**
  - [ ] Haftanın günleri gösteriliyor mu?
  - [ ] Bugünün tarihi vurgulanıyor mu?
  - [ ] Task'lar doğru günlerde gösteriliyor mu?
  - [ ] Task'lara tıklanınca detay açılıyor mu?

- [ ] **Aylık Görünüm**
  - [ ] Ay takvimi gösteriliyor mu?
  - [ ] Task'lar doğru günlerde gösteriliyor mu?
  - [ ] Günlere tıklanınca task eklenebiliyor mu?

- [ ] **Task Ekleme**
  - [ ] Günlere tıklanınca task ekleme modal açılıyor mu?
  - [ ] Task oluşturulunca takvimde görünüyor mu?

- [ ] **Scroll**
  - [ ] Mouse wheel ile scroll çalışıyor mu?
  - [ ] Arka plan kaymıyor mu?

---

## 👥 PHASE 7: Team (Takım)

### 7.1 Team Page (`/team`)
- [ ] **Sayfa Yükleme**
  - [ ] Workspace seçmeden erişilemiyor mu?
  - [ ] Takım üyeleri listeleniyor mu?
  - [ ] Gerçek verilerden mi geliyor? (mock değil)

- [ ] **Üye Listesi**
  - [ ] Her üyede:
    - [ ] Avatar var mı?
    - [ ] İsim var mı?
    - [ ] Email var mı?
    - [ ] Rol badge'i var mı? (Admin/Editor/Viewer)
    - [ ] "Rol Değiştir" butonu var mı? (sadece admin)
    - [ ] "Kaldır" butonu var mı? (sadece admin)

- [ ] **Rol Değiştirme**
  - [ ] Admin rol değiştirebiliyor mu?
  - [ ] Editor/Viewer değiştirebiliyor mu?
  - [ ] Değişiklik veritabanına yazılıyor mu?
  - [ ] Sayfa yenilenince değişiklik kalıyor mu?

- [ ] **Üye Kaldırma**
  - [ ] Admin üye kaldırabiliyor mu?
  - [ ] Kaldırılınca listeden gidiyor mu?
  - [ ] Veritabanından siliniyor mu?

- [ ] **Üye Davet Etme**
  - [ ] "Üye Davet Et" butonu var mı? (sadece admin)
  - [ ] Modal açılıyor mu?
  - [ ] Davet linki oluşturuluyor mu?
  - [ ] Link kopyalanabiliyor mu?

---

## ⚙️ PHASE 8: Settings (Ayarlar)

### 8.1 Settings Page (`/settings`)
- [ ] **Sayfa Yükleme**
  - [ ] Workspace seçmeden erişilemiyor mu?
  - [ ] Sayfa yükleniyor mu?
  - [ ] Sidebar ve Topbar görünüyor mu?

- [ ] **Tabs**
  - [ ] Profil tabı var mı?
  - [ ] Bildirimler tabı var mı?
  - [ ] Görünüm tabı var mı?
  - [ ] Güvenlik tabı var mı?
  - [ ] Tab geçişleri çalışıyor mu?

- [ ] **Profil Tabı**
  - [ ] Avatar gösteriliyor mu?
  - [ ] İsim input var mı?
  - [ ] Email input var mı? (disabled mı?)
  - [ ] Rol gösteriliyor mu?
  - [ ] "Kaydet" butonu var mı?
  - [ ] Kaydedilince değişiklikler kalıyor mu?

- [ ] **Bildirimler Tabı**
  - [ ] Toggle switch'ler var mı?
  - [ ] Her toggle çalışıyor mu?
  - [ ] Değişiklikler kaydediliyor mu?

- [ ] **Görünüm Tabı**
  - [ ] Tema seçenekleri var mı?
  - [ ] Seçim yapılabiliyor mu?

- [ ] **Güvenlik Tabı**
  - [ ] "Şifre Değiştir" butonu var mı?
  - [ ] "Aktif Oturumlar" bölümü var mı?
  - [ ] "Hesabı Sil" butonu var mı?

- [ ] **Çıkış Yap**
  - [ ] "Çıkış Yap" butonu var mı?
  - [ ] Tıklanınca çıkış yapılıyor mu?
  - [ ] Landing page'e yönlendiriliyor mu?
  - [ ] Store temizleniyor mu?

---

## 🔐 PHASE 9: Admin Panel

### 9.1 Admin Page (`/admin`)
- [ ] **Erişim Kontrolü**
  - [ ] Viewer/Editor erişemiyor mu? (redirect)
  - [ ] Sadece Admin erişebiliyor mu?

- [ ] **Sayfa Yükleme**
  - [ ] Workspace seçmeden erişilemiyor mu?
  - [ ] Sayfa yükleniyor mu?

- [ ] **Kullanıcı Yönetimi**
  - [ ] Kullanıcı listesi görünüyor mu?
  - [ ] Her kullanıcıda:
    - [ ] İsim var mı?
    - [ ] Email var mı?
    - [ ] Rol dropdown var mı?
    - [ ] "Sil" butonu var mı?
  - [ ] Rol değiştirilebiliyor mu?
  - [ ] Kullanıcı silinebiliyor mu?

- [ ] **Workspace Ayarları**
  - [ ] Workspace adı değiştirilebiliyor mu?
  - [ ] Workspace silinebiliyor mu?

---

## 🔗 PHASE 10: Invite System (Davet Sistemi)

### 10.1 Invite Link (`/invite/[token]`)
- [ ] **Sayfa Yükleme**
  - [ ] Geçersiz token ile hata veriyor mu?
  - [ ] Geçerli token ile sayfa açılıyor mu?
  - [ ] Workspace bilgisi gösteriliyor mu?
  - [ ] Rol bilgisi gösteriliyor mu?

- [ ] **Davet Kabul**
  - [ ] "Kabul Et" butonu var mı?
  - [ ] Giriş yapmadan kabul edilebiliyor mu?
  - [ ] Giriş yapılmışsa direkt kabul ediliyor mu?
  - [ ] Kabul edilince workspace'e ekleniyor mu?
  - [ ] `/workspaces` veya `/dashboard`'a yönlendiriliyor mu?

- [ ] **Hata Durumları**
  - [ ] Süresi dolmuş token ile hata veriyor mu?
  - [ ] Zaten kullanılmış token ile hata veriyor mu?
  - [ ] Email eşleşmiyorsa hata veriyor mu?

---

## 🧪 PHASE 11: Edge Cases & Error Handling

### 11.1 Network Errors
- [ ] **API Hataları**
  - [ ] Network hatası durumunda hata mesajı gösteriliyor mu?
  - [ ] 404 hatası durumunda uygun mesaj var mı?
  - [ ] 500 hatası durumunda uygun mesaj var mı?
  - [ ] 403 (Forbidden) hatası durumunda uygun mesaj var mı?

### 11.2 Empty States
- [ ] **Boş Durumlar**
  - [ ] Workspace yoksa uygun mesaj var mı?
  - [ ] Proje yoksa uygun mesaj var mı?
  - [ ] Task yoksa uygun mesaj var mı?
  - [ ] Üye yoksa uygun mesaj var mı?
  - [ ] Aktivite yoksa uygun mesaj var mı?

### 11.3 Loading States
- [ ] **Yükleme Durumları**
  - [ ] Her sayfada loading indicator var mı?
  - [ ] API çağrıları sırasında loading gösteriliyor mu?
  - [ ] Button'larda loading state var mı?

### 11.4 Form Validations
- [ ] **Form Doğrulamaları**
  - [ ] Tüm formlarda required field kontrolü var mı?
  - [ ] Email format kontrolü var mı?
  - [ ] Şifre uzunluk kontrolü var mı?
  - [ ] Şifre eşleşme kontrolü var mı?

---

## 🔄 PHASE 12: State Management & Persistence

### 12.1 Zustand Store
- [ ] **Store Persistence**
  - [ ] `currentWorkspaceId` localStorage'da saklanıyor mu?
  - [ ] `currentProjectId` localStorage'da saklanıyor mu?
  - [ ] `userRole` localStorage'da saklanıyor mu?
  - [ ] Sayfa yenilenince değerler korunuyor mu?
  - [ ] Çıkış yapınca store temizleniyor mu?

### 12.2 Session Management
- [ ] **NextAuth Session**
  - [ ] Session doğru şekilde oluşturuluyor mu?
  - [ ] `user.id` session'da var mı?
  - [ ] `user.role` session'da var mı?
  - [ ] `user.workspaceId` session'da var mı?
  - [ ] Session yenilenince değerler güncelleniyor mu?

---

## 🎨 PHASE 13: UI/UX & Animations

### 13.1 Animations
- [ ] **Framer Motion**
  - [ ] Sayfa geçişlerinde animasyon var mı?
  - [ ] Modal açılış/kapanış animasyonu var mı?
  - [ ] Button hover animasyonları var mı?
  - [ ] Card hover animasyonları var mı?

### 13.2 Responsive Design
- [ ] **Mobil Uyumluluk**
  - [ ] Mobilde sidebar collapse oluyor mu?
  - [ ] Mobilde tüm sayfalar düzgün görünüyor mu?
  - [ ] Touch gesture'lar çalışıyor mu?

### 13.3 Theme
- [ ] **Tema Sistemi**
  - [ ] Dark mode çalışıyor mu?
  - [ ] Tema değişikliği kalıcı mı?
  - [ ] Tüm sayfalarda tema uygulanıyor mu?

---

## 🐛 PHASE 14: Bug Checks (Bilinen Hatalar)

### 14.1 Önceki Hatalar
- [ ] **Düzeltilen Hatalar**
  - [ ] `findIndex` hatası düzeltildi mi?
  - [ ] Double sidebar sorunu çözüldü mü?
  - [ ] Kanban board siyah ekran sorunu çözüldü mü?
  - [ ] Logout crash sorunu çözüldü mü?
  - [ ] Project creation scroll sorunu çözüldü mü?
  - [ ] Default notifications sorunu çözüldü mü?
  - [ ] Calendar default tasks sorunu çözüldü mü?
  - [ ] Activity default data sorunu çözüldü mü?
  - [ ] Workspace name display sorunu çözüldü mü?
  - [ ] Invite link copy sorunu çözüldü mü?
  - [ ] Localhost in invite link sorunu çözüldü mü?

---

## ✅ Test Sonuçları

### Test Tarihi: _______________
### Test Eden: _______________

### Genel Durum:
- [ ] Tüm testler başarılı
- [ ] Bazı testler başarısız (detaylar aşağıda)

### Başarısız Testler:
1. _________________________________
2. _________________________________
3. _________________________________

### Notlar:
_________________________________
_________________________________
_________________________________

---

## 📝 Test Checklist Özeti

**Toplam Test Sayısı:** ~200+ test case

**Test Süresi Tahmini:** 2-3 saat (ilk test)

**Önemli:** 
- Testleri sırayla yap (her phase bir öncekine bağlı)
- Her testi işaretle
- Başarısız testleri not al
- Screenshot al (gerekirse)

**Sonraki Adımlar:**
1. Tüm testleri tamamla
2. Başarısız testleri listele
3. Hataları düzelt
4. Tekrar test et






