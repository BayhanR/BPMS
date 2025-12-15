# BPMS Ödeme Sistemi Planı

## 📋 Genel Bakış

BPMS için subscription (abonelik) tabanlı ödeme sistemi planı. Türkiye'deki ödeme gateway'leri ile entegrasyon.

---

## 💳 Ödeme Gateway Seçenekleri (Türkiye)

### 1. **İyzico** (Önerilen ⭐)
- **Avantajlar:**
  - Türkiye'nin en popüler ödeme gateway'i
  - Kolay entegrasyon (REST API)
  - 3D Secure desteği
  - Recurring payment (otomatik yenileme) desteği
  - Webhook desteği
  - Detaylı dokümantasyon (Türkçe)
  
- **Ücretler:**
  - Setup: Ücretsiz
  - İşlem başına: ~%2.9 + 0.25₺
  - Aylık: Minimum işlem yok
  
- **Kurulum:**
  - Sandbox hesabı: Ücretsiz test
  - Production: İyzico'dan hesap açma gerekir

### 2. **PayTR**
- **Avantajlar:**
  - Türk ödeme sistemi
  - Düşük komisyon oranları
  - Kolay entegrasyon
  
- **Dezavantajlar:**
  - İyzico kadar yaygın değil
  - Dokümantasyon sınırlı

### 3. **Paymes**
- **Avantajlar:**
  - Modern API
  - İyi dokümantasyon
  
- **Dezavantajlar:**
  - Daha az bilinen

### 4. **Stripe** (Türkiye'de de çalışıyor)
- **Avantajlar:**
  - Global standart
  - Mükemmel dokümantasyon
  - Güçlü webhook sistemi
  
- **Dezavantajlar:**
  - Türkiye'de daha az kullanılıyor
  - Komisyon biraz daha yüksek

**Öneri:** İyzico ile başla, daha sonra gerekirse Stripe ekle.

---

## 📦 Subscription Planları

### **Free Plan** (Ücretsiz)
- **Fiyat:** 0₺/ay
- **Özellikler:**
  - 1 Workspace
  - 3 Proje
  - 10 Task/Proje
  - 2 Üye/Workspace
  - Temel özellikler
  - 100MB depolama

### **Pro Plan** (Bireysel/Küçük Ekip)
- **Fiyat:** 99₺/ay veya 990₺/yıl (2 ay indirim)
- **Özellikler:**
  - 3 Workspace
  - Sınırsız Proje
  - Sınırsız Task
  - 10 Üye/Workspace
  - Tüm özellikler
  - 10GB depolama
  - Öncelikli destek
  - API erişimi

### **Enterprise Plan** (Büyük Ekipler/Şirketler)
- **Fiyat:** 299₺/ay veya 2990₺/yıl (2 ay indirim)
- **Özellikler:**
  - Sınırsız Workspace
  - Sınırsız Proje
  - Sınırsız Task
  - Sınırsız Üye
  - Tüm özellikler
  - 100GB depolama
  - 7/24 öncelikli destek
  - Özel API erişimi
  - Özel entegrasyonlar
  - Özel branding

---

## 🗄️ Database Schema (Prisma)

```prisma
enum SubscriptionPlan {
  free
  pro
  enterprise
}

enum SubscriptionStatus {
  active
  canceled
  expired
  past_due
  trialing
}

enum PaymentStatus {
  pending
  completed
  failed
  refunded
}

enum PaymentMethod {
  credit_card
  bank_transfer
  manual
}

// Workspace bazlı subscription (Workspace'e bağlı)
model Subscription {
  id                String            @id @default(cuid())
  workspaceId       String            @unique
  plan              SubscriptionPlan  @default(free)
  status            SubscriptionStatus @default(active)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean          @default(false)
  canceledAt        DateTime?
  trialEndsAt       DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  workspace         Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  payments          Payment[]
  
  @@index([workspaceId])
  @@index([status])
  @@index([currentPeriodEnd])
}

// Ödeme kayıtları
model Payment {
  id                String            @id @default(cuid())
  subscriptionId    String
  amount            Float             // TL cinsinden
  currency          String            @default("TRY")
  status            PaymentStatus     @default(pending)
  method            PaymentMethod
  transactionId    String?           // İyzico transaction ID
  iyzicoPaymentId   String?          // İyzico payment ID
  description       String?
  metadata          Json?            // Ek bilgiler
  paidAt            DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  subscription      Subscription      @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  
  @@index([subscriptionId])
  @@index([status])
  @@index([transactionId])
}

// İyzico webhook kayıtları (debug için)
model PaymentWebhook {
  id                String            @id @default(cuid())
  eventType         String
  payload           Json
  processed         Boolean          @default(false)
  error             String?
  createdAt         DateTime          @default(now())
  
  @@index([eventType])
  @@index([processed])
}
```

---

## 🔄 Subscription Akışı

### 1. **Yeni Subscription**
```
Kullanıcı "Pro Plan" seçer
    ↓
/pricing sayfası → Plan seçimi
    ↓
/api/subscriptions/create → Subscription oluştur (trial başlat)
    ↓
İyzico'ya yönlendir → Ödeme sayfası
    ↓
Ödeme başarılı → Webhook gelir
    ↓
Subscription aktif → Workspace limitleri artar
```

### 2. **Ödeme Yenileme (Recurring)**
```
Subscription bitiş tarihi yaklaşır (7 gün kala)
    ↓
Email bildirimi gönder
    ↓
Bitiş tarihi geldi → İyzico otomatik ödeme
    ↓
Webhook → Ödeme başarılı
    ↓
Subscription uzatılır (1 ay/1 yıl)
```

### 3. **İptal**
```
Kullanıcı "İptal Et" tıklar
    ↓
cancelAtPeriodEnd = true
    ↓
Mevcut dönem bitene kadar aktif kalır
    ↓
Dönem bitince → Free plan'a düşer
```

---

## 🛠️ Teknik Implementasyon

### 1. **API Routes**

#### `/api/subscriptions`
- `GET` - Kullanıcının workspace subscription'larını listele
- `POST` - Yeni subscription oluştur (trial başlat)

#### `/api/subscriptions/[id]`
- `GET` - Subscription detayları
- `PATCH` - Subscription güncelle (plan değiştir, iptal et)
- `DELETE` - Subscription iptal et

#### `/api/payments`
- `GET` - Ödeme geçmişi
- `POST` - Manuel ödeme oluştur (bank transfer için)

#### `/api/payments/iyzico/webhook`
- `POST` - İyzico webhook handler
  - `payment.success` → Subscription aktif
  - `payment.failed` → Subscription askıya al
  - `subscription.canceled` → İptal işle

#### `/api/payments/iyzico/checkout`
- `POST` - İyzico checkout session oluştur
  - Return URL: `/pricing/success`
  - Cancel URL: `/pricing`

### 2. **Middleware - Limit Kontrolü**

```typescript
// middleware.ts veya API route'larda
export async function checkSubscriptionLimits(
  workspaceId: string,
  action: 'create_project' | 'add_member' | 'create_task'
) {
  const subscription = await prisma.subscription.findUnique({
    where: { workspaceId },
  });
  
  if (!subscription || subscription.status !== 'active') {
    return { allowed: false, reason: 'No active subscription' };
  }
  
  const limits = getPlanLimits(subscription.plan);
  const current = await getCurrentUsage(workspaceId);
  
  switch (action) {
    case 'create_project':
      return { 
        allowed: current.projects < limits.maxProjects,
        reason: 'Project limit reached'
      };
    case 'add_member':
      return { 
        allowed: current.members < limits.maxMembers,
        reason: 'Member limit reached'
      };
    // ...
  }
}
```

### 3. **UI Components**

#### `/app/pricing/page.tsx`
- Plan karşılaştırma tablosu
- "Plan Seç" butonları
- Mevcut plan gösterimi

#### `/app/settings/billing/page.tsx`
- Mevcut subscription bilgisi
- Ödeme geçmişi
- Plan değiştirme
- İptal etme
- Ödeme yöntemi yönetimi

---

## 🔐 Güvenlik

1. **Webhook Signature Doğrulama**
   - İyzico'dan gelen webhook'ları imza ile doğrula
   - Replay attack koruması

2. **Rate Limiting**
   - Ödeme API'lerine rate limit ekle
   - DDoS koruması

3. **Sensitive Data**
   - Payment bilgilerini asla loglama
   - Transaction ID'leri hash'le

---

## 📊 Monitoring & Analytics

1. **Metrics**
   - Aktif subscription sayısı
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - Conversion rate (Free → Pro)

2. **Alerts**
   - Ödeme başarısız → Email bildirimi
   - Subscription bitiyor → 7 gün önce uyarı
   - Webhook hataları → Slack/Discord bildirimi

---

## 🚀 Implementation Sırası

### Phase 1: Temel Yapı (1-2 hafta)
1. ✅ Prisma schema ekle (Subscription, Payment)
2. ✅ Migration çalıştır
3. ✅ Subscription model oluştur
4. ✅ Limit kontrol middleware'i yaz
5. ✅ `/pricing` sayfası oluştur

### Phase 2: İyzico Entegrasyonu (1 hafta)
1. ✅ İyzico SDK kurulumu
2. ✅ Sandbox hesabı aç
3. ✅ Checkout flow implementasyonu
4. ✅ Webhook handler yaz
5. ✅ Test ödemeleri

### Phase 3: Subscription Yönetimi (1 hafta)
1. ✅ Plan değiştirme
2. ✅ İptal etme
3. ✅ Ödeme geçmişi
4. ✅ Email bildirimleri

### Phase 4: Production (1 hafta)
1. ✅ İyzico production hesabı
2. ✅ Webhook signature doğrulama
3. ✅ Monitoring kurulumu
4. ✅ Dokümantasyon

---

## 💰 Fiyatlandırma Stratejisi

### Türkiye Pazarı İçin:
- **Free Plan:** Her zaman ücretsiz (lead generation)
- **Pro Plan:** 99₺/ay (bireysel/küçük ekip için uygun)
- **Enterprise:** 299₺/ay (büyük şirketler için)

### Yıllık Ödeme İndirimi:
- 2 ay bedava (10 ay öde, 12 ay kullan)
- Daha iyi cash flow
- Daha düşük churn

---

## 📝 Notlar

1. **Sanal POS:** İyzico kendi sanal POS'unu sağlıyor, ekstra kurulum gerekmez
2. **Vergi:** İyzico fatura kesiyor, sen sadece subscription yönet
3. **Refund:** İyzico üzerinden iade yapılabilir
4. **Test:** Sandbox modunda test et, production'a geçmeden önce

---

## 🔗 Kaynaklar

- [İyzico Dokümantasyon](https://dev.iyzipay.com/tr)
- [İyzico Node.js SDK](https://github.com/iyzico/iyzipay-node)
- [Recurring Payment Guide](https://dev.iyzipay.com/tr/api/recurring-payment)

---

## ✅ Sonraki Adımlar

1. İyzico sandbox hesabı aç
2. Prisma schema'yı güncelle
3. İlk API route'ları yaz
4. `/pricing` sayfasını tasarla
5. Test ödemesi yap






