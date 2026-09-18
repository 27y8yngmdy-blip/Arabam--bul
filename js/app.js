/* ARABAMI BUL V1.2 — app.js
   Uygulama çekirdeği + ortak değişkenler + başlangıç kodu.
   Özellikler ayrı modüllerde tutulur.
*/

// ============================================================
// 1. ARAÇ VERİ TABANI
// ============================================================

const brands = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Tesla",
  "Volkswagen",
  "Volvo",
  "Porsche",
  "Toyota",
  "Honda",
  "Ford"
];

const bodyTypes = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe"
];

const fuels = [
  "Benzin",
  "Dizel",
  "Elektrik",
  "Hibrit"
];

const imgPool = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"
];

// Yeni detail.js modülünün kullandığı global araç listesi
window.dummyCars = [];

for (let i = 1; i <= 70; i++) {
  const b = brands[i % brands.length];
  const body = bodyTypes[i % bodyTypes.length];
  const fuel = fuels[i % fuels.length];
  const year = 2018 + (i % 7);
  const price = 850000 + (i * 45000);
  const km = 10000 + (i * 2800);
  const trans = i % 4 === 0 ? "Manuel" : "Otomatik";
  const tco = Math.round(price * 0.006);

  window.dummyCars.push({
    id: i,
    brand: b,
    model: `${body} Series ${i}`,
    seg: body,
    price: price,
    fuel: fuel,
    trans: trans,
    year: year,
    km: km,
    tco: tco,
    img: imgPool[i % imgPool.length],

    expert: {
      hood: i % 5 === 0 ? "Boya" : "Orijinal",
      fenderLeft: i % 4 === 0 ? "Boya" : "Orijinal",
      roof: "Orijinal",
      doorRight: "Orijinal",
      tramer: i % 3 === 0
        ? `${(i * 1200).toLocaleString("tr-TR")} TL`
        : "Hasar Kayıtsız",
      engineScore: "%" + (90 + (i % 10)),
      transmissionScore: "Kusursuz / Test Edildi"
    }
  });
}


// ============================================================
// 2. ORTAK DURUM
// ============================================================

let favorites = JSON.parse(
  localStorage.getItem("favs") || "[]"
);

window.favorites = favorites;

let uploadedImages = [];


// ============================================================
// 3. SAYFA GEÇİŞLERİ
// ============================================================

function go(pageId) {
  document
    .querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));

  const target = document.getElementById(pageId);

  if (target) {
    target.classList.add("active");
  }

  document
    .querySelectorAll(".navlinks button, .mobile-bottom-nav button")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );
    });

  if (pageId === "home") {
    renderHome();
  }

  if (pageId === "browse") {
    renderBrowse();
  }

  if (pageId === "favorites") {
    renderFavorites();
  }

  window.scrollTo(0, 0);
}


// ============================================================
// 4. AKILLI ARAMA
// ============================================================

function handleSearchInput(val) {
  const dropdown = document.getElementById("searchDropdown");

  if (!dropdown) return;

  const q = val.trim().toLowerCase("tr-TR");

  if (!q) {
    dropdown.classList.remove("open");
    return;
  }

  const cmdItems = [];
  const carItems = [];

  if (
    "favoriler".includes(q) ||
    "fav".includes(q)
  ) {
    cmdItems.push({
      text: "⭐ Favorilerim Sayfasına Git",
      action: () => {
        go("favorites");
        clearSearch();
      }
    });
  }

  if (
    "ilan ver".includes(q) ||
    "sat".includes(q)
  ) {
    cmdItems.push({
      text: "📝 İlan Ver Sayfasına Git",
      action: () => {
        go("sell");
        clearSearch();
      }
    });
  }

  if (
    "sihirbaz".includes(q) ||
    "bul".includes(q)
  ) {
    cmdItems.push({
      text: "🪄 Bana Araba Bul Sihirbazı",
      action: () => {
        go("find");
        clearSearch();
      }
    });
  }

  const matchedCars = window.dummyCars
    .filter(car =>
      car.brand.toLowerCase("tr-TR").includes(q) ||
      car.model.toLowerCase("tr-TR").includes(q)
    )
    .slice(0, 5);

  matchedCars.forEach(car => {
    carItems.push({
      text: `${car.brand} ${car.model} (${car.price.toLocaleString("tr-TR")} TL)`,
      action: () => {
        openDetail(car.id);
        clearSearch();
      },
      tag: car.fuel
    });
  });

  let html = "";

  if (cmdItems.length > 0) {
    html += '<div class="search-group-title">Hızlı Komutlar</div>';

    cmdItems.forEach((item, idx) => {
      html += `
        <div
          class="search-item"
          onclick="execCmd(${idx})"
        >
          <span>${item.text}</span>
          <span class="type-tag">Komut</span>
        </div>
      `;
    });

    dropdown.cmdActions = cmdItems.map(item => item.action);
  }

  if (carItems.length > 0) {
    html += '<div class="search-group-title">Eşleşen Araçlar</div>';

    carItems.forEach((item, idx) => {
      html += `
        <div
          class="search-item"
          onclick="execCar(${idx})"
        >
          <span>${item.text}</span>
          <span class="type-tag">${item.tag}</span>
        </div>
      `;
    });

    dropdown.carActions = carItems.map(item => item.action);
  }

  if (!html) {
    html = `
      <div
        class="search-item"
        onclick="executeBrowseSearch('${q.replace(/'/g, "\\'")}')"
      >
        🔍 "${q}" için araçlarda detaylı ara...
      </div>
    `;

    dropdown.cmdActions = [
      () => executeBrowseSearch(q)
    ];
  }

  dropdown.innerHTML = html;
  dropdown.classList.add("open");
}

function execCmd(idx) {
  const dropdown = document.getElementById("searchDropdown");

  if (
    dropdown &&
    dropdown.cmdActions &&
    dropdown.cmdActions[idx]
  ) {
    dropdown.cmdActions[idx]();
  }
}

function execCar(idx) {
  const dropdown = document.getElementById("searchDropdown");

  if (
    dropdown &&
    dropdown.carActions &&
    dropdown.carActions[idx]
  ) {
    dropdown.carActions[idx]();
  }
}

function executeBrowseSearch(q) {
  go("browse");

  const queryInput = document.getElementById("fQuery");

  if (queryInput) {
    queryInput.value = q;
  }

  renderBrowse();
  clearSearch();
}

function clearSearch() {
  const input = document.getElementById("globalSearchInput");
  const dropdown = document.getElementById("searchDropdown");

  if (input) {
    input.value = "";
  }

  if (dropdown) {
    dropdown.classList.remove("open");
  }
}

document.addEventListener("keydown", event => {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key.toLowerCase() === "k"
  ) {
    event.preventDefault();

    const input = document.getElementById(
      "globalSearchInput"
    );

    if (input) {
      input.focus();
    }
  }
});


// ============================================================
// 5. FAVORİLER
// ============================================================

function toggleFav(id, e) {
  if (e) {
    e.stopPropagation();
  }

  if (favorites.includes(id)) {
    favorites = favorites.filter(
      item => item !== id
    );
  } else {
    favorites.push(id);
  }

  localStorage.setItem(
    "favs",
    JSON.stringify(favorites)
  );

  // Diğer modüllerin güncel favorileri görebilmesi için
  window.favorites = favorites;

  renderHome();
  renderBrowse();
  renderFavorites();
}


// ============================================================
// 6. ANA SAYFA
// ============================================================

function renderHome() {
  const grid = document.getElementById("homeGrid");

  if (!grid) return;

  grid.innerHTML = window.dummyCars
    .slice(0, 6)
    .map(car => createCarCard(car))
    .join("");
}


// ============================================================
// 7. KATEGORİLER
// ============================================================

function filterByCategory(cat) {
  document
    .querySelectorAll(".category-pills .pill")
    .forEach(pill => {
      pill.classList.toggle(
        "active",
        pill.textContent.includes(cat) ||
        (
          cat === "" &&
          pill.textContent.includes("Tüm")
        )
      );
    });

  go("browse");

  const bodyInput = document.getElementById("fBody");
  const fuelInput = document.getElementById("fFuel");

  if (bodyInput) {
    bodyInput.value =
      cat === "Elektrik" ? "" : cat;
  }

  if (fuelInput) {
    fuelInput.value =
      cat === "Elektrik" ? "Elektrik" : "";
  }

  renderBrowse();
}


// ============================================================
// 8. ARAÇ LİSTESİ / FİLTRELER
// ============================================================

function renderBrowse() {
  const grid = document.getElementById("browseGrid");

  if (!grid) return;

  const q = (
    document.getElementById("fQuery")?.value || ""
  ).toLowerCase("tr-TR");

  const brand =
    document.getElementById("fBrand")?.value || "";

  const body =
    document.getElementById("fBody")?.value || "";

  const pMin = Number(
    document.getElementById("fPriceMin")?.value || 0
  );

  const pMax = Number(
    document.getElementById("fPriceMax")?.value ||
    Infinity
  );

  const yMin = Number(
    document.getElementById("fYearMin")?.value || 0
  );

  const yMax = Number(
    document.getElementById("fYearMax")?.value ||
    Infinity
  );

  const kmMax = Number(
    document.getElementById("fKmMax")?.value ||
    Infinity
  );

  const fuel =
    document.getElementById("fFuel")?.value || "";

  const trans =
    document.getElementById("fTrans")?.value || "";

  const sort =
    document.getElementById("fSort")?.value ||
    "default";

  let filtered = window.dummyCars.filter(car => {
    if (
      q &&
      !(
        car.brand
          .toLowerCase("tr-TR")
          .includes(q) ||
        car.model
          .toLowerCase("tr-TR")
          .includes(q)
      )
    ) {
      return false;
    }

    if (brand && car.brand !== brand) {
      return false;
    }

    if (body && car.seg !== body) {
      return false;
    }

    if (car.price < pMin) {
      return false;
    }

    if (
      pMax !== Infinity &&
      car.price > pMax
    ) {
      return false;
    }

    if (car.year < yMin) {
      return false;
    }

    if (
      yMax !== Infinity &&
      car.year > yMax
    ) {
      return false;
    }

    if (car.km > kmMax) {
      return false;
    }

    if (fuel && car.fuel !== fuel) {
      return false;
    }

    if (trans && car.trans !== trans) {
      return false;
    }

    return true;
  });

  if (sort === "priceAsc") {
    filtered.sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "priceDesc") {
    filtered.sort(
      (a, b) => b.price - a.price
    );
  }

  if (sort === "yearDesc") {
    filtered.sort(
      (a, b) => b.year - a.year
    );
  }

  const resultCount =
    document.getElementById("resultCount");

  if (resultCount) {
    resultCount.textContent =
      `Bulunan Araç: ${filtered.length}`;
  }

  grid.innerHTML =
    filtered.length > 0
      ? filtered
          .map(car => createCarCard(car))
          .join("")
      : `
        <div
          style="
            grid-column:1/-1;
            padding:40px;
            text-align:center;
            color:var(--muted);
          "
        >
          Aramanıza uygun araç bulunamadı.
        </div>
      `;
}


// ============================================================
// 9. ARAÇ KARTI
// ============================================================

function createCarCard(car, matchRate) {
  const isFav = favorites.includes(car.id);

  return `
    <div
      class="vehicle-card"
      onclick="openDetail(${car.id})"
    >

      <button
        class="fav-btn"
        onclick="toggleFav(${car.id}, event)"
      >
        ${isFav ? "❤️" : "🤍"}
      </button>

      <div
        class="car-img"
        style="background-image:url('${car.img}')"
      >
        <div class="car-overlay">
          <span>${car.brand} ${car.model}</span>
          <span>${car.year}</span>
        </div>
      </div>

      <div class="car-body">

        ${
          matchRate
            ? `<span class="match-badge">%${matchRate} Uyumlu</span>`
            : ""
        }

        <div class="car-title">
          ${car.brand} ${car.model}
        </div>

        <div class="car-price">
          ${car.price.toLocaleString("tr-TR")} TL
        </div>

        <div class="car-meta">
          <span>${car.fuel}</span>
          •
          <span>${car.trans}</span>
          •
          <span>${car.km.toLocaleString("tr-TR")} KM</span>
        </div>

        <div class="badge-tco">
          Tahmini Yürütme:
          ~${car.tco.toLocaleString("tr-TR")} TL / ay
        </div>

      </div>
    </div>
  `;
}


// ============================================================
// 10. BANA ARABA BUL — SİHİRBAZ
// ============================================================

let wizardAnswers = {};
let qIndex = 0;

const wizardQuestions = [
  {
    key: "price",
    title: "Bütçe Aralığınız",
    sub: "Maksimum alım bütçenizi seçin.",
    options: [
      "1.500.000 TL Altı",
      "1.500.000 - 3.000.000 TL",
      "3.000.000 TL Üzeri"
    ]
  },

  {
    key: "body",
    title: "Kasa Tipi / Kullanım Amacı",
    sub: "Aracı en çok nerede ve nasıl kullanacaksınız?",
    options: [
      "Sedan (Konfor & Aile)",
      "SUV (Geniş & Yüksek)",
      "Hatchback (Şehir İçi Pratik)",
      "Coupe (Performans)"
    ]
  },

  {
    key: "fuel",
    title: "Yakıt & Enerji Tercihi",
    sub: "Hangi yakıt tipi sizin için daha uygun?",
    options: [
      "Elektrik",
      "Benzin",
      "Dizel",
      "Hibrit"
    ]
  },

  {
    key: "trans",
    title: "Vites Tipi",
    sub: "Sürüş alışkanlığınız nedir?",
    options: [
      "Otomatik",
      "Manuel"
    ]
  },

  {
    key: "year",
    title: "Model Yılı Beklentisi",
    sub: "Aracın yaşı ne olmalı?",
    options: [
      "2022 ve Üzeri (Yeni)",
      "2018 - 2021 (Orta Yaş)",
      "Fark Etmez"
    ]
  },

  {
    key: "priority",
    title: "En Önemli Kriteriniz",
    sub: "Aracınızda ilk aradığınız nitelik.",
    options: [
      "Düşük Yürütme Gideri",
      "Yüksek Performans",
      "Maksimum Konfor",
      "İkinci El Değeri"
    ]
  }
];

function renderWizard() {
  const question =
    wizardQuestions[qIndex];

  if (!question) return;

  const qBadge =
    document.getElementById("qBadge");

  const qTitle =
    document.getElementById("qTitle");

  const qSub =
    document.getElementById("qSub");

  const pFill =
    document.getElementById("pFill");

  const prevBtn =
    document.getElementById("prevBtn");

  const options =
    document.getElementById("qOptions");

  if (qBadge) {
    qBadge.textContent =
      `Soru ${qIndex + 1} / ${wizardQuestions.length}`;
  }

  if (qTitle) {
    qTitle.textContent =
      question.title;
  }

  if (qSub) {
    qSub.textContent =
      question.sub;
  }

  if (pFill) {
    pFill.style.width =
      `${((qIndex + 1) / wizardQuestions.length) * 100}%`;
  }

  if (prevBtn) {
    prevBtn.style.visibility =
      qIndex === 0
        ? "hidden"
        : "visible";
  }

  if (!options) return;

  options.innerHTML =
    question.options
      .map(option => `
        <div
          class="option-btn ${
            wizardAnswers[question.key] === option
              ? "selected"
              : ""
          }"
          onclick="selectWizardOpt(
            '${question.key}',
            '${option.replace(/'/g, "\\'")}',
            this
          )"
        >
          <span>${option}</span>
          <span class="check-icon">✓</span>
        </div>
      `)
      .join("");
}

function selectWizardOpt(key, val, element) {
  document
    .querySelectorAll(".option-btn")
    .forEach(button =>
      button.classList.remove("selected")
    );

  if (element) {
    element.classList.add("selected");
  }

  wizardAnswers[key] = val;
}

function nextQ() {
  const currentQuestion =
    wizardQuestions[qIndex];

  if (
    !wizardAnswers[currentQuestion.key]
  ) {
    alert(
      "Lütfen devam etmek için bir seçim yapın."
    );
    return;
  }

  if (
    qIndex <
    wizardQuestions.length - 1
  ) {
    qIndex++;
    renderWizard();
  } else {
    showWizardResults();
  }
}

function prevQ() {
  if (qIndex > 0) {
    qIndex--;
    renderWizard();
  }
}

function showWizardResults() {
  const wizardCard =
    document.getElementById("wizardCard");

  const wizardResult =
    document.getElementById("wizardResult");

  const resultGrid =
    document.getElementById("wizardResultGrid");

  if (wizardCard) {
    wizardCard.style.display = "none";
  }

  if (wizardResult) {
    wizardResult.style.display = "block";
  }

  let scoredCars =
    window.dummyCars.map(car => {
      let score = 70;

      if (
        wizardAnswers.fuel &&
        car.fuel === wizardAnswers.fuel
      ) {
        score += 10;
      }

      if (
        wizardAnswers.trans &&
        car.trans === wizardAnswers.trans
      ) {
        score += 10;
      }

      if (
        wizardAnswers.body &&
        car.seg ===
          wizardAnswers.body.split(" ")[0]
      ) {
        score += 10;
      }

      return {
        car: car,
        score: Math.min(score, 98)
      };
    });

  scoredCars.sort(
    (a, b) => b.score - a.score
  );

  if (resultGrid) {
    resultGrid.innerHTML =
      scoredCars
        .slice(0, 4)
        .map(item =>
          createCarCard(
            item.car,
            item.score
          )
        )
        .join("");
  }
}

function resetWizard() {
  wizardAnswers = {};
  qIndex = 0;

  const wizardCard =
    document.getElementById("wizardCard");

  const wizardResult =
    document.getElementById("wizardResult");

  if (wizardCard) {
    wizardCard.style.display = "block";
  }

  if (wizardResult) {
    wizardResult.style.display = "none";
  }

  renderWizard();
}


// ============================================================
// 11. İLAN VERME / GÖRSEL YÜKLEME
// ============================================================

function handleImageUpload(e) {
  const files = e.target.files;

  if (!files || !files.length) {
    return;
  }

  for (const file of files) {
    const reader = new FileReader();

    reader.onload = function(event) {
      uploadedImages.push(
        event.target.result
      );

      renderImgPreviews();
    };

    reader.readAsDataURL(file);
  }
}

function renderImgPreviews() {
  const grid =
    document.getElementById(
      "imgPreviewGrid"
    );

  if (!grid) return;

  grid.innerHTML =
    uploadedImages
      .map(
        (src, index) => `
          <div class="preview-card">
            <img src="${src}">
            <button
              type="button"
              class="remove-btn"
              onclick="removeImg(${index})"
            >
              ✕
            </button>
          </div>
        `
      )
      .join("");
}

function removeImg(index) {
  uploadedImages.splice(index, 1);
  renderImgPreviews();
}

function submitNewCar(e) {
  e.preventDefault();

  const price =
    Number(
      document.getElementById("addPrice")?.value || 0
    );

  // ID çakışmasını önlemek için mevcut en büyük ID + 1
  const newId =
    window.dummyCars.length > 0
      ? Math.max(
          ...window.dummyCars.map(car => car.id)
        ) + 1
      : 1;

  const newCar = {
    id: newId,

    brand:
      document.getElementById("addBrand")?.value || "",

    model:
      document.getElementById("addModel")?.value || "",

    seg:
      document.getElementById("addBody")?.value || "",

    price: price,

    fuel:
      document.getElementById("addFuel")?.value || "",

    trans:
      document.getElementById("addTrans")?.value || "",

    year:
      Number(
        document.getElementById("addYear")?.value || 0
      ),

    km:
      Number(
        document.getElementById("addKm")?.value || 0
      ),

    tco:
      Math.round(price * 0.006),

    img:
      uploadedImages[0] || imgPool[0],

    images:
      uploadedImages.length
        ? [...uploadedImages]
        : [imgPool[0]],

    expert: {
      hood: "Orijinal",
      fenderLeft: "Orijinal",
      roof: "Orijinal",
      doorRight: "Orijinal",
      tramer: "Beyan Edilmedi",
      engineScore: "%95",
      transmissionScore: "Kontrol Edildi"
    }
  };

  window.dummyCars.unshift(newCar);

  alert(
    "İlanınız başarıyla eklendi!"
  );

  uploadedImages = [];

  renderImgPreviews();

  if (e.target) {
    e.target.reset();
  }

  go("browse");
}


// ============================================================
// 12. YENİ ARAÇ DETAY SİSTEMİ
// ============================================================

// Eski modal sistemi tamamen kaldırıldı.
// Artık detail.js içindeki AB_Detail sistemi kullanılıyor.

function openDetail(id) {
  if (
    window.AB_Detail &&
    typeof window.AB_Detail.open === "function"
  ) {
    window.AB_Detail.open(id);
    return;
  }

  console.error(
    "Yeni araç detay sistemi henüz yüklenmedi."
  );
}


// ============================================================
// 13. YAPAY ZEKA DESTEK MOTORU
// ============================================================

async function sendAIChat() {
  const input =
    document.getElementById("chatInput");

  if (!input) return;

  const query =
    input.value.trim();

  if (!query) return;

  const body =
    document.getElementById("chatBody");

  if (!body) return;

  body.innerHTML += `
    <div class="chat-msg user">
      ${query}
    </div>
  `;

  input.value = "";

  body.scrollTop =
    body.scrollHeight;

  const typingId =
    "typing_" + Date.now();

  body.innerHTML += `
    <div
      class="chat-msg bot"
      id="${typingId}"
    >
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;

  body.scrollTop =
    body.scrollHeight;

  setTimeout(() => {
    document
      .getElementById(typingId)
      ?.remove();

    let reply;

    if (
      typeof generateAIResponse ===
      "function"
    ) {
      reply =
        generateAIResponse(query);
    } else {
      reply =
        "Size uygun araçları bulmak için Bana Araba Bul bölümünü kullanabilirsiniz.";
    }

    body.innerHTML += `
      <div class="chat-msg bot">
        ${reply}
      </div>
    `;

    body.scrollTop =
      body.scrollHeight;
  }, 900);
}


// ============================================================
// 14. BAŞLANGIÇ
// ============================================================

window.addEventListener(
  "DOMContentLoaded",
  () => {
    go("home");
    renderWizard();
  }
);
