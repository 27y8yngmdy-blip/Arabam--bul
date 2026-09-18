(function () {
  'use strict';

  let currentCar = null;
  let galleryImages = [];
  let currentImageIndex = 0;
  let isLightboxOpen = false;
  let lightboxIndex = 0;

  const PLACEHOLDER_IMG =
    'https://via.placeholder.com/900x650?text=G%C3%B6rsel+Yok';


  /* =====================================================
     YARDIMCI FONKSİYONLAR
  ===================================================== */

  function formatPrice(price) {
    if (
      price === undefined ||
      price === null ||
      price === '' ||
      isNaN(Number(price))
    ) {
      return 'Fiyat Belirtilmedi';
    }

    return Number(price).toLocaleString('tr-TR') + ' TL';
  }


  function formatKM(km) {
    if (
      km === undefined ||
      km === null ||
      km === '' ||
      isNaN(Number(km))
    ) {
      return 'Belirtilmedi';
    }

    return Number(km).toLocaleString('tr-TR') + ' km';
  }


  function formatVal(value) {
    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {
      return 'Belirtilmedi';
    }

    if (typeof value === 'object') {

      if (value.text) {
        return String(value.text);
      }

      if (value.status) {
        return String(value.status);
      }

      if (value.note) {
        return String(value.note);
      }

      return Object.values(value)
        .filter(Boolean)
        .join(' • ') || 'Belirtilmedi';
    }

    return String(value);
  }


  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }


  function calculateTrustScore(car) {

    let score = 50;

    const currentYear =
      new Date().getFullYear();

    if (car && car.year) {

      const age =
        currentYear - Number(car.year);

      if (age <= 3) {
        score += 20;
      } else if (age <= 7) {
        score += 10;
      }
    }

    if (
      car &&
      car.km !== undefined &&
      car.km !== null
    ) {

      const km = Number(car.km);

      if (km < 50000) {
        score += 20;
      } else if (km < 120000) {
        score += 10;
      }
    }

    if (car && car.expert) {
      score += 10;
    }

    score = Math.max(
      0,
      Math.min(95, score)
    );

    return {
      rawScore: score,
      formatted: (score / 10).toFixed(1)
    };
  }


  function prepareImageList(car) {

    let images = [];

    if (
      car &&
      Array.isArray(car.images)
    ) {

      images = car.images.filter(function (img) {

        return (
          img &&
          String(img).trim() !== ''
        );

      });

    }

    if (
      images.length === 0 &&
      car &&
      car.img
    ) {

      images = [
        String(car.img)
      ];

    }

    if (images.length === 0) {
      images = [PLACEHOLDER_IMG];
    }

    return images;
  }


  function getSimilarCars(car) {

    if (
      !window.dummyCars ||
      !Array.isArray(window.dummyCars)
    ) {
      return [];
    }

    return window.dummyCars
      .filter(function (item) {

        return (
          item &&
          String(item.id) !==
            String(car.id)
        );

      })
      .filter(function (item) {

        const sameSegment =
          item.seg &&
          car.seg &&
          String(item.seg).toLowerCase() ===
            String(car.seg).toLowerCase();

        const sameBrand =
          item.brand &&
          car.brand &&
          String(item.brand).toLowerCase() ===
            String(car.brand).toLowerCase();

        return (
          sameSegment ||
          sameBrand
        );

      })
      .slice(0, 3);
  }


  /* =====================================================
     DETAY HTML
  ===================================================== */

  function generateDetailHTML(car) {

    const trustScore =
      calculateTrustScore(car);

    galleryImages =
      prepareImageList(car);

    currentImageIndex = 0;

    const similarCars =
      getSimilarCars(car);

    const brand =
      escapeHTML(formatVal(car.brand));

    const model =
      escapeHTML(formatVal(car.model));

    const title =
      `${brand} ${model}`;

    const phone =
      car.phone
        ? String(car.phone)
        : '';

    const expertText =
      formatVal(car.expert);

    return `

      <div
        class="ab-detail-overlay"
        id="abDetailOverlay"
      >

        <div class="ab-detail-wrapper">

          <!-- HEADER -->

          <header class="ab-detail-header">

            <button
              type="button"
              class="ab-detail-back-btn"
              onclick="window.AB_Detail.close()"
            >
              <span class="ab-detail-back-icon">←</span>
              <span>Geri</span>
            </button>


            <div class="ab-detail-header-title">
              ${title}
            </div>


            <div class="ab-detail-header-actions">

              <button
                type="button"
                class="ab-detail-icon-btn"
                onclick="window.AB_Detail.toggleFavorite('${car.id}')"
                title="Favorilere Ekle"
              >
                ♡
              </button>


              <button
                type="button"
                class="ab-detail-icon-btn"
                onclick="window.AB_Detail.toggleCompare('${car.id}')"
                title="Karşılaştır"
              >
                ⇄
              </button>


              <button
                type="button"
                class="ab-detail-close-btn"
                onclick="window.AB_Detail.close()"
                title="Kapat"
              >
                ×
              </button>

            </div>

          </header>


          <!-- ANA İÇERİK -->

          <main class="ab-detail-body">


            <!-- ÜST ALAN -->

            <section class="ab-detail-top-grid">


              <!-- GALERİ -->

              <div
                class="ab-detail-gallery-container"
                id="abGalleryContainer"
              >

                <div
                  class="ab-detail-main-img-wrap"
                  onclick="window.AB_Detail.openLightbox()"
                >

                  <img
                    id="abDetailMainImg"
                    src="${galleryImages[0]}"
                    alt="${title}"
                  >

                  <div class="ab-detail-img-counter">

                    <span id="abImgCurrent">
                      1
                    </span>

                    <span>/</span>

                    <span id="abImgTotal">
                      ${galleryImages.length}
                    </span>

                  </div>


                  <div class="ab-detail-zoom-badge">
                    ⛶
                  </div>

                </div>


                ${
                  galleryImages.length > 1
                    ? `

                    <button
                      type="button"
                      class="ab-detail-nav-btn ab-prev"
                      onclick="window.AB_Detail.prevImage(event)"
                    >
                      ‹
                    </button>


                    <button
                      type="button"
                      class="ab-detail-nav-btn ab-next"
                      onclick="window.AB_Detail.nextImage(event)"
                    >
                      ›
                    </button>


                    <div class="ab-detail-thumbs">

                      ${galleryImages
                        .map(function (img, index) {

                          return `

                            <button
                              type="button"
                              class="ab-detail-thumb-btn ${
                                index === 0
                                  ? 'active'
                                  : ''
                              }"
                              onclick="window.AB_Detail.setGalleryIndex(${index})"
                            >

                              <img
                                src="${img}"
                                alt="Araç görseli ${index + 1}"
                              >

                            </button>

                          `;

                        })
                        .join('')}

                    </div>

                  `
                    : ''
                }

              </div>


              <!-- SAĞ BİLGİ -->

              <aside class="ab-detail-quick-info">


                <div class="ab-detail-title-group">

                  <span class="ab-detail-segment-tag">
                    ${escapeHTML(formatVal(car.seg))}
                  </span>


                  <h2>
                    ${title}
                  </h2>


                  <div class="ab-detail-price-tag">
                    ${formatPrice(car.price)}
                  </div>

                </div>


                <!-- HIZLI BİLGİLER -->

                <div class="ab-detail-mini-specs">

                  <div>
                    <span>Yıl</span>
                    <strong>
                      ${escapeHTML(formatVal(car.year))}
                    </strong>
                  </div>


                  <div>
                    <span>KM</span>
                    <strong>
                      ${formatKM(car.km)}
                    </strong>
                  </div>


                  <div>
                    <span>Yakıt</span>
                    <strong>
                      ${escapeHTML(formatVal(car.fuel))}
                    </strong>
                  </div>


                  <div>
                    <span>Vites</span>
                    <strong>
                      ${escapeHTML(formatVal(car.trans))}
                    </strong>
                  </div>

                </div>


                <!-- GÜVEN SKORU -->

                <div class="ab-detail-card ab-trust-card">

                  <div class="ab-detail-card-header">

                    <h3>
                      Güven Skoru
                    </h3>

                    <span class="ab-detail-badge-demo">
                      DEMO
                    </span>

                  </div>


                  <div class="ab-detail-score-number">
                    ${trustScore.formatted}
                    <span>/10</span>
                  </div>


                  <div class="ab-detail-score-bar-wrap">

                    <div
                      class="ab-detail-score-bar"
                      style="width:${trustScore.rawScore}%"
                    ></div>

                  </div>


                  <small class="ab-detail-muted">
                    Araç yaşı, kilometre ve ekspertiz
                    verilerine göre oluşturulan demo skoru.
                  </small>

                </div>


                <!-- İLETİŞİM -->

                <div class="ab-detail-desktop-cta">

                  ${
                    phone
                      ? `

                        <a
                          href="tel:${phone}"
                          class="ab-btn ab-btn-primary ab-btn-block"
                        >
                          📞 Satıcıyla İletişime Geç
                        </a>

                      `
                      : `

                        <button
                          type="button"
                          class="ab-btn ab-btn-primary ab-btn-block"
                          onclick="window.AB_Detail.contactSeller()"
                        >
                          💬 Satıcıya Mesaj Gönder
                        </button>

                      `
                  }

                </div>

              </aside>

            </section>


            <!-- ARAÇ BİLGİLERİ -->

            <section class="ab-detail-section">

              <h3 class="ab-detail-section-title">
                Araç Bilgileri
              </h3>


              <div class="ab-detail-specs-grid">

                <div class="ab-spec-item">
                  <span class="ab-spec-label">Marka</span>
                  <span class="ab-spec-value">
                    ${brand}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Model</span>
                  <span class="ab-spec-value">
                    ${model}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Yıl</span>
                  <span class="ab-spec-value">
                    ${escapeHTML(formatVal(car.year))}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Kilometre</span>
                  <span class="ab-spec-value">
                    ${formatKM(car.km)}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Yakıt</span>
                  <span class="ab-spec-value">
                    ${escapeHTML(formatVal(car.fuel))}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Vites</span>
                  <span class="ab-spec-value">
                    ${escapeHTML(formatVal(car.trans))}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Kasa</span>
                  <span class="ab-spec-value">
                    ${escapeHTML(formatVal(car.seg))}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Fiyat</span>
                  <span class="ab-spec-value">
                    ${formatPrice(car.price)}
                  </span>
                </div>


                ${
                  car.tco !== undefined &&
                  car.tco !== null
                    ? `

                      <div class="ab-spec-item">

                        <span class="ab-spec-label">
                          Aylık Tahmini Gider
                        </span>

                        <span class="ab-spec-value">
                          ${formatPrice(car.tco)}
                        </span>

                      </div>

                    `
                    : ''
                }

              </div>

            </section>


            <!-- EKSPERTİZ -->

            ${
              car.expert
                ? `

                  <section class="ab-detail-section">

                    <h3 class="ab-detail-section-title">
                      Ekspertiz Durumu
                    </h3>


                    <div class="ab-detail-card ab-expert-card">

                      <div class="ab-expert-content">

                        <div class="ab-expert-icon">
                          ✓
                        </div>


                        <div>

                          <strong>
                            Ekspertiz Notu
                          </strong>

                          <p>
                            ${escapeHTML(expertText)}
                          </p>

                        </div>

                      </div>

                    </div>

                  </section>

                `
                : ''
            }


            <!-- BENZER ARAÇLAR -->

            ${
              similarCars.length
                ? `

                  <section class="ab-detail-section">

                    <h3 class="ab-detail-section-title">
                      Benzer Araçlar
                    </h3>


                    <div class="ab-detail-similar-grid">

                      ${similarCars
                        .map(function (similar) {

                          const image =
                            (
                              Array.isArray(
                                similar.images
                              ) &&
                              similar.images[0]
                            ) ||
                            similar.img ||
                            PLACEHOLDER_IMG;


                          return `

                            <article
                              class="ab-similar-card"
                              onclick="window.openDetail('${similar.id}')"
                            >

                              <div class="ab-similar-img-wrap">

                                <img
                                  src="${image}"
                                  alt="${escapeHTML(
                                    formatVal(
                                      similar.brand
                                    )
                                  )}"
                                >

                              </div>


                              <div class="ab-similar-info">

                                <h4>
                                  ${escapeHTML(
                                    formatVal(
                                      similar.brand
                                    )
                                  )}

                                  ${escapeHTML(
                                    formatVal(
                                      similar.model
                                    )
                                  )}
                                </h4>


                                <div class="ab-similar-meta">

                                  ${escapeHTML(
                                    formatVal(
                                      similar.year
                                    )
                                  )}

                                  <span>•</span>

                                  ${formatKM(
                                    similar.km
                                  )}

                                </div>


                                <div class="ab-similar-price">
                                  ${formatPrice(
                                    similar.price
                                  )}
                                </div>

                              </div>

                            </article>

                          `;

                        })
                        .join('')}

                    </div>

                  </section>

                `
                : ''
            }


            <!-- ALT BOŞLUK -->

            <div class="ab-detail-bottom-space"></div>

          </main>


          <!-- MOBİL ALT BAR -->

          <div class="ab-detail-mobile-bottom-bar">

            <div class="ab-mobile-price">

              <small>
                Fiyat
              </small>

              <strong>
                ${formatPrice(car.price)}
              </strong>

            </div>


            ${
              phone
                ? `

                  <a
                    href="tel:${phone}"
                    class="ab-btn ab-btn-primary"
                  >
                    📞 İletişim
                  </a>

                `
                : `

                  <button
                    type="button"
                    class="ab-btn ab-btn-primary"
                    onclick="window.AB_Detail.contactSeller()"
                  >
                    İletişim
                  </button>

                `
            }

          </div>

        </div>

      </div>


      <!-- LIGHTBOX -->

      <div
        class="ab-lightbox-overlay"
        id="abLightboxOverlay"
      >

        <button
          type="button"
          class="ab-lightbox-close"
          onclick="window.AB_Detail.closeLightbox(event)"
        >
          ×
        </button>


        <div
          class="ab-lightbox-content"
          onclick="event.stopPropagation()"
        >

          <img
            id="abLightboxImg"
            src=""
            alt="Büyük araç görseli"
          >


          <div class="ab-lightbox-counter">

            <span id="abLbCurrent">
              1
            </span>

            /
            
            <span id="abLbTotal">
              ${galleryImages.length}
            </span>

          </div>


          ${
            galleryImages.length > 1
              ? `

                <button
                  type="button"
                  class="ab-lightbox-nav ab-lb-prev"
                  onclick="window.AB_Detail.navigateLightbox(-1)"
                >
                  ‹
                </button>


                <button
                  type="button"
                  class="ab-lightbox-nav ab-lb-next"
                  onclick="window.AB_Detail.navigateLightbox(1)"
                >
                  ›
                </button>

              `
              : ''
          }

        </div>

      </div>

    `;
  }


  /* =====================================================
     GALERİ
  ===================================================== */

  function updateGalleryDisplay() {

    const mainImg =
      document.getElementById(
        'abDetailMainImg'
      );

    const currentSpan =
      document.getElementById(
        'abImgCurrent'
      );

    const thumbs =
      document.querySelectorAll(
        '.ab-detail-thumb-btn'
      );


    if (
      mainImg &&
      galleryImages[currentImageIndex]
    ) {

      mainImg.src =
        galleryImages[currentImageIndex];

    }


    if (currentSpan) {

      currentSpan.textContent =
        currentImageIndex + 1;

    }


    thumbs.forEach(function (
      thumb,
      index
    ) {

      thumb.classList.toggle(
        'active',
        index === currentImageIndex
      );

    });

  }


  /* =====================================================
     TOUCH
  ===================================================== */

  function attachTouchEvents() {

    const gallery =
      document.getElementById(
        'abGalleryContainer'
      );

    if (!gallery) {
      return;
    }


    let startX = 0;


    gallery.addEventListener(
      'touchstart',
      function (event) {

        if (
          event.touches &&
          event.touches[0]
        ) {

          startX =
            event.touches[0].clientX;

        }

      },
      {
        passive: true
      }
    );


    gallery.addEventListener(
      'touchend',
      function (event) {

        if (
          !event.changedTouches ||
          !event.changedTouches[0]
        ) {
          return;
        }


        const endX =
          event.changedTouches[0].clientX;


        const difference =
          endX - startX;


        if (Math.abs(difference) < 40) {
          return;
        }


        if (difference < 0) {
          window.AB_Detail.nextImage();
        } else {
          window.AB_Detail.prevImage();
        }

      },
      {
        passive: true
      }
    );

  }


  /* =====================================================
     KLAVYE
  ===================================================== */

  document.addEventListener(
    'keydown',
    function (event) {

      const container =
        document.getElementById(
          'car-detail-container'
        );


      if (
        !container ||
        container.style.display === 'none'
      ) {
        return;
      }


      if (event.key === 'Escape') {

        if (isLightboxOpen) {
          window.AB_Detail.closeLightbox();
        } else {
          window.AB_Detail.close();
        }

      }


      if (
        event.key === 'ArrowLeft'
      ) {

        if (isLightboxOpen) {
          window.AB_Detail.navigateLightbox(-1);
        } else {
          window.AB_Detail.prevImage();
        }

      }


      if (
        event.key === 'ArrowRight'
      ) {

        if (isLightboxOpen) {
          window.AB_Detail.navigateLightbox(1);
        } else {
          window.AB_Detail.nextImage();
        }

      }

    }
  );


  /* =====================================================
     DETAY SİSTEMİ
  ===================================================== */

  window.AB_Detail = {

    open: function (carId) {

      console.log(
        'Araç detay açılıyor:',
        carId
      );


      if (
        !window.dummyCars ||
        !Array.isArray(window.dummyCars)
      ) {

        console.error(
          'dummyCars bulunamadı.'
        );

        return;

      }


      const car =
        window.dummyCars.find(
          function (item) {

            return (
              item &&
              String(item.id) ===
                String(carId)
            );

          }
        );


      if (!car) {

        console.error(
          'Araç bulunamadı:',
          carId
        );

        return;

      }


      currentCar = car;


      const container =
        document.getElementById(
          'car-detail-container'
        );


      if (!container) {

        console.error(
          '#car-detail-container bulunamadı.'
        );

        return;

      }


      try {

        container.innerHTML =
          generateDetailHTML(car);


        /*
          DETAY KONTEYNERİNİ CSS'TEN
          BAĞIMSIZ OLARAK TAM EKRAN YAP
        */

        container.style.setProperty(
          'display',
          'block',
          'important'
        );

        container.style.setProperty(
          'position',
          'fixed',
          'important'
        );

        container.style.setProperty(
          'inset',
          '0',
          'important'
        );

        container.style.setProperty(
          'width',
          '100%',
          'important'
        );

        container.style.setProperty(
          'height',
          '100%',
          'important'
        );

        container.style.setProperty(
          'z-index',
          '999999',
          'important'
        );

        container.style.setProperty(
          'background',
          '#f5f6f8',
          'important'
        );

        container.style.setProperty(
          'overflow',
          'auto',
          'important'
        );


        document.body.style.overflow =
          'hidden';


        isLightboxOpen = false;


        attachTouchEvents();


        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });


        console.log(
          'Detay ekranı açıldı:',
          car.brand,
          car.model
        );

      } catch (error) {

        console.error(
          'Detay oluşturma hatası:',
          error
        );


        container.innerHTML = `

          <div
            style="
              min-height:100vh;
              background:#fff;
              padding:30px;
              font-family:Arial,sans-serif;
              box-sizing:border-box;
            "
          >

            <button
              onclick="window.AB_Detail.close()"
              style="
                background:#e30613;
                color:white;
                border:0;
                padding:12px 20px;
                border-radius:10px;
                font-weight:700;
                cursor:pointer;
              "
            >
              ← Geri
            </button>


            <h1>
              ${escapeHTML(
                formatVal(car.brand)
              )}

              ${escapeHTML(
                formatVal(car.model)
              )}
            </h1>


            <h2>
              ${formatPrice(car.price)}
            </h2>


            <p>
              Detay ekranı açıldı fakat
              tasarım oluşturulurken bir hata oluştu.
            </p>

          </div>

        `;

        container.style.setProperty(
          'display',
          'block',
          'important'
        );

        container.style.setProperty(
          'position',
          'fixed',
          'important'
        );

        container.style.setProperty(
          'inset',
          '0',
          'important'
        );

        container.style.setProperty(
          'z-index',
          '999999',
          'important'
        );

        container.style.setProperty(
          'overflow',
          'auto',
          'important'
        );

        document.body.style.overflow =
          'hidden';

      }

    },


    close: function () {

      const container =
        document.getElementById(
          'car-detail-container'
        );


      if (container) {

        container.style.setProperty(
          'display',
          'none',
          'important'
        );

        container.innerHTML = '';

      }


      document.body.style.overflow =
        '';


      currentCar = null;
      galleryImages = [];
      currentImageIndex = 0;
      isLightboxOpen = false;

    },


    setGalleryIndex: function (index) {

      if (
        index >= 0 &&
        index < galleryImages.length
      ) {

        currentImageIndex =
          index;

        updateGalleryDisplay();

      }

    },


    prevImage: function (event) {

      if (
        event &&
        typeof event.stopPropagation ===
          'function'
      ) {

        event.stopPropagation();

      }


      if (
        galleryImages.length <= 1
      ) {
        return;
      }


      currentImageIndex =
        (
          currentImageIndex -
          1 +
          galleryImages.length
        ) %
        galleryImages.length;


      updateGalleryDisplay();

    },


    nextImage: function (event) {

      if (
        event &&
        typeof event.stopPropagation ===
          'function'
      ) {

        event.stopPropagation();

      }


      if (
        galleryImages.length <= 1
      ) {
        return;
      }


      currentImageIndex =
        (
          currentImageIndex +
          1
        ) %
        galleryImages.length;


      updateGalleryDisplay();

    },


    openLightbox: function () {

      if (
        galleryImages.length === 0
      ) {
        return;
      }


      lightboxIndex =
        currentImageIndex;

      isLightboxOpen = true;


      const overlay =
        document.getElementById(
          'abLightboxOverlay'
        );

      const image =
        document.getElementById(
          'abLightboxImg'
        );

      const current =
        document.getElementById(
          'abLbCurrent'
        );

      const total =
        document.getElementById(
          'abLbTotal'
        );


      if (!overlay || !image) {
        return;
      }


      image.src =
        galleryImages[lightboxIndex];


      if (current) {
        current.textContent =
          lightboxIndex + 1;
      }


      if (total) {
        total.textContent =
          galleryImages.length;
      }


      overlay.style.setProperty(
        'display',
        'flex',
        'important'
      );

      overlay.style.setProperty(
        'position',
        'fixed',
        'important'
      );

      overlay.style.setProperty(
        'inset',
        '0',
        'important'
      );

      overlay.style.setProperty(
        'z-index',
        '1000000',
        'important'
      );

    },


    closeLightbox: function (event) {

      if (
        event &&
        typeof event.stopPropagation ===
          'function'
      ) {

        event.stopPropagation();

      }


      const overlay =
        document.getElementById(
          'abLightboxOverlay'
        );


      if (overlay) {

        overlay.style.setProperty(
          'display',
          'none',
          'important'
        );

      }


      isLightboxOpen = false;

    },


    navigateLightbox: function (
      direction
    ) {

      if (
        galleryImages.length <= 1
      ) {
        return;
      }


      lightboxIndex =
        (
          lightboxIndex +
          direction +
          galleryImages.length
        ) %
        galleryImages.length;


      const image =
        document.getElementById(
          'abLightboxImg'
        );

      const current =
        document.getElementById(
          'abLbCurrent'
        );


      if (image) {

        image.src =
          galleryImages[
            lightboxIndex
          ];

      }


      if (current) {

        current.textContent =
          lightboxIndex + 1;

      }

    },


    toggleFavorite: function (
      carId
    ) {

      if (
        typeof window.toggleFav ===
        'function'
      ) {

        window.toggleFav(
          Number(carId)
        );

        return;

      }


      alert(
        'Favori sistemi hazır değil.'
      );

    },


    toggleCompare: function () {

      alert(
        'Karşılaştırma özelliği yakında aktif olacak.'
      );

    },


    contactSeller: function () {

      if (
        currentCar &&
        currentCar.phone
      ) {

        window.location.href =
          'tel:' +
          currentCar.phone;

        return;

      }


      alert(
        'Bu araç için iletişim bilgisi bulunmuyor.'
      );

    }

  };


  /* =====================================================
     GLOBAL OPEN DETAIL
  ===================================================== */

  window.openDetail = function (
    carId
  ) {

    if (
      window.AB_Detail &&
      typeof window.AB_Detail.open ===
        'function'
    ) {

      window.AB_Detail.open(
        carId
      );

    } else {

      console.error(
        'AB_Detail henüz yüklenmedi.'
      );

    }

  };


  console.log(
    'ARABAMI BUL araç detay sistemi hazır.'
  );

})();
