URL: http://localhost:3004/signin
Test kullanıcıları:
admin@bpms.io / Password123! (Admin)
editor1@bpms.io / Password123! (Editor)
viewer@bpms.io / Password123! (Viewer)
3. Workspace Seçimi
Giriş yaptıktan sonra /workspaces sayfasına yönlenmeli
"Bayhan Core" workspace'i görünmeli
Workspace'e tıklayınca dashboard'a gitmeli
[ ] Admin olarak workspace kartında **Sil** butonu görünüyor mu?
[ ] Sil butonuna tıklayınca onay modali açılıyor mu?
[ ] Modal içinde uyarı metni ve geri alınamaz ibaresi var mı?
[ ] **"SİL"** yazmadan silme butonu pasif mi?
[ ] "SİL" yazınca silme butonu aktif hale geliyor mu?
[ ] Silmeden sonra workspace listeden kayboluyor mu?
4. Dashboard (/dashboard)
[ ] İstatistikler (proje sayısı, görev sayısı, takım üyeleri) görünüyor mu?
[ ] Son projeler kartları görünüyor mu?
[ ] Projeye tıklayınca board'a gidiyor mu?
5. Projeler (/projects)
[ ] 3 proje listeleniyor mu? (CRM Pipeline, Analytics Dashboard, Mobile App)
[ ] Proje kartlarında progress bar görünüyor mu?
[ ] "Yeni Proje" butonu çalışıyor mu? (Admin/Editor)
6. Kanban Board (/projects/{id}/board)
[ ] Görevler 3 sütunda (Yapılacak, Devam Ediyor, Tamamlandı) görünüyor mu?
[ ] Drag-drop çalışıyor mu? (Görev sürükleyip bırak)
[ ] Tek navbar var mı? (çift navbar sorunu düzeldi mi?)
[ ] "+" butonu ile yeni görev eklenebiliyor mu?
7. Takvim (/calendar)
[ ] Sayfa açılıyor mu? (404 hatası düzeldi mi?)
[ ] Aylık görünüm çalışıyor mu?
[ ] Görevler takvimde görünüyor mu?
8. Ekip (/team)
[ ] Workspace üyeleri listeleniyor mu? (4 kişi)
[ ] Rol badge'leri doğru görünüyor mu? (Admin, Editor, Viewer)
[ ] Admin olarak rol değiştirme çalışıyor mu?
9. Admin Paneli (/admin)
[ ] Sadece admin kullanıcı erişebiliyor mu?
[ ] Kullanıcı listesi görünüyor mu?
[ ] Rol değiştirme dropdown'u çalışıyor mu?
[ ] Workspace ayarları sekmesi çalışıyor mu?
10. Rol Bazlı Yetkilendirme
Admin ile test et:
[ ] Tüm butonlar görünür
[ ] Üye davet edebilir
[ ] Rol değiştirebilir
Viewer ile test et (viewer@bpms.io):
[ ] "Yeni Proje" butonu gizli/disabled mı?
[ ] Kanban'da görev oluşturma butonu gizli mi?
[ ] Admin paneline erişim engelli mi?
11. Çıkış Yap & Tekrar Giriş
[ ] Çıkış yap butonu çalışıyor mu?
[ ] Çıkış sonrası landing page'e yönleniyor mu?
[ ] Tekrar giriş yapınca veriler korunuyor mu?