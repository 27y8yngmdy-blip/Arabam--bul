(function () {
  'use strict';

  // Global State
  let currentCar = null;
  let galleryImages = [];
  let currentImageIndex = 0;
  let isLightboxOpen = false;
  let lightboxIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let globalEventsAttached = false;

  // Placeholder Image
  const PLACEHOLDER_IMG = 'https://via.placeholder.com/800x600?text=G%C3%B6rsel+Yok';

  // Helper: Format Price
  function formatPrice(price) {
    if (price === undefined || price === null || isNaN(price)) return 'Fiyat Belirtilmedi';
    return Number(price).toLocaleString('tr-TR') + ' TL';
  }

  // Helper: Format KM
  function formatKM(km) {
    if (km === undefined || km === null || isNaN(km)) return 'Belirtilmedi';
    return Number(km).toLocaleString('tr-TR') + ' km';
  }

  // Helper: Format Text
  function formatVal(val) {
    if (val === undefined || val === null || String(val).trim() === '') return 'Belirtilmedi';
    return String(val);
  }

  // Güven Skoru Algoritması (DEMO)
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

    if (car && car.km !== undefined && car.km !== null) {
      const km = Number(car.km);

      if (km < 50000) {
        score += 20;
      } else if (km < 120000) {
        score += 10;
      }
    }

    if (car && car.expert && String(car.expert).trim() !== '') {
      score += 10;
    }

    if (score > 95) score = 95;
    if (score < 0) score = 0;

    return {
      rawScore: score,
      formatted: (score / 10).toFixed(1)
    };
  }

  // Prepare Image List
  function prepareImageList(car) {
    let images = [];
    if (car && Array.isArray(car.images) && car.images.length > 0) {
      images = car.images.filter(img => img && String(img).trim() !== '');
    }
    if (images.length === 0 && car && car.img && String(car.img).trim() !== '') {
      images = [car.img];
    }
    if (images.length === 0) {
      images = [PLACEHOLDER_IMG];
    }
    return images;
  }

  // Find Similar Cars from window.dummyCars
  function getSimilarCars(car) {
    if (!window.dummyCars || !Array.isArray(window.dummyCars)) return [];
    return window.dummyCars
      .filter(item => item && String(item.id) !== String(car.id))
      .filter(item => {
        const sameSeg = item.seg && car.seg && String(item.seg).toLowerCase() === String(car.seg).toLowerCase();
        const sameBrand = item.brand && car.brand && String(item.brand).toLowerCase() === String(car.brand).toLowerCase();
        return sameSeg || sameBrand;
      })
      .slice(0, 3);
  }

  // Generate Complete Detail HTML
  function generateDetailHTML(car) {
    const trustScore = calculateTrustScore(car);
    galleryImages = prepareImageList(car);
    currentImageIndex = 0;

    const similarCars = getSimilarCars(car);
    const hasPhone = car.phone && String(car.phone).trim() !== '';

    return `
      <div class="ab-detail-overlay" id="abDetailOverlay">
        <div class="ab-detail-wrapper" id="abDetailWrapper">
          
          <!-- Header Bar -->
          <header class="ab-detail-header">
            <button type="button" class="ab-detail-back-btn" onclick="window.AB_Detail.close()" aria-label="Kapat">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Geri</span>
            </button>
            <h1 class="ab-detail-header-title">${formatVal(car.brand)} ${formatVal(car.model)}</h1>
            <div class="ab-detail-header-actions">
              <button type="button" class="ab-detail-icon-btn" onclick="window.AB_Detail.toggleFavorite('${car.id}')" title="Favorilere Ekle" aria-label="Favorilere Ekle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <button type="button" class="ab-detail-icon-btn" onclick="window.AB_Detail.toggleCompare('${car.id}')" title="Karşılaştır" aria-label="Karşılaştır">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
              <button type="button" class="ab-detail-close-btn" onclick="window.AB_Detail.close()" aria-label="Kapat">&times;</button>
            </div>
          </header>

          <!-- Main Scrollable Body -->
          <div class="ab-detail-body">
            
            <!-- Top Section: Gallery & Quick Stats -->
            <div class="ab-detail-top-grid">
              
              <!-- Gallery Container -->
              <div class="ab-detail-gallery-container" id="abGalleryContainer">
                <div class="ab-detail-main-img-wrap" onclick="window.AB_Detail.openLightbox()">
                  <img id="abDetailMainImg" src="${galleryImages[0]}" alt="${formatVal(car.brand)} ${formatVal(car.model)}" />
                  <div class="ab-detail-img-counter">
                    <span id="abImgCurrent">1</span> / <span id="abImgTotal">${galleryImages.length}</span>
                  </div>
                  <button type="button" class="ab-detail-zoom-badge" aria-label="Büyüt">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  </button>
                </div>

                ${galleryImages.length > 1 ? `
                  <button type="button" class="ab-detail-nav-btn ab-prev" onclick="window.AB_Detail.prevImage(event)" aria-label="Önceki Görsel">&#10094;</button>
                  <button type="button" class="ab-detail-nav-btn ab-next" onclick="window.AB_Detail.nextImage(event)" aria-label="Sonraki Görsel">&#10095;</button>
                  <div class="ab-detail-thumbs">
                    ${galleryImages.map((img, idx) => `
                      <button type="button" class="ab-detail-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="window.AB_Detail.setGalleryIndex(${idx})" aria-label="Görsel ${idx + 1}">
                        <img src="${img}" alt="Küçük Görsel ${idx + 1}" />
                      </button>
                    `).join('')}
                  </div>
                ` : ''}
              </div>

              <!-- Quick Info / Price Box -->
              <div class="ab-detail-quick-info">
                <div class="ab-detail-title-group">
                  <span class="ab-detail-segment-tag">${formatVal(car.seg)} Segment</span>
                  <h2>${formatVal(car.brand)} ${formatVal(car.model)}</h2>
                  <div class="ab-detail-price-tag">${formatPrice(car.price)}</div>
                </div>

                <!-- Trust Score Card -->
                <div class="ab-detail-card ab-trust-card">
                  <div class="ab-detail-card-header">
                    <h3>Güven Skoru</h3>
                    <span class="ab-detail-badge-demo">DEMO / TAHMİNİ</span>
                  </div>
                  <div class="ab-detail-score-bar-wrap">
                    <div class="ab-detail-score-bar" style="width: ${trustScore.rawScore}%;">
                      ${trustScore.formatted} / 10
                    </div>
                  </div>
                  <small class="ab-detail-muted">Bu skor araç yaşı, kilometre ve ekspertiz verileri kullanılarak hesaplanan tahmini bir algoritma değeridir.</small>
                </div>

                <!-- Primary CTA Desktop -->
                <div class="ab-detail-desktop-cta">
                  ${hasPhone ? `
                    <a href="tel:${car.phone}" class="ab-btn ab-btn-primary ab-btn-block">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      İletişime Geç (${car.phone})
                    </a>
                  ` : `
                    <button type="button" class="ab-btn ab-btn-primary ab-btn-block" onclick="window.AB_Detail.contactSeller()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      Satıcıya Mesaj Gönder
                    </button>
                  `}
                </div>
              </div>

            </div>

            <!-- Details Specs Grid -->
            <div class="ab-detail-section">
              <h3 class="ab-detail-section-title">Araç Bilgileri</h3>
              <div class="ab-detail-specs-grid">
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Marka</span>
                  <span class="ab-spec-value">${formatVal(car.brand)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Model</span>
                  <span class="ab-spec-value">${formatVal(car.model)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Yıl</span>
                  <span class="ab-spec-value">${formatVal(car.year)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Kilometre</span>
                  <span class="ab-spec-value">${formatKM(car.km)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Yakıt Tipi</span>
                  <span class="ab-spec-value">${formatVal(car.fuel)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Vites Tipi</span>
                  <span class="ab-spec-value">${formatVal(car.trans)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Segment</span>
                  <span class="ab-spec-value">${formatVal(car.seg)}</span>
                </div>
                <div class="ab-spec-item">
                  <span class="ab-spec-label">Fiyat</span>
                  <span class="ab-spec-value">${formatPrice(car.price)}</span>
                </div>
                ${car.tco !== undefined && car.tco !== null ? `
                  <div class="ab-spec-item">
                    <span class="ab-spec-label">Aylık Tahmini Gider (TCO) <span class="ab-detail-badge-demo">DEMO</span></span>
                    <span class="ab-spec-value">${formatPrice(car.tco)} / ay</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <!-- Expert Report Section (if available) -->
            ${car.expert && String(car.expert).trim() !== '' ? `
              <div class="ab-detail-section">
                <h3 class="ab-detail-section-title">Ekspertiz Durumu</h3>
                <div class="ab-detail-card ab-expert-card">
                  <div class="ab-expert-content">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <div>
                      <strong>Ekspertiz Notu:</strong>
                      <p>${formatVal(car.expert)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- Similar Cars Section -->
            ${similarCars.length > 0 ? `
              <div class="ab-detail-section">
                <h3 class="ab-detail-section-title">Benzer Araçlar</h3>
                <div class="ab-detail-similar-grid">
                  ${similarCars.map(sCar => {
                    const sImg = (sCar.images && sCar.images[0]) || sCar.img || PLACEHOLDER_IMG;
                    return `
                      <div class="ab-similar-card" onclick="window.openDetail('${sCar.id}')">
                        <div class="ab-similar-img-wrap">
                          <img src="${sImg}" alt="${formatVal(sCar.brand)} ${formatVal(sCar.model)}" />
                        </div>
                        <div class="ab-similar-info">
                          <h4>${formatVal(sCar.brand)} ${formatVal(sCar.model)}</h4>
                          <div class="ab-similar-meta">${formatVal(sCar.year)} &bull; ${formatKM(sCar.km)}</div>
                          <div class="ab-similar-price">${formatPrice(sCar.price)}</div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

          </div> <!-- End Body -->

          <!-- Mobile Fixed Bottom Bar -->
          <div class="ab-detail-mobile-bottom-bar">
            <div class="ab-mobile-price">
              <small>Fiyat</small>
              <strong>${formatPrice(car.price)}</strong>
            </div>
            ${hasPhone ? `
              <a href="tel:${car.phone}" class="ab-btn ab-btn-primary">
                İletişime Geç
              </a>
            ` : `
              <button type="button" class="ab-btn ab-btn-primary" onclick="window.AB_Detail.contactSeller()">
                İletişim
              </button>
            `}
          </div>

        </div> <!-- End Wrapper -->
      </div> <!-- End Overlay -->

      <!-- Lightbox Modal -->
      <div class="ab-lightbox-overlay" id="abLightboxOverlay" style="display:none;" onclick="window.AB_Detail.closeLightbox(event)">
        <button type="button" class="ab-lightbox-close" onclick="window.AB_Detail.closeLightbox(event)">&times;</button>
        <div class="ab-lightbox-content" onclick="event.stopPropagation()">
          <img id="abLightboxImg" src="" alt="Büyütülmüş Görsel" />
          <div class="ab-lightbox-counter">
            <span id="abLbCurrent">1</span> / <span id="abLbTotal">1</span>
          </div>
          ${galleryImages.length > 1 ? `
            <button type="button" class="ab-lightbox-nav ab-lb-prev" onclick="window.AB_Detail.navigateLightbox(-1)">&#10094;</button>
            <button type="button" class="ab-lightbox-nav ab-lb-next" onclick="window.AB_Detail.navigateLightbox(1)">&#10095;</button>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Update Gallery Image Display
  function updateGalleryDisplay() {
    const mainImg = document.getElementById('abDetailMainImg');
    const currentSpan = document.getElementById('abImgCurrent');
    const thumbs = document.querySelectorAll('.ab-detail-thumb-btn');

    if (mainImg && galleryImages[currentImageIndex]) {
      mainImg.src = galleryImages[currentImageIndex];
    }
    if (currentSpan) {
      currentSpan.textContent = currentImageIndex + 1;
    }
    thumbs.forEach((thumb, idx) => {
      if (idx === currentImageIndex) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });
  }

  // Attach Global Event Listeners (Keyboard + Touch/Swipe)
  function attachGlobalEvents() {
    if (globalEventsAttached) return;

    // Keyboard Events
    document.addEventListener('keydown', function (e) {
      const container = document.getElementById('car-detail-container');
      if (!container || container.style.display === 'none') return;

      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          window.AB_Detail.closeLightbox();
        } else {
          window.AB_Detail.close();
        }
      } else if (e.key === 'ArrowLeft') {
        if (isLightboxOpen) {
          window.AB_Detail.navigateLightbox(-1);
        } else {
          window.AB_Detail.prevImage();
        }
      } else if (e.key === 'ArrowRight') {
        if (isLightboxOpen) {
          window.AB_Detail.navigateLightbox(1);
        } else {
          window.AB_Detail.nextImage();
        }
      }
    });

    globalEventsAttached = true;
  }

  // Attach Touch Events for Gallery
  function attachTouchEvents() {
    const galleryContainer = document.getElementById('abGalleryContainer');
    if (!galleryContainer) return;

    galleryContainer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryContainer.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const threshold = 40;
    if (touchEndX < touchStartX - threshold) {
      window.AB_Detail.nextImage();
    } else if (touchEndX > touchStartX + threshold) {
      window.AB_Detail.prevImage();
    }
  }

  // Global Module Definition
  window.AB_Detail = {

    open: function (carId) {
      if (!window.dummyCars || !Array.isArray(window.dummyCars)) {
        console.error('window.dummyCars bulunamadı veya bir dizi değil.');
        return;
      }

      const car = window.dummyCars.find(item => item && String(item.id) === String(carId));
      if (!car) {
        console.error('Araç bulunamadı. ID:', carId);
        return;
      }

      currentCar = car;
      const container = document.getElementById('car-detail-container');
      if (!container) {
        console.error('#car-detail-container elementi HTML içinde bulunamadı.');
        return;
      }

      container.innerHTML = generateDetailHTML(car);
      container.style.display = 'block';
      document.body.style.overflow = 'hidden';

      attachGlobalEvents();
      attachTouchEvents();
    },

    close: function () {
      const container = document.getElementById('car-detail-container');
      if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
      }
      document.body.style.overflow = '';
      currentCar = null;
      isLightboxOpen = false;
    },

    setGalleryIndex: function (index) {
      if (index >= 0 && index < galleryImages.length) {
        currentImageIndex = index;
        updateGalleryDisplay();
      }
    },

    prevImage: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      if (galleryImages.length <= 1) return;
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateGalleryDisplay();
    },

    nextImage: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      if (galleryImages.length <= 1) return;
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateGalleryDisplay();
    },

    openLightbox: function () {
      if (galleryImages.length === 0) return;
      lightboxIndex = currentImageIndex;
      isLightboxOpen = true;

      const lbOverlay = document.getElementById('abLightboxOverlay');
      const lbImg = document.getElementById('abLightboxImg');
      const lbCurrent = document.getElementById('abLbCurrent');
      const lbTotal = document.getElementById('abLbTotal');

      if (lbOverlay && lbImg) {
        lbImg.src = galleryImages[lightboxIndex];
        if (lbCurrent) lbCurrent.textContent = lightboxIndex + 1;
        if (lbTotal) lbTotal.textContent = galleryImages.length;
        lbOverlay.style.display = 'flex';
      }
    },

    closeLightbox: function (e) {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      const lbOverlay = document.getElementById('abLightboxOverlay');
      if (lbOverlay) {
        lbOverlay.style.display = 'none';
      }
      isLightboxOpen = false;
    },

    navigateLightbox: function (direction) {
      if (galleryImages.length <= 1) return;
      lightboxIndex = (lightboxIndex + direction + galleryImages.length) % galleryImages.length;

      const lbImg = document.getElementById('abLightboxImg');
      const lbCurrent = document.getElementById('abLbCurrent');

      if (lbImg) lbImg.src = galleryImages[lightboxIndex];
      if (lbCurrent) lbCurrent.textContent = lightboxIndex + 1;

      currentImageIndex = lightboxIndex;
      updateGalleryDisplay();
    },

    toggleFavorite: function (carId) {
      alert('Araç (' + carId + ') favorilere eklendi/çıkarıldı.');
    },

    toggleCompare: function (carId) {
      alert('Araç (' + carId + ') karşılaştırma listesine eklendi.');
    },

    contactSeller: function () {
      if (currentCar && currentCar.phone) {
        window.location.href = 'tel:' + currentCar.phone;
      } else {
        alert('Bu araç için iletişim bilgisi belirtilmemiştir.');
      }
    }
  };

  

})();
