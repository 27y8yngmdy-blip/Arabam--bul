/* ============================================================
   ARABAMI BUL V2 — app.js
   Uygulama çekirdeği + gerçekçi demo araç veri tabanı
   ============================================================

   NOT:
   Araç fiyatları canlı ilan verisi değildir.
   Türkiye otomobil pazarına benzer gerçekçi DEMO verileridir.
   ============================================================ */


/* ============================================================
   1. ARAÇ VERİ TABANI
   ============================================================ */

const brands = [
  "Renault",
  "Fiat",
  "Opel",
  "Peugeot",
  "Volkswagen",
  "Toyota",
  "Honda",
  "Hyundai",
  "Ford",
  "Skoda",
  "SEAT",
  "Dacia",
  "Nissan",
  "Kia",
  "Cupra",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Tesla"
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


/* ============================================================
   GÖRSEL HAVUZU
   ============================================================ */

const imgPool = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&q=85",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&q=85",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1000&q=85",
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000&q=85",
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000&q=85",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&q=85"
];


/* ============================================================
   GERÇEKÇİ ARAÇ KATALOĞU
   ------------------------------------------------------------
   Her satır:
   Marka,
   Model,
   Kasa,
   Paket,
   Yakıt,
   Şanzıman,
   Yıl,
   Fiyat,
   KM,
   Motor,
   HP,
   Çekiş
   ============================================================ */

const carCatalog = [

  ["Renault","Clio","Hatchback","1.0 TCe Icon","Benzin","Otomatik",2023,1450000,42000,"1.0 Turbo","90 HP","Ön Çekiş"],
  ["Renault","Megane","Sedan","1.3 TCe Icon","Benzin","Otomatik",2022,1725000,68000,"1.3 Turbo","140 HP","Ön Çekiş"],

  ["Fiat","Egea","Sedan","1.6 Multijet Lounge","Dizel","Otomatik",2023,1325000,54000,"1.6 Multijet","130 HP","Ön Çekiş"],
  ["Fiat","Egea Cross","SUV","1.0 Firefly Urban","Benzin","Manuel",2022,1295000,61000,"1.0 Turbo","100 HP","Ön Çekiş"],

  ["Opel","Corsa","Hatchback","1.2 Elegance","Benzin","Otomatik",2024,1585000,18500,"1.2 Turbo","100 HP","Ön Çekiş"],
  ["Peugeot","208","Hatchback","1.2 PureTech Allure","Benzin","Otomatik",2023,1545000,31000,"1.2 Turbo","100 HP","Ön Çekiş"],

  ["Peugeot","3008","SUV","1.5 BlueHDi Allure","Dizel","Otomatik",2022,2145000,72000,"1.5 BlueHDi","130 HP","Ön Çekiş"],
  ["Volkswagen","Polo","Hatchback","1.0 TSI Style","Benzin","Otomatik",2023,1695000,36000,"1.0 TSI","95 HP","Ön Çekiş"],

  ["Volkswagen","Golf","Hatchback","1.5 eTSI Style","Hibrit","Otomatik",2024,2265000,22000,"1.5 eTSI","150 HP","Ön Çekiş"],
  ["Toyota","Corolla","Sedan","1.8 Hybrid Flame X-Pack","Hibrit","Otomatik",2023,1975000,47000,"1.8 Hybrid","140 HP","Ön Çekiş"],

  ["Toyota","Yaris","Hatchback","1.5 Hybrid Dream","Hibrit","Otomatik",2022,1665000,39000,"1.5 Hybrid","116 HP","Ön Çekiş"],
  ["Honda","Civic","Sedan","1.5 VTEC Turbo Executive+","Benzin","Otomatik",2022,2135000,58000,"1.5 Turbo","182 HP","Ön Çekiş"],

  ["Hyundai","i20","Hatchback","1.0 T-GDI Elite","Benzin","Otomatik",2023,1375000,33000,"1.0 Turbo","100 HP","Ön Çekiş"],
  ["Hyundai","Bayon","SUV","1.0 T-GDI Elite","Benzin","Otomatik",2023,1515000,41000,"1.0 Turbo","100 HP","Ön Çekiş"],

  ["Hyundai","Tucson","SUV","1.6 T-GDI Elite Plus","Benzin","Otomatik",2023,2195000,52000,"1.6 Turbo","180 HP","Ön Çekiş"],
  ["Ford","Focus","Sedan","1.5 EcoBlue Titanium","Dizel","Otomatik",2022,1765000,76000,"1.5 EcoBlue","120 HP","Ön Çekiş"],

  ["Ford","Puma","SUV","1.0 EcoBoost ST-Line","Benzin","Otomatik",2023,1815000,35000,"1.0 EcoBoost","125 HP","Ön Çekiş"],
  ["Skoda","Fabia","Hatchback","1.0 TSI Elite","Benzin","Otomatik",2023,1485000,29000,"1.0 TSI","110 HP","Ön Çekiş"],

  ["Skoda","Octavia","Sedan","1.5 TSI Premium","Benzin","Otomatik",2022,1985000,64000,"1.5 TSI","150 HP","Ön Çekiş"],
  ["Skoda","Kamiq","SUV","1.0 TSI Premium","Benzin","Otomatik",2023,1775000,38000,"1.0 TSI","110 HP","Ön Çekiş"],

  ["SEAT","Ibiza","Hatchback","1.0 EcoTSI FR","Benzin","Otomatik",2023,1515000,27000,"1.0 TSI","110 HP","Ön Çekiş"],
  ["SEAT","Leon","Hatchback","1.5 eTSI FR","Hibrit","Otomatik",2023,1915000,43000,"1.5 eTSI","150 HP","Ön Çekiş"],

  ["Dacia","Duster","SUV","1.3 TCe Journey","Benzin","Otomatik",2023,1665000,49000,"1.3 Turbo","150 HP","Ön Çekiş"],
  ["Nissan","Qashqai","SUV","1.3 DIG-T Designpack","Benzin","Otomatik",2022,2075000,69000,"1.3 Turbo","158 HP","Ön Çekiş"],

  ["Kia","Sportage","SUV","1.6 T-GDI Prestige","Benzin","Otomatik",2023,2325000,44000,"1.6 Turbo","180 HP","Ön Çekiş"],
  ["Cupra","Formentor","SUV","1.5 TSI VZ","Benzin","Otomatik",2023,2395000,36000,"1.5 TSI","150 HP","Ön Çekiş"],

  ["BMW","1 Serisi","Hatchback","118i M Sport","Benzin","Otomatik",2022,2550000,52000,"1.5 Turbo","136 HP","Ön Çekiş"],
  ["BMW","3 Serisi","Sedan","320i M Sport","Benzin","Otomatik",2021,3095000,79000,"1.6 Turbo","170 HP","Arka Çekiş"],

  ["Mercedes-Benz","A-Serisi","Hatchback","A 200 AMG","Benzin","Otomatik",2022,2650000,48000,"1.3 Turbo","163 HP","Ön Çekiş"],
  ["Mercedes-Benz","C-Serisi","Sedan","C 200 AMG","Benzin","Otomatik",2021,3295000,72000,"1.5 Turbo","170 HP","Arka Çekiş"],

  ["Audi","A3","Sedan","35 TFSI Advanced","Benzin","Otomatik",2022,2495000,56000,"1.5 TFSI","150 HP","Ön Çekiş"],
  ["Audi","Q3","SUV","35 TFSI Advanced","Benzin","Otomatik",2022,2945000,61000,"1.5 TFSI","150 HP","Ön Çekiş"],

  ["Volvo","XC40","SUV","B3 Plus Dark","Benzin","Otomatik",2023,2825000,39000,"2.0 Turbo","163 HP","Ön Çekiş"],
  ["Volvo","S60","Sedan","B4 Ultimate","Benzin","Otomatik",2022,2985000,51000,"2.0 Turbo","197 HP","Ön Çekiş"],

  ["Tesla","Model 3","Sedan","Long Range AWD","Elektrik","Otomatik",2023,2795000,44000,"Elektrik","498 HP","Dört Çeker"]

];


/* ============================================================
   SATICI İSİMLERİ
   ============================================================ */

const sellerNames = [
  "Mert Yılmaz",
  "Emre Kaya",
  "Burak Demir",
  "Can Aydın",
  "Kerem Şahin",
  "Onur Çelik",
  "Berkay Özkan",
  "Eren Aksoy",
  "Serkan Arslan",
  "Hakan Koç",
  "Mehmet Yıldız",
  "Ali Kılıç",
  "Oğuzhan Kurt",
  "Barış Doğan",
  "Umut Kara"
];


/* ============================================================
   KONUM LİSTESİ
   ============================================================ */

const locations = [
  "İstanbul, Kadıköy",
  "İstanbul, Ataşehir",
  "İstanbul, Ümraniye",
  "İstanbul, Başakşehir",
  "İstanbul, Beylikdüzü",
  "Ankara, Çankaya",
  "Ankara, Keçiören",
  "İzmir, Bornova",
  "İzmir, Karşıyaka",
  "Bursa, Nilüfer",
  "Antalya, Kepez",
  "Kocaeli, Gebze",
  "Adana, Seyhan"
];


/* ============================================================
   RENKLER
   ============================================================ */

const carColors = [
  "Beyaz",
  "Gri",
  "Siyah",
  "Lacivert",
  "Kırmızı",
  "Gümüş"
];


/* ============================================================
   EKSPERTİZ VERİSİ
   ============================================================ */

function createExpertData(index) {

  const sets = [

    {
      hood: "Orijinal",
      fenderLeft: "Orijinal",
      roof: "Orijinal",
      doorRight: "Orijinal",
      tramer: "Hasar Kayıtsız",
      engineScore: "%97",
      transmissionScore: "Kusursuz / Test Edildi"
    },

    {
      hood: "Orijinal",
      fenderLeft: "Boya",
      roof: "Orijinal",
      doorRight: "Orijinal",
      tramer: "12.400 TL",
      engineScore: "%94",
      transmissionScore: "Kusursuz / Test Edildi"
    },

    {
      hood: "Orijinal",
      fenderLeft: "Orijinal",
      roof: "Orijinal",
      doorRight: "Boya",
      tramer: "8.750 TL",
      engineScore: "%93",
      transmissionScore: "Kontrol Edildi"
    },

    {
      hood: "Boya",
      fenderLeft: "Orijinal",
      roof: "Orijinal",
      doorRight: "Orijinal",
      tramer: "21.500 TL",
      engineScore: "%91",
      transmissionScore: "Kontrol Edildi"
    },

    {
      hood: "Orijinal",
      fenderLeft: "Değişen",
      roof: "Orijinal",
      doorRight: "Orijinal",
      tramer: "34.800 TL",
      engineScore: "%89",
      transmissionScore: "Kontrol Edildi"
    }

  ];

  return sets[index % sets.length];

}


/* ============================================================
   ARAÇ LİSTESİ OLUŞTUR
   ------------------------------------------------------------
   35 gerçek model x 2 farklı ilan = 70 araç
   ============================================================ */

window.dummyCars = [];


carCatalog.forEach((base, modelIndex) => {

  for (let variant = 0; variant < 2; variant++) {

    const id =
      modelIndex * 2 +
      variant +
      1;


    const year =
      Math.max(
        2019,
        Number(base[6]) - variant
      );


    const price =
      base[7] -
      (
        variant *
        Math.round(
          base[7] * 0.055
        )
      );


    const km =
      base[8] +
      (
        variant === 0
          ? 0
          : 24500 +
            (
              modelIndex % 6
            ) * 4200
      );


    let tcoRate = 0.0058;


    if (base[4] === "Hibrit") {
      tcoRate = 0.0042;
    }


    if (base[4] === "Elektrik") {
      tcoRate = 0.0032;
    }


    const tco =
      Math.max(
        4500,
        Math.round(
          price * tcoRate
        )
      );


    const imageStart =
      (
        modelIndex +
        variant
      ) % imgPool.length;


    const location =
      locations[
        (id - 1) %
        locations.length
      ];


    const seller =
      sellerNames[
        (id - 1) %
        sellerNames.length
      ];


    const car = {

      id: id,

      brand: base[0],

      model: base[1],

      title:
        `${base[0]} ${base[1]} ${base[3]}`,

      trim: base[3],

      seg: base[2],

      body: base[2],

      price: price,

      fuel: base[4],

      trans: base[5],

      transmission: base[5],

      year: year,

      km: km,

      tco: tco,


      img:
        imgPool[imageStart],


      images: [

        imgPool[imageStart],

        imgPool[
          (imageStart + 1) %
          imgPool.length
        ],

        imgPool[
          (imageStart + 2) %
          imgPool.length
        ],

        imgPool[
          (imageStart + 3) %
          imgPool.length
        ]

      ],


      engine: base[9],

      power: base[10],

      drive: base[11],


      color:
        carColors[
          id % carColors.length
        ],


      seller: seller,

      sellerType:
        id % 5 === 0
          ? "Kurumsal"
          : "Bireysel",


      location: location,


      city:
        location.split(", ")[0],


      district:
        location.split(", ")[1],


      featured:
        id <= 6,


      description:
        `${year} model ${base[0]} ${base[1]} ${base[3]}. ` +
        `${km.toLocaleString("tr-TR")} km'de, ` +
        `${base[4].toLowerCase()} yakıtlı ve ` +
        `${base[5].toLowerCase()} şanzımanlıdır. ` +
        `Araç bilgileri demo amaçlı hazırlanmıştır.`,


      equipment: [

        "Klima",
        "Multimedya ekranı",
        "Bluetooth",
        "Geri görüş kamerası",
        "Park sensörü",
        "Hız sabitleyici",
        "Elektrikli camlar",
        "Anahtarsız çalıştırma",
        "LED farlar",
        "Yokuş kalkış desteği",
        "ABS",
        "ESP"

      ],


      expert:
        createExpertData(id)

    };


    window.dummyCars.push(car);

  }

});


/* ============================================================
   2. ORTAK DURUM
   ============================================================ */

let favorites =
  JSON.parse(
    localStorage.getItem("favs") || "[]"
  );


window.favorites =
  favorites;


let uploadedImages = [];


/* ============================================================
   3. SAYFA GEÇİŞLERİ
   ============================================================ */

function go(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  const target =
    document.getElementById(
      pageId
    );


  if (target) {

    target.classList.add(
      "active"
    );

  }


  document
    .querySelectorAll(
      ".navlinks button, .mobile-bottom-nav button"
    )
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


  if (
    pageId === "favorites" &&
    typeof renderFavorites ===
    "function"
  ) {

    renderFavorites();

  }


  window.scrollTo({

    top: 0,

    behavior: "instant"

  });

}


/* ============================================================
   4. AKILLI ARAMA
   ============================================================ */

function handleSearchInput(val) {

  const dropdown =
    document.getElementById(
      "searchDropdown"
    );


  if (!dropdown) return;


  const q =
    String(val || "")
      .trim()
      .toLocaleLowerCase(
        "tr-TR"
      );


  if (!q) {

    dropdown.classList.remove(
      "open"
    );

    return;

  }


  const cmdItems = [];

  const carItems = [];


  if (
    "favoriler".includes(q) ||
    "fav".includes(q)
  ) {

    cmdItems.push({

      text:
        "⭐ Favorilerim Sayfasına Git",

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

      text:
        "📝 İlan Ver Sayfasına Git",

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

      text:
        "🪄 Bana Araba Bul Sihirbazı",

      action: () => {

        go("find");

        clearSearch();

      }

    });

  }


  const matchedCars =
    window.dummyCars
      .filter(car => {

        const brand =
          String(car.brand || "")
            .toLocaleLowerCase(
              "tr-TR"
            );


        const model =
          String(car.model || "")
            .toLocaleLowerCase(
              "tr-TR"
            );


        return (
          brand.includes(q) ||
          model.includes(q)
        );

      })
      .slice(0, 5);


  matchedCars.forEach(car => {

    carItems.push({

      text:
        `${car.brand} ${car.model} ${car.trim} ` +
        `(${car.price.toLocaleString("tr-TR")} TL)`,

      action: () => {

        openDetail(
          car.id
        );

        clearSearch();

      },

      tag:
        car.fuel

    });

  });


  let html = "";


  if (
    cmdItems.length > 0
  ) {

    html +=
      '<div class="search-group-title">Hızlı Komutlar</div>';


    cmdItems.forEach(
      (item, index) => {

        html += `

          <div
            class="search-item"
            onclick="execCmd(${index})"
          >

            <span>
              ${item.text}
            </span>

            <span class="type-tag">
              Komut
            </span>

          </div>

        `;

      }
    );


    dropdown.cmdActions =
      cmdItems.map(
        item => item.action
      );

  }


  if (
    carItems.length > 0
  ) {

    html +=
      '<div class="search-group-title">Eşleşen Araçlar</div>';


    carItems.forEach(
      (item, index) => {

        html += `

          <div
            class="search-item"
            onclick="execCar(${index})"
          >

            <span>
              ${item.text}
            </span>

            <span class="type-tag">
              ${item.tag}
            </span>

          </div>

        `;

      }
    );


    dropdown.carActions =
      carItems.map(
        item => item.action
      );

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

      () =>
        executeBrowseSearch(q)

    ];

  }


  dropdown.innerHTML =
    html;


  dropdown.classList.add(
    "open"
  );

}


function execCmd(index) {

  const dropdown =
    document.getElementById(
      "searchDropdown"
    );


  if (
    dropdown &&
    dropdown.cmdActions &&
    dropdown.cmdActions[index]
  ) {

    dropdown.cmdActions[index]();

  }

}


function execCar(index) {

  const dropdown =
    document.getElementById(
      "searchDropdown"
    );


  if (
    dropdown &&
    dropdown.carActions &&
    dropdown.carActions[index]
  ) {

    dropdown.carActions[index]();

  }

}


function executeBrowseSearch(q) {

  go("browse");


  const queryInput =
    document.getElementById(
      "fQuery"
    );


  if (queryInput) {

    queryInput.value =
      q;

  }


  renderBrowse();

  clearSearch();

}


function clearSearch() {

  const input =
    document.getElementById(
      "globalSearchInput"
    );


  const dropdown =
    document.getElementById(
      "searchDropdown"
    );


  if (input) {

    input.value = "";

  }


  if (dropdown) {

    dropdown.classList.remove(
      "open"
    );

  }

}


function handleSearchKeyDown(
  event
) {

  if (
    event.key === "Enter"
  ) {

    const input =
      document.getElementById(
        "globalSearchInput"
      );


    if (!input) return;


    const q =
      input.value.trim();


    if (q) {

      executeBrowseSearch(
        q
      );

    }

  }

}


/* CTRL + K */

document.addEventListener(
  "keydown",
  event => {

    if (
      (event.ctrlKey ||
        event.metaKey) &&
      event.key.toLowerCase() ===
        "k"
    ) {

      event.preventDefault();


      const input =
        document.getElementById(
          "globalSearchInput"
        );


      if (input) {

        input.focus();

      }

    }

  }
);


/* ============================================================
   5. FAVORİLER
   ============================================================ */

function toggleFav(
  id,
  e
) {

  if (e) {

    e.stopPropagation();

  }


  if (
    favorites.includes(id)
  ) {

    favorites =
      favorites.filter(
        item => item !== id
      );

  } else {

    favorites.push(id);

  }


  window.favorites =
    favorites;


  localStorage.setItem(
    "favs",
    JSON.stringify(
      favorites
    )
  );


  renderHome();

  renderBrowse();

  if (
    typeof renderFavorites ===
    "function"
  ) {

    renderFavorites();

  }

}


function isFavorite(id) {

  return favorites.some(
    item =>
      String(item) ===
      String(id)
  );

}


/* ============================================================
   6. ANA SAYFA
   ============================================================ */

function renderHome() {

  const grid =
    document.getElementById(
      "homeGrid"
    );


  if (!grid) return;


  grid.innerHTML =
    window.dummyCars
      .slice(0, 6)
      .map(
        car =>
          createCarCard(car)
      )
      .join("");

}


/* ============================================================
   7. KATEGORİLER
   ============================================================ */

function filterByCategory(
  cat
) {

  document
    .querySelectorAll(
      ".category-pills .pill"
    )
    .forEach(pill => {

      pill.classList.toggle(

        "active",

        pill.textContent.includes(
          cat
        ) ||

        (
          cat === "" &&
          pill.textContent.includes(
            "Tüm"
          )
        )

      );

    });


  go("browse");


  const bodyInput =
    document.getElementById(
      "fBody"
    );


  const fuelInput =
    document.getElementById(
      "fFuel"
    );


  if (bodyInput) {

    bodyInput.value =
      cat === "Elektrik"
        ? ""
        : cat;

  }


  if (fuelInput) {

    fuelInput.value =
      cat === "Elektrik"
        ? "Elektrik"
        : "";

  }


  renderBrowse();

}


/* ============================================================
   8. ARAÇ LİSTESİ / FİLTRELER
   ============================================================ */

function renderBrowse() {

  const grid =
    document.getElementById(
      "browseGrid"
    );


  if (!grid) return;


  const q =
    (
      document.getElementById(
        "fQuery"
      )?.value || ""
    )
      .toLocaleLowerCase(
        "tr-TR"
      );


  const brand =
    document.getElementById(
      "fBrand"
    )?.value || "";


  const body =
    document.getElementById(
      "fBody"
    )?.value || "";


  const pMin =
    Number(
      document.getElementById(
        "fPriceMin"
      )?.value || 0
    );


  const pMax =
    Number(
      document.getElementById(
        "fPriceMax"
      )?.value ||
      Infinity
    );


  const yMin =
    Number(
      document.getElementById(
        "fYearMin"
      )?.value || 0
    );


  const yMax =
    Number(
      document.getElementById(
        "fYearMax"
      )?.value ||
      Infinity
    );


  const kmMax =
    Number(
      document.getElementById(
        "fKmMax"
      )?.value ||
      Infinity
    );


  const fuel =
    document.getElementById(
      "fFuel"
    )?.value || "";


  const trans =
    document.getElementById(
      "fTrans"
    )?.value || "";


  const sort =
    document.getElementById(
      "fSort"
    )?.value ||
    "default";


  let filtered =
    window.dummyCars.filter(
      car => {

        const carBrand =
          String(
            car.brand || ""
          )
            .toLocaleLowerCase(
              "tr-TR"
            );


        const carModel =
          String(
            car.model || ""
          )
            .toLocaleLowerCase(
              "tr-TR"
            );


        if (
          q &&
          !(
            carBrand.includes(q) ||
            carModel.includes(q)
          )
        ) {

          return false;

        }


        if (
          brand &&
          car.brand !== brand
        ) {

          return false;

        }


        if (
          body &&
          car.seg !== body
        ) {

          return false;

        }


        if (
          car.price < pMin
        ) {

          return false;

        }


        if (
          pMax !== Infinity &&
          car.price > pMax
        ) {

          return false;

        }


        if (
          car.year < yMin
        ) {

          return false;

        }


        if (
          yMax !== Infinity &&
          car.year > yMax
        ) {

          return false;

        }


        if (
          car.km > kmMax
        ) {

          return false;

        }


        if (
          fuel &&
          car.fuel !== fuel
        ) {

          return false;

        }


        if (
          trans &&
          car.trans !== trans
        ) {

          return false;

        }


        return true;

      }
    );


  /* SIRALAMA */

  if (
    sort === "priceAsc"
  ) {

    filtered.sort(
      (a, b) =>
        a.price - b.price
    );

  }


  if (
    sort === "priceDesc"
  ) {

    filtered.sort(
      (a, b) =>
        b.price - a.price
    );

  }


  if (
    sort === "yearDesc"
  ) {

    filtered.sort(
      (a, b) =>
        b.year - a.year
    );

  }


  if (
    sort === "kmAsc"
  ) {

    filtered.sort(
      (a, b) =>
        a.km - b.km
    );

  }


  const resultCount =
    document.getElementById(
      "resultCount"
    );


  if (resultCount) {

    resultCount.textContent =
      `Bulunan Araç: ${filtered.length}`;

  }


  grid.innerHTML =
    filtered.length > 0

      ?

        filtered
          .map(
            car =>
              createCarCard(
                car
              )
          )
          .join("")

      :

        `

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


/* ============================================================
   9. ARAÇ KARTI
   ============================================================ */

function createCarCard(
  car,
  matchRate
) {

  const isFav =
    favorites.includes(
      car.id
    );


  return `

    <div
      class="vehicle-card"
      onclick="openDetail(${car.id})"
    >

      <button
        class="fav-btn"
        onclick="toggleFav(${car.id}, event)"
        type="button"
      >

        ${isFav ? "❤️" : "🤍"}

      </button>


      <div
        class="car-img"
        style="
          background-image:url('${car.img}')
        "
      >

        <div class="car-overlay">

          <span>
            ${car.brand} ${car.model}
          </span>

          <span>
            ${car.year}
          </span>

        </div>

      </div>


      <div class="car-body">

        ${
          matchRate
            ?

              `

                <span class="match-badge">

                  %${matchRate} Uyumlu

                </span>

              `

            :

              ""
        }


        <div class="car-title">

          ${car.brand}
          ${car.model}

        </div>


        <div class="car-price">

          ${car.price.toLocaleString(
            "tr-TR"
          )} TL

        </div>


        <div class="car-meta">

          <span>
            ${car.fuel}
          </span>

          •

          <span>
            ${car.trans}
          </span>

          •

          <span>
            ${car.km.toLocaleString(
              "tr-TR"
            )} KM
          </span>

        </div>


        <div class="badge-tco">

          Tahmini Yürütme:

          ~${car.tco.toLocaleString(
            "tr-TR"
          )} TL / ay

        </div>

      </div>

    </div>

  `;

}


/* ============================================================
   10. İLAN VERME / GÖRSEL YÜKLEME
   ============================================================ */

function handleImageUpload(
  e
) {

  const files =
    e.target.files;


  if (
    !files ||
    !files.length
  ) {

    return;

  }


  for (
    const file of files
  ) {

    const reader =
      new FileReader();


    reader.onload =
      function(event) {

        uploadedImages.push(
          event.target.result
        );


        renderImgPreviews();

      };


    reader.readAsDataURL(
      file
    );

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
        (
          src,
          index
        ) => `

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


function removeImg(
  index
) {

  uploadedImages.splice(
    index,
    1
  );


  renderImgPreviews();

}


function submitNewCar(
  e
) {

  e.preventDefault();


  const price =
    Number(
      document.getElementById(
        "addPrice"
      )?.value || 0
    );


  const newId =
    window.dummyCars.length > 0

      ?

        Math.max(
          ...window.dummyCars.map(
            car => car.id
          )
        ) + 1

      :

        1;


  const brand =
    document.getElementById(
      "addBrand"
    )?.value || "";


  const model =
    document.getElementById(
      "addModel"
    )?.value || "";


  const body =
    document.getElementById(
      "addBody"
    )?.value || "";


  const fuel =
    document.getElementById(
      "addFuel"
    )?.value || "";


  const trans =
    document.getElementById(
      "addTrans"
    )?.value || "";


  const year =
    Number(
      document.getElementById(
        "addYear"
      )?.value || 0
    );


  const km =
    Number(
      document.getElementById(
        "addKm"
      )?.value || 0
    );


  const newCar = {

    id: newId,

    brand: brand,

    model: model,

    title:
      `${brand} ${model}`,

    trim:
      "İlan Sahibi Tarafından Girildi",

    seg: body,

    body: body,

    price: price,

    fuel: fuel,

    trans: trans,

    transmission: trans,

    year: year,

    km: km,

    tco:
      Math.round(
        price * 0.006
      ),


    img:
      uploadedImages[0] ||
      imgPool[0],


    images:
      uploadedImages.length
        ? [...uploadedImages]
        : [imgPool[0]],


    engine:
      "Belirtilmedi",


    power:
      "Belirtilmedi",


    drive:
      "Ön Çekiş",


    color:
      "Belirtilmedi",


    location:
      "İstanbul, Kadıköy",


    city:
      "İstanbul",


    district:
      "Kadıköy",


    seller:
      "Yeni İlan Sahibi",


    sellerType:
      "Bireysel",


    featured:
      false,


    description:
      `${year} model ${brand} ${model}. ` +
      `${km.toLocaleString("tr-TR")} km'de.`,


    equipment: [

      "Klima",
      "Bluetooth",
      "Park sensörü",
      "ABS",
      "ESP"

    ],


    expert: {

      hood:
        "Beyan Edilmedi",

      fenderLeft:
        "Beyan Edilmedi",

      roof:
        "Beyan Edilmedi",

      doorRight:
        "Beyan Edilmedi",

      tramer:
        "Beyan Edilmedi",

      engineScore:
        "%95",

      transmissionScore:
        "Kontrol Edildi"

    }

  };


  window.dummyCars.unshift(
    newCar
  );


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


/* ============================================================
   11. YENİ ARAÇ DETAY SİSTEMİ
   ============================================================ */

function openDetail(
  id
) {

  console.log(
    "Araç detay isteği:",
    id
  );


  const detailSystem =
    window.AB_Detail;


  if (!detailSystem) {

    console.error(
      "AB_Detail bulunamadı. detail.js yüklenmemiş olabilir."
    );

    return;

  }


  if (
    typeof detailSystem.open !==
    "function"
  ) {

    console.error(
      "AB_Detail.open fonksiyonu bulunamadı."
    );

    return;

  }


  detailSystem.open(id);

}


/* ============================================================
   12. YAPAY ZEKA DESTEK MOTORU
   ============================================================ */

async function sendAIChat() {

  const input =
    document.getElementById(
      "chatInput"
    );


  if (!input) return;


  const query =
    input.value.trim();


  if (!query) return;


  const body =
    document.getElementById(
      "chatBody"
    );


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
    "typing_" +
    Date.now();


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


  setTimeout(
    () => {

      document
        .getElementById(
          typingId
        )
        ?.remove();


      let reply;


      if (
        typeof generateAIResponse ===
        "function"
      ) {

        reply =
          generateAIResponse(
            query
          );

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


    },
    900
  );

}


/* ============================================================
   13. BAŞLANGIÇ
   ============================================================ */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    go("home");

    console.log(
      "Arabamı Bul:",
      window.dummyCars.length,
      "gerçekçi demo araç yüklendi."
    );

  }
);
