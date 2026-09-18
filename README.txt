ARABAMI BUL V1.2 — GERÇEK MODÜLER SÜRÜM

Bu sürüm, mevcut tek HTML dosyasını:
- index.html
- css/style.css
- js/app.js
- js/core.js
- js/filters.js
- js/favorites.js
- js/search.js
- js/wizard.js
- js/detail.js
- js/listing.js
- js/chat.js
- data/
- images/

olarak ayırır.

AMAÇ
Her özellik için sonraki geliştirmeleri ayrı dosyada yapabilmek.
app.js uygulamanın mevcut çekirdeğini ve paylaşılan verileri korur.
Özellik fonksiyonlarının ana gövdeleri ilgili modüllere ayrılmıştır.

VERCEL
index.html kökte olduğu için statik site olarak yayınlanabilir.
GitHub'a ZIP'i değil, ZIP'in içindeki dosyaları yükle.
Build komutu gerekmez.

NOT
V1.2'nin amacı mimariyi düzeltmektir; tasarım baştan değiştirilmemiştir.
Araç demo verileri henüz API/database değildir. Sonraki aşamada data/cars.json
veya gerçek backend/database yapısına taşınabilir.

AI GELİŞTİRME KURALI
Bir özellik istenirse sadece ilgili modülü değiştir:
- araç detay: detail.js
- Araba Bul: wizard.js
- filtre: filters.js
- favoriler: favorites.js
- arama: search.js
- ilan verme: listing.js
- sohbet: chat.js
- ortak/başlangıç kodu: app.js/core.js
