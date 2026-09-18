/* =========================================================
   ARABAMI BUL V2 — ARAÇ DETAY SİSTEMİ
   Profesyonel ilan detay ekranı
   ========================================================= */

(function () {
  "use strict";

  const AB_Detail = {

    currentCar: null,
    currentImageIndex: 0,
    images: [],
    previousBodyOverflow: "",

    /* =====================================================
       AÇ
    ===================================================== */

    open(id) {

      const cars = window.dummyCars || [];

      const car = cars.find(
        c => String(c.id) === String(id)
      );

      if (!car) {
        console.error("Araç bulunamadı:", id);
        return;
      }

      const container =
        document.getElementById("car-detail-container");

      if (!container) {
        console.error(
          "car-detail-container bulunamadı."
        );
        return;
      }

      this.currentCar = car;
      this.currentImageIndex = 0;
      this.images = this.getImages(car);

      this.previousBodyOverflow =
        document.body.style.overflow;

      document.body.style.overflow = "hidden";

      container.innerHTML =
        this.render(car);

      container.style.display = "block";

      this.bindEvents();
      this.updateGallery();

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
    },


    /* =====================================================
       KAPAT
    ===================================================== */

    close() {

      const container =
        document.getElementById(
          "car-detail-container"
        );

      if (!container) return;

      container.style.display = "none";
      container.innerHTML = "";

      document.body.style.overflow =
        this.previousBodyOverflow || "";

      this.currentCar = null;
    },


    /* =====================================================
       FOTOĞRAFLAR
    ===================================================== */

    getImages(car) {

      let images = [];

      if (Array.isArray(car.images)) {
        images = car.images.filter(Boolean);
      }

      if (
        !images.length &&
        Array.isArray(car.photos)
      ) {
        images = car.photos.filter(Boolean);
      }

      if (!images.length && car.img) {
        images = [car.img];
      }

      if (!images.length && car.image) {
        images = [car.image];
      }

      if (!images.length && car.photo) {
        images = [car.photo];
      }

      if (!images.length) {

        images = [
          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
        ];

      }

      return images;
    },


    /* =====================================================
       YARDIMCI
    ===================================================== */

    money(value) {

      return (
        Number(value || 0)
          .toLocaleString("tr-TR") +
        " TL"
      );

    },


    number(value) {

      return Number(value || 0)
        .toLocaleString("tr-TR");

    },


    fuelText(car) {

      return (
        car.fuel ||
        car.yakit ||
        "Benzin"
      );

    },


    transText(car) {

      return (
        car.trans ||
        car.transmission ||
        car.vites ||
        "Otomatik"
      );

    },


    bodyText(car) {

      return (
        car.body ||
        car.kasa ||
        car.seg ||
        "Otomobil"
      );

    },


    locationText(car) {

      return (
        car.location ||
        car.city ||
        "İstanbul"
      );

    },


    sellerName(car) {

      return (
        car.seller ||
        car.sellerName ||
        "Satıcı"
      );

    },


    getTrustScore(car) {

      if (car.trustScore) {
        return Number(car.trustScore);
      }

      const km =
        Number(car.km || 0);

      if (km < 10000) return 94;
      if (km < 30000) return 91;
      if (km < 70000) return 88;
      if (km < 120000) return 84;

      return 80;
    },


    getMatchScore(car) {

      if (car.matchScore) {
        return Number(car.matchScore);
      }

      return Math.min(
        96,
        88 + ((Number(car.id) || 1) % 8)
      );

    },


    escape(value) {

      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    },


    /* =====================================================
       ANA DETAY EKRANI
    ===================================================== */

    render(car) {

      const images =
        this.getImages(car);

      const title =
        `${car.brand || "Otomobil"} ${car.model || ""}`.trim();

      const price =
        this.money(car.price);

      const trust =
        this.getTrustScore(car);

      const match =
        this.getMatchScore(car);

      const favoriteActive =
        Array.isArray(window.favorites) &&
        window.favorites.includes(car.id);


      const year =
        car.year || "-";

      const km =
        this.number(car.km);

      const fuel =
        this.fuelText(car);

      const trans =
        this.transText(car);

      const body =
        this.bodyText(car);


      return `

      <div class="ab-detail-page">

        <!-- =============================================
             ÜST BAR
        ============================================== -->

        <div class="ab-detail-topbar">

          <button
            class="ab-detail-back"
            data-detail-close
            type="button"
          >
            ←
            <span>Araçlara Dön</span>
          </button>

          <div class="ab-detail-top-title">
            ${this.escape(title)}
          </div>

          <div class="ab-detail-top-actions">

            <button
              type="button"
              data-detail-favorite
              class="${favoriteActive ? "active" : ""}"
            >
              ${favoriteActive ? "♥" : "♡"}
              <span>
                ${favoriteActive
                  ? "Favorilerde"
                  : "Favoriye Ekle"}
              </span>
            </button>

            <button
              type="button"
              data-detail-compare
            >
              ⇄
              <span>Karşılaştır</span>
            </button>

          </div>

        </div>


        <!-- =============================================
             ANA İÇERİK
        ============================================== -->

        <main class="ab-detail-main">

          <!-- BREADCRUMB -->

          <div class="ab-detail-breadcrumb">

            <button data-detail-close type="button">
              Ana Sayfa
            </button>

            <span>›</span>

            <button
              data-detail-browse
              type="button"
            >
              Araçlar
            </button>

            <span>›</span>

            <strong>
              ${this.escape(title)}
            </strong>

          </div>


          <!-- ===========================================
               ÜST ARAÇ ALANI
          ============================================ -->

          <section class="ab-detail-hero">

            <!-- FOTOĞRAF ALANI -->

            <div class="ab-detail-gallery">

              <div class="ab-detail-main-photo">

                ${
                  car.featured
                    ? `
                      <div class="ab-detail-featured">
                        ★ Öne Çıkan İlan
                      </div>
                    `
                    : ""
                }

                <img
                  id="abDetailMainImage"
                  src="${images[0]}"
                  alt="${this.escape(title)}"
                />

                ${
                  images.length > 1
                    ? `
                      <button
                        class="ab-detail-gallery-arrow ab-detail-gallery-prev"
                        data-gallery-prev
                        type="button"
                      >
                        ‹
                      </button>

                      <button
                        class="ab-detail-gallery-arrow ab-detail-gallery-next"
                        data-gallery-next
                        type="button"
                      >
                        ›
                      </button>
                    `
                    : ""
                }

                <div class="ab-detail-photo-count">

                  <span id="abDetailPhotoIndex">
                    1
                  </span>

                  /

                  <span>
                    ${images.length}
                  </span>

                </div>

                <button
                  class="ab-detail-fullscreen"
                  data-gallery-fullscreen
                  type="button"
                  aria-label="Fotoğrafı büyüt"
                >
                  ⛶
                </button>

              </div>


              <!-- THUMBNAILS -->

              <div class="ab-detail-thumbnails">

                ${images.map((image, index) => `

                  <button
                    class="ab-detail-thumbnail ${
                      index === 0 ? "active" : ""
                    }"
                    data-gallery-index="${index}"
                    type="button"
                  >

                    <img
                      src="${image}"
                      alt="${this.escape(title)}"
                    />

                  </button>

                `).join("")}

              </div>

            </div>


            <!-- =========================================
                 ARAÇ BİLGİ KARTI
            ========================================== -->

            <div class="ab-detail-summary">

              <div class="ab-detail-brand-line">

                <span>
                  ${this.escape(car.brand || "Otomobil")}
                </span>

                ${
                  car.featured
                    ? `<b>★ Öne Çıkan</b>`
                    : ""
                }

              </div>


              <h1>
                ${this.escape(title)}
              </h1>


              <div class="ab-detail-price">
                ${price}
              </div>


              <div class="ab-detail-price-note">
                Tahmini piyasa değeriyle karşılaştırılmış ilan fiyatı
              </div>


              <!-- HIZLI BİLGİLER -->

              <div class="ab-detail-quick-specs">

                <div class="ab-detail-quick-spec">

                  <span>YIL</span>

                  <strong>
                    ${year}
                  </strong>

                </div>


                <div class="ab-detail-quick-spec">

                  <span>KM</span>

                  <strong>
                    ${km}
                  </strong>

                </div>


                <div class="ab-detail-quick-spec">

                  <span>YAKIT</span>

                  <strong>
                    ${this.escape(fuel)}
                  </strong>

                </div>


                <div class="ab-detail-quick-spec">

                  <span>VİTES</span>

                  <strong>
                    ${this.escape(trans)}
                  </strong>

                </div>

              </div>


              <!-- GÜVEN / UYUM -->

              <div class="ab-detail-score-row">

                <div class="ab-detail-score-card">

                  <span>İlan Güveni</span>

                  <strong>
                    %${trust}
                  </strong>

                  <div class="ab-detail-score-bar">
                    <i style="width:${trust}%"></i>
                  </div>

                </div>


                <div class="ab-detail-score-card">

                  <span>Size Uyumu</span>

                  <strong>
                    %${match}
                  </strong>

                  <div class="ab-detail-score-bar">
                    <i style="width:${match}%"></i>
                  </div>

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

                  ${
                    favoriteActive
                      ? "♥"
                      : "♡"
                  }

                  <span>
                    ${
                      favoriteActive
                        ? "Favorilerde"
                        : "Favoriye Ekle"
                    }
                  </span>

                </button>


                <button
                  class="ab-detail-compare-btn"
                  data-detail-compare
                  type="button"
                >
                  ⇄
                  <span>
                    Karşılaştır
                  </span>
                </button>

              </div>


              <button
                class="ab-detail-contact-btn"
                data-detail-contact
                type="button"
              >

                ✉

                <span>
                  Satıcıyla İletişime Geç
                </span>

              </button>


              <div class="ab-detail-location">

                <span>⌖</span>

                <div>
                  <strong>
                    ${this.escape(
                      this.locationText(car)
                    )}
                  </strong>

                  <small>
                    İlan konumu
                  </small>
                </div>

              </div>

            </div>


            <!-- =========================================
                 SATICI KARTI
            ========================================== -->

            <aside class="ab-detail-seller">

              <div class="ab-detail-seller-title">
                Satıcı
              </div>


              <div class="ab-detail-seller-head">

                <div class="ab-detail-seller-avatar">
                  ${this.getInitials(
                    this.sellerName(car)
                  )}
                </div>

                <div>

                  <strong>
                    ${this.escape(
                      this.sellerName(car)
                    )}
                  </strong>

                  <span>
                    ● Çevrimiçi
                  </span>

                </div>

              </div>


              <div class="ab-detail-seller-info">

                <div>
                  <span>Satıcı tipi</span>
                  <strong>Bireysel</strong>
                </div>

                <div>
                  <span>İlan konumu</span>
                  <strong>
                    ${this.escape(
                      this.locationText(car)
                    )}
                  </strong>
                </div>

              </div>


              <button
                class="ab-detail-seller-message"
                data-detail-contact
                type="button"
              >
                ✉ Mesaj Gönder
              </button>


              <button
                class="ab-detail-phone-btn"
                data-detail-phone
                type="button"
              >
                ☎ Telefonu Gör
              </button>


              <div class="ab-detail-seller-safe">
                ✓ ARABAMI BUL güvenli iletişim
              </div>

            </aside>

          </section>


          <!-- ===========================================
               SEKME MENÜSÜ
          ============================================ -->

          <div class="ab-detail-tabs">

            <button
              class="active"
              data-detail-tab="overview"
              type="button"
            >
              Genel Bakış
            </button>

            <button
              data-detail-tab="expertise"
              type="button"
            >
              Ekspertiz
            </button>

            <button
              data-detail-tab="ownership"
              type="button"
            >
              Sahiplik Maliyeti
            </button>

            <button
              data-detail-tab="price"
              type="button"
            >
              Fiyat Analizi
            </button>

            <button
              data-detail-tab="comments"
              type="button"
            >
              Yorumlar
            </button>

          </div>


          <!-- ===========================================
               GENEL BAKIŞ
          ============================================ -->

          <section
            class="ab-detail-tab-content active"
            data-tab-content="overview"
          >

            <div class="ab-detail-content-grid">


              <!-- TEMEL ÖZELLİKLER -->

              <section class="ab-detail-card">

                <div class="ab-detail-card-header">

                  <div>
                    <span class="ab-detail-card-kicker">
                      ARAÇ BİLGİLERİ
                    </span>

                    <h2>
                      Temel Özellikler
                    </h2>
                  </div>

                </div>


                <div class="ab-detail-spec-grid">

                  ${this.specItem(
                    "Marka",
                    car.brand
                  )}

                  ${this.specItem(
                    "Model",
                    car.model
                  )}

                  ${this.specItem(
                    "Model Yılı",
                    year
                  )}

                  ${this.specItem(
                    "Kilometre",
                    `${km} km`
                  )}

                  ${this.specItem(
                    "Yakıt",
                    fuel
                  )}

                  ${this.specItem(
                    "Vites",
                    trans
                  )}

                  ${this.specItem(
                    "Kasa Tipi",
                    body
                  )}

                  ${this.specItem(
                    "Motor",
                    car.engine || "1.2 Turbo"
                  )}

                  ${this.specItem(
                    "Güç",
                    car.power || "100 HP"
                  )}

                  ${this.specItem(
                    "Çekiş",
                    car.drive || "Ön Çekiş"
                  )}

                </div>

              </section>


              <!-- NEDEN BU ARAÇ -->

              <section class="ab-detail-card">

                <div class="ab-detail-card-header">

                  <div>
                    <span class="ab-detail-card-kicker">
                      ARABAMI BUL
                    </span>

                    <h2>
                      Neden Bu Araç?
                    </h2>
                  </div>

                  <div class="ab-detail-match-big">
                    %${match}
                  </div>

                </div>


                <p class="ab-detail-card-description">

                  Bu araç, belirlenen kriterlerle
                  karşılaştırıldığında yüksek uyum
                  gösteriyor.

                </p>


                <div class="ab-detail-match-list">

                  ${this.matchRow(
                    "Bütçene uygunluk",
                    "Uygun"
                  )}

                  ${this.matchRow(
                    "Günlük kullanıma uygunluk",
                    "Uygun"
                  )}

                  ${this.matchRow(
                    "Vites tercihi",
                    trans
                  )}

                  ${this.matchRow(
                    "Kasa tipi",
                    body
                  )}

                  ${this.matchRow(
                    "Model yılı",
                    year
                  )}

                </div>

              </section>


              <!-- SAHİPLİK MALİYETİ -->

              <section class="ab-detail-card">

                <div class="ab-detail-card-header">

                  <div>
                    <span class="ab-detail-card-kicker">
                      MALİYET
                    </span>

                    <h2>
                      Tahmini Aylık Sahiplik
                    </h2>
                  </div>

                  <span class="ab-detail-card-badge">
                    Tahmini
                  </span>

                </div>


                <div class="ab-detail-cost-total">

                  <strong>
                    ${this.money(
                      car.tco || 9850
                    )}
                  </strong>

                  <span>
                    / ay
                  </span>

                </div>


                <div class="ab-detail-cost-list">

                  ${this.costRow(
                    "Yakıt",
                    "5.200 TL",
                    "53%"
                  )}

                  ${this.costRow(
                    "Bakım",
                    "1.000 TL",
                    "10%"
                  )}

                  ${this.costRow(
                    "Sigorta / Kasko",
                    "1.850 TL",
                    "19%"
                  )}

                  ${this.costRow(
                    "Vergi",
                    "800 TL",
                    "8%"
                  )}

                  ${this.costRow(
                    "Değer Kaybı",
                    "1.000 TL",
                    "10%"
                  )}

                </div>


                <div class="ab-detail-cost-total-line">

                  <span>
                    3 yıllık tahmini toplam
                  </span>

                  <strong>
                    ${this.money(
                      (car.tco || 9850) * 36
                    )}
                  </strong>

                </div>


                <small class="ab-detail-disclaimer">
                  Tahmini değerlerdir. Gerçek maliyet
                  kullanım koşullarına göre değişebilir.
                </small>

              </section>


              <!-- GÜVEN SKORU -->

              <section class="ab-detail-card">

                <div class="ab-detail-card-header">

                  <div>
                    <span class="ab-detail-card-kicker">
                      GÜVEN
                    </span>

                    <h2>
                      İlan Güven Skoru
                    </h2>
                  </div>

                  <div class="ab-detail-trust-number">
                    %${trust}
                  </div>

                </div>


                <div class="ab-detail-trust-bar">
                  <span style="width:${trust}%"></span>
                </div>


                <div class="ab-detail-check-list">

                  ${this.checkRow(
                    "Fotoğraflar mevcut",
                    true
                  )}

                  ${this.checkRow(
                    "Kilometre bilgisi mevcut",
                    true
                  )}

                  ${this.checkRow(
                    "Ekspertiz bilgisi mevcut",
                    true
                  )}

                  ${this.checkRow(
                    "Hasar bilgisi mevcut",
                    true
                  )}

                  ${this.checkRow(
                    "Servis geçmişi belirtilmiş",
                    false
                  )}

                </div>

              </section>


              <!-- AI ANALİZ -->

              <section class="ab-detail-card ab-detail-ai-card">

                <div class="ab-detail-ai-header">

                  <div class="ab-detail-ai-icon">
                    ✦
                  </div>

                  <div>
                    <span class="ab-detail-card-kicker">
                      YAPAY ZEKA
                    </span>

                    <h2>
                      ARABAMI BUL Analizi
                    </h2>
                  </div>

                </div>


                <p>

                  ${this.escape(
                    `${title}, ${body.toLowerCase()} gövde tipi ve ${this.transText(car).toLowerCase()} vites yapısıyla günlük kullanım için değerlendirilebilir. ${this.fuelText(car)} motor seçeneği ve mevcut kilometresi birlikte incelenmelidir.`
                  )}

                </p>


                <button
                  class="ab-detail-ai-btn"
                  data-detail-ai
                  type="button"
                >
                  ✦ Bana benzer araçları göster
                </button>

              </section>


              <!-- PİYASA ANALİZİ -->

              <section class="ab-detail-card">

                <div class="ab-detail-card-header">

                  <div>
                    <span class="ab-detail-card-kicker">
                      PİYASA
                    </span>

                    <h2>
                      Fiyat Analizi
                    </h2>
                  </div>

                  <span class="ab-detail-market-badge">
                    Piyasa İçinde
                  </span>

                </div>


                <p class="ab-detail-card-description">
                  İlan fiyatı, sistemdeki benzer araçların
                  fiyatlarıyla birlikte değerlendirilir.
                </p>


                <div class="ab-detail-price-position">

                  <span>
                    850K
                  </span>

                  <div>
                    <i></i>
                    <b></b>
                  </div>

                  <span>
                    3M+
                  </span>

                </div>


                <div class="ab-detail-price-position-current">
                  İlan fiyatı:
                  <strong>
                    ${price}
                  </strong>
                </div>

              </section>


              <!-- BENZER ARAÇLAR -->

              <section class="ab-detail-card ab-detail-similar-section">

                <div class="ab-detail-card-header">

                  <div>
                    <span class="ab-detail-card-kicker">
                      ALTERNATİFLER
                    </span>

                    <h2>
                      Benzer Araçlar
                    </h2>
                  </div>

                  <button
                    class="ab-detail-see-all"
                    data-detail-browse
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

          </section>


          <!-- ===========================================
               EKSPERTİZ
          ============================================ -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="expertise"
          >

            ${this.renderExpertise(car)}

          </section>


          <!-- ===========================================
               SAHİPLİK
          ============================================ -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="ownership"
          >

            ${this.renderExtraSection(
              "Sahiplik Maliyeti",
              "Yakıt, bakım, sigorta, vergi ve değer kaybı tahminleri burada detaylandırılabilir."
            )}

          </section>


          <!-- ===========================================
               FİYAT
          ============================================ -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="price"
          >

            ${this.renderExtraSection(
              "Fiyat Analizi",
              "Aracın ilan fiyatı benzer araçlarla karşılaştırılarak piyasa konumu gösterilir."
            )}

          </section>


          <!-- ===========================================
               YORUMLAR
          ============================================ -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="comments"
          >

            ${this.renderExtraSection(
              "Yorumlar",
              "Bu bölümde ileride araç ve satıcı hakkında kullanıcı yorumları gösterilebilir."
            )}

          </section>


          <!-- ALT CTA -->

          <section class="ab-detail-bottom-cta">

            <div>

              <strong>
                ${this.escape(title)}
              </strong>

              <span>
                ${price}
              </span>

            </div>

            <button
              data-detail-contact
              type="button"
            >
              ✉ Satıcıyla İletişime Geç
            </button>

          </section>

        </main>


        <!-- MOBİL SABİT BAR -->

        <div class="ab-detail-mobile-bar">

          <div>

            <small>
              İlan Fiyatı
            </small>

            <strong>
              ${price}
            </strong>

          </div>

          <button
            data-detail-contact
            type="button"
          >
            ✉ İletişime Geç
          </button>

        </div>

      </div>


      <!-- ===============================================
           LIGHTBOX
      ================================================ -->

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


    /* =====================================================
       İLK HARFLER
    ===================================================== */

    getInitials(name) {

      const parts =
        String(name || "Satıcı")
          .trim()
          .split(/\s+/);

      if (!parts.length) return "S";

      return (
        parts
          .slice(0, 2)
          .map(x => x.charAt(0).toUpperCase())
          .join("")
      );

    },


    /* =====================================================
       ÖZELLİK
    ===================================================== */

    specItem(label, value) {

      return `

        <div class="ab-detail-spec-item">

          <span>
            ${this.escape(label)}
          </span>

          <strong>
            ${this.escape(
              String(value ?? "-")
            )}
          </strong>

        </div>

      `;

    },


    /* =====================================================
       UYUM SATIRI
    ===================================================== */

    matchRow(label, result) {

      return `

        <div class="ab-detail-match-row">

          <span class="check">
            ✓
          </span>

          <span>
            ${this.escape(label)}
          </span>

          <strong>
            ${this.escape(result)}
          </strong>

        </div>

      `;

    },


    /* =====================================================
       MALİYET SATIRI
    ===================================================== */

    costRow(label, price, percentage) {

      return `

        <div class="ab-detail-cost-row">

          <span class="cost-dot"></span>

          <span>
            ${this.escape(label)}
          </span>

          <strong>
            ${this.escape(price)}
          </strong>

          <small>
            ${this.escape(percentage)}
          </small>

        </div>

      `;

    },


    /* =====================================================
       GÜVEN SATIRI
    ===================================================== */

    checkRow(label, good) {

      return `

        <div
          class="ab-detail-check-row ${
            good ? "good" : "warning"
          }"
        >

          <span>
            ${good ? "✓" : "!"}
          </span>

          <label>
            ${this.escape(label)}
          </label>

          <strong>
            ${good ? "Mevcut" : "Eksik"}
          </strong>

        </div>

      `;

    },


    /* =====================================================
       EKSPERTİZ
    ===================================================== */

    renderExpertise(car) {

      const expert =
        car.expert || {};

      const parts = [
        [
          "Kaput",
          expert.hood || "Orijinal"
        ],
        [
          "Sol Ön Çamurluk",
          expert.fenderLeft || "Orijinal"
        ],
        [
          "Tavan",
          expert.roof || "Orijinal"
        ],
        [
          "Sağ Kapı",
          expert.doorRight || "Orijinal"
        ]
      ];


      return `

        <div class="ab-detail-expertise-page">

          <section class="ab-detail-card">

            <div class="ab-detail-card-header">

              <div>

                <span class="ab-detail-card-kicker">
                  ARAÇ DURUMU
                </span>

                <h2>
                  Ekspertiz Özeti
                </h2>

              </div>

              <span class="ab-detail-market-badge">
                Kontrol Edildi
              </span>

            </div>


            <div class="ab-detail-panel-grid">

              ${parts.map(part => `

                <div class="ab-detail-panel-item">

                  <span>
                    ${this.escape(part[0])}
                  </span>

                  <strong
                    class="${
                      String(part[1])
                        .toLowerCase()
                        .includes("orijinal")
                        ? "good"
                        : "warning"
                    }"
                  >
                    ${this.escape(part[1])}
                  </strong>

                </div>

              `).join("")}

            </div>

          </section>


          <section class="ab-detail-card">

            <div class="ab-detail-card-header">

              <div>

                <span class="ab-detail-card-kicker">
                  HASAR GEÇMİŞİ
                </span>

                <h2>
                  Tramer
                </h2>

              </div>

            </div>


            <div class="ab-detail-tramer">

              <strong>
                ${this.escape(
                  expert.tramer ||
                  "Beyan Edilmedi"
                )}
              </strong>

              <span>
                İlan verisindeki mevcut bilgi
              </span>

            </div>

          </section>


          <section class="ab-detail-card">

            <div class="ab-detail-card-header">

              <div>

                <span class="ab-detail-card-kicker">
                  MEKANİK
                </span>

                <h2>
                  Motor & Şanzıman
                </h2>

              </div>

            </div>


            <div class="ab-detail-mechanical-grid">

              <div>

                <span>
                  Motor Sağlığı
                </span>

                <strong>
                  ${this.escape(
                    expert.engineScore ||
                    "%95"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Şanzıman
                </span>

                <strong>
                  ${this.escape(
                    expert.transmissionScore ||
                    "Kontrol Edildi"
                  )}
                </strong>

              </div>

            </div>

          </section>

          <div class="ab-detail-disclaimer-box">

            <strong>
              Ekspertiz bilgisi hakkında
            </strong>

            <p>
              Buradaki bilgiler demo araç verilerinden
              oluşturulmuştur. Gerçek bir ilan sisteminde
              ekspertiz raporu belge ve servis kayıtlarıyla
              desteklenmelidir.
            </p>

          </div>

        </div>

      `;

    },


    /* =====================================================
       BENZER ARAÇLAR
    ===================================================== */

    renderSimilarCars(currentCar) {

      const cars =
        (window.dummyCars || [])
          .filter(
            car =>
              String(car.id) !==
              String(currentCar.id)
          )
          .sort((a, b) => {

            let scoreA = 0;
            let scoreB = 0;

            if (
              a.seg === currentCar.seg
            ) scoreA += 2;

            if (
              b.seg === currentCar.seg
            ) scoreB += 2;

            if (
              a.fuel === currentCar.fuel
            ) scoreA += 1;

            if (
              b.fuel === currentCar.fuel
            ) scoreB += 1;

            return scoreB - scoreA;

          })
          .slice(0, 3);


      if (!cars.length) {

        return `
          <div class="ab-detail-no-similar">
            Benzer araç bulunamadı.
          </div>
        `;

      }


      return cars.map(car => {

        const image =
          this.getImages(car)[0];

        const title =
          `${car.brand || ""} ${car.model || ""}`.trim();

        return `

          <article
            class="ab-detail-similar-car"
            data-similar-id="${car.id}"
          >

            <div class="ab-detail-similar-image">

              <img
                src="${image}"
                alt="${this.escape(title)}"
              />

            </div>


            <div class="ab-detail-similar-info">

              <h3>
                ${this.escape(title)}
              </h3>

              <strong>
                ${this.money(car.price)}
              </strong>

              <p>
                ${car.year || "-"}
                ·
                ${this.number(car.km)} km
                ·
                ${this.escape(
                  this.transText(car)
                )}
              </p>

              <span>
                %${this.getMatchScore(car)} Uyum
              </span>

            </div>

          </article>

        `;

      }).join("");

    },


    /* =====================================================
       EK SEKSİYON
    ===================================================== */

    renderExtraSection(title, text) {

      return `

        <section class="ab-detail-extra-section">

          <div class="ab-detail-extra-icon">
            ✦
          </div>

          <div>

            <span>
              ARABAMI BUL
            </span>

            <h2>
              ${this.escape(title)}
            </h2>

            <p>
              ${this.escape(text)}
            </p>

          </div>

        </section>

      `;

    },


    /* =====================================================
       GALERİ GÜNCELLE
    ===================================================== */

    updateGallery() {

      if (!this.images.length) return;

      const image =
        this.images[
          this.currentImageIndex
        ];


      const mainImage =
        document.getElementById(
          "abDetailMainImage"
        );


      const lightboxImage =
        document.getElementById(
          "abDetailLightboxImage"
        );


      const indexText =
        document.getElementById(
          "abDetailPhotoIndex"
        );


      if (mainImage) {
        mainImage.src = image;
      }


      if (lightboxImage) {
        lightboxImage.src = image;
      }


      if (indexText) {
        indexText.textContent =
          String(
            this.currentImageIndex + 1
          );
      }


      document
        .querySelectorAll(
          ".ab-detail-thumbnail"
        )
        .forEach(
          (thumb, index) => {

            thumb.classList.toggle(
              "active",
              index ===
              this.currentImageIndex
            );

          }
        );

    },


    /* =====================================================
       SONRAKİ FOTO
    ===================================================== */

    nextImage() {

      if (this.images.length <= 1) {
        return;
      }

      this.currentImageIndex =
        (
          this.currentImageIndex + 1
        ) %
        this.images.length;

      this.updateGallery();

    },


    /* =====================================================
       ÖNCEKİ FOTO
    ===================================================== */

    previousImage() {

      if (this.images.length <= 1) {
        return;
      }

      this.currentImageIndex =
        (
          this.currentImageIndex -
          1 +
          this.images.length
        ) %
        this.images.length;

      this.updateGallery();

    },


    /* =====================================================
       FAVORİ
    ===================================================== */

    toggleFavorite() {

      if (!this.currentCar) return;

      let favorites =
        Array.isArray(window.favorites)
          ? [...window.favorites]
          : [];


      const index =
        favorites.indexOf(
          this.currentCar.id
        );


      if (index >= 0) {

        favorites.splice(
          index,
          1
        );

      } else {

        favorites.push(
          this.currentCar.id
        );

      }


      window.favorites =
        favorites;


      localStorage.setItem(
        "favs",
        JSON.stringify(favorites)
      );


      document
        .querySelectorAll(
          "[data-detail-favorite]"
        )
        .forEach(button => {

          const active =
            favorites.includes(
              this.currentCar.id
            );

          button.classList.toggle(
            "active",
            active
          );


          button.innerHTML =
            `
              ${active ? "♥" : "♡"}
              <span>
                ${
                  active
                    ? "Favorilerde"
                    : "Favoriye Ekle"
                }
              </span>
            `;

        });

    },


    /* =====================================================
       İLETİŞİM
    ===================================================== */

    contactSeller() {

      alert(
        "Satıcı iletişim ekranı yakında aktif olacak."
      );

    },


    /* =====================================================
       TELEFON
    ===================================================== */

    showPhone() {

      alert(
        "Satıcının telefon bilgisi bir sonraki aşamada gösterilecek."
      );

    },


    /* =====================================================
       KARŞILAŞTIR
    ===================================================== */

    compare() {

      alert(
        "Karşılaştırma ekranı bir sonraki aşamada aktif olacak."
      );

    },


    /* =====================================================
       AI
    ===================================================== */

    aiSuggest() {

      const car =
        this.currentCar;

      if (!car) return;

      this.close();

      if (
        typeof window.go ===
        "function"
      ) {

        window.go("find");

      }

    },


    /* =====================================================
       LIGHTBOX
    ===================================================== */

    openLightbox() {

      const lightbox =
        document.querySelector(
          "[data-detail-lightbox]"
        );

      if (!lightbox) return;

      lightbox.classList.add(
        "open"
      );

      this.updateGallery();

    },


    closeLightbox() {

      const lightbox =
        document.querySelector(
          "[data-detail-lightbox]"
        );

      if (!lightbox) return;

      lightbox.classList.remove(
        "open"
      );

    },


    /* =====================================================
       SEKME
    ===================================================== */

    setTab(tabName) {

      document
        .querySelectorAll(
          "[data-detail-tab]"
        )
        .forEach(button => {

          button.classList.toggle(
            "active",
            button.dataset.detailTab ===
            tabName
          );

        });


      document
        .querySelectorAll(
          "[data-tab-content]"
        )
        .forEach(content => {

          content.classList.toggle(
            "active",
            content.dataset.tabContent ===
            tabName
          );

        });

    },


    /* =====================================================
       EVENTLER
    ===================================================== */

    bindEvents() {

      /* GALERİ */

      document
        .querySelectorAll(
          "[data-gallery-next]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              this.nextImage();

            }
          );

        });


      document
        .querySelectorAll(
          "[data-gallery-prev]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              this.previousImage();

            }
          );

        });


      document
        .querySelectorAll(
          "[data-gallery-index]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.currentImageIndex =
                Number(
                  button.dataset.galleryIndex
                );

              this.updateGallery();

            }
          );

        });


      document
        .querySelectorAll(
          "[data-gallery-fullscreen]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.openLightbox();

            }
          );

        });


      /* FAVORİ */

      document
        .querySelectorAll(
          "[data-detail-favorite]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            event => {

              event.stopPropagation();

              this.toggleFavorite();

            }
          );

        });


      /* KARŞILAŞTIR */

      document
        .querySelectorAll(
          "[data-detail-compare]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.compare();

            }
          );

        });


      /* İLETİŞİM */

      document
        .querySelectorAll(
          "[data-detail-contact]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.contactSeller();

            }
          );

        });


      /* TELEFON */

      document
        .querySelectorAll(
          "[data-detail-phone]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.showPhone();

            }
          );

        });


      /* SEKME */

      document
        .querySelectorAll(
          "[data-detail-tab]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.setTab(
                button.dataset.detailTab
              );

            }
          );

        });


      /* LIGHTBOX */

      document
        .querySelectorAll(
          "[data-lightbox-close]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.closeLightbox();

            }
          );

        });


      document
        .querySelectorAll(
          "[data-lightbox-next]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.nextImage();

            }
          );

        });


      document
        .querySelectorAll(
          "[data-lightbox-prev]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.previousImage();

            }
          );

        });


      /* ANA SİTEYE DÖNÜŞ */

      document
        .querySelectorAll(
          "[data-detail-close]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.close();

              if (
                typeof window.go ===
                "function"
              ) {
                window.go("home");
              }

            }
          );

        });


      document
        .querySelectorAll(
          "[data-detail-browse]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.close();

              if (
                typeof window.go ===
                "function"
              ) {

                window.go("browse");

              }

            }
          );

        });


      /* BENZER ARAÇ */

      document
        .querySelectorAll(
          "[data-similar-id]"
        )
        .forEach(card => {

          card.addEventListener(
            "click",
            () => {

              this.open(
                card.dataset.similarId
              );

            }
          );

        });


      /* AI */

      document
        .querySelectorAll(
          "[data-detail-ai]"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            () => {

              this.aiSuggest();

            }
          );

        });

    },


    /* =====================================================
       KLAVYE
    ===================================================== */

    handleKeydown(event) {

      const detail =
        window.AB_Detail;

      if (!detail) return;

      const container =
        document.getElementById(
          "car-detail-container"
        );

      if (
        !container ||
        container.style.display === "none"
      ) {
        return;
      }


      if (
        event.key === "Escape"
      ) {

        const lightbox =
          document.querySelector(
            "[data-detail-lightbox].open"
          );

        if (lightbox) {

          detail.closeLightbox();

        } else {

          detail.close();

        }

        return;
      }


      if (
        event.key === "ArrowRight"
      ) {

        detail.nextImage();

      }


      if (
        event.key === "ArrowLeft"
      ) {

        detail.previousImage();

      }

    }

  };


  /* =======================================================
     GLOBAL
  ======================================================= */

  window.AB_Detail =
    AB_Detail;


  /* ESC / OK TUŞLARI */
  document.addEventListener(
    "keydown",
    AB_Detail.handleKeydown
  );

})();
