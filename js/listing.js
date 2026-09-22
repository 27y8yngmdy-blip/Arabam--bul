/* ==========================================================================
   ARABAMI BUL V2 — listing.js
   İlan Ver / Araç Ekle Modülü
   Selection System + Listing Flow
   ========================================================================== */

'use strict';


/* ==========================================================================
   MODÜL DURUMU
   ========================================================================== */

window.ArabamiBul = window.ArabamiBul || {};

window.ArabamiBul.listing = window.ArabamiBul.listing || {
    uploadedImages: [],
    currentSellStep: 1
};

const listingState = window.ArabamiBul.listing;

const MAX_IMAGES = 15;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const DRAFT_KEY = 'arabami_bul_listing_draft';
const MY_LISTINGS_KEY = 'my_listings';


/* ==========================================================================
   MARKA / MODEL VERİLERİ
   ========================================================================== */

const LISTING_BRANDS = {

    "BMW": [
        "1 Serisi",
        "2 Serisi",
        "3 Serisi",
        "4 Serisi",
        "5 Serisi",
        "7 Serisi",
        "X1",
        "X2",
        "X3",
        "X4",
        "X5",
        "X6",
        "X7"
    ],

    "Mercedes-Benz": [
        "A Serisi",
        "B Serisi",
        "C Serisi",
        "E Serisi",
        "S Serisi",
        "CLA",
        "GLA",
        "GLB",
        "GLC",
        "GLE",
        "GLS"
    ],

    "Audi": [
        "A1",
        "A3",
        "A4",
        "A5",
        "A6",
        "A7",
        "A8",
        "Q2",
        "Q3",
        "Q5",
        "Q7",
        "Q8"
    ],

    "Volkswagen": [
        "Polo",
        "Golf",
        "Passat",
        "Jetta",
        "T-Roc",
        "T-Cross",
        "Tiguan",
        "Touareg"
    ],

    "Toyota": [
        "Yaris",
        "Corolla",
        "Camry",
        "C-HR",
        "RAV4",
        "Yaris Cross"
    ],

    "Honda": [
        "Jazz",
        "Civic",
        "City",
        "HR-V",
        "CR-V"
    ],

    "Ford": [
        "Fiesta",
        "Focus",
        "Mondeo",
        "Puma",
        "Kuga",
        "Mustang"
    ],

    "Opel": [
        "Corsa",
        "Astra",
        "Mokka",
        "Crossland",
        "Grandland",
        "Insignia"
    ],

    "Renault": [
        "Clio",
        "Megane",
        "Taliant",
        "Captur",
        "Austral",
        "Arkana"
    ],

    "Peugeot": [
        "208",
        "308",
        "408",
        "2008",
        "3008",
        "5008"
    ],

    "Tesla": [
        "Model 3",
        "Model Y",
        "Model S",
        "Model X"
    ],

    "Volvo": [
        "S60",
        "S90",
        "V60",
        "XC40",
        "XC60",
        "XC90"
    ],

    "Porsche": [
        "718",
        "911",
        "Taycan",
        "Macan",
        "Cayenne",
        "Panamera"
    ],

    "Fiat": [
        "Egea",
        "500",
        "500X",
        "Panda",
        "Tipo"
    ],

    "Hyundai": [
        "i10",
        "i20",
        "i30",
        "Elantra",
        "Bayon",
        "Kona",
        "Tucson"
    ],

    "Kia": [
        "Picanto",
        "Rio",
        "Ceed",
        "Stonic",
        "Sportage",
        "Sorento"
    ],

    "Nissan": [
        "Micra",
        "Juke",
        "Qashqai",
        "X-Trail"
    ],

    "Skoda": [
        "Fabia",
        "Scala",
        "Octavia",
        "Superb",
        "Kamiq",
        "Karoq",
        "Kodiaq"
    ],

    "Dacia": [
        "Sandero",
        "Logan",
        "Duster",
        "Jogger"
    ]
};


/* ==========================================================================
   SEÇİM VERİLERİ
   ========================================================================== */

const LISTING_YEARS = [];

for (
    let year = new Date().getFullYear() + 1;
    year >= 1990;
    year--
) {
    LISTING_YEARS.push(String(year));
}


const LISTING_COLORS = [
    "Beyaz",
    "Siyah",
    "Gri",
    "Gümüş",
    "Kırmızı",
    "Mavi",
    "Lacivert",
    "Yeşil",
    "Turuncu",
    "Sarı",
    "Kahverengi",
    "Bej",
    "Bordo",
    "Mor",
    "Diğer"
];


/* ==========================================================================
   DONANIMLAR
   ========================================================================== */

const LISTING_FEATURE_GROUPS = {

    "Güvenlik": [
        "ABS",
        "ESP",
        "6 Hava Yastığı",
        "Şerit Takip Sistemi",
        "Kör Nokta Uyarısı",
        "Çarpışma Önleme"
    ],

    "Konfor": [
        "Klima",
        "Çift Bölgeli Klima",
        "Isıtmalı Koltuk",
        "Elektrikli Koltuk",
        "Hafızalı Koltuk",
        "Anahtarsız Giriş",
        "Anahtarsız Çalıştırma"
    ],

    "Multimedya": [
        "Apple CarPlay",
        "Android Auto",
        "Bluetooth",
        "Navigasyon",
        "Kablosuz Şarj",
        "Premium Ses Sistemi"
    ],

    "Dış Donanım": [
        "LED Far",
        "Panoramik Cam Tavan",
        "Sunroof",
        "Elektrikli Bagaj",
        "Yağmur Sensörü",
        "Otomatik Far"
    ],

    "Sürüş Destek": [
        "Adaptif Hız Sabitleyici",
        "Park Sensörü",
        "Geri Görüş Kamerası",
        "360° Kamera",
        "Otomatik Park",
        "Yokuş Kalkış Desteği"
    ]
};


/* ==========================================================================
   YARDIMCI FONKSİYONLAR
   ========================================================================== */

function getFieldValue(id) {

    const el = document.getElementById(id);

    return el
        ? String(el.value || '').trim()
        : '';
}


function getNumberValue(id) {

    const value = getFieldValue(id);

    if (value === '') {
        return 0;
    }

    const number = Number(
        String(value)
            .replace(/\./g, '')
            .replace(',', '.')
    );

    return Number.isFinite(number)
        ? number
        : 0;
}


function getCheckedFeatures() {

    return Array.from(
        document.querySelectorAll('input[name="feature"]:checked')
    ).map(input => input.value);
}


function escapeHtml(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* ==========================================================================
   SELECT OLUŞTURMA
   ========================================================================== */

function replaceFieldWithSelect(id, options, placeholder) {

    const oldElement = document.getElementById(id);

    if (!oldElement) {
        return null;
    }

    if (oldElement.tagName.toLowerCase() === 'select') {
        return oldElement;
    }

    const select = document.createElement('select');

    Array.from(oldElement.attributes).forEach(attribute => {

        if (
            attribute.name !== 'type' &&
            attribute.name !== 'value'
        ) {
            select.setAttribute(
                attribute.name,
                attribute.value
            );
        }
    });

    select.id = id;
    select.name = oldElement.name || id;

    select.innerHTML = '';

    const placeholderOption =
        document.createElement('option');

    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;

    select.appendChild(placeholderOption);

    options.forEach(optionValue => {

        const option =
            document.createElement('option');

        option.value = optionValue;
        option.textContent = optionValue;

        select.appendChild(option);
    });

    oldElement.replaceWith(select);

    return select;
}


/* ==========================================================================
   MARKA SELECT
   ========================================================================== */

function setupBrandSelect() {

    const brandSelect =
        replaceFieldWithSelect(
            'addBrand',
            Object.keys(LISTING_BRANDS),
            'Marka seçiniz'
        );

    if (!brandSelect) {
        return;
    }

    brandSelect.addEventListener(
        'change',
        function () {

            updateModelSelect(
                this.value
            );
        }
    );

    updateModelSelect(
        brandSelect.value
    );
}


/* ==========================================================================
   MODEL SELECT
   ========================================================================== */

function updateModelSelect(brand, selectedModel = '') {

    const modelElement =
        document.getElementById('addModel');

    if (!modelElement) {
        return;
    }

    const currentValue =
        selectedModel ||
        modelElement.value ||
        '';

    const models =
        LISTING_BRANDS[brand] || [];

    if (
        modelElement.tagName.toLowerCase() !== 'select'
    ) {

        replaceFieldWithSelect(
            'addModel',
            models,
            brand
                ? 'Model seçiniz'
                : 'Önce marka seçiniz'
        );

    } else {

        modelElement.innerHTML = '';

        const placeholder =
            document.createElement('option');

        placeholder.value = '';

        placeholder.textContent =
            brand
                ? 'Model seçiniz'
                : 'Önce marka seçiniz';

        modelElement.appendChild(
            placeholder
        );

        models.forEach(model => {

            const option =
                document.createElement('option');

            option.value = model;
            option.textContent = model;

            modelElement.appendChild(
                option
            );
        });
    }

    const finalModelElement =
        document.getElementById('addModel');

    if (finalModelElement) {

        finalModelElement.value =
            models.includes(currentValue)
                ? currentValue
                : '';

        finalModelElement.disabled =
            !brand;
    }
}


/* ==========================================================================
   YIL SELECT
   ========================================================================== */

function setupYearSelect() {

    const yearSelect =
        replaceFieldWithSelect(
            'addYear',
            LISTING_YEARS,
            'Model yılı seçiniz'
        );

    if (!yearSelect) {
        return;
    }

    const currentYear =
        new Date().getFullYear();

    if (
        !yearSelect.value &&
        currentYear
    ) {
        // Otomatik seçim yapılmıyor.
    }
}


/* ==========================================================================
   RENK SELECT
   ========================================================================== */

function setupColorSelect() {

    replaceFieldWithSelect(
        'addColor',
        LISTING_COLORS,
        'Renk seçiniz'
    );
}


/* ==========================================================================
   DONANIMLARI YENİDEN OLUŞTUR
   ========================================================================== */

function setupFeatureCards() {

    const featureInputs =
        Array.from(
            document.querySelectorAll(
                'input[name="feature"]'
            )
        );

    if (!featureInputs.length) {
        return;
    }

    const firstContainer =
        featureInputs[0]
            .closest('.feature-grid');

    if (!firstContainer) {
        return;
    }

    /*
       Daha önce oluşturduysak tekrar oluşturma.
    */

    if (
        document.querySelector(
            '.listing-feature-groups'
        )
    ) {
        return;
    }

    const selectedValues =
        featureInputs
            .filter(input => input.checked)
            .map(input => input.value);

    const wrapper =
        document.createElement('div');

    wrapper.className =
        'listing-feature-groups';

    Object.entries(
        LISTING_FEATURE_GROUPS
    ).forEach(
        ([groupName, features]) => {

            const group =
                document.createElement('div');

            group.className =
                'listing-feature-group';

            group.innerHTML = `
                <div class="listing-feature-group-title">
                    <strong>${escapeHtml(groupName)}</strong>
                    <span>İstediğiniz özellikleri seçin</span>
                </div>

                <div class="listing-feature-options"></div>
            `;

            const optionsContainer =
                group.querySelector(
                    '.listing-feature-options'
                );

            features.forEach(
                (feature, index) => {

                    const id =
                        `listingFeature_${groupName}_${index}`
                            .replace(
                                /[^a-zA-Z0-9_]/g,
                                '_'
                            );

                    const option =
                        document.createElement('div');

                    option.className =
                        'listing-feature-option';

                    const checked =
                        selectedValues.includes(
                            feature
                        );

                    option.innerHTML = `
                        <input
                            type="checkbox"
                            id="${id}"
                            name="feature"
                            value="${escapeHtml(feature)}"
                            ${checked ? 'checked' : ''}
                        >

                        <label for="${id}">
                            <span class="feature-check-icon">✓</span>
                            <span class="feature-label-text">
                                ${escapeHtml(feature)}
                            </span>
                        </label>
                    `;

                    optionsContainer.appendChild(
                        option
                    );
                }
            );

            wrapper.appendChild(group);
        }
    );

    firstContainer
        .replaceWith(wrapper);
}


/* ==========================================================================
   TÜM SEÇİM ALANLARINI BAŞLAT
   ========================================================================== */

function initializeListingSelectors() {

    setupBrandSelect();
    setupYearSelect();
    setupColorSelect();
    setupFeatureCards();

    const body =
        document.getElementById('addBody');

    if (
        body &&
        body.tagName.toLowerCase() !== 'select'
    ) {

        replaceFieldWithSelect(
            'addBody',
            [
                'Sedan',
                'Hatchback',
                'SUV',
                'Coupe',
                'Cabrio',
                'Station Wagon',
                'MPV',
                'Pickup'
            ],
            'Kasa tipi seçiniz'
        );
    }

    const fuel =
        document.getElementById('addFuel');

    if (
        fuel &&
        fuel.tagName.toLowerCase() !== 'select'
    ) {

        replaceFieldWithSelect(
            'addFuel',
            [
                'Benzin',
                'Dizel',
                'Hibrit',
                'Elektrik',
                'LPG'
            ],
            'Yakıt tipi seçiniz'
        );
    }

    const trans =
        document.getElementById('addTrans');

    if (
        trans &&
        trans.tagName.toLowerCase() !== 'select'
    ) {

        replaceFieldWithSelect(
            'addTrans',
            [
                'Otomatik',
                'Manuel',
                'Yarı Otomatik'
            ],
            'Vites tipi seçiniz'
        );
    }

    const damage =
        document.getElementById('addDamage');

    if (
        damage &&
        damage.tagName.toLowerCase() !== 'select'
    ) {

        replaceFieldWithSelect(
            'addDamage',
            [
                'Hasarsız',
                'Boyalı',
                'Değişen Parça Var',
                'Tramer Kayıtlı',
                'Ağır Hasarlı'
            ],
            'Hasar durumu seçiniz'
        );
    }
}


/* ==========================================================================
   ADIM YÖNETİMİ
   ========================================================================== */

function goToSellStep(stepNumber) {

    if (
        stepNumber < 1 ||
        stepNumber > 4
    ) {
        return;
    }

    listingState.currentSellStep =
        stepNumber;

    for (
        let i = 1;
        i <= 4;
        i++
    ) {

        const step =
            document.getElementById(
                `sellStep${i}`
            );

        const node =
            document.getElementById(
                `stepNode${i}`
            );

        if (step) {
            step.classList.remove(
                'active'
            );
        }

        if (node) {
            node.classList.remove(
                'active'
            );
        }
    }

    const activeStep =
        document.getElementById(
            `sellStep${stepNumber}`
        );

    const activeNode =
        document.getElementById(
            `stepNode${stepNumber}`
        );

    if (activeStep) {
        activeStep.classList.add(
            'active'
        );
    }

    if (activeNode) {
        activeNode.classList.add(
            'active'
        );
    }

    for (
        let i = 1;
        i < stepNumber;
        i++
    ) {

        const node =
            document.getElementById(
                `stepNode${i}`
            );

        if (node) {
            node.classList.add(
                'completed'
            );
        }
    }

    for (
        let i = stepNumber;
        i <= 4;
        i++
    ) {

        const node =
            document.getElementById(
                `stepNode${i}`
            );

        if (
            node &&
            i !== stepNumber
        ) {
            node.classList.remove(
                'completed'
            );
        }
    }

    const fill =
        document.getElementById(
            'sellStepFill'
        );

    if (fill) {

        fill.style.width =
            `${stepNumber * 25}%`;
    }

    if (stepNumber === 4) {
        buildListingSummary();
    }
}


/* ==========================================================================
   SONRAKİ ADIM
   ========================================================================== */

function nextSellStep() {

    const current =
        listingState.currentSellStep;

    if (!validateSellStep(current)) {
        return;
    }

    if (current < 4) {
        goToSellStep(
            current + 1
        );
    }
}


/* ==========================================================================
   ÖNCEKİ ADIM
   ========================================================================== */

function previousSellStep() {

    const current =
        listingState.currentSellStep;

    if (current > 1) {
        goToSellStep(
            current - 1
        );
    }
}


/* ==========================================================================
   ADIM DOĞRULAMA
   ========================================================================== */

function validateSellStep(step) {

    if (step === 1) {

        const brand =
            getFieldValue('addBrand');

        const model =
            getFieldValue('addModel');

        const price =
            getNumberValue('addPrice');

        const year =
            getNumberValue('addYear');

        if (!brand) {

            alert(
                'Lütfen marka seçiniz.'
            );

            document
                .getElementById('addBrand')
                ?.focus();

            return false;
        }

        if (!model) {

            alert(
                'Lütfen model seçiniz.'
            );

            document
                .getElementById('addModel')
                ?.focus();

            return false;
        }

        if (
            !price ||
            price <= 0
        ) {

            alert(
                'Lütfen geçerli bir fiyat giriniz.'
            );

            document
                .getElementById('addPrice')
                ?.focus();

            return false;
        }

        const currentYear =
            new Date().getFullYear();

        if (
            !year ||
            year < 1990 ||
            year > currentYear + 1
        ) {

            alert(
                'Lütfen geçerli bir model yılı seçiniz.'
            );

            document
                .getElementById('addYear')
                ?.focus();

            return false;
        }

        return true;
    }


    if (step === 2) {

        const km =
            getFieldValue('addKm');

        const fuel =
            getFieldValue('addFuel');

        const trans =
            getFieldValue('addTrans');

        if (
            km === '' ||
            Number(km) < 0
        ) {

            alert(
                'Lütfen kilometre bilgisini giriniz.'
            );

            document
                .getElementById('addKm')
                ?.focus();

            return false;
        }

        if (!fuel) {

            alert(
                'Lütfen yakıt tipini seçiniz.'
            );

            document
                .getElementById('addFuel')
                ?.focus();

            return false;
        }

        if (!trans) {

            alert(
                'Lütfen vites tipini seçiniz.'
            );

            document
                .getElementById('addTrans')
                ?.focus();

            return false;
        }

        return true;
    }


    if (step === 3) {

        if (
            listingState.uploadedImages.length === 0
        ) {

            const answer =
                confirm(
                    'Henüz fotoğraf eklemediniz.\n\n' +
                    'Fotoğrafsız ilan yayınlamak ister misiniz?'
                );

            if (!answer) {
                return false;
            }
        }

        return true;
    }

    return true;
}


/* ==========================================================================
   FOTOĞRAF YÜKLEME
   ========================================================================== */

function handleImageUpload(event) {

    if (
        !event ||
        !event.target
    ) {
        return;
    }

    const files =
        Array.from(
            event.target.files || []
        );

    if (!files.length) {
        return;
    }

    const remainingSlots =
        MAX_IMAGES -
        listingState.uploadedImages.length;

    if (remainingSlots <= 0) {

        alert(
            `En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz.`
        );

        event.target.value = '';

        return;
    }

    const selectedFiles =
        files.slice(
            0,
            remainingSlots
        );

    if (
        files.length >
        remainingSlots
    ) {

        alert(
            `En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz. ` +
            `${remainingSlots} fotoğraf eklenecek.`
        );
    }

    selectedFiles.forEach(file => {

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                `"${file.name}" desteklenmeyen bir format.\n\n` +
                'JPG, PNG veya WEBP kullanın.'
            );

            return;
        }

        if (
            file.size >
            MAX_FILE_SIZE
        ) {

            alert(
                `"${file.name}" çok büyük.\n\n` +
                'Tek fotoğraf maksimum 8 MB olabilir.'
            );

            return;
        }

        const imageId =
            `${Date.now()}_${Math.random()
                .toString(36)
                .slice(2)}`;

        const reader =
            new FileReader();

        reader.onload =
            function (e) {

                listingState.uploadedImages.push({

                    id: imageId,

                    data: e.target.result,

                    name: file.name
                });

                renderImagePreviews();

                updateImageCounter();
            };

        reader.onerror =
            function () {

                alert(
                    `"${file.name}" yüklenemedi.`
                );
            };

        reader.readAsDataURL(file);
    });

    event.target.value = '';
}


/* ==========================================================================
   FOTOĞRAF ÖNİZLEME
   ========================================================================== */

function renderImagePreviews() {

    const previewGrid =
        document.getElementById(
            'imgPreviewGrid'
        );

    if (!previewGrid) {
        return;
    }

    previewGrid.innerHTML = '';

    listingState.uploadedImages.forEach(
        (image, index) => {

            const card =
                document.createElement(
                    'div'
                );

            card.className =
                'image-preview-card';

            card.dataset.imageId =
                image.id;

            card.innerHTML = `

                <img
                    src="${image.data}"
                    alt="İlan fotoğrafı ${index + 1}"
                >

                <div class="listing-image-badge">
                    ${
                        index === 0
                            ? 'ANA FOTOĞRAF'
                            : index + 1
                    }
                </div>

                <button
                    type="button"
                    onclick="removeImageById('${image.id}')"
                    aria-label="Fotoğrafı sil"
                >
                    ×
                </button>
            `;

            previewGrid.appendChild(
                card
            );
        }
    );
}


/* ==========================================================================
   FOTOĞRAF SİL
   ========================================================================== */

function removeImageById(imageId) {

    listingState.uploadedImages =
        listingState.uploadedImages.filter(
            image =>
                image.id !== imageId
        );

    renderImagePreviews();

    updateImageCounter();
}


function removeImage(index) {

    if (
        typeof index !== 'number' ||
        index < 0 ||
        index >=
            listingState.uploadedImages.length
    ) {
        return;
    }

    listingState.uploadedImages.splice(
        index,
        1
    );

    renderImagePreviews();

    updateImageCounter();
}


/* ==========================================================================
   FOTOĞRAF SAYACI
   ========================================================================== */

function updateImageCounter() {

    const counter =
        document.getElementById(
            'imageCounter'
        );

    if (!counter) {
        return;
    }

    counter.textContent =
        `${listingState.uploadedImages.length}/${MAX_IMAGES} fotoğraf`;
}


/* ==========================================================================
   İLAN ÖZETİ
   ========================================================================== */

function buildListingSummary() {

    const summary =
        document.getElementById(
            'listingSummary'
        );

    if (!summary) {
        return;
    }

    const brand =
        getFieldValue('addBrand') ||
        '-';

    const model =
        getFieldValue('addModel') ||
        '-';

    const price =
        getNumberValue('addPrice');

    const year =
        getNumberValue('addYear');

    const km =
        getNumberValue('addKm');

    const body =
        getFieldValue('addBody') ||
        'Belirtilmemiş';

    const fuel =
        getFieldValue('addFuel') ||
        'Belirtilmemiş';

    const trans =
        getFieldValue('addTrans') ||
        'Belirtilmemiş';

    const color =
        getFieldValue('addColor') ||
        'Belirtilmemiş';

    const damage =
        getFieldValue('addDamage') ||
        'Belirtilmemiş';

    const tramer =
        getNumberValue('addTramer');

    const description =
        getFieldValue('addDesc') ||
        'Açıklama eklenmemiş.';

    const features =
        getCheckedFeatures();

    const formattedPrice =
        price > 0
            ? new Intl.NumberFormat(
                'tr-TR'
            ).format(price) + ' TL'
            : '-';

    const formattedKm =
        new Intl.NumberFormat(
            'tr-TR'
        ).format(km) + ' km';

    const formattedTramer =
        new Intl.NumberFormat(
            'tr-TR'
        ).format(tramer) + ' TL';

    const featureHtml =
        features.length

            ? features.map(
                feature => `
                    <span class="summary-feature">
                        ${escapeHtml(feature)}
                    </span>
                `
            ).join('')

            : '<span>Ek donanım seçilmedi.</span>';

    summary.innerHTML = `

        <div class="listing-summary-grid">

            <div class="listing-summary-item">
                <span>İlan Başlığı</span>
                <strong>
                    ${escapeHtml(year)}
                    ${escapeHtml(brand)}
                    ${escapeHtml(model)}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Fiyat</span>
                <strong class="listing-summary-price">
                    ${formattedPrice}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Kilometre</span>
                <strong>
                    ${formattedKm}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Yakıt</span>
                <strong>
                    ${escapeHtml(fuel)}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Vites</span>
                <strong>
                    ${escapeHtml(trans)}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Kasa</span>
                <strong>
                    ${escapeHtml(body)}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Renk</span>
                <strong>
                    ${escapeHtml(color)}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Hasar Durumu</span>
                <strong>
                    ${escapeHtml(damage)}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Tramer</span>
                <strong>
                    ${formattedTramer}
                </strong>
            </div>

            <div class="listing-summary-item">
                <span>Fotoğraf</span>
                <strong>
                    ${listingState.uploadedImages.length}
                    adet
                </strong>
            </div>

        </div>

        <div class="listing-summary-section">

            <div class="listing-summary-section-title">
                Donanımlar
            </div>

            <div class="listing-summary-features">
                ${featureHtml}
            </div>

        </div>

        <div class="listing-summary-section">

            <div class="listing-summary-section-title">
                Açıklama
            </div>

            <p class="listing-summary-description">
                ${escapeHtml(description)}
            </p>

        </div>
    `;
}


/* ==========================================================================
   TASLAK KAYDET
   ========================================================================== */

function saveListingDraft() {

    const draft = {

        brand:
            getFieldValue('addBrand'),

        model:
            getFieldValue('addModel'),

        price:
            getFieldValue('addPrice'),

        year:
            getFieldValue('addYear'),

        body:
            getFieldValue('addBody'),

        color:
            getFieldValue('addColor'),

        km:
            getFieldValue('addKm'),

        fuel:
            getFieldValue('addFuel'),

        trans:
            getFieldValue('addTrans'),

        damage:
            getFieldValue('addDamage'),

        tramer:
            getFieldValue('addTramer'),

        description:
            getFieldValue('addDesc'),

        features:
            getCheckedFeatures(),

        images:
            listingState.uploadedImages,

        savedAt:
            new Date().toISOString()
    };

    try {

        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(draft)
        );

        alert(
            'Taslağınız kaydedildi.'
        );

    } catch (error) {

        console.warn(
            'Fotoğraflı taslak kaydedilemedi:',
            error
        );

        try {

            const smallDraft = {
                ...draft,
                images: []
            };

            localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify(
                    smallDraft
                )
            );

            alert(
                'Taslak kaydedildi ancak fotoğraflar ' +
                'tarayıcı depolama sınırı nedeniyle kaydedilemedi.'
            );

        } catch (secondError) {

            console.error(
                'Taslak kaydetme hatası:',
                secondError
            );

            alert(
                'Taslak kaydedilemedi. ' +
                'Tarayıcı depolama alanı dolu olabilir.'
            );
        }
    }
}


/* ==========================================================================
   TASLAK YÜKLE
   ========================================================================== */

function loadListingDraft() {

    try {

        const raw =
            localStorage.getItem(
                DRAFT_KEY
            );

        if (!raw) {
            return;
        }

        const draft =
            JSON.parse(raw);

        if (!draft) {
            return;
        }

        const setValue =
            (id, value) => {

                const element =
                    document.getElementById(id);

                if (
                    element &&
                    value !== undefined &&
                    value !== null
                ) {

                    element.value =
                        value;
                }
            };


        setValue(
            'addBrand',
            draft.brand
        );

        updateModelSelect(
            draft.brand,
            draft.model
        );

        setValue(
            'addPrice',
            draft.price
        );

        setValue(
            'addYear',
            draft.year
        );

        setValue(
            'addBody',
            draft.body
        );

        setValue(
            'addColor',
            draft.color
        );

        setValue(
            'addKm',
            draft.km
        );

        setValue(
            'addFuel',
            draft.fuel
        );

        setValue(
            'addTrans',
            draft.trans
        );

        setValue(
            'addDamage',
            draft.damage
        );

        setValue(
            'addTramer',
            draft.tramer
        );

        setValue(
            'addDesc',
            draft.description
        );


        if (
            Array.isArray(
                draft.features
            )
        ) {

            document
                .querySelectorAll(
                    'input[name="feature"]'
                )
                .forEach(
                    input => {

                        input.checked =
                            draft.features.includes(
                                input.value
                            );
                    }
                );
        }


        if (
            Array.isArray(
                draft.images
            )
        ) {

            listingState.uploadedImages =
                draft.images.filter(
                    image =>
                        image &&
                        image.data
                );

            renderImagePreviews();

            updateImageCounter();
        }

    } catch (error) {

        console.warn(
            'Taslak yüklenemedi:',
            error
        );
    }
}


/* ==========================================================================
   TASLAK TEMİZLE
   ========================================================================== */

function clearListingDraft() {

    try {

        localStorage.removeItem(
            DRAFT_KEY
        );

    } catch (error) {

        console.warn(
            'Taslak temizlenemedi:',
            error
        );
    }
}


/* ==========================================================================
   YENİ ARAÇ NESNESİ
   ========================================================================== */

function createNewCarObject() {

    const brand =
        getFieldValue('addBrand');

    const model =
        getFieldValue('addModel');

    const price =
        getNumberValue('addPrice');

    const year =
        getNumberValue('addYear');

    const km =
        getNumberValue('addKm');

    const body =
        getFieldValue('addBody') ||
        'Sedan';

    const fuel =
        getFieldValue('addFuel') ||
        'Benzin';

    const trans =
        getFieldValue('addTrans') ||
        'Otomatik';

    const color =
        getFieldValue('addColor') ||
        'Belirtilmemiş';

    const damage =
        getFieldValue('addDamage') ||
        'Belirtilmemiş';

    const tramer =
        getNumberValue('addTramer');

    const description =
        getFieldValue('addDesc');

    const features =
        getCheckedFeatures();

    const fallbackImage =
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200';

    const imageList =
        listingState.uploadedImages.length

            ? listingState.uploadedImages
                .map(
                    image => image.data
                )

            : [fallbackImage];

    const id =
        Date.now();

    return {

        id,

        brand,

        model,

        title:
            `${year} ${brand} ${model}`,

        price,

        year,

        km,

        img:
            imageList[0],

        image:
            imageList[0],

        images:
            imageList,

        body,

        fuel,

        trans,

        transmission:
            trans,

        color,

        features,

        equipment:
            features,

        damageStatus:
            damage,

        tramer,

        description,

        date:
            new Date()
                .toLocaleDateString(
                    'tr-TR'
                ),

        createdAt:
            new Date().toISOString(),

        source:
            'user_listing',

        isUserListing:
            true,

        featured:
            false,

        seller:
            'Arabamı Bul Kullanıcısı',

        sellerType:
            'Bireysel',

        location:
            'Türkiye',

        city:
            'Türkiye',

        district:
            '',

        expert:
            'Belirtilmemiş',

        engine:
            '',

        power:
            '',

        drive:
            '',

        trim:
            '',

        seg:
            body,

        tco:
            0
    };
}


/* ==========================================================================
   İLANI LOCAL STORAGE'A KAYDET
   ========================================================================== */

function persistNewListing(newCar) {

    try {

        let savedCars =
            JSON.parse(
                localStorage.getItem(
                    MY_LISTINGS_KEY
                ) || '[]'
            );

        if (
            !Array.isArray(savedCars)
        ) {
            savedCars = [];
        }

        savedCars =
            savedCars.filter(
                car =>
                    car.id !== newCar.id
            );

        savedCars.unshift(
            newCar
        );

        localStorage.setItem(
            MY_LISTINGS_KEY,
            JSON.stringify(
                savedCars
            )
        );

        return true;

    } catch (error) {

        console.error(
            'İlan kaydetme hatası:',
            error
        );

        alert(
            'İlan kaydedilirken tarayıcı depolama ' +
            'hatası oluştu.'
        );

        return false;
    }
}


/* ==========================================================================
   KAYITLI İLANLARI ANA VERİYE YÜKLE
   ========================================================================== */

function loadSavedListingsIntoCatalog() {

    try {

        const raw =
            localStorage.getItem(
                MY_LISTINGS_KEY
            );

        if (!raw) {
            return;
        }

        const savedCars =
            JSON.parse(raw);

        if (
            !Array.isArray(
                savedCars
            )
        ) {
            return;
        }

        if (
            !Array.isArray(
                window.dummyCars
            )
        ) {
            return;
        }

        const existingIds =
            new Set(
                window.dummyCars.map(
                    car =>
                        String(car.id)
                )
            );

        const newListings =
            savedCars.filter(
                car =>
                    car &&
                    car.id !== undefined &&
                    !existingIds.has(
                        String(car.id)
                    )
            );

        if (
            newListings.length
        ) {

            window.dummyCars.unshift(
                ...newListings
            );
        }

    } catch (error) {

        console.warn(
            'Kayıtlı ilanlar yüklenemedi:',
            error
        );
    }
}


/* ==========================================================================
   İLANI GLOBAL VERİYE EKLE
   ========================================================================== */

function addListingToGlobalData(
    newCar
) {

    if (
        Array.isArray(
            window.dummyCars
        )
    ) {

        const exists =
            window.dummyCars.some(
                car =>
                    String(car.id) ===
                    String(newCar.id)
            );

        if (!exists) {

            window.dummyCars.unshift(
                newCar
            );
        }
    }


    if (
        Array.isArray(
            window.cars
        )
    ) {

        const exists =
            window.cars.some(
                car =>
                    String(car.id) ===
                    String(newCar.id)
            );

        if (!exists) {

            window.cars.unshift(
                newCar
            );
        }
    }


    try {

        window.dispatchEvent(
            new CustomEvent(
                'arabamiBulListingsUpdated',
                {
                    detail: newCar
                }
            )
        );

    } catch (error) {

        console.warn(
            'Listing event gönderilemedi:',
            error
        );
    }
}


/* ==========================================================================
   FORM SIFIRLA
   ========================================================================== */

function resetListingForm() {

    /*
       Mevcut HTML'deki gerçek form ID:
       listingForm
    */

    const form =
        document.getElementById(
            'listingForm'
        );

    if (form) {
        form.reset();
    }

    listingState.uploadedImages = [];

    const previewGrid =
        document.getElementById(
            'imgPreviewGrid'
        );

    if (previewGrid) {
        previewGrid.innerHTML = '';
    }

    updateImageCounter();

    document
        .querySelectorAll(
            'input[name="feature"]'
        )
        .forEach(
            input => {
                input.checked = false;
            }
        );

    const model =
        document.getElementById(
            'addModel'
        );

    if (model) {
        model.value = '';
        model.disabled = true;
    }

    clearListingDraft();

    goToSellStep(1);
}


/* ==========================================================================
   İLAN YAYINLA
   ========================================================================== */

function submitNewCar(event) {

    if (event) {
        event.preventDefault();
    }

    for (
        let step = 1;
        step <= 3;
        step++
    ) {

        if (
            !validateSellStep(
                step
            )
        ) {

            goToSellStep(
                step
            );

            return;
        }
    }


    const newCar =
        createNewCarObject();


    const saved =
        persistNewListing(
            newCar
        );

    if (!saved) {
        return;
    }


    addListingToGlobalData(
        newCar
    );


    clearListingDraft();


    alert(
        '🎉 İlanınız başarıyla yayınlandı!\n\n' +
        `${newCar.year} ${newCar.brand} ${newCar.model}`
    );


    resetListingForm();


    if (
        typeof go === 'function'
    ) {

        setTimeout(
            () => {
                go('browse');
            },
            150
        );
    }
}


/* ==========================================================================
   SAYFA AÇILIŞI
   ========================================================================== */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        /*
           Önce seçim alanlarını oluştur.
        */

        initializeListingSelectors();


        /*
           Sonra kayıtlı ilanları yükle.
        */

        loadSavedListingsIntoCatalog();


        /*
           İlk adım.
        */

        goToSellStep(1);


        /*
           Fotoğraf sayacı.
        */

        updateImageCounter();


        /*
           Taslak.
        */

        loadListingDraft();
    }
);


/* ==========================================================================
   İLAN GÜNCELLENDİ EVENT
   ========================================================================== */

window.addEventListener(
    'arabamiBulListingsUpdated',
    function () {

        try {

            if (
                typeof renderBrowse === 'function'
            ) {

                renderBrowse();
            }

        } catch (error) {

            console.warn(
                'Browse yenilenemedi:',
                error
            );
        }


        try {

            if (
                typeof renderCars === 'function'
            ) {

                renderCars();
            }

        } catch (error) {

            console.warn(
                'Araç listesi yenilenemedi:',
                error
            );
        }
    }
);
