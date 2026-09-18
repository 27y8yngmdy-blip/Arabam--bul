(function () {
  'use strict';

  let currentCar = null;
  let galleryImages = [];
  let currentImageIndex = 0;
  let isLightboxOpen = false;
  let lightboxIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let globalEventsAttached = false;

  const PLACEHOLDER_IMG =
    'https://via.placeholder.com/800x600?text=G%C3%B6rsel+Yok';


  /* =========================
     YARDIMCI FONKSİYONLAR
  ========================= */

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
      if (value.text) return String(value.text);

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


  function calculateTrustScore(car) {
    let score = 50;

    const currentYear = new Date().getFullYear();

    if (car && car.year) {
      const age = currentYear - Number(car.year);

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

    if (score > 95) score = 95;
    if (score < 0) score = 0;

    return {
      rawScore: score,
      formatted: (score / 10).toFixed(1)
    };
  }


  function prepareImageList(car) {
    let images = [];

    if (
      car &&
      Array.isArray(car.images) &&
      car.images.length
    ) {
      images = car.images.filter(function (img) {
        return img && String(img).trim() !== '';
      });
    }

    if (
      images.length === 0 &&
      car &&
      car.img &&
      String(car.img).trim() !== ''
    ) {
      images = [car.img];
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
          String(item.id) !== String(car.id)
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

        return sameSegment || sameBrand;
      })
      .slice(0, 3);
  }


  /* =========================
     DETAY HTML
  ========================= */

  function generateDetailHTML(car) {

    const trustScore =
      calculateTrustScore(car);

    galleryImages =
      prepareImageList(car);

    currentImageIndex = 0;

    const similarCars =
      getSimilarCars(car);

    const hasPhone =
      car.phone &&
      String(car.phone).trim() !== '';


    return `
      <div
        class="ab-detail-overlay"
        id="abDetailOverlay"
        style="
          position:fixed;
          inset:0;
          z-index:99999;
          display:block;
        "
      >

        <div
          class="ab-detail-wrapper"
          id="abDetailWrapper"
        >

          <!-- HEADER -->

          <header class="ab-detail-header">

            <button
              type="button"
              class="ab-detail-back-btn"
              onclick="window.AB_Detail.close()"
            >

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>

              <span>Geri</span>

            </button>


            <h1 class="ab-detail-header-title">
              ${formatVal(car.brand)}
              ${formatVal(car.model)}
            </h1>


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
              >
                &times;
              </button>

            </div>

          </header>


          <!-- BODY -->

          <div class="ab-detail-body">

            <div class="ab-detail-top-grid">


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
                    alt="${formatVal(car.brand)} ${formatVal(car.model)}"
                  >


                  <div class="ab-detail-img-counter">

                    <span id="abImgCurrent">
                      1
                    </span>

                    /

                    <span id="abImgTotal">
                      ${galleryImages.length}
                    </span>

                  </div>


                  <div class="ab-detail-zoom-badge">
                    🔍
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
                    ❮
                  </button>


                  <button
                    type="button"
                    class="ab-detail-nav-btn ab-next"
                    onclick="window.AB_Detail.nextImage(event)"
                  >
                    ❯
                  </button>


                  <div class="ab-detail-thumbs">

                    ${galleryImages
                      .map(function (img, index) {
                        return `
                          <button
                            type="button"
                            class="ab-detail-thumb-btn ${
                              index === 0 ? 'active' : ''
                            }"
                            onclick="window.AB_Detail.setGalleryIndex(${index})"
                          >
                            <img
                              src="${img}"
                              alt="Görsel ${index + 1}"
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


              <!-- HIZLI BİLGİ -->

              <div class="ab-detail-quick-info">

                <div class="ab-detail-title-group">

                  <span class="ab-detail-segment-tag">
                    ${formatVal(car.seg)}
                  </span>


                  <h2>
                    ${formatVal(car.brand)}
                    ${formatVal(car.model)}
                  </h2>


                  <div class="ab-detail-price-tag">
                    ${formatPrice(car.price)}
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


                  <div class="ab-detail-score-bar-wrap">

                    <div
                      class="ab-detail-score-bar"
                      style="width:${trustScore.rawScore}%"
                    >
                      ${trustScore.formatted} / 10
                    </div>

                  </div>


                  <small class="ab-detail-muted">
                    Araç yaşı, kilometre ve ekspertiz
                    verilerine göre hesaplanan demo değerdir.
                  </small>

                </div>


                <!-- İLETİŞİM -->

                <div class="ab-detail-desktop-cta">

                  ${
                    hasPhone
                      ? `
                        <a
                          href="tel:${car.phone}"
                          class="ab-btn ab-btn-primary ab-btn-block"
                        >
                          📞 İletişime Geç
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

              </div>

            </div>


            <!-- ARAÇ BİLGİLERİ -->

            <div class="ab-detail-section">

              <h3 class="ab-detail-section-title">
                Araç Bilgileri
              </h3>


              <div class="ab-detail-specs-grid">

                <div class="ab-spec-item">
                  <span class="ab-spec-label">Marka</span>
                  <span class="ab-spec-value">
                    ${formatVal(car.brand)}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Model</span>
                  <span class="ab-spec-value">
                    ${formatVal(car.model)}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Yıl</span>
                  <span class="ab-spec-value">
                    ${formatVal(car.year)}
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
                    ${formatVal(car.fuel)}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Vites</span>
                  <span class="ab-spec-value">
                    ${formatVal(car.trans)}
                  </span>
                </div>


                <div class="ab-spec-item">
                  <span class="ab-spec-label">Kasa</span>
                  <span class="ab-spec-value">
                    ${formatVal(car.seg)}
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
                          ${formatPrice(car.tco)} / ay
                        </span>

                      </div>
                    `
                    : ''
                }

              </div>

            </div>


            <!-- EKSPERTİZ -->

            ${
              car.expert
                ? `
                  <div class="ab-detail-section">

                    <h3 class="ab-detail-section-title">
                      Ekspertiz Durumu
                    </h3>


                    <div class="ab-detail-card ab-expert-card">

                      <div class="ab-expert-content">

                        <span style="font-size:24px;">
                          ✓
                        </span>

                        <div>

                          <strong>
                            Ekspertiz Notu
                          </strong>

                          <p>
                            ${formatVal(car.expert)}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>
                `
                : ''
            }


            <!-- BENZER ARAÇLAR -->

            ${
              similarCars.length
                ? `
                  <div class="ab-detail-section">

                    <h3 class="ab-detail-section-title">
                      Benzer Araçlar
                    </h3>


                    <div class="ab-detail-similar-grid">

                      ${similarCars
                        .map(function (similar) {

                          const image =
                            (
                              similar.images &&
                              similar.images[0]
                            ) ||
                            similar.img ||
                            PLACEHOLDER_IMG;

                          return `

                            <div
                              class="ab-similar-card"
                              onclick="window.openDetail('${similar.id}')"
                            >

                              <div class="ab-similar-img-wrap">

                                <img
                                  src="${image}"
                                  alt="${formatVal(similar.brand)} ${formatVal(similar.model)}"
                                >

                              </div>


                              <div class="ab-similar-info">

                                <h4>
                                  ${formatVal(similar.brand)}
                                  ${formatVal(similar.model)}
                                </h4>


                                <div class="ab-similar-meta">

                                  ${formatVal(similar.year)}

                                  &bull;

                                  ${formatKM(similar.km)}

                                </div>


                                <div class="ab-similar-price">
                                  ${formatPrice(similar.price)}
                                </div>

                              </div>

                            </div>

                          `;
                        })
                        .join('')}

                    </div>

                  </div>
                `
                : ''
            }

          </div>


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
              hasPhone
                ? `
                  <a
                    href="tel:${car.phone}"
                    class="ab-btn ab-btn-primary"
                  >
                    İletişime Geç
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
        style="display:none;"
        onclick="window.AB_Detail.closeLightbox(event)"
      >

        <button
          type="button"
          class="ab-lightbox-close"
          onclick="window.AB_Detail.closeLightbox(event)"
        >
          &times;
        </button>


        <div
          class="ab-lightbox-content"
          onclick="event.stopPropagation()"
        >

          <img
            id="abLightboxImg"
            src=""
            alt="Büyütülmüş Görsel"
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
                  ❮
                </button>


                <button
                  type="button"
                  class="ab-lightbox-nav ab-lb-next"
                  onclick="window.AB_Detail.navigateLightbox(1)"
                >
                  ❯
                </button>
              `
              : ''
          }

        </div>

      </div>

    `;
  }


  /* =========================
     GALERİ
  ========================= */

  function updateGalleryDisplay() {

    const mainImg =
      document.getElementById('abDetailMainImg');

    const currentSpan =
      document.getElementById('abImgCurrent');

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


    thumbs.forEach(function (thumb, index) {

      thumb.classList.toggle(
        'active',
        index === currentImageIndex
      );

    });

  }


  /* =========================
     KLAVYE
  ========================= */

  function attachGlobalEvents() {

    if (globalEventsAttached) {
      return;
    }


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


        if (event.key === 'ArrowLeft') {

          if (isLightboxOpen) {
            window.AB_Detail.navigateLightbox(-1);
          } else {
            window.AB_Detail.prevImage();
          }

        }


        if (event.key === 'ArrowRight') {

          if (isLightboxOpen) {
            window.AB_Detail.navigateLightbox(1);
          } else {
            window.AB_Detail.nextImage();
          }

        }

      }
    );


    globalEventsAttached = true;
  }


  /* =========================
     MOBİL SWIPE
  ========================= */

  function attachTouchEvents() {

    const gallery =
      document.getElementById(
        'abGalleryContainer'
      );


    if (!gallery) {
      return;
    }


    gallery.addEventListener(
      'touchstart',
      function (event) {

        if (
          event.changedTouches &&
          event.changedTouches[0]
        ) {
          touchStartX =
            event.changedTouches[0].screenX;
        }

      },
      { passive: true }
    );


    gallery.addEventListener(
      'touchend',
      function (event) {

        if (
          event.changedTouches &&
          event.changedTouches[0]
        ) {
          touchEndX =
            event.changedTouches[0].screenX;
        }

        handleSwipe();

      },
      { passive: true }
    );

  }


  function handleSwipe() {

    const threshold = 40;


    if (
      touchEndX <
      touchStartX - threshold
    ) {
      window.AB_Detail.nextImage();
    }


    if (
      touchEndX >
      touchStartX + threshold
    ) {
      window.AB_Detail.prevImage();
    }

  }


  /* =========================
     ANA DETAY SİSTEMİ
  ========================= */

  window.AB_Detail = {

    open: function (carId) {

      console.log(
        'AB_Detail.open çalıştı:',
        carId
      );


      if (
        !window.dummyCars ||
        !Array.isArray(window.dummyCars)
      ) {

        console.error(
          'window.dummyCars bulunamadı.'
        );

        return;
      }


      const car =
        window.dummyCars.find(function (item) {

          return (
            item &&
            String(item.id) ===
              String(carId)
          );

        });


      if (!car) {

        console.error(
          'Araç bulunamadı. ID:',
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


        container.style.display =
          'block';


        container.style.position =
          'relative';


        container.style.zIndex =
          '99999';


        document.body.style.overflow =
          'hidden';


        attachGlobalEvents();
        attachTouchEvents();


        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });


        console.log(
          'Araç detayı başarıyla açıldı:',
          car.brand,
          car.model
        );

      } catch (error) {

        console.error(
          'Araç detay ekranı oluşturulurken hata:',
          error
        );


        container.innerHTML = `

          <div
            style="
              position:fixed;
              inset:0;
              z-index:999999;
              background:#fff;
              overflow:auto;
              padding:30px;
              font-family:Arial,sans-serif;
            "
          >

            <button
              onclick="window.AB_Detail.close()"
              style="
                padding:10px 18px;
                border:0;
                border-radius:8px;
                background:#e30613;
                color:white;
                cursor:pointer;
                margin-bottom:20px;
              "
            >
              ← Geri
            </button>


            <h1>
              ${formatVal(car.brand)}
              ${formatVal(car.model)}
            </h1>


            <h2>
              ${formatPrice(car.price)}
            </h2>


            <p>
              ${formatVal(car.year)}
              •
              ${formatKM(car.km)}
              •
              ${formatVal(car.fuel)}
              •
              ${formatVal(car.trans)}
            </p>


            <hr>


            <p>
              Araç detay sistemi çalıştı fakat
              detay tasarımında bir hata oluştu.
            </p>

          </div>

        `;

        container.style.display =
          'block';

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

        container.style.display =
          'none';

        container.innerHTML = '';

      }


      document.body.style.overflow =
        '';


      currentCar = null;

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


      if (galleryImages.length <= 1) {
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


      if (galleryImages.length <= 1) {
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


      if (overlay && image) {

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


        overlay.style.display =
          'flex';

      }

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

        overlay.style.display =
          'none';

      }


      isLightboxOpen = false;

    },


    navigateLightbox: function (direction) {

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
          galleryImages[lightboxIndex];
      }


      if (current) {
        current.textContent =
          lightboxIndex + 1;
      }


      currentImageIndex =
        lightboxIndex;


      updateGalleryDisplay();

    },


    toggleFavorite: function (carId) {

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
        'Araç favorilere eklendi / çıkarıldı.'
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

      } else {

        alert(
          'Bu araç için iletişim bilgisi belirtilmemiştir.'
        );

      }

    }

  };


  /* =========================
     GLOBAL OPENDETAIL
  ========================= */

  window.openDetail = function (carId) {

    if (
      window.AB_Detail &&
      typeof window.AB_Detail.open ===
        'function'
    ) {

      window.AB_Detail.open(carId);

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
