/* =========================================================
   ARABAMI BUL
   ARAÇ DETAY SAYFASI V2
   ========================================================= */

(function () {
  'use strict';

  const state = {
    car: null,
    images: [],
    currentImage: 0,
    lightboxOpen: false,
    previousOverflow: '',
    keyHandlerAttached: false,
    touchStartX: 0,
    touchEndX: 0
  };

  const container = document.getElementById('car-detail-container');

  if (!container) {
    console.warn('ARABAMI BUL: #car-detail-container bulunamadı.');
    return;
  }

  /* =======================================================
     HELPERS
     ======================================================= */

  function allCars() {
    return Array.isArray(window.dummyCars) ? window.dummyCars : [];
  }

  function getCar(id) {
    return allCars().find(function (car) {
      return String(car.id) === String(id);
    });
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function money(value) {
    const number = Number(value) || 0;

    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(number);
  }

  function number(value) {
    return new Intl.NumberFormat('tr-TR').format(Number(value) || 0);
  }

  function percent(value) {
    return Math.max(0, Math.min(100, Number(value) || 0));
  }

  function getImages(car) {
    if (Array.isArray(car.images) && car.images.length) {
      return car.images.filter(Boolean);
    }

    if (car.image) {
      return [car.image];
    }

    return [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=85'
    ];
  }

  function getBrand(car) {
    return car.brand || 'Bilinmiyor';
  }

  function getTitle(car) {
    return car.title || `${getBrand(car)} ${car.model || ''}`.trim();
  }

  function getBody(car) {
    return car.body || car.bodyType || 'Otomobil';
  }

  function getFuel(car) {
    return car.fuel || car.fuelType || 'Benzin';
  }

  function getTransmission(car) {
    return car.trans || car.transmission || 'Otomatik';
  }

  function getLocation(car) {
    if (car.location) return car.location;

    if (car.city) {
      return `${car.city}${car.district ? ` / ${car.district}` : ''}`;
    }

    return 'İstanbul / Kadıköy';
  }

  function getSeller(car) {
    return car.seller || car.sellerName || 'İlan Sahibi';
  }

  function initials(name) {
    return String(name || 'İS')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(function (word) {
        return word.charAt(0).toUpperCase();
      })
      .join('');
  }

  function isFavorite(id) {
    const favorites = Array.isArray(window.favorites)
      ? window.favorites
      : [];

    return favorites.some(function (fav) {
      return String(fav) === String(id);
    });
  }

  function expertData(car) {
    return car.expert || {};
  }

  /* =======================================================
     PUANLAR
     ======================================================= */

  function calculateTrust(car) {
    const expert = expertData(car);

    const engine = Number(expert.engineScore ?? 90);
    const transmission = Number(expert.transmissionScore ?? 90);

    let score = 72;

    score += engine * 0.10;
    score += transmission * 0.10;

    if (expert.tramer !== undefined) {
      const tramerText = String(expert.tramer).toLowerCase();

      if (
        tramerText.includes('yok') ||
        tramerText.includes('0')
      ) {
        score += 8;
      }
    }

    if (car.year) {
      const age = new Date().getFullYear() - Number(car.year);

      if (age <= 3) score += 4;
      else if (age <= 6) score += 2;
    }

    return Math.round(Math.max(50, Math.min(98, score)));
  }

  function calculateMatch(car) {
    if (car.matchRate !== undefined) {
      return Math.round(Number(car.matchRate));
    }

    let score = 86;

    if (getTransmission(car).toLowerCase().includes('otomatik')) {
      score += 3;
    }

    if (Number(car.km) < 80000) {
      score += 3;
    }

    if (Number(car.year) >= 2021) {
      score += 2;
    }

    return Math.min(97, score);
  }

  function conditionScore(car) {
    const expert = expertData(car);

    const engine = Number(expert.engineScore ?? 90);
    const transmission = Number(expert.transmissionScore ?? 90);

    return Math.round((engine + transmission) / 2);
  }

  /* =======================================================
     FAVORİ
     ======================================================= */

  function toggleFavorite() {
    if (!state.car) return;

    let favorites = Array.isArray(window.favorites)
      ? window.favorites
      : [];

    const id = String(state.car.id);

    const index = favorites.findIndex(function (fav) {
      return String(fav) === id;
    });

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(state.car.id);
    }

    /*
      ÖNEMLİ:
      Yeni array oluşturmak yerine mevcut array'i değiştiriyoruz.
      Böylece app.js içindeki favorites değişkeni de güncel kalıyor.
    */
    window.favorites = favorites;

    localStorage.setItem(
      'arabamiBulFavorites',
      JSON.stringify(favorites)
    );

    updateFavoriteButtons();
  }

  function updateFavoriteButtons() {
    const active = isFavorite(state.car?.id);

    container
      .querySelectorAll('[data-action="favorite"]')
      .forEach(function (button) {
        button.classList.toggle('active', active);

        const icon = button.querySelector('.fav-icon');

        if (icon) {
          icon.textContent = active ? '♥' : '♡';
        }

        const label = button.querySelector('.fav-label');

        if (label) {
          label.textContent = active
            ? 'Favorilerde'
            : 'Favoriye ekle';
        }

        button.setAttribute(
          'aria-label',
          active ? 'Favorilerden çıkar' : 'Favorilere ekle'
        );
      });
  }

  /* =======================================================
     KARŞILAŞTIR
     ======================================================= */

  function toggleCompare() {
    if (!state.car) return;

    let compare = [];

    try {
      compare = JSON.parse(
        localStorage.getItem('arabamiBulCompare') || '[]'
      );
    } catch (error) {
      compare = [];
    }

    if (!Array.isArray(compare)) {
      compare = [];
    }

    const id = String(state.car.id);

    const existingIndex = compare.findIndex(function (item) {
      return String(item) === id;
    });

    if (existingIndex >= 0) {
      compare.splice(existingIndex, 1);

      localStorage.setItem(
        'arabamiBulCompare',
        JSON.stringify(compare)
      );

      updateCompareButton();

      alert('Araç karşılaştırmadan çıkarıldı.');
      return;
    }

    if (compare.length >= 3) {
      alert('Karşılaştırmaya en fazla 3 araç ekleyebilirsin.');
      return;
    }

    compare.push(state.car.id);

    localStorage.setItem(
      'arabamiBulCompare',
      JSON.stringify(compare)
    );

    updateCompareButton();

    alert(
      compare.length === 1
        ? 'Araç karşılaştırmaya eklendi. İkinci aracı da ekleyebilirsin.'
        : `Araç karşılaştırmaya eklendi. Toplam ${compare.length} araç var.`
    );
  }

  function updateCompareButton() {
    let compare = [];

    try {
      compare = JSON.parse(
        localStorage.getItem('arabamiBulCompare') || '[]'
      );
    } catch (error) {
      compare = [];
    }

    const active = compare.some(function (item) {
      return String(item) === String(state.car?.id);
    });

    container
      .querySelectorAll('[data-action="compare"]')
      .forEach(function (button) {
        button.classList.toggle('active', active);

        const icon = button.querySelector('.compare-icon');

        if (icon) {
          icon.textContent = active ? '✓' : '⇄';
        }
      });
  }

  /* =======================================================
     GALERİ
     ======================================================= */

  function updateGallery() {
    if (!state.images.length) return;

    const image = state.images[state.currentImage];

    const mainImage = container.querySelector(
      '[data-detail-main-image]'
    );

    if (mainImage) {
      mainImage.src = image;
      mainImage.alt = getTitle(state.car);
    }

    const counter = container.querySelector(
      '[data-photo-count]'
    );

    if (counter) {
      counter.textContent =
        `${state.currentImage + 1} / ${state.images.length}`;
    }

    container
      .querySelectorAll('[data-gallery-index]')
      .forEach(function (thumb) {
        const index = Number(
          thumb.getAttribute('data-gallery-index')
        );

        thumb.classList.toggle(
          'active',
          index === state.currentImage
        );
      });
  }

  function changeImage(direction) {
    if (!state.images.length) return;

    state.currentImage =
      (state.currentImage + direction + state.images.length) %
      state.images.length;

    updateGallery();
  }

  function selectImage(index) {
    if (
      index < 0 ||
      index >= state.images.length
    ) {
      return;
    }

    state.currentImage = index;

    updateGallery();
  }

  /* =======================================================
     LIGHTBOX
     ======================================================= */

  function openLightbox() {
    const lightbox = container.querySelector(
      '.ab-detail-lightbox'
    );

    if (!lightbox) return;

    state.lightboxOpen = true;

    lightbox.classList.add('open');

    updateLightbox();
  }

  function closeLightbox() {
    const lightbox = container.querySelector(
      '.ab-detail-lightbox'
    );

    if (!lightbox) return;

    state.lightboxOpen = false;

    lightbox.classList.remove('open');
  }

  function updateLightbox() {
    const lightboxImage = container.querySelector(
      '[data-lightbox-image]'
    );

    if (!lightboxImage || !state.images.length) return;

    lightboxImage.src = state.images[state.currentImage];
    lightboxImage.alt = getTitle(state.car);
  }

  function changeLightbox(direction) {
    changeImage(direction);

    if (state.lightboxOpen) {
      updateLightbox();
    }
  }

  /* =======================================================
     CONTACT
     ======================================================= */

  function contactSeller() {
    if (!state.car) return;

    const phone =
      state.car.phone ||
      state.car.phoneNumber ||
      state.car.telephone;

    if (phone) {
      window.location.href =
        `tel:${String(phone).replace(/\s/g, '')}`;

      return;
    }

    alert(
      `${getSeller(state.car)} adlı satıcıyla iletişim özelliği demo aşamasındadır.\n\nTelefon numarası bu demo ilanda paylaşılmamıştır.`
    );
  }

  function sendMessage() {
    if (!state.car) return;

    alert(
      `${getSeller(state.car)} adlı satıcıya mesaj gönderme özelliği yakında aktif olacak.`
    );
  }

  /* =======================================================
     AI ANALİZ
     ======================================================= */

  function aiAnalysis(car) {
    const km = Number(car.km) || 0;
    const year = Number(car.year) || new Date().getFullYear();
    const score = conditionScore(car);

    let usageText = 'dengeli kullanım profiline sahip';

    if (km < 50000) {
      usageText = 'düşük kilometreli bir kullanım profiline sahip';
    } else if (km > 120000) {
      usageText = 'kilometresi yüksek bir kullanım profiline sahip';
    }

    return `${getTitle(car)}, ${year} model ve ${number(km)} km bilgisiyle ${usageText}. İlan verilerindeki motor ve şanzıman puanları birlikte değerlendirildiğinde araç için uygulama içi kondisyon göstergesi ${score}/100 seviyesinde. Bu değerlendirme yalnızca demo ilan verilerine dayanır; gerçek ekspertiz yerine geçmez.`;
  }

  function showAIAnalysis() {
    const output = container.querySelector(
      '[data-ai-output]'
    );

    if (!output) return;

    output.hidden = false;
    output.textContent = aiAnalysis(state.car);
  }

  /* =======================================================
     COST
     ======================================================= */

  function costData(car) {
    const price = Number(car.price) || 0;

    const annualTax = Math.round(price * 0.012);
    const maintenance = Math.round(price * 0.008);
    const insurance = Math.round(price * 0.014);
    const total = annualTax + maintenance + insurance;

    return {
      annualTax,
      maintenance,
      insurance,
      total
    };
  }

  /* =======================================================
     MARKET
     ======================================================= */

  function marketData(car) {
    const sameBrand = allCars().filter(function (item) {
      return (
        String(item.brand).toLowerCase() ===
          String(car.brand).toLowerCase() &&
        String(item.id) !== String(car.id)
      );
    });

    if (!sameBrand.length) {
      return {
        average: Number(car.price) || 0,
        count: 0
      };
    }

    const average =
      sameBrand.reduce(function (sum, item) {
        return sum + (Number(item.price) || 0);
      }, 0) / sameBrand.length;

    return {
      average: Math.round(average),
      count: sameBrand.length
    };
  }

  /* =======================================================
     SIMILAR CARS
     ======================================================= */

  function similarCars(car) {
    const cars = allCars()
      .filter(function (item) {
        return String(item.id) !== String(car.id);
      })
      .map(function (item) {
        let score = 0;

        if (
          String(item.brand).toLowerCase() ===
          String(car.brand).toLowerCase()
        ) {
          score += 4;
        }

        if (
          String(getBody(item)).toLowerCase() ===
          String(getBody(car)).toLowerCase()
        ) {
          score += 3;
        }

        if (
          Math.abs(
            Number(item.price || 0) -
            Number(car.price || 0)
          ) < 300000
        ) {
          score += 2;
        }

        if (
          Math.abs(
            Number(item.year || 0) -
            Number(car.year || 0)
          ) <= 2
        ) {
          score += 1;
        }

        return {
          car: item,
          score
        };
      })
      .sort(function (a, b) {
        return b.score - a.score;
      });

    return cars
      .slice(0, 3)
      .map(function (item) {
        return item.car;
      });
  }

  /* =======================================================
     EXPERTISE
     ======================================================= */

  function expertiseRows(car) {
    const expert = expertData(car);

    return [
      {
        label: 'Kaput',
        value: expert.hood || 'Bilgi yok'
      },
      {
        label: 'Ön çamurluk',
        value: expert.fender || 'Bilgi yok'
      },
      {
        label: 'Tavan',
        value: expert.roof || 'Bilgi yok'
      },
      {
        label: 'Kapılar',
        value: expert.door || 'Bilgi yok'
      }
    ];
  }

  function valueStatus(value) {
    const text = String(value || '').toLowerCase();

    if (
      text.includes('orijinal') ||
      text.includes('boyasız') ||
      text.includes('değişensiz') ||
      text.includes('temiz')
    ) {
      return 'good';
    }

    if (
      text.includes('boya') ||
      text.includes('değişen')
    ) {
      return 'warning';
    }

    return '';
  }

  /* =======================================================
     EQUIPMENT
     ======================================================= */

  function equipmentList(car) {
    if (
      Array.isArray(car.equipment) &&
      car.equipment.length
    ) {
      return car.equipment;
    }

    return [
      'Klima',
      'Multimedya ekranı',
      'Bluetooth',
      'Park sensörü',
      'Hız sabitleyici',
      'Elektrikli camlar',
      'Merkezi kilit',
      'ABS'
    ];
  }

  /* =======================================================
     RENDER
     ======================================================= */

  function render(car) {
    state.car = car;
    state.images = getImages(car);
    state.currentImage = 0;

    const trust = calculateTrust(car);
    const match = calculateMatch(car);
    const condition = conditionScore(car);
    const costs = costData(car);
    const market = marketData(car);
    const similar = similarCars(car);
    const expert = expertData(car);
    const equipment = equipmentList(car);

    const favorite = isFavorite(car.id);

    const imageThumbs = state.images
      .map(function (image, index) {
        return `
          <button
            type="button"
            class="ab-detail-thumbnail ${index === 0 ? 'active' : ''}"
            data-gallery-index="${index}"
            aria-label="Fotoğraf ${index + 1}"
          >
            <img
              src="${escapeHTML(image)}"
              alt="${escapeHTML(getTitle(car))} fotoğraf ${index + 1}"
              loading="${index === 0 ? 'eager' : 'lazy'}"
            >
          </button>
        `;
      })
      .join('');

    const specs = [
      ['Marka', getBrand(car)],
      ['Model', car.model || getTitle(car)],
      ['Model yılı', car.year || '—'],
      ['Kilometre', `${number(car.km)} km`],
      ['Yakıt', getFuel(car)],
      ['Vites', getTransmission(car)],
      ['Kasa', getBody(car)],
      ['Motor', car.engine || '1.2 Turbo'],
      ['Güç', car.power || '100 HP'],
      ['Çekiş', car.drive || 'Ön Çekiş']
    ];

    const specHTML = specs
      .map(function (item) {
        return `
          <div class="ab-detail-spec-item">
            <span>${escapeHTML(item[0])}</span>
            <strong>${escapeHTML(item[1])}</strong>
          </div>
        `;
      })
      .join('');

    const matchRows = [
      ['Bütçe uyumu', 'Uygun'],
      ['Kullanım tipi', `${escapeHTML(getBody(car))}`],
      ['Vites tercihi', `${escapeHTML(getTransmission(car))}`],
      ['Yakıt tercihi', `${escapeHTML(getFuel(car))}`],
      ['Kilometre', Number(car.km) < 100000 ? 'Düşük' : 'Orta / yüksek']
    ]
      .map(function (item) {
        return `
          <div class="ab-detail-match-row">
            <span class="check">✓</span>
            <span>${item[0]}</span>
            <strong>${item[1]}</strong>
          </div>
        `;
      })
      .join('');

    const costRows = [
      ['Yıllık vergi tahmini', costs.annualTax],
      ['Bakım tahmini', costs.maintenance],
      ['Sigorta tahmini', costs.insurance]
    ]
      .map(function (item) {
        return `
          <div class="ab-detail-cost-row">
            <i class="cost-dot"></i>
            <span>${escapeHTML(item[0])}</span>
            <small>yıllık</small>
            <strong>${money(item[1])}</strong>
          </div>
        `;
      })
      .join('');

    const expertiseHTML = expertiseRows(car)
      .map(function (item) {
        return `
          <div class="ab-detail-panel-item">
            <span>${escapeHTML(item.label)}</span>
            <strong class="${valueStatus(item.value)}">
              ${escapeHTML(item.value)}
            </strong>
          </div>
        `;
      })
      .join('');

    const equipmentHTML = equipment
      .slice(0, 12)
      .map(function (item) {
        return `
          <div class="ab-detail-spec-item">
            <span>Donanım</span>
            <strong>${escapeHTML(item)}</strong>
          </div>
        `;
      })
      .join('');

    const similarHTML = similar
      .map(function (item) {
        return `
          <article
            class="ab-detail-similar-car"
            data-similar-id="${escapeHTML(item.id)}"
          >
            <div class="ab-detail-similar-image">
              <img
                src="${escapeHTML(getImages(item)[0])}"
                alt="${escapeHTML(getTitle(item))}"
                loading="lazy"
              >
            </div>

            <div class="ab-detail-similar-info">
              <h3>${escapeHTML(getTitle(item))}</h3>
              <strong>${money(item.price)}</strong>
              <p>
                ${escapeHTML(item.year || '—')} ·
                ${number(item.km)} km ·
                ${escapeHTML(getFuel(item))}
              </p>
              <span>Detayları gör →</span>
            </div>
          </article>
        `;
      })
      .join('');

    container.innerHTML = `
      <div class="ab-detail-page">

        <!-- TOP BAR -->
        <div class="ab-detail-topbar">

          <button
            type="button"
            class="ab-detail-back"
            data-action="close"
          >
            <span>←</span>
            <span>İlanlara dön</span>
          </button>

          <div class="ab-detail-top-title">
            ${escapeHTML(getTitle(car))}
          </div>

          <div class="ab-detail-top-actions">

            <button
              type="button"
              data-action="favorite"
              class="${favorite ? 'active' : ''}"
              title="Favorilere ekle"
              aria-label="Favorilere ekle"
            >
              <span class="fav-icon">${favorite ? '♥' : '♡'}</span>
              <span class="fav-label">
                ${favorite ? 'Favorilerde' : 'Favori'}
              </span>
            </button>

            <button
              type="button"
              data-action="compare"
              title="Karşılaştır"
              aria-label="Karşılaştır"
            >
              <span class="compare-icon">⇄</span>
              <span>Karşılaştır</span>
            </button>

          </div>
        </div>

        <!-- MAIN -->
        <main class="ab-detail-main">

          <!-- BREADCRUMB -->
          <div class="ab-detail-breadcrumb">
            <button type="button" data-action="close">
              Ana Sayfa
            </button>
            <span>›</span>
            <span>${escapeHTML(getBody(car))}</span>
            <span>›</span>
            <strong>${escapeHTML(getTitle(car))}</strong>
          </div>

          <!-- HERO -->
          <section class="ab-detail-hero">

            <!-- GALLERY -->
            <div class="ab-detail-gallery">

              <div class="ab-detail-main-photo">

                ${
                  car.featured
                    ? `<span class="ab-detail-featured">ÖNE ÇIKAN İLAN</span>`
                    : ''
                }

                <img
                  data-detail-main-image
                  src="${escapeHTML(state.images[0])}"
                  alt="${escapeHTML(getTitle(car))}"
                >

                ${
                  state.images.length > 1
                    ? `
                      <button
                        type="button"
                        class="ab-detail-gallery-arrow ab-detail-gallery-prev"
                        data-action="prev-image"
                        aria-label="Önceki fotoğraf"
                      >‹</button>

                      <button
                        type="button"
                        class="ab-detail-gallery-arrow ab-detail-gallery-next"
                        data-action="next-image"
                        aria-label="Sonraki fotoğraf"
                      >›</button>
                    `
                    : ''
                }

                <span
                  class="ab-detail-photo-count"
                  data-photo-count
                >
                  1 / ${state.images.length}
                </span>

                <button
                  type="button"
                  class="ab-detail-fullscreen"
                  data-action="lightbox"
                  aria-label="Fotoğrafı büyüt"
                  title="Büyüt"
                >
                  ⛶
                </button>

              </div>

              <div class="ab-detail-thumbnails">
                ${imageThumbs}
              </div>

            </div>

            <!-- RIGHT SIDE -->
            <div>

              <!-- SUMMARY -->
              <section class="ab-detail-summary">

                <div class="ab-detail-brand-line">
                  <span>${escapeHTML(getBrand(car))}</span>
                  ${
                    car.featured
                      ? '<b>ÖNE ÇIKAN</b>'
                      : '<b>İLAN</b>'
                  }
                </div>

                <h1>${escapeHTML(getTitle(car))}</h1>

                <div class="ab-detail-price">
                  ${money(car.price)}
                </div>

                <div class="ab-detail-price-note">
                  İlan fiyatı · Son güncelleme: bugün
                </div>

                <div class="ab-detail-quick-specs">

                  <div class="ab-detail-quick-spec">
                    <span>Model</span>
                    <strong>${escapeHTML(car.year || '—')}</strong>
                  </div>

                  <div class="ab-detail-quick-spec">
                    <span>Kilometre</span>
                    <strong>${number(car.km)} km</strong>
                  </div>

                  <div class="ab-detail-quick-spec">
                    <span>Yakıt</span>
                    <strong>${escapeHTML(getFuel(car))}</strong>
                  </div>

                  <div class="ab-detail-quick-spec">
                    <span>Vites</span>
                    <strong>${escapeHTML(getTransmission(car))}</strong>
                  </div>

                </div>

                <div class="ab-detail-score-row">

                  <div class="ab-detail-score-card">
                    <span>ARABAMI BUL UYUMU</span>
                    <strong>%${match}</strong>

                    <div class="ab-detail-score-bar">
                      <i style="width:${percent(match)}%"></i>
                    </div>
                  </div>

                  <div class="ab-detail-score-card">
                    <span>GÜVEN GÖSTERGESİ</span>
                    <strong>${trust}/100</strong>

                    <div class="ab-detail-score-bar">
                      <i style="width:${percent(trust)}%"></i>
                    </div>
                  </div>

                </div>

                <div class="ab-detail-actions">

                  <button
                    type="button"
                    class="ab-detail-favorite-btn ${favorite ? 'active' : ''}"
                    data-action="favorite"
                    aria-label="Favorilere ekle"
                  >
                    <span class="fav-icon">
                      ${favorite ? '♥' : '♡'}
                    </span>
                  </button>

                  <button
                    type="button"
                    class="ab-detail-compare-btn"
                    data-action="compare"
                    aria-label="Karşılaştır"
                  >
                    <span class="compare-icon">⇄</span>
                  </button>

                  <button
                    type="button"
                    class="ab-detail-contact-btn"
                    data-action="contact"
                  >
                    Satıcıyla İletişime Geç
                  </button>

                </div>

                <div class="ab-detail-location">
                  <span>📍</span>

                  <div>
                    <strong>${escapeHTML(getLocation(car))}</strong>
                    <small>İlan konumu</small>
                  </div>
                </div>

              </section>

              <!-- SELLER -->
              <section class="ab-detail-seller">

                <div class="ab-detail-seller-title">
                  SATICI
                </div>

                <div class="ab-detail-seller-head">

                  <div class="ab-detail-seller-avatar">
                    ${escapeHTML(initials(getSeller(car)))}
                  </div>

                  <div>
                    <strong>${escapeHTML(getSeller(car))}</strong>
                    <span>✓ Doğrulanmış ilan profili</span>
                  </div>

                </div>

                <div class="ab-detail-seller-info">

                  <div>
                    <span>İlan tipi</span>
                    <strong>Bireysel</strong>
                  </div>

                  <div>
                    <span>İlan durumu</span>
                    <strong>Aktif</strong>
                  </div>

                </div>

                <button
                  type="button"
                  class="ab-detail-seller-message"
                  data-action="message"
                >
                  ✉ Mesaj Gönder
                </button>

                <button
                  type="button"
                  class="ab-detail-phone-btn"
                  data-action="contact"
                >
                  ☎ Telefonla İletişim
                </button>

                <div class="ab-detail-seller-safe">
                  ✓ Güvenli iletişim önerilir
                </div>

              </section>

            </div>

          </section>

          <!-- TABS -->
          <nav class="ab-detail-tabs">

            <button
              type="button"
              class="active"
              data-tab="overview"
            >
              Genel Bakış
            </button>

            <button
              type="button"
              data-tab="technical"
            >
              Teknik Bilgiler
            </button>

            <button
              type="button"
              data-tab="expertise"
            >
              Ekspertiz
            </button>

            <button
              type="button"
              data-tab="cost"
            >
              Maliyet
            </button>

          </nav>

          <!-- =================================================
               OVERVIEW
               ================================================= -->

          <section
            class="ab-detail-tab-content active"
            data-tab-content="overview"
          >

            <div class="ab-detail-content-grid">

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      ARAÇ BİLGİLERİ
                    </span>
                    <h2>Araç Özeti</h2>
                  </div>
                </div>

                <div class="ab-detail-spec-grid">
                  ${specHTML}
                </div>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      ARABAMI BUL
                    </span>
                    <h2>Neden Bu Araç?</h2>
                  </div>

                  <span class="ab-detail-match-big">
                    %${match}
                  </span>
                </div>

                <p class="ab-detail-card-description">
                  Bu uyum puanı, uygulamadaki araç verileri ve
                  kullanıcı tercihleri üzerinden oluşturulan
                  demo değerlendirmesidir.
                </p>

                <div class="ab-detail-match-list">
                  ${matchRows}
                </div>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      DONANIM
                    </span>
                    <h2>Öne Çıkan Donanımlar</h2>
                  </div>
                </div>

                <div class="ab-detail-spec-grid">
                  ${equipmentHTML}
                </div>

              </article>

              <article class="ab-detail-card ab-detail-ai-card">

                <div class="ab-detail-ai-header">

                  <div class="ab-detail-ai-icon">
                    ✦
                  </div>

                  <div>
                    <span class="ab-detail-card-kicker">
                      ARABAMI BUL AI
                    </span>
                    <h2>AI Araç Analizi</h2>
                  </div>

                </div>

                <p>
                  Araç verilerini kullanarak fiyat, kilometre,
                  model yılı ve teknik bilgileri birlikte
                  değerlendiren kısa bir özet oluştur.
                </p>

                <button
                  type="button"
                  class="ab-detail-ai-btn"
                  data-action="ai"
                >
                  ✦ Analizi Göster
                </button>

                <p
                  data-ai-output
                  hidden
                ></p>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      PİYASA
                    </span>
                    <h2>Fiyat Konumu</h2>
                  </div>

                  <span class="ab-detail-market-badge">
                    Uygulama verisi
                  </span>
                </div>

                <p class="ab-detail-card-description">
                  Aynı marka içindeki demo ilanlarının
                  ortalama fiyatıyla karşılaştırılır.
                </p>

                <div class="ab-detail-price-position">
                  <span>Düşük</span>
                  <div>
                    <i></i>
                  </div>
                  <span>Yüksek</span>
                </div>

                <div class="ab-detail-price-position-current">
                  Araç fiyatı:
                  <strong>${money(car.price)}</strong>
                  <br>
                  Örnek marka ortalaması:
                  <strong>${money(market.average)}</strong>
                </div>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      ALTERNATİFLER
                    </span>
                    <h2>Benzer Araçlar</h2>
                  </div>
                </div>

                <div class="ab-detail-similar-grid">
                  ${
                    similarHTML ||
                    '<p class="ab-detail-card-description">Benzer araç bulunamadı.</p>'
                  }
                </div>

              </article>

            </div>

          </section>

          <!-- =================================================
               TECHNICAL
               ================================================= -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="technical"
          >

            <div class="ab-detail-content-grid">

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      TEKNİK
                    </span>
                    <h2>Teknik Özellikler</h2>
                  </div>
                </div>

                <div class="ab-detail-spec-grid">
                  ${specHTML}
                </div>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      DONANIM
                    </span>
                    <h2>Donanım Listesi</h2>
                  </div>
                </div>

                <div class="ab-detail-spec-grid">
                  ${equipmentHTML}
                </div>

              </article>

            </div>

          </section>

          <!-- =================================================
               EXPERTISE
               ================================================= -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="expertise"
          >

            <div class="ab-detail-expertise-page">

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      EKSPERTİZ
                    </span>
                    <h2>Kaporta / Boya Durumu</h2>
                  </div>

                  <span class="ab-detail-market-badge">
                    İlan verisi
                  </span>
                </div>

                <div class="ab-detail-panel-grid">
                  ${expertiseHTML}
                </div>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      TRAMER
                    </span>
                    <h2>Hasar Kaydı</h2>
                  </div>
                </div>

                <div class="ab-detail-tramer">
                  <strong>
                    ${escapeHTML(expert.tramer || 'Bilgi yok')}
                  </strong>

                  <span>
                    Bu bilgi ilan sahibinin girdiği
                    demo verisinden alınmıştır.
                  </span>
                </div>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      MEKANİK
                    </span>
                    <h2>Motor & Şanzıman</h2>
                  </div>
                </div>

                <div class="ab-detail-mechanical-grid">

                  <div>
                    <span>Motor durumu</span>
                    <strong>
                      ${Number(expert.engineScore ?? 90)}/100
                    </strong>
                  </div>

                  <div>
                    <span>Şanzıman durumu</span>
                    <strong>
                      ${Number(expert.transmissionScore ?? 90)}/100
                    </strong>
                  </div>

                </div>

              </article>

              <div class="ab-detail-disclaimer-box">

                <strong>⚠ Ekspertiz notu</strong>

                <p>
                  Buradaki bilgiler uygulama içindeki ilan
                  verilerinden oluşturulmuştur. Gerçek satın alma
                  öncesinde bağımsız ekspertiz ve resmi hasar
                  kayıtlarının kontrol edilmesi gerekir.
                </p>

              </div>

            </div>

          </section>

          <!-- =================================================
               COST
               ================================================= -->

          <section
            class="ab-detail-tab-content"
            data-tab-content="cost"
          >

            <div class="ab-detail-content-grid">

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      YILLIK TAHMİN
                    </span>
                    <h2>Araç Maliyeti</h2>
                  </div>
                </div>

                <div class="ab-detail-cost-total">
                  <strong>${money(costs.total)}</strong>
                  <span>/ yıl</span>
                </div>

                <div class="ab-detail-cost-list">
                  ${costRows}
                </div>

                <span class="ab-detail-disclaimer">
                  Bu rakamlar demo amaçlı yaklaşık hesaplamadır.
                  Gerçek vergi, sigorta ve bakım maliyetleri
                  kişiye ve araca göre değişebilir.
                </span>

              </article>

              <article class="ab-detail-card">

                <div class="ab-detail-card-header">
                  <div>
                    <span class="ab-detail-card-kicker">
                      GENEL DEĞERLENDİRME
                    </span>
                    <h2>Bu Aracın Profili</h2>
                  </div>
                </div>

                <div class="ab-detail-spec-grid">

                  <div class="ab-detail-spec-item">
                    <span>Fiyat</span>
                    <strong>${money(car.price)}</strong>
                  </div>

                  <div class="ab-detail-spec-item">
                    <span>Kilometre</span>
                    <strong>${number(car.km)} km</strong>
                  </div>

                  <div class="ab-detail-spec-item">
                    <span>Model yılı</span>
                    <strong>${escapeHTML(car.year || '—')}</strong>
                  </div>

                  <div class="ab-detail-spec-item">
                    <span>Kondisyon göstergesi</span>
                    <strong>${condition}/100</strong>
                  </div>

                </div>

              </article>

            </div>

          </section>

          <!-- BOTTOM CTA -->
          <div class="ab-detail-bottom-cta">

            <div>
              <strong>
                ${escapeHTML(getTitle(car))}
              </strong>

              <span>
                ${money(car.price)} ·
                ${number(car.km)} km
              </span>
            </div>

            <button
              type="button"
              data-action="contact"
            >
              Satıcıyla İletişime Geç
            </button>

          </div>

        </main>

        <!-- MOBILE BAR -->
        <div class="ab-detail-mobile-bar">

          <div>
            <small>İlan fiyatı</small>
            <strong>${money(car.price)}</strong>
          </div>

          <button
            type="button"
            data-action="contact"
          >
            Satıcıyla İletişime Geç
          </button>

        </div>

        <!-- LIGHTBOX -->
        <div
          class="ab-detail-lightbox"
          aria-hidden="true"
        >

          <button
            type="button"
            class="ab-detail-lightbox-close"
            data-action="close-lightbox"
            aria-label="Kapat"
          >
            ×
          </button>

          ${
            state.images.length > 1
              ? `
                <button
                  type="button"
                  class="ab-detail-lightbox-arrow left"
                  data-action="lightbox-prev"
                  aria-label="Önceki fotoğraf"
                >
                  ‹
                </button>

                <button
                  type="button"
                  class="ab-detail-lightbox-arrow right"
                  data-action="lightbox-next"
                  aria-label="Sonraki fotoğraf"
                >
                  ›
                </button>
              `
              : ''
          }

          <img
            data-lightbox-image
            src="${escapeHTML(state.images[0])}"
            alt="${escapeHTML(getTitle(car))}"
          >

        </div>

      </div>
    `;

    bindEvents();
    updateGallery();
    updateFavoriteButtons();
    updateCompareButton();
  }

  /* =======================================================
     TABS
     ======================================================= */

  function setTab(tabName) {
    container
      .querySelectorAll('[data-tab]')
      .forEach(function (button) {
        button.classList.toggle(
          'active',
          button.getAttribute('data-tab') === tabName
        );
      });

    container
      .querySelectorAll('[data-tab-content]')
      .forEach(function (section) {
        section.classList.toggle(
          'active',
          section.getAttribute('data-tab-content') === tabName
        );
      });
  }

  /* =======================================================
     EVENTS
     ======================================================= */

  function bindEvents() {
    container
      .querySelectorAll('[data-action]')
      .forEach(function (element) {

        element.addEventListener('click', function (event) {

          event.stopPropagation();

          const action =
            element.getAttribute('data-action');

          if (action === 'close') {
            close();
          }

          if (action === 'favorite') {
            toggleFavorite();
          }

          if (action === 'compare') {
            toggleCompare();
          }

          if (action === 'prev-image') {
            changeImage(-1);
          }

          if (action === 'next-image') {
            changeImage(1);
          }

          if (action === 'lightbox') {
            openLightbox();
          }

          if (action === 'close-lightbox') {
            closeLightbox();
          }

          if (action === 'lightbox-prev') {
            changeLightbox(-1);
          }

          if (action === 'lightbox-next') {
            changeLightbox(1);
          }

          if (action === 'contact') {
            contactSeller();
          }

          if (action === 'message') {
            sendMessage();
          }

          if (action === 'ai') {
            showAIAnalysis();
          }
        });
      });

    container
      .querySelectorAll('[data-gallery-index]')
      .forEach(function (thumbnail) {

        thumbnail.addEventListener('click', function (event) {
          event.stopPropagation();

          selectImage(
            Number(
              thumbnail.getAttribute('data-gallery-index')
            )
          );
        });
      });

    container
      .querySelectorAll('[data-tab]')
      .forEach(function (button) {

        button.addEventListener('click', function () {
          setTab(
            button.getAttribute('data-tab')
          );
        });
      });

    container
      .querySelectorAll('[data-similar-id]')
      .forEach(function (card) {

        card.addEventListener('click', function () {

          const id =
            card.getAttribute('data-similar-id');

          open(id);
        });
      });

    const mainImage = container.querySelector(
      '[data-detail-main-image]'
    );

    if (mainImage) {
      mainImage.addEventListener(
        'click',
        openLightbox
      );
    }

    const lightbox = container.querySelector(
      '.ab-detail-lightbox'
    );

    if (lightbox) {

      lightbox.addEventListener(
        'click',
        function (event) {

          if (event.target === lightbox) {
            closeLightbox();
          }

        }
      );
    }

    bindSwipe();
  }

  function bindSwipe() {
    const mainPhoto = container.querySelector(
      '.ab-detail-main-photo'
    );

    if (!mainPhoto) return;

    mainPhoto.addEventListener(
      'touchstart',
      function (event) {

        if (!event.touches.length) return;

        state.touchStartX =
          event.touches[0].clientX;

      },
      { passive: true }
    );

    mainPhoto.addEventListener(
      'touchend',
      function (event) {

        if (!event.changedTouches.length) return;

        state.touchEndX =
          event.changedTouches[0].clientX;

        const distance =
          state.touchEndX - state.touchStartX;

        if (Math.abs(distance) < 45) return;

        if (distance < 0) {
          changeImage(1);
        } else {
          changeImage(-1);
        }

      },
      { passive: true }
    );
  }

  /* =======================================================
     GLOBAL KEYBOARD
     ======================================================= */

  function attachKeyboard() {
    if (state.keyHandlerAttached) return;

    document.addEventListener(
      'keydown',
      function (event) {

        if (!state.car) return;

        if (event.key === 'Escape') {

          if (state.lightboxOpen) {
            closeLightbox();
          } else {
            close();
          }

          return;
        }

        if (state.lightboxOpen) {

          if (event.key === 'ArrowLeft') {
            changeLightbox(-1);
          }

          if (event.key === 'ArrowRight') {
            changeLightbox(1);
          }
        }

      }
    );

    state.keyHandlerAttached = true;
  }

  /* =======================================================
     OPEN
     ======================================================= */

  function open(id) {
    const car = getCar(id);

    if (!car) {
      console.warn(
        'ARABAMI BUL: Araç bulunamadı:',
        id
      );

      return;
    }

    state.previousOverflow =
      document.body.style.overflow;

    state.lightboxOpen = false;

    document.body.classList.add('detail-open');

    document.body.style.overflow = 'hidden';

    render(car);

    container.style.display = 'block';

    container.scrollTop = 0;

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });

    attachKeyboard();
  }

  /* =======================================================
     CLOSE
     ======================================================= */

  function close() {
    closeLightbox();

    state.car = null;
    state.images = [];
    state.currentImage = 0;

    container.style.display = 'none';
    container.innerHTML = '';

    document.body.classList.remove('detail-open');

    document.body.style.overflow =
      state.previousOverflow || '';
  }

  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.AB_Detail = {
    open: open,
    close: close,
    toggleFavorite: toggleFavorite,
    toggleCompare: toggleCompare,
    nextImage: function () {
      changeImage(1);
    },
    previousImage: function () {
      changeImage(-1);
    }
  };

})();
