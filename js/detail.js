/* =========================================================
   ARABAMI BUL — V2 ARAÇ DETAY SİSTEMİ
   Hedef: Profesyonel ilan detay sayfası
   ========================================================= */

(function () {
  "use strict";

  const AB_Detail = {
    currentCar: null,
    currentImageIndex: 0,
    images: [],
    previousBodyOverflow: "",

    open(id) {
      const cars = window.dummyCars || [];
      const car = cars.find(c => String(c.id) === String(id));

      if (!car) {
        console.error("Araç bulunamadı:", id);
        return;
      }

      this.currentCar = car;
      this.currentImageIndex = 0;
      this.images = this.getImages(car);

      const container = document.getElementById("car-detail-container");

      if (!container) {
        console.error("car-detail-container bulunamadı.");
        return;
      }

      this.previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      container.innerHTML = this.render(car);
      container.style.display = "block";

      this.bindEvents();
      this.updateGallery();

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    },

    close() {
      const container = document.getElementById("car-detail-container");

      if (!container) return;

      container.style.display = "none";
      container.innerHTML = "";

      document.body.style.overflow = this.previousBodyOverflow || "";
    },

    getImages(car) {
      let images = [];

      if (Array.isArray(car.images)) {
        images = car.images.filter(Boolean);
      }

      if (!images.length && Array.isArray(car.photos)) {
        images = car.photos.filter(Boolean);
      }

      if (!images.length && car.image) {
        images = [car.image];
      }

      if (!images.length && car.photo) {
        images = [car.photo];
      }

      if (!images.length) {
        images = [
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
        ];
      }

      return images;
    },

    money(value) {
      const number = Number(value) || 0;

      return number.toLocaleString("tr-TR") + " TL";
    },

    number(value) {
      return Number(value || 0).toLocaleString("tr-TR");
    },

    fuelText(car) {
      return car.fuel || car.yakit || "Benzin";
    },

    transText(car) {
      return car.trans || car.transmission || car.vites || "Otomatik";
    },

    bodyText(car) {
      return car.body || car.kasa || car.seg || "Otomobil";
    },

    locationText(car) {
      return car.location || car.city || "İstanbul, Kadıköy";
    },

    sellerName(car) {
      return car.seller || car.sellerName || "Ahmet Kaya";
    },

    getTrustScore(car) {
      if (car.trustScore) return Number(car.trustScore);

      const km = Number(car.km) || 0;

      if (km < 10000) return 92;
      if (km < 30000) return 89;
      if (km < 70000) return 86;
      if (km < 120000) return 82;

      return 78;
    },

    getMatchScore(car) {
      if (car.matchScore) return Number(car.matchScore);

      const score = 88 + ((Number(car.id) || 1) % 8);

      return Math.min(score, 96);
    },

    render(car) {
      const images = this.getImages(car);
      const trust = this.getTrustScore(car);
      const match = this.getMatchScore(car);

      const brand = car.brand || "Otomobil";
      const model = car.model || "";
      const title = `${brand} ${model}`.trim();

      const year = car.year || "-";
      const km = this.number(car.km);
      const fuel = this.fuelText(car);
      const trans = this.transText(car);
      const body = this.bodyText(car);
      const price = this.money(car.price);

      const favoriteActive =
        Array.isArray(window.favorites) &&
        window.favorites.includes(car.id);

      return `
        <div class="ab-detail-page">

          <!-- =================================================
               ÜST SİTE NAVİGASYONU
          ================================================== -->

          <header class="ab-detail-site-header">

            <div class="ab-detail-logo">
              <div class="ab-detail-logo-icon">🚘</div>
              <div>
                <strong>ARABAMI <span>BUL</span></strong>
              </div>
            </div>

            <nav class="ab-detail-main-nav">
              <button data-detail-nav="home">Ana Sayfa</button>
              <button data-detail-nav="wizard">Bana Araba Bul</button>
              <button data-detail-nav="browse">Araçları İncele</button>
              <button data-detail-nav="favorites">Favorilerim</button>
              <button data-detail-nav="listing">İlan Ver</button>
            </nav>

            <div class="ab-detail-user-area">
              <button class="ab-detail-search-icon" type="button">⌕</button>
              <button class="ab-detail-notification" type="button">♧</button>

              <div class="ab-detail-avatar">👤</div>

              <strong>Ahmet Yılmaz</strong>
              <span>⌄</span>
            </div>

          </header>


          <!-- =================================================
               ANA İÇERİK
          ================================================== -->

          <main class="ab-detail-main">

            <!-- BREADCRUMB -->

            <div class="ab-detail-breadcrumb">
              <button data-detail-nav="home">Ana Sayfa</button>
              <span>›</span>
              <button data-detail-nav="browse">Araçlar</button>
              <span>›</span>
              <strong>${this.escape(title)}</strong>
            </div>


            <!-- =================================================
                 ÜST İLAN ALANI
            ================================================== -->

            <section class="ab-detail-hero">

              <!-- GALERİ -->

              <div class="ab-detail-gallery">

                <div class="ab-detail-main-photo">

                  ${
                    car.featured || car.isFeatured
                      ? `<div class="ab-detail-featured">
                          ◉ Öne Çıkan İlan
                         </div>`
                      : ""
                  }

                  <img
                    id="abDetailMainImage"
                    src="${images[0]}"
                    alt="${this.escape(title)}"
                  />

                  <button
                    class="ab-detail-gallery-arrow ab-detail-gallery-prev"
                    data-gallery-prev
                    type="button"
                    aria-label="Önceki fotoğraf"
                  >
                    ‹
                  </button>

                  <button
                    class="ab-detail-gallery-arrow ab-detail-gallery-next"
                    data-gallery-next
                    type="button"
                    aria-label="Sonraki fotoğraf"
                  >
                    ›
                  </button>

                  <div class="ab-detail-photo-count">
                    <span id="abDetailPhotoIndex">1</span>
                    /
                    <span>${images.length}</span>
                  </div>

                  <button
                    class="ab-detail-fullscreen"
                    data-gallery-fullscreen
                    type="button"
                  >
                    ⛶
                  </button>

                </div>


                <!-- KÜÇÜK FOTOĞRAFLAR -->

                <div class="ab-detail-thumbnails">

                  ${images
                    .map(
                      (img, index) => `
                        <button
                          class="ab-detail-thumbnail ${
                            index === 0 ? "active" : ""
                          }"
                          data-gallery-index="${index}"
                          type="button"
                        >
                          <img
                            src="${img}"
                            alt="${this.escape(title)} ${index + 1}"
                          />

                          ${
                            index === images.length - 1 &&
                            images.length > 5
                              ? `<span>+${images.length - 5}</span>`
                              : ""
                          }
                        </button>
                      `
                    )
                    .join("")}

                </div>

              </div>


              <!-- =================================================
                   ARAÇ ÖZET KARTI
              ================================================== -->

              <div class="ab-detail-summary">

                <div class="ab-detail-match">
                  <span>✓</span>
                  %${match} Uyum
                </div>

                <h1>${this.escape(title)}</h1>

                <div class="ab-detail-price">
                  ${price}
                </div>

                <div class="ab-detail-market">
                  <span>●</span>
                  Piyasa içinde
                </div>


                <!-- HIZLI BİLGİLER -->

                <div class="ab-detail-quick-specs">

                  <div>
                    <small>YIL</small>
                    <strong>${year}</strong>
                  </div>

                  <div>
                    <small>KM</small>
                    <strong>${km} km</strong>
                  </div>

                  <div>
                    <small>YAKIT</small>
                    <strong>${this.escape(fuel)}</strong>
                  </div>

                  <div>
                    <small>VİTES</small>
                    <strong>${this.escape(trans)}</strong>
                  </div>

                </div>


                <!-- AKSİYONLAR -->

                <div class="ab-detail-actions">

                  <button
                    class="ab-detail-favorite-btn ${
                      favoriteActive ? "active" : ""
                    }"
                    data-detail-favorite
                    type="button"
                  >
                    ♡
                    <span>Favoriye Ekle</span>
                  </button>

                  <button
                    class="ab-detail-compare-btn"
                    data-detail-compare
                    type="button"
                  >
                    ⇄
                    <span>Karşılaştır</span>
                  </button>

                </div>

                <button
                  class="ab-detail-contact-btn"
                  data-detail-contact
                  type="button"
                >
                  ✉
                  Satıcıyla İletişime Geç
                </button>

              </div>


              <!-- =================================================
                   SATICI
              ================================================== -->

              <aside class="ab-detail-seller">

                <div class="ab-detail-seller-head">

                  <div class="ab-detail-seller-avatar">
                    👤
                  </div>

                  <div>
                    <strong>${this.escape(
                      this.sellerName(car)
                    )}</strong>

                    <span>
                      ● Çevrimiçi
                    </span>
                  </div>

                </div>

                <div class="ab-detail-seller-info">
                  <span>Bireysel Satıcı</span>
                  <span>Üyelik Tarihi: Mart 2025</span>
                </div>

                <button
                  class="ab-detail-seller-message"
                  data-detail-contact
                  type="button"
                >
                  ✉ &nbsp; Mesaj Gönder
                </button>

                <button
                  class="ab-detail-phone-btn"
                  type="button"
                >
                  ＋ &nbsp; Telefonu Gör
                </button>

              </aside>

            </section>


            <!-- =================================================
                 SEKME MENÜSÜ
            ================================================== -->

            <div class="ab-detail-tabs">

              <button class="active" data-detail-tab="overview">
                ◉ &nbsp; Genel Bakış
              </button>

              <button data-detail-tab="ownership">
                ♧ &nbsp; Sahiplik Maliyeti
              </button>

              <button data-detail-tab="price">
                ↗ &nbsp; Fiyat Analizi
              </button>

              <button data-detail-tab="trust">
                ♡ &nbsp; Güven Skoru
              </button>

              <button data-detail-tab="compare">
                ⇄ &nbsp; Kıyasla
              </button>

              <button data-detail-tab="comments">
                ◯ &nbsp; Yorumlar
              </button>

            </div>


            <!-- =================================================
                 GENEL BAKIŞ
            ================================================== -->

            <section
              class="ab-detail-tab-content active"
              data-tab-content="overview"
            >

              <div class="ab-detail-overview-grid">


                <!-- TEMEL ÖZELLİKLER -->

                <section class="ab-detail-card ab-detail-basic-card">

                  <div class="ab-detail-card-title">
                    <h2>Temel Özellikler</h2>
                  </div>

                  <div class="ab-detail-basic-grid">

                    ${this.specItem("Marka", brand)}
                    ${this.specItem("Model", model)}
                    ${this.specItem("Yıl", year)}
                    ${this.specItem("KM", `${km} km`)}
                    ${this.specItem("Yakıt", fuel)}
                    ${this.specItem("Vites", trans)}
                    ${this.specItem("Kasa Tipi", body)}
                    ${this.specItem(
                      "Motor",
                      car.engine || car.motor || "1.2 Turbo"
                    )}
                    ${this.specItem(
                      "Güç",
                      car.power || car.guc || "100 HP"
                    )}
                    ${this.specItem(
                      "Çekiş",
                      car.drive || car.cekis || "Ön Çekiş"
                    )}

                  </div>

                  <button class="ab-detail-more-btn" type="button">
                    Tüm detayları gör →
                  </button>

                </section>


                <!-- NEDEN BU ARAÇ -->

                <section class="ab-detail-card ab-detail-match-card">

                  <div class="ab-detail-card-title">
                    <h2>Neden Bu Araç?</h2>
                  </div>

                  <div class="ab-detail-match-top">

                    <div class="ab-detail-match-circle">
                      <strong>%${match}</strong>
                    </div>

                    <div>
                      <h3>Genel Uyum Oranı</h3>
                      <p>
                        Bu araç belirttiğiniz kriterlerin büyük
                        bölümünü karşılıyor.
                      </p>
                    </div>

                  </div>


                  <div class="ab-detail-match-list">

                    ${this.matchRow(
                      "Bütçene uygun",
                      "Çok uygun"
                    )}

                    ${this.matchRow(
                      "Şehir içi kullanıma uygun",
                      "Çok uygun"
                    )}

                    ${this.matchRow(
                      "Otomatik vites",
                      "Uygun"
                    )}

                    ${this.matchRow(
                      "Düşük tüketim beklentine uygun",
                      "Uygun"
                    )}

                    ${this.matchRow(
                      "Bagaj ihtiyacına uygun",
                      "Orta"
                    )}

                    ${this.matchRow(
                      "Performans beklentine uygun",
                      "Orta"
                    )}

                  </div>

                  <button class="ab-detail-more-btn" type="button">
                    Tüm detayları gör →
                  </button>

                </section>


                <!-- AI ANALİZ -->

                <section class="ab-detail-card ab-detail-ai-card">

                  <div class="ab-detail-ai-head">

                    <div class="ab-detail-ai-icon">
                      ✦
                    </div>

                    <h2>AI Arabamı Bul Analizi</h2>

                  </div>

                  <p>
                    “Bu araç, şehir içi kullanımda düşük yakıt
                    tüketimi sunması ve bütçene uygun olması
                    nedeniyle senin için ideal bir seçenek.
                    Ayrıca otomatik vites özelliği günlük
                    kullanımını oldukça kolaylaştırır.”
                  </p>

                  <button
                    class="ab-detail-ai-btn"
                    type="button"
                  >
                    ♡ &nbsp; Bana daha fazla öneri sun
                  </button>

                  <div class="ab-detail-ai-bot">
                    🤖
                  </div>

                </section>


                <!-- SAHİPLİK MALİYETİ -->

                <section class="ab-detail-card ab-detail-cost-card">

                  <div class="ab-detail-card-title">
                    <h2>Tahmini Aylık Sahiplik Maliyeti</h2>
                    <span>Hesaplama</span>
                  </div>

                  <div class="ab-detail-big-cost">
                    ≈ 9.850 TL
                    <small>/ ay</small>
                  </div>

                  <div class="ab-detail-cost-list">

                    ${this.costRow("Yakıt", "5.200 TL", "53%")}
                    ${this.costRow("Bakım", "1.000 TL", "10%")}
                    ${this.costRow("Sigorta / Kasko", "1.850 TL", "19%")}
                    ${this.costRow("Vergi", "800 TL", "8%")}
                    ${this.costRow("Değer Kaybı", "1.000 TL", "10%")}

                  </div>

                  <div class="ab-detail-total-cost">
                    <span>3 Yıllık Tahmini Toplam Maliyet</span>
                    <strong>354.600 TL</strong>
                  </div>

                  <small class="ab-detail-disclaimer">
                    * Tahmini değerlerdir. Gerçek maliyet kullanım
                    ve kişisel koşullara göre değişebilir.
                  </small>

                </section>


                <!-- GÜVEN SKORU -->

                <section class="ab-detail-card ab-detail-trust-section">

                  <div class="ab-detail-card-title">
                    <h2>İlan Güven Skoru</h2>
                  </div>

                  <div class="ab-detail-trust-score">
                    <strong>%${trust}</strong>
                    <span>/ 100</span>
                  </div>

                  <div class="ab-detail-progress">
                    <span style="width:${trust}%"></span>
                  </div>

                  <div class="ab-detail-check-list">

                    ${this.checkRow("Fotoğraflar mevcut", true)}
                    ${this.checkRow("KM bilgisi mevcut", true)}
                    ${this.checkRow("Ekspertiz raporu mevcut", true)}
                    ${this.checkRow("Hasar bilgisi mevcut", true)}
                    ${this.checkRow("Servis geçmişi belirtilmemiş", false)}

                  </div>

                  <div class="ab-detail-completeness">
                    İlan bilgileri tamlık oranı
                    <strong>%${trust}</strong>
                  </div>

                  <button class="ab-detail-more-btn" type="button">
                    Detaylı İncele →
                  </button>

                </section>


                <!-- PİYASA ANALİZİ -->

                <section class="ab-detail-card ab-detail-market-card">

                  <div class="ab-detail-card-title">
                    <h2>Piyasa Fiyatı Analizi</h2>
                    <span class="market-good">
                      Piyasa içinde
                    </span>
                  </div>

                  <small>Tahmini piyasa aralığı</small>

                  <strong class="ab-detail-market-range">
                    1.420.000 TL – 1.510.000 TL
                  </strong>

                  <div class="ab-detail-market-line">
                    <span></span>
                    <b></b>
                  </div>

                  <div class="ab-detail-market-values">
                    <span>1.42M</span>
                    <strong>${this.money(car.price)}</strong>
                    <span>1.51M</span>
                  </div>

                </section>


                <!-- BENZER ARAÇLAR -->

                <section class="ab-detail-card ab-detail-similar-section">

                  <div class="ab-detail-card-title">

                    <h2>Benzer Araçlar</h2>

                    <button
                      data-detail-nav="browse"
                      type="button"
                    >
                      Tümünü Gör →
                    </button>

                  </div>

                  <div class="ab-detail-similar-grid">

                    ${this.renderSimilarCars(car)}

                  </div>

                </section>

              </div>


              <!-- KARŞILAŞTIR CTA -->

              <section class="ab-detail-compare-banner">

                <div class="ab-detail-compare-icon">
                  ⚖
                </div>

                <div>
                  <h3>Bu Aracı Diğerleriyle Karşılaştır</h3>
                  <p>
                    Seçtiğin araçları yan yana getir,
                    kararını daha kolay ver.
                  </p>
                </div>

                <button data-detail-compare type="button">
                  ⇄ &nbsp; Karşılaştırma Ekranına Git →
                </button>

              </section>

            </section>


            <!-- =================================================
                 DİĞER SEKME İÇERİKLERİ
            ================================================== -->

            <section
              class="ab-detail-tab-content"
              data-tab-content="ownership"
            >
              ${this.renderExtraSection(
                "Sahiplik Maliyeti",
                "Yakıt, bakım, sigorta, vergi ve değer kaybı tahmini burada gösterilecek."
              )}
            </section>

            <section
              class="ab-detail-tab-content"
              data-tab-content="price"
            >
              ${this.renderExtraSection(
                "Fiyat Analizi",
                "Aracın tahmini piyasa değeri ve ilan fiyatının konumu burada gösterilecek."
              )}
            </section>

            <section
              class="ab-detail-tab-content"
              data-tab-content="trust"
            >
              ${this.renderExtraSection(
                "Güven Skoru",
                "İlanın fotoğraf, kilometre, ekspertiz ve hasar bilgileri analiz edilecek."
              )}
            </section>

            <section
              class="ab-detail-tab-content"
              data-tab-content="compare"
            >
              ${this.renderExtraSection(
                "Kıyasla",
                "Bu araç diğer araçlarla yan yana karşılaştırılabilecek."
              )}
            </section>

            <section
              class="ab-detail-tab-content"
              data-tab-content="comments"
            >
              ${this.renderExtraSection(
                "Yorumlar",
                "Araç ve ilan hakkında kullanıcı yorumları burada gösterilecek."
              )}
            </section>

          </main>


          <!-- MOBİL ALT BAR -->

          <div class="ab-detail-mobile-bar">

            <div>
              <small>İlan Fiyatı</small>
              <strong>${price}</strong>
            </div>

            <button data-detail-contact type="button">
              ✉ Satıcıyla İletişime Geç
            </button>

          </div>

        </div>

        <!-- LIGHTBOX -->

        <div
          class="ab-detail-lightbox"
          data-detail-lightbox
        >
          <button
            class="ab-detail-lightbox-close"
            data-lightbox-close
            type="button"
          >
            ×
          </button>

          <button
            class="ab-detail-lightbox-arrow left"
            data-lightbox-prev
            type="button"
          >
            ‹
          </button>

          <img
            id="abDetailLightboxImage"
            src="${images[0]}"
            alt="${this.escape(title)}"
          />

          <button
            class="ab-detail-lightbox-arrow right"
            data-lightbox-next
            type="button"
          >
            ›
          </button>
        </div>
      `;
    },

    specItem(label, value) {
      return `
        <div class="ab-detail-spec-item">
          <span>${this.escape(label)}</span>
          <strong>${this.escape(String(value ?? "-"))}</strong>
        </div>
      `;
    },

    matchRow(label, result) {
      return `
        <div class="ab-detail-match-row">
          <span class="check">✓</span>
          <span>${this.escape(label)}</span>
          <strong>${this.escape(result)}</strong>
        </div>
      `;
    },

    costRow(label, price, percentage) {
      return `
        <div class="ab-detail-cost-row">
          <span class="cost-dot"></span>
          <span>${label}</span>
          <strong>${price}</strong>
          <small>${percentage}</small>
        </div>
      `;
    },

    checkRow(label, good) {
      return `
        <div class="ab-detail-check-row ${good ? "good" : "warning"}">
          <span>${good ? "✓" : "!"}</span>
          <label>${label}</label>
          <strong>${good ? "✓" : "!"}</strong>
        </div>
      `;
    },

    renderSimilarCars(currentCar) {
      const cars = (window.dummyCars || [])
        .filter(c => String(c.id) !== String(currentCar.id))
        .slice(0, 3);

      if (!cars.length) {
        return `
          <div class="ab-detail-no-similar">
            Benzer araç bulunamadı.
          </div>
        `;
      }

      return cars
        .map(car => {
          const image = this.getImages(car)[0];

          return `
            <article
              class="ab-detail-similar-car"
              data-similar-id="${car.id}"
            >

              <div class="ab-detail-similar-image">
                <img
                  src="${image}"
                  alt="${this.escape(
                    `${car.brand || ""} ${car.model || ""}`
                  )}"
                />
              </div>

              <div class="ab-detail-similar-info">

                <h3>
                  ${this.escape(
                    `${car.brand || ""} ${car.model || ""}`.trim()
                  )}
                </h3>

                <strong>
                  ${this.money(car.price)}
                </strong>

                <p>
                  ${car.year || "-"} ·
                  ${this.number(car.km)} km ·
                  ${this.escape(this.transText(car))}
                </p>

                <span>
                  %${this.getMatchScore(car)} Uyum
                </span>

              </div>

            </article>
          `;
        })
        .join("");
    },

    renderExtraSection(title, text) {
      return `
        <section class="ab-detail-extra-section">

          <div class="ab-detail-extra-icon">
            ✦
          </div>

          <div>
            <h2>${title}</h2>
            <p>${text}</p>
          </div>

        </section>
      `;
    },

    updateGallery() {
      const image = this.images[this.currentImageIndex];

      const mainImage =
        document.getElementById("abDetailMainImage");

      const lightboxImage =
        document.getElementById("abDetailLightboxImage");

      const indexText =
        document.getElementById("abDetailPhotoIndex");

      if (mainImage) {
        mainImage.src = image;
      }

      if (lightboxImage) {
        lightboxImage.src = image;
      }

      if (indexText) {
        indexText.textContent =
          String(this.currentImageIndex + 1);
      }

      document
        .querySelectorAll(".ab-detail-thumbnail")
        .forEach((thumb, index) => {
          thumb.classList.toggle(
            "active",
            index === this.currentImageIndex
          );
        });
    },

    nextImage() {
      if (this.images.length <= 1) return;

      this.currentImageIndex =
        (this.currentImageIndex + 1) %
        this.images.length;

      this.updateGallery();
    },

    previousImage() {
      if (this.images.length <= 1) return;

      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.images.length) %
        this.images.length;

      this.updateGallery();
    },

    toggleFavorite() {
      if (!this.currentCar) return;

      let favorites = Array.isArray(window.favorites)
        ? [...window.favorites]
        : [];

      const index = favorites.indexOf(this.currentCar.id);

      if (index >= 0) {
        favorites.splice(index, 1);
      } else {
        favorites.push(this.currentCar.id);
      }

      window.favorites = favorites;

      localStorage.setItem(
        "favs",
        JSON.stringify(favorites)
      );

      const button =
        document.querySelector(
          "[data-detail-favorite]"
        );

      if (button) {
        const active = favorites.includes(
          this.currentCar.id
        );

        button.classList.toggle("active", active);

        const text = button.querySelector("span");

        if (text) {
          text.textContent = active
            ? "Favorilerde"
            : "Favoriye Ekle";
        }
      }
    },

    contactSeller() {
      alert(
        "Satıcı iletişim ekranı yakında aktif olacak."
      );
    },

    compare() {
      alert(
        "Karşılaştırma ekranı bir sonraki aşamada aktif olacak."
      );
    },

    openLightbox() {
      const lightbox =
        document.querySelector(
          "[data-detail-lightbox]"
        );

      if (!lightbox) return;

      lightbox.classList.add("open");

      this.updateGallery();
    },

    closeLightbox() {
      const lightbox =
        document.querySelector(
          "[data-detail-lightbox]"
        );

      if (!lightbox) return;

      lightbox.classList.remove("open");
    },

    setTab(tabName) {
      document
        .querySelectorAll("[data-detail-tab]")
        .forEach(button => {
          button.classList.toggle(
            "active",
            button.dataset.detailTab === tabName
          );
        });

      document
        .querySelectorAll("[data-tab-content]")
        .forEach(content => {
          content.classList.toggle(
            "active",
            content.dataset.tabContent === tabName
          );
        });
    },

    bindEvents() {

      document
        .querySelectorAll("[data-gallery-next]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.nextImage();
          });
        });

      document
        .querySelectorAll("[data-gallery-prev]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.previousImage();
          });
        });

      document
        .querySelectorAll("[data-gallery-index]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.currentImageIndex =
              Number(button.dataset.galleryIndex);

            this.updateGallery();
          });
        });

      document
        .querySelectorAll("[data-gallery-fullscreen]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.openLightbox();
          });
        });

      document
        .querySelectorAll("[data-detail-favorite]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.toggleFavorite();
          });
        });

      document
        .querySelectorAll("[data-detail-compare]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.compare();
          });
        });

      document
        .querySelectorAll("[data-detail-contact]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.contactSeller();
          });
        });

      document
        .querySelectorAll("[data-detail-tab]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.setTab(
              button.dataset.detailTab
            );
          });
        });

      document
        .querySelectorAll("[data-lightbox-close]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.closeLightbox();
          });
        });

      document
        .querySelectorAll("[data-lightbox-next]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.nextImage();
          });
        });

      document
        .querySelectorAll("[data-lightbox-prev]")
        .forEach(button => {
          button.addEventListener("click", () => {
            this.previousImage();
          });
        });

      document
        .querySelectorAll("[data-detail-nav]")
        .forEach(button => {
          button.addEventListener("click", () => {

            const page =
              button.dataset.detailNav;

            this.close();

            if (
              typeof window.go === "function"
            ) {
              window.go(page);
            }
          });
        });

      document
        .querySelectorAll("[data-similar-id]")
        .forEach(card => {
          card.addEventListener("click", () => {

            const id =
              card.dataset.similarId;

            this.open(id);
          });
        });


      // ESC
      document.addEventListener(
        "keydown",
        this.handleKeydown
      );
    },

    handleKeydown(event) {

      const detail =
        window.AB_Detail;

      if (!detail) return;

      if (event.key === "Escape") {

        const lightbox =
          document.querySelector(
            "[data-detail-lightbox].open"
          );

        if (lightbox) {
          detail.closeLightbox();
        } else {
          detail.close();
        }
      }

      if (event.key === "ArrowRight") {
        detail.nextImage();
      }

      if (event.key === "ArrowLeft") {
        detail.previousImage();
      }
    },

    escape(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  };


  // Global API
  window.AB_Detail = AB_Detail;

})();
