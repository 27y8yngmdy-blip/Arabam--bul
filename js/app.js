/* ============================================================
   ARABAMI BUL V2 — app.js
   Ana uygulama çekirdeği
   ------------------------------------------------------------
   Sorumluluklar:
   - Demo araç verileri
   - Kullanıcı ilanlarını yükleme
   - Sayfa navigasyonu
   - Ana sayfa
   - Araçları İncele
   - Favoriler
   - Arama
   - Araç kartları
   - Araç detay bağlantısı
   - AI sohbet
   ------------------------------------------------------------
   İlan oluşturma işlemleri listing.js tarafından yönetilir.
   ============================================================ */

'use strict';


/* ============================================================
   1. DEMO ARAÇ VERİLERİ
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

const imgPool = [
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1000&q=85",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1000&q=85",
    "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1000&q=85",
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1000&q=85",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1000&q=85",
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&q=85"
];


/* ============================================================
   2. ARAÇ KATALOGU
   ============================================================ */

const carCatalog = [
    ["Renault", "Clio", "Hatchback", 825000, "Benzin", "Otomatik"],
    ["Renault", "Megane", "Sedan", 1185000, "Benzin", "Otomatik"],
    ["Fiat", "Egea", "Sedan", 795000, "Benzin", "Manuel"],
    ["Fiat", "Egea Cross", "SUV", 965000, "Benzin", "Otomatik"],
    ["Opel", "Corsa", "Hatchback", 985000, "Benzin", "Otomatik"],
    ["Peugeot", "208", "Hatchback", 1045000, "Benzin", "Otomatik"],
    ["Peugeot", "3008", "SUV", 1495000, "Benzin", "Otomatik"],
    ["Volkswagen", "Polo", "Hatchback", 1095000, "Benzin", "Otomatik"],
    ["Volkswagen", "Golf", "Hatchback", 1425000, "Benzin", "Otomatik"],
    ["Toyota", "Corolla", "Sedan", 1295000, "Hibrit", "Otomatik"],
    ["Toyota", "Yaris", "Hatchback", 1125000, "Hibrit", "Otomatik"],
    ["Honda", "Civic", "Sedan", 1515000, "Benzin", "Otomatik"],
    ["Hyundai", "i20", "Hatchback", 945000, "Benzin", "Otomatik"],
    ["Hyundai", "Bayon", "SUV", 1085000, "Benzin", "Otomatik"],
    ["Hyundai", "Tucson", "SUV", 1595000, "Benzin", "Otomatik"],
    ["Ford", "Focus", "Sedan", 1295000, "Benzin", "Otomatik"],
    ["Ford", "Puma", "SUV", 1275000, "Benzin", "Otomatik"],
    ["Skoda", "Fabia", "Hatchback", 995000, "Benzin", "Otomatik"],
    ["Skoda", "Octavia", "Sedan", 1375000, "Benzin", "Otomatik"],
    ["Skoda", "Kamiq", "SUV", 1245000, "Benzin", "Otomatik"],
    ["SEAT", "Ibiza", "Hatchback", 925000, "Benzin", "Otomatik"],
    ["SEAT", "Leon", "Hatchback", 1185000, "Benzin", "Otomatik"],
    ["Dacia", "Duster", "SUV", 1075000, "Benzin", "Manuel"],
    ["Nissan", "Qashqai", "SUV", 1545000, "Benzin", "Otomatik"],
    ["Kia", "Sportage", "SUV", 1695000, "Benzin", "Otomatik"],
    ["Cupra", "Formentor", "SUV", 1875000, "Benzin", "Otomatik"],
    ["BMW", "1 Serisi", "Hatchback", 1950000, "Benzin", "Otomatik"],
    ["BMW", "3 Serisi", "Sedan", 2595000, "Benzin", "Otomatik"],
    ["Mercedes-Benz", "A Serisi", "Hatchback", 2145000, "Benzin", "Otomatik"],
    ["Mercedes-Benz", "C Serisi", "Sedan", 2875000, "Benzin", "Otomatik"],
    ["Audi", "A3", "Sedan", 1995000, "Benzin", "Otomatik"],
    ["Audi", "Q3", "SUV", 2295000, "Benzin", "Otomatik"],
    ["Volvo", "XC40", "SUV", 2195000, "Benzin", "Otomatik"],
    ["Volvo", "S60", "Sedan", 2395000, "Hibrit", "Otomatik"],
    ["Tesla", "Model 3", "Sedan", 1895000, "Elektrik", "Otomatik"]
];


const sellerNames = [
    "AutoCenter",
    "Premium Motors",
    "Güven Otomotiv",
    "Elite Cars",
    "Şehir Otomotiv",
    "Motorline",
    "Prestij Auto",
    "Oto Galeri"
];


const locations = [
    ["İstanbul", "Kadıköy"],
    ["İstanbul", "Ümraniye"],
    ["Ankara", "Çankaya"],
    ["İzmir", "Bornova"],
    ["Bursa", "Nilüfer"],
    ["Antalya", "Muratpaşa"],
    ["Adana", "Seyhan"],
    ["Hatay", "İskenderun"]
];


/* ============================================================
   3. YARDIMCI VERİ ÜRETİCİLERİ
   ============================================================ */

function createExpertData(index) {

    return {
        hood: index % 3 !== 0,
        fender: index % 4 !== 0,
        roof: index % 5 !== 0,
        doorRight: index % 6 !== 0,
        tramer: Math.floor((index % 8) * 3750),
        engineScore: 88 + (index % 11),
        transmissionScore: 90 + (index % 9)
    };
}


function createDemoCar(base, index, variant) {

    const [
        brand,
        model,
        body,
        basePrice,
        fuel,
        trans
    ] = base;

    const year = 2021 + ((index + variant) % 5);

    const km = 8500 +
        (((index * 7311) + (variant * 4200)) % 85000);

    const price = basePrice +
        (((variant * 42000) + (index % 4) * 17500));

    const location = locations[
        (index + variant) % locations.length
    ];

    const imageIndex =
        (index + variant) % imgPool.length;

    const engineMap = {
        "Renault": "1.0 TCe",
        "Fiat": "1.4 Fire",
        "Opel": "1.2 Turbo",
        "Peugeot": "1.2 PureTech",
        "Volkswagen": "1.0 TSI",
        "Toyota": "1.8 Hybrid",
        "Honda": "1.5 VTEC",
        "Hyundai": "1.0 T-GDI",
        "Ford": "1.0 EcoBoost",
        "Skoda": "1.0 TSI",
        "SEAT": "1.0 TSI",
        "Dacia": "1.0 TCe",
        "Nissan": "1.3 DIG-T",
        "Kia": "1.6 T-GDI",
        "Cupra": "1.5 TSI",
        "BMW": "1.5 TwinPower",
        "Mercedes-Benz": "1.3 Turbo",
        "Audi": "1.5 TFSI",
        "Volvo": "2.0 B4",
        "Tesla": "Elektrikli"
    };

    const powerMap = {
        "Renault": 90,
        "Fiat": 95,
        "Opel": 100,
        "Peugeot": 100,
        "Volkswagen": 110,
        "Toyota": 140,
        "Honda": 129,
        "Hyundai": 100,
        "Ford": 125,
        "Skoda": 110,
        "SEAT": 110,
        "Dacia": 100,
        "Nissan": 158,
        "Kia": 150,
        "Cupra": 150,
        "BMW": 136,
        "Mercedes-Benz": 163,
        "Audi": 150,
        "Volvo": 197,
        "Tesla": 283
    };

    const equipment = [
        "Geri Görüş Kamerası",
        "Apple CarPlay",
        "Android Auto",
        "LED Far",
        "Hız Sabitleyici",
        "Park Sensörü",
        "Dijital Klima"
    ].slice(0, 4 + ((index + variant) % 4));

    const tco =
        Math.round(price * 0.022) +
        12000 +
        ((index % 5) * 1500);

    const expert = createExpertData(index + variant);

    return {

        id: index + 1 + (variant * 100),

        brand,
        model,

        title: `${year} ${brand} ${model}`,

        trim:
            variant === 0
                ? "Standart"
                : variant === 1
                    ? "Premium"
                    : "Plus",

        seg: body,

        body,

        price,

        fuel,

        trans,

        transmission: trans,

        year,

        km,

        tco,

        img: imgPool[imageIndex],

        images: [
            imgPool[imageIndex],
            imgPool[(imageIndex + 1) % imgPool.length],
            imgPool[(imageIndex + 2) % imgPool.length]
        ],

        engine: engineMap[brand] || "1.5 Turbo",

        power: powerMap[brand] || 120,

        drive:
            body === "SUV"
                ? "Önden Çekiş"
                : "Önden Çekiş",

        color: [
            "Beyaz",
            "Siyah",
            "Gri",
            "Kırmızı",
            "Mavi"
        ][(index + variant) % 5],

        seller:
            sellerNames[(index + variant) % sellerNames.length],

        sellerType:
            index % 3 === 0
                ? "Kurumsal"
                : "Galerici",

        location:
            `${location[1]}, ${location[0]}`,

        city: location[0],

        district: location[1],

        featured:
            index < 6,

        description:
            `${year} model ${brand} ${model}. ` +
            `Bakımları düzenli yapılmış, günlük kullanıma hazır ` +
            `ve detaylı olarak kontrol edilmiş araç.`,

        equipment,

        expert
    };
}


/* ============================================================
   4. 70 ARAÇLIK DEMO KATALOG
   ============================================================ */

const dummyCars = [];

carCatalog.forEach((car, index) => {

    dummyCars.push(
        createDemoCar(car, index, 0)
    );

    dummyCars.push(
        createDemoCar(car, index, 1)
    );

});

window.dummyCars = dummyCars;


/* ============================================================
   5. FAVORİLER
   ============================================================ */

let favorites = [];

try {

    favorites =
        JSON.parse(
            localStorage.getItem("favs") || "[]"
        );

    if (!Array.isArray(favorites)) {
        favorites = [];
    }

} catch (error) {

    favorites = [];

}

window.favorites = favorites;


/* ============================================================
   6. KULLANICI İLANLARINI YÜKLE
   ============================================================ */

function normalizeSavedListing(car, index) {

    if (!car || typeof car !== "object") {
        return null;
    }

    const safeBrand =
        car.brand || "Diğer";

    const safeModel =
        car.model || "Araç";

    const safeYear =
        Number(car.year) || new Date().getFullYear();

    const safePrice =
        Number(car.price) || 0;

    const safeKm =
        Number(car.km) || 0;

    const imageList =
        Array.isArray(car.images) && car.images.length
            ? car.images
            : car.image
                ? [car.image]
                : [
                    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200"
                ];

    return {

        ...car,

        id:
            car.id ||
            `user_${Date.now()}_${index}`,

        brand: safeBrand,

        model: safeModel,

        title:
            car.title ||
            `${safeYear} ${safeBrand} ${safeModel}`,

        trim:
            car.trim || "Standart",

        seg:
            car.seg ||
            car.body ||
            "Sedan",

        body:
            car.body ||
            "Sedan",

        price: safePrice,

        fuel:
            car.fuel ||
            "Benzin",

        trans:
            car.trans ||
            car.transmission ||
            "Otomatik",

        transmission:
            car.transmission ||
            car.trans ||
            "Otomatik",

        year: safeYear,

        km: safeKm,

        tco:
            Number(car.tco) ||
            Math.round(safePrice * 0.022),

        img:
            car.img ||
            imageList[0],

        images:
            imageList,

        engine:
            car.engine ||
            "Belirtilmemiş",

        power:
            Number(car.power) ||
            0,

        drive:
            car.drive ||
            "Önden Çekiş",

        color:
            car.color ||
            "Belirtilmemiş",

        seller:
            car.seller ||
            "Bireysel Satıcı",

        sellerType:
            car.sellerType ||
            "Bireysel",

        location:
            car.location ||
            "Türkiye",

        city:
            car.city ||
            "",

        district:
            car.district ||
            "",

        featured:
            false,

        description:
            car.description ||
            "Satıcı tarafından eklenen ilan.",

        equipment:
            Array.isArray(car.equipment)
                ? car.equipment
                : Array.isArray(car.features)
                    ? car.features
                    : [],

        features:
            Array.isArray(car.features)
                ? car.features
                : [],

        expert:
            car.expert || {
                hood: true,
                fender: true,
                roof: true,
                doorRight: true,
                tramer: Number(car.tramer) || 0,
                engineScore: 90,
                transmissionScore: 90
            },

        source:
            "user_listing",

        isUserListing:
            true
    };
}


function loadSavedUserListings() {

    try {

        const raw =
            localStorage.getItem("my_listings");

        if (!raw) {
            return;
        }

        const saved =
            JSON.parse(raw);

        if (!Array.isArray(saved) || !saved.length) {
            return;
        }

        const normalized =
            saved
                .map((car, index) =>
                    normalizeSavedListing(car, index)
                )
                .filter(Boolean);

        const existingIds =
            new Set(
                window.dummyCars.map(car =>
                    String(car.id)
                )
            );

        normalized.reverse().forEach(car => {

            if (!existingIds.has(String(car.id))) {

                window.dummyCars.unshift(car);

                existingIds.add(
                    String(car.id)
                );
            }

        });

        console.log(
            `Arabamı Bul: ${normalized.length} kullanıcı ilanı yüklendi.`
        );

    } catch (error) {

        console.warn(
            "Kullanıcı ilanları yüklenemedi:",
            error
        );

    }
}


/* ============================================================
   7. SAYFA NAVİGASYONU
   ============================================================ */

function go(pageId) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const target =
        document.getElementById(pageId);

    if (target) {

        target.classList.add("active");

    }


    document
        .querySelectorAll("[data-page]")
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


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   8. FAVORİ İŞLEMLERİ
   ============================================================ */

function isFavorite(id) {

    return favorites.some(
        favoriteId =>
            String(favoriteId) === String(id)
    );

}


function toggleFav(id) {

    const index =
        favorites.findIndex(
            favoriteId =>
                String(favoriteId) === String(id)
        );


    if (index >= 0) {

        favorites.splice(index, 1);

    } else {

        favorites.push(id);

    }


    window.favorites = favorites;


    try {

        localStorage.setItem(
            "favs",
            JSON.stringify(favorites)
        );

    } catch (error) {

        console.warn(
            "Favoriler kaydedilemedi:",
            error
        );

    }


    renderHome();
    renderBrowse();
    renderFavorites();

}


/* ============================================================
   9. ARAÇ KARTI
   ============================================================ */

function createCarCard(car, matchRate) {

    if (!car) {
        return "";
    }


    const favorite =
        isFavorite(car.id);


    const image =
        car.img ||
        car.image ||
        (
            Array.isArray(car.images)
                ? car.images[0]
                : imgPool[0]
        );


    const price =
        new Intl.NumberFormat("tr-TR")
            .format(Number(car.price) || 0);


    const km =
        new Intl.NumberFormat("tr-TR")
            .format(Number(car.km) || 0);


    const tco =
        new Intl.NumberFormat("tr-TR")
            .format(Number(car.tco) || 0);


    const matchHtml =
        matchRate
            ? `
                <div class="match-badge">
                    ${matchRate}% Uyum
                </div>
            `
            : "";


    return `

        <article
            class="car-card"
            data-car-id="${car.id}"
            onclick="openDetail('${car.id}')"
        >

            <div class="car-card-image">

                <img
                    src="${image}"
                    alt="${car.title || `${car.brand} ${car.model}`}"
                    loading="lazy"
                >

                ${matchHtml}

                <button
                    type="button"
                    class="favorite-btn ${favorite ? "active" : ""}"
                    onclick="event.stopPropagation(); toggleFav('${car.id}')"
                    aria-label="Favorilere ekle"
                >
                    ${favorite ? "♥" : "♡"}
                </button>

                ${
                    car.isUserListing
                        ? `
                            <span class="user-listing-badge">
                                Yeni İlan
                            </span>
                        `
                        : ""
                }

            </div>


            <div class="car-card-body">

                <div class="car-card-top">

                    <div>

                        <div class="car-card-brand">
                            ${car.brand || ""}
                        </div>

                        <h3>
                            ${car.model || "Araç"}
                        </h3>

                    </div>

                    <strong class="car-card-price">
                        ${price} TL
                    </strong>

                </div>


                <div class="car-card-meta">

                    <span>
                        ${car.year || "-"}
                    </span>

                    <span>
                        ${km} km
                    </span>

                    <span>
                        ${car.fuel || "-"}
                    </span>

                    <span>
                        ${car.trans || car.transmission || "-"}
                    </span>

                </div>


                <div class="car-card-bottom">

                    <span>
                        ${car.body || car.seg || "-"}
                    </span>

                    <span>
                        Sahiplik: ${tco} TL/yıl
                    </span>

                </div>

            </div>

        </article>

    `;
}


/* ============================================================
   10. ANA SAYFA
   ============================================================ */

function renderHome() {

    const grid =
        document.getElementById("homeGrid");

    if (!grid) {
        return;
    }


    const popularCars =
        window.dummyCars
            .filter(car => !car.isUserListing)
            .slice(0, 6);


    grid.innerHTML =
        popularCars
            .map(car =>
                createCarCard(car)
            )
            .join("");


    const count =
        document.getElementById("homeCarCount");

    if (count) {

        count.textContent =
            `${window.dummyCars.length}`;

    }

}


/* ============================================================
   11. KATEGORİ FİLTRELEME
   ============================================================ */

function filterByCategory(category) {

    const body =
        document.getElementById("fBody");

    const fuel =
        document.getElementById("fFuel");


    if (body) {
        body.value = "";
    }

    if (fuel) {
        fuel.value = "";
    }


    if (category === "Elektrikli Araçlar") {

        if (fuel) {
            fuel.value = "Elektrik";
        }

    } else if (body) {

        const validBodies =
            [
                "Sedan",
                "SUV",
                "Hatchback",
                "Coupe"
            ];

        if (validBodies.includes(category)) {

            body.value = category;

        }

    }


    go("browse");

    renderBrowse();

}


/* ============================================================
   12. ARAÇLARI İNCELE
   ============================================================ */

function renderBrowse() {

    const grid =
        document.getElementById("browseGrid");

    if (!grid) {
        return;
    }


    const query =
        (
            document.getElementById("fQuery")?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const brand =
        document.getElementById("fBrand")?.value ||
        "";


    const body =
        document.getElementById("fBody")?.value ||
        "";


    const priceMin =
        Number(
            document.getElementById("fPriceMin")?.value
        ) || 0;


    const priceMax =
        Number(
            document.getElementById("fPriceMax")?.value
        ) || Infinity;


    const yearMin =
        Number(
            document.getElementById("fYearMin")?.value
        ) || 0;


    const yearMax =
        Number(
            document.getElementById("fYearMax")?.value
        ) || Infinity;


    const kmMax =
        Number(
            document.getElementById("fKmMax")?.value
        ) || Infinity;


    const fuel =
        document.getElementById("fFuel")?.value ||
        "";


    const trans =
        document.getElementById("fTrans")?.value ||
        "";


    const sort =
        document.getElementById("fSort")?.value ||
        "default";


    let filtered =
        window.dummyCars.filter(car => {

            const searchable =
                `
                    ${car.brand || ""}
                    ${car.model || ""}
                    ${car.title || ""}
                    ${car.city || ""}
                    ${car.district || ""}
                `
                    .toLowerCase();


            if (
                query &&
                !searchable.includes(query)
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
                car.body !== body
            ) {
                return false;
            }


            if (
                car.price < priceMin ||
                car.price > priceMax
            ) {
                return false;
            }


            if (
                car.year < yearMin ||
                car.year > yearMax
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
                car.trans !== trans &&
                car.transmission !== trans
            ) {
                return false;
            }


            return true;

        });


    /* -------------------------
       Sıralama
       ------------------------- */

    if (sort === "priceAsc") {

        filtered.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    }

    else if (sort === "priceDesc") {

        filtered.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    }

    else if (sort === "yearDesc") {

        filtered.sort(
            (a, b) =>
                Number(b.year) -
                Number(a.year)
        );

    }

    else if (sort === "kmAsc") {

        filtered.sort(
            (a, b) =>
                Number(a.km) -
                Number(b.km)
        );

    }


    /* -------------------------
       Sonuç sayısı
       ------------------------- */

    const resultCount =
        document.getElementById("browseCount") ||
        document.getElementById("resultCount");


    if (resultCount) {

        resultCount.textContent =
            `Bulunan Araç: ${filtered.length}`;

    }


    /* -------------------------
       Sonuç yok
       ------------------------- */

    if (!filtered.length) {

        grid.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🚗
                </div>

                <h3>
                    Aradığınız kriterlerde araç bulunamadı.
                </h3>

                <p>
                    Filtreleri değiştirerek tekrar deneyebilirsiniz.
                </p>

                <button
                    type="button"
                    onclick="resetFilters()"
                    class="btn"
                >
                    Filtreleri Temizle
                </button>

            </div>

        `;

        return;
    }


    grid.innerHTML =
        filtered
            .map(car =>
                createCarCard(car)
            )
            .join("");

}


/* ============================================================
   13. FAVORİLER SAYFASI
   ============================================================ */

function renderFavorites() {

    const grid =
        document.getElementById("favoritesGrid");

    if (!grid) {
        return;
    }


    const favoriteCars =
        window.dummyCars.filter(car =>
            isFavorite(car.id)
        );


    const count =
        document.getElementById("favoritesCount");


    if (count) {

        count.textContent =
            favoriteCars.length;

    }


    if (!favoriteCars.length) {

        grid.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    ♡
                </div>

                <h3>
                    Henüz favori aracınız yok.
                </h3>

                <p>
                    Beğendiğiniz araçları favorilerinize ekleyebilirsiniz.
                </p>

                <button
                    type="button"
                    class="btn"
                    onclick="go('browse')"
                >
                    Araçları İncele
                </button>

            </div>

        `;

        return;
    }


    grid.innerHTML =
        favoriteCars
            .map(car =>
                createCarCard(car)
            )
            .join("");

}


/* ============================================================
   14. ARAÇ DETAY
   ============================================================ */

function openDetail(id) {

    if (
        window.AB_Detail &&
        typeof window.AB_Detail.open === "function"
    ) {

        window.AB_Detail.open(id);

        return;

    }


    console.warn(
        "detail.js bulunamadı veya AB_Detail.open mevcut değil."
    );

}


/* ============================================================
   15. GLOBAL ARAMA
   ============================================================ */

function handleSearchInput(event) {

    const value =
        event.target.value.trim();


    const suggestions =
        document.getElementById("searchSuggestions");


    if (!suggestions) {
        return;
    }


    if (!value) {

        suggestions.innerHTML = "";
        suggestions.classList.remove("open");

        return;

    }


    const query =
        value.toLowerCase();


    const matches =
        window.dummyCars
            .filter(car => {

                const text =
                    `
                        ${car.brand}
                        ${car.model}
                        ${car.title}
                    `
                        .toLowerCase();

                return text.includes(query);

            })
            .slice(0, 5);


    if (!matches.length) {

        suggestions.innerHTML = `
            <div class="search-empty">
                Sonuç bulunamadı
            </div>
        `;

    } else {

        suggestions.innerHTML =
            matches
                .map(car => `

                    <button
                        type="button"
                        class="search-result-item"
                        onclick="openDetail('${car.id}')"
                    >

                        <span>
                            ${car.brand} ${car.model}
                        </span>

                        <strong>
                            ${new Intl.NumberFormat("tr-TR").format(car.price)} TL
                        </strong>

                    </button>

                `)
                .join("");

    }


    suggestions.classList.add("open");

}


function execCar(query) {

    const clean =
        query
            .trim()
            .toLowerCase();


    if (!clean) {
        return;
    }


    const car =
        window.dummyCars.find(item => {

            const text =
                `
                    ${item.brand}
                    ${item.model}
                    ${item.title}
                `
                    .toLowerCase();

            return text.includes(clean);

        });


    if (car) {

        openDetail(car.id);

        return true;

    }


    return false;

}


function executeBrowseSearch(query) {

    const input =
        document.getElementById("fQuery");

    if (input) {

        input.value =
            query || "";

    }


    go("browse");

    renderBrowse();

}


function execCmd(command) {

    const clean =
        String(command || "")
            .trim()
            .toLowerCase();


    if (
        clean === "favoriler" ||
        clean === "favorilerim"
    ) {

        go("favorites");

        return;

    }


    if (
        clean === "ilan ver" ||
        clean === "araç ekle"
    ) {

        go("sell");

        return;

    }


    if (
        clean === "araçlar" ||
        clean === "araç incele" ||
        clean === "araçları incele"
    ) {

        go("browse");

        return;

    }


    if (
        clean === "ana sayfa" ||
        clean === "home"
    ) {

        go("home");

        return;

    }


    if (
        clean === "bana araba bul" ||
        clean === "sihirbaz"
    ) {

        go("find");

        return;

    }


    if (!execCar(command)) {

        executeBrowseSearch(command);

    }

}


function clearSearch() {

    const input =
        document.getElementById("globalSearch");

    if (input) {

        input.value = "";

    }


    const suggestions =
        document.getElementById("searchSuggestions");

    if (suggestions) {

        suggestions.innerHTML = "";

        suggestions.classList.remove("open");

    }

}


function handleSearchKeyDown(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        execCmd(event.target.value);

    }


    if (event.key === "Escape") {

        clearSearch();

    }

}


/* ============================================================
   16. CTRL + K
   ============================================================ */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            const search =
                document.getElementById("globalSearch");

            if (search) {

                search.focus();

                search.select();

            }

        }

    }
);


/* ============================================================
   17. AI SOHBET
   ============================================================ */

function sendAIChat() {

    const input =
        document.getElementById("aiInput");

    const messages =
        document.getElementById("aiMessages");


    if (!input || !messages) {
        return;
    }


    const text =
        input.value.trim();


    if (!text) {
        return;
    }


    messages.insertAdjacentHTML(
        "beforeend",
        `
            <div class="chat-message user">
                ${text}
            </div>
        `
    );


    input.value = "";


    setTimeout(() => {

        const response =
            generateAIResponse(text);


        messages.insertAdjacentHTML(
            "beforeend",
            `
                <div class="chat-message assistant">
                    ${response}
                </div>
            `
        );


        messages.scrollTop =
            messages.scrollHeight;

    }, 400);

}


function generateAIResponse(text) {

    const query =
        text.toLowerCase();


    if (
        query.includes("ucuz") ||
        query.includes("bütçe")
    ) {

        return `
            Bütçe odaklı bir araç arıyorsanız
            Araçları İncele bölümünden fiyat aralığı
            belirleyebilirsiniz.
        `;

    }


    if (
        query.includes("az yak") ||
        query.includes("tüketim")
    ) {

        return `
            Yakıt tüketimi sizin için önemliyse
            hibrit veya küçük hacimli benzinli
            araçlara bakabilirsiniz.
        `;

    }


    if (
        query.includes("suv")
    ) {

        return `
            SUV araçları görmek için Araçları İncele
            bölümündeki kasa tipi filtresinden SUV
            seçebilirsiniz.
        `;

    }


    if (
        query.includes("otomatik")
    ) {

        return `
            Otomatik araçları Vites filtresinden
            seçerek listeyi daraltabilirsiniz.
        `;

    }


    return `
        Size daha uygun araçları bulabilmem için
        bütçenizi, kullanım amacınızı ve otomatik
        veya manuel tercihinizi yazabilirsiniz.
    `;

}


/* ============================================================
   18. İLANLAR GÜNCELLENDİĞİNDE LİSTEYİ YENİLE
   ============================================================ */

window.addEventListener(
    "arabamiBulListingsUpdated",
    function () {

        loadSavedUserListings();

        renderHome();
        renderBrowse();
        renderFavorites();

    }
);


/* ============================================================
   19. DOM HAZIR
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Önce kayıtlı kullanıcı ilanlarını yükle */
        loadSavedUserListings();


        /* Ana sayfayı aç */
        go("home");


        console.log(
            `Arabamı Bul hazır. Toplam araç: ${window.dummyCars.length}`
        );

    }
);
