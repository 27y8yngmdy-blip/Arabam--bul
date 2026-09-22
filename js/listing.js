/* ==========================================================================
   ARABAMI BUL V2 — listing.js
   İlan Ver / Araç Ekle Modülü
   ========================================================================== */

'use strict';

let uploadedImages = [];
let currentSellStep = 1;

const MAX_IMAGES = 15;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const DRAFT_KEY = 'arabami_bul_listing_draft';
const MY_LISTINGS_KEY = 'my_listings';


/* ==========================================================================
   YARDIMCI FONKSİYONLAR
   ========================================================================== */

function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function getNumberValue(id) {
    const value = getFieldValue(id);
    return value ? Number(value) : 0;
}

function getCheckedFeatures() {
    return Array.from(
        document.querySelectorAll('input[name="feature"]:checked')
    ).map(input => input.value);
}


/* ==========================================================================
   ADIM YÖNETİMİ
   ========================================================================== */

function goToSellStep(stepNumber) {

    if (stepNumber < 1 || stepNumber > 4) return;

    currentSellStep = stepNumber;

    // Tüm adımları kapat
    for (let i = 1; i <= 4; i++) {

        const step = document.getElementById(`sellStep${i}`);
        const node = document.getElementById(`stepNode${i}`);

        if (step) {
            step.classList.remove('active');
        }

        if (node) {
            node.classList.remove('active');
        }
    }

    // Aktif adım
    const activeStep = document.getElementById(`sellStep${stepNumber}`);
    const activeNode = document.getElementById(`stepNode${stepNumber}`);

    if (activeStep) {
        activeStep.classList.add('active');
    }

    if (activeNode) {
        activeNode.classList.add('active');
    }

    // Önceki adımlar tamamlandı görünümü
    for (let i = 1; i < stepNumber; i++) {

        const node = document.getElementById(`stepNode${i}`);

        if (node) {
            node.classList.add('completed');
        }
    }

    // Sonraki adımlar completed kalmasın
    for (let i = stepNumber; i <= 4; i++) {

        const node = document.getElementById(`stepNode${i}`);

        if (node && i !== stepNumber) {
            node.classList.remove('completed');
        }
    }

    // Progress bar
    const fill = document.getElementById('sellStepFill');

    if (fill) {
        fill.style.width = `${stepNumber * 25}%`;
    }

    // Son adımda özet oluştur
    if (stepNumber === 4) {
        buildListingSummary();
    }

    // İlan bölümüne kaydır
    const sellSection = document.getElementById('sell');

    if (sellSection) {
        setTimeout(() => {
            sellSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 50);
    }
}


/* ==========================================================================
   SONRAKİ ADIM
   ========================================================================== */

function nextSellStep() {

    if (!validateSellStep(currentSellStep)) {
        return;
    }

    if (currentSellStep < 4) {
        goToSellStep(currentSellStep + 1);
    }
}


/* ==========================================================================
   ÖNCEKİ ADIM
   ========================================================================== */

function previousSellStep() {

    if (currentSellStep > 1) {
        goToSellStep(currentSellStep - 1);
    }
}


/* ==========================================================================
   ADIM KONTROLÜ
   ========================================================================== */

function validateSellStep(step) {

    // STEP 1
    if (step === 1) {

        const brand = getFieldValue('addBrand');
        const model = getFieldValue('addModel');
        const price = getNumberValue('addPrice');
        const year = getNumberValue('addYear');

        if (!brand) {
            alert('Lütfen marka seçiniz.');
            document.getElementById('addBrand')?.focus();
            return false;
        }

        if (!model) {
            alert('Lütfen model bilgisini giriniz.');
            document.getElementById('addModel')?.focus();
            return false;
        }

        if (!price || price <= 0) {
            alert('Lütfen geçerli bir fiyat giriniz.');
            document.getElementById('addPrice')?.focus();
            return false;
        }

        if (!year || year < 1990 || year > new Date().getFullYear() + 1) {
            alert('Lütfen geçerli bir model yılı giriniz.');
            document.getElementById('addYear')?.focus();
            return false;
        }

        return true;
    }


    // STEP 2
    if (step === 2) {

        const km = getFieldValue('addKm');
        const fuel = getFieldValue('addFuel');
        const trans = getFieldValue('addTrans');

        if (km === '' || Number(km) < 0) {
            alert('Lütfen kilometre bilgisini giriniz.');
            document.getElementById('addKm')?.focus();
            return false;
        }

        if (!fuel) {
            alert('Lütfen yakıt tipini seçiniz.');
            document.getElementById('addFuel')?.focus();
            return false;
        }

        if (!trans) {
            alert('Lütfen vites tipini seçiniz.');
            document.getElementById('addTrans')?.focus();
            return false;
        }

        return true;
    }


    // STEP 3
    if (step === 3) {

        if (uploadedImages.length === 0) {

            const answer = confirm(
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

    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const remainingSlots = MAX_IMAGES - uploadedImages.length;

    if (remainingSlots <= 0) {

        alert(`En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz.`);

        event.target.value = '';
        return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {

        alert(
            `En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz. ` +
            `${remainingSlots} fotoğraf eklenecek.`
        );
    }

    selectedFiles.forEach(file => {

        // Dosya tipi
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowedTypes.includes(file.type)) {

            alert(
                `"${file.name}" desteklenmeyen bir format.\n\n` +
                'JPG, PNG veya WEBP kullanın.'
            );

            return;
        }

        // Dosya boyutu
        if (file.size > MAX_FILE_SIZE) {

            alert(
                `"${file.name}" çok büyük.\n\n` +
                'Tek fotoğraf maksimum 8 MB olabilir.'
            );

            return;
        }

        const imageId =
            `${Date.now()}_${Math.random().toString(36).slice(2)}`;

        const reader = new FileReader();

        reader.onload = function (e) {

            uploadedImages.push({
                id: imageId,
                data: e.target.result,
                name: file.name
            });

            renderImagePreviews();
            updateImageCounter();
        };

        reader.onerror = function () {

            alert(`"${file.name}" yüklenemedi.`);
        };

        reader.readAsDataURL(file);
    });

    // Input'u temizle
    event.target.value = '';
}


/* ==========================================================================
   FOTOĞRAF ÖNİZLEME
   ========================================================================== */

function renderImagePreviews() {

    const previewGrid = document.getElementById('imgPreviewGrid');

    if (!previewGrid) return;

    previewGrid.innerHTML = '';

    uploadedImages.forEach((image, index) => {

        const card = document.createElement('div');

        card.className = 'image-preview-card';

        card.dataset.imageId = image.id;

        card.style.cssText = `
            position:relative;
            width:100%;
            aspect-ratio:1;
            border-radius:14px;
            overflow:hidden;
            border:1px solid #e5e7eb;
            background:#f3f4f6;
        `;

        card.innerHTML = `
            <img
                src="${image.data}"
                alt="İlan fotoğrafı ${index + 1}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    display:block;
                "
            >

            <div style="
                position:absolute;
                left:8px;
                top:8px;
                padding:4px 7px;
                border-radius:6px;
                background:rgba(0,0,0,.65);
                color:#fff;
                font-size:11px;
                font-weight:700;
            ">
                ${index === 0 ? 'ANA FOTOĞRAF' : index + 1}
            </div>

            <button
                type="button"
                onclick="removeImageById('${image.id}')"
                style="
                    position:absolute;
                    right:8px;
                    top:8px;
                    width:28px;
                    height:28px;
                    border:0;
                    border-radius:50%;
                    background:rgba(0,0,0,.72);
                    color:#fff;
                    cursor:pointer;
                    font-size:15px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                "
                aria-label="Fotoğrafı sil"
            >
                ×
            </button>
        `;

        previewGrid.appendChild(card);
    });
}


/* ==========================================================================
   FOTOĞRAF SİL
   ========================================================================== */

function removeImageById(imageId) {

    uploadedImages = uploadedImages.filter(
        image => image.id !== imageId
    );

    renderImagePreviews();
    updateImageCounter();
}


/* ==========================================================================
   ESKİ FONKSİYONLA UYUMLULUK
   ========================================================================== */

function removeImage(index) {

    if (
        typeof index !== 'number' ||
        index < 0 ||
        index >= uploadedImages.length
    ) {
        return;
    }

    uploadedImages.splice(index, 1);

    renderImagePreviews();
    updateImageCounter();
}


/* ==========================================================================
   FOTOĞRAF SAYACI
   ========================================================================== */

function updateImageCounter() {

    const counter = document.getElementById('imageCounter');

    if (!counter) return;

    counter.textContent =
        `${uploadedImages.length}/${MAX_IMAGES} fotoğraf`;
}


/* ==========================================================================
   İLAN ÖZETİ
   ========================================================================== */

function buildListingSummary() {

    const summary = document.getElementById('listingSummary');

    if (!summary) return;

    const brand = getFieldValue('addBrand') || '-';
    const model = getFieldValue('addModel') || '-';
    const price = getNumberValue('addPrice');
    const year = getNumberValue('addYear');
    const km = getNumberValue('addKm');

    const body =
        getFieldValue('addBody') || 'Belirtilmemiş';

    const fuel =
        getFieldValue('addFuel') || 'Belirtilmemiş';

    const trans =
        getFieldValue('addTrans') || 'Belirtilmemiş';

    const color =
        getFieldValue('addColor') || 'Belirtilmemiş';

    const damage =
        getFieldValue('addDamage') || 'Belirtilmemiş';

    const tramer =
        getNumberValue('addTramer');

    const description =
        getFieldValue('addDesc') || 'Açıklama eklenmemiş.';

    const features = getCheckedFeatures();

    const formattedPrice =
        price > 0
            ? new Intl.NumberFormat('tr-TR').format(price) + ' TL'
            : '-';

    const formattedKm =
        km > 0
            ? new Intl.NumberFormat('tr-TR').format(km) + ' km'
            : '0 km';

    const formattedTramer =
        tramer > 0
            ? new Intl.NumberFormat('tr-TR').format(tramer) + ' TL'
            : '0 TL';

    const featureHtml = features.length
        ? features.map(feature => `
            <span style="
                display:inline-flex;
                padding:6px 10px;
                border-radius:8px;
                background:#fff1f1;
                color:#c62828;
                font-size:12px;
                font-weight:700;
                margin:3px;
            ">
                ${feature}
            </span>
        `).join('')
        : '<span>Ek donanım seçilmedi.</span>';

    summary.innerHTML = `
        <div style="
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
            gap:12px;
        ">

            <div>
                <small>İlan Başlığı</small>
                <strong>
                    ${year} ${brand} ${model}
                </strong>
            </div>

            <div>
                <small>Fiyat</small>
                <strong>
                    ${formattedPrice}
                </strong>
            </div>

            <div>
                <small>Kilometre</small>
                <strong>
                    ${formattedKm}
                </strong>
            </div>

            <div>
                <small>Yakıt</small>
                <strong>
                    ${fuel}
                </strong>
            </div>

            <div>
                <small>Vites</small>
                <strong>
                    ${trans}
                </strong>
            </div>

            <div>
                <small>Kasa</small>
                <strong>
                    ${body}
                </strong>
            </div>

            <div>
                <small>Renk</small>
                <strong>
                    ${color}
                </strong>
            </div>

            <div>
                <small>Hasar Durumu</small>
                <strong>
                    ${damage}
                </strong>
            </div>

            <div>
                <small>Tramer</small>
                <strong>
                    ${formattedTramer}
                </strong>
            </div>

            <div>
                <small>Fotoğraf</small>
                <strong>
                    ${uploadedImages.length} adet
                </strong>
            </div>

        </div>

        <div style="
            margin-top:20px;
            padding-top:20px;
            border-top:1px solid #eee;
        ">
            <small style="display:block;margin-bottom:8px;">
                Donanımlar
            </small>

            <div>
                ${featureHtml}
            </div>
        </div>

        <div style="
            margin-top:20px;
            padding-top:20px;
            border-top:1px solid #eee;
        ">
            <small style="display:block;margin-bottom:8px;">
                Açıklama
            </small>

            <p style="
                margin:0;
                line-height:1.7;
                color:#555;
            ">
                ${description}
            </p>
        </div>
    `;
}


/* ==========================================================================
   TASLAK KAYDET
   ========================================================================== */

function saveListingDraft() {

    const draft = {

        brand: getFieldValue('addBrand'),
        model: getFieldValue('addModel'),
        price: getFieldValue('addPrice'),
        year: getFieldValue('addYear'),
        body: getFieldValue('addBody'),
        color: getFieldValue('addColor'),

        km: getFieldValue('addKm'),
        fuel: getFieldValue('addFuel'),
        trans: getFieldValue('addTrans'),
        damage: getFieldValue('addDamage'),
        tramer: getFieldValue('addTramer'),
        description: getFieldValue('addDesc'),

        features: getCheckedFeatures(),

        images: uploadedImages,

        savedAt: new Date().toISOString()
    };

    try {

        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(draft)
        );

        alert('Taslağınız kaydedildi. Daha sonra kaldığınız yerden devam edebilirsiniz.');

    } catch (error) {

        console.error('Taslak kaydetme hatası:', error);

        // Fotoğraflar yüzünden storage dolarsa
        try {

            const draftWithoutImages = {
                ...draft,
                images: []
            };

            localStorage.setItem(
                DRAFT_KEY,
                JSON.stringify(draftWithoutImages)
            );

            alert(
                'Taslak kaydedildi ancak fotoğraflar tarayıcı depolama sınırı nedeniyle kaydedilemedi.'
            );

        } catch (secondError) {

            alert(
                'Taslak kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.'
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
            localStorage.getItem(DRAFT_KEY);

        if (!raw) return;

        const draft = JSON.parse(raw);

        if (!draft) return;

        const setValue = (id, value) => {

            const element = document.getElementById(id);

            if (element && value !== undefined && value !== null) {
                element.value = value;
            }
        };

        setValue('addBrand', draft.brand);
        setValue('addModel', draft.model);
        setValue('addPrice', draft.price);
        setValue('addYear', draft.year);
        setValue('addBody', draft.body);
        setValue('addColor', draft.color);

        setValue('addKm', draft.km);
        setValue('addFuel', draft.fuel);
        setValue('addTrans', draft.trans);
        setValue('addDamage', draft.damage);
        setValue('addTramer', draft.tramer);
        setValue('addDesc', draft.description);

        // Özellikleri geri yükle
        if (Array.isArray(draft.features)) {

            document
                .querySelectorAll('input[name="feature"]')
                .forEach(input => {

                    input.checked =
                        draft.features.includes(input.value);
                });
        }

        // Fotoğrafları geri yükle
        if (Array.isArray(draft.images)) {

            uploadedImages = draft.images;

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
   TASLAĞI TEMİZLE
   ========================================================================== */

function clearListingDraft() {

    try {
        localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
        console.warn(
            'Taslak temizlenemedi:',
            error
        );
    }
}


/* ==========================================================================
   İLAN OLUŞTUR
   ========================================================================== */

function createNewCarObject() {

    const selectedFeatures = getCheckedFeatures();

    const brand = getFieldValue('addBrand');
    const model = getFieldValue('addModel');
    const price = getNumberValue('addPrice');
    const year = getNumberValue('addYear');
    const km = getNumberValue('addKm');

    const fallbackImage =
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200';

    const imageList =
        uploadedImages.length
            ? uploadedImages.map(image => image.data)
            : [fallbackImage];

    return {

        id: Date.now(),

        brand,
        model,

        title: `${year} ${brand} ${model}`,

        price,
        year,
        km,

        color:
            getFieldValue('addColor') ||
            'Belirtilmemiş',

        body:
            getFieldValue('addBody') ||
            'Sedan',

        fuel:
            getFieldValue('addFuel') ||
            'Benzin',

        transmission:
            getFieldValue('addTrans') ||
            'Otomatik',

        features: selectedFeatures,

        damageStatus:
            getFieldValue('addDamage') ||
            'Belirtilmemiş',

        tramer:
            getNumberValue('addTramer'),

        description:
            getFieldValue('addDesc'),

        image:
            imageList[0],

        images:
            imageList,

        date:
            new Date().toLocaleDateString('tr-TR'),

        createdAt:
            new Date().toISOString(),

        source:
            'user_listing',

        isUserListing:
            true
    };
}


/* ==========================================================================
   İLANI KAYDET
   ========================================================================== */

function persistNewListing(newCar) {

    try {

        let savedCars =
            JSON.parse(
                localStorage.getItem(MY_LISTINGS_KEY) || '[]'
            );

        if (!Array.isArray(savedCars)) {
            savedCars = [];
        }

        savedCars.unshift(newCar);

        localStorage.setItem(
            MY_LISTINGS_KEY,
            JSON.stringify(savedCars)
        );

    } catch (error) {

        console.error(
            'İlan localStorage kaydetme hatası:',
            error
        );

        alert(
            'İlan kaydedilirken tarayıcı depolama hatası oluştu.'
        );

        return false;
    }

    return true;
}


/* ==========================================================================
   GLOBAL ARAÇ VERİSİNE EKLE
   ========================================================================== */

function addListingToGlobalData(newCar) {

    try {

        if (
            typeof cars !== 'undefined' &&
            Array.isArray(cars)
        ) {
            cars.unshift(newCar);
        }

    } catch (error) {

        console.warn(
            'cars dizisine eklenemedi:',
            error
        );
    }


    try {

        if (
            Array.isArray(window.cars) &&
            window.cars.indexOf(newCar) === -1
        ) {
            window.cars.unshift(newCar);
        }

    } catch (error) {

        console.warn(
            'window.cars güncellenemedi:',
            error
        );
    }


    // Diğer modüllere haber ver
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
            'Custom event gönderilemedi:',
            error
        );
    }
}


/* ==========================================================================
   FORM SIFIRLA
   ========================================================================== */

function resetListingForm() {

    const form =
        document.getElementById('sellForm');

    if (form) {
        form.reset();
    }

    uploadedImages = [];

    const previewGrid =
        document.getElementById('imgPreviewGrid');

    if (previewGrid) {
        previewGrid.innerHTML = '';
    }

    updateImageCounter();

    clearListingDraft();

    // Checkboxları garanti olarak temizle
    document
        .querySelectorAll('input[name="feature"]')
        .forEach(input => {
            input.checked = false;
        });

    goToSellStep(1);
}


/* ==========================================================================
   FORM GÖNDER
   ========================================================================== */

function submitNewCar(event) {

    if (event) {
        event.preventDefault();
    }

    // Tüm adımları kontrol et
    for (let step = 1; step <= 3; step++) {

        if (!validateSellStep(step)) {

            goToSellStep(step);
            return;
        }
    }

    const newCar =
        createNewCarObject();

    // Önce kaydet
    const saved =
        persistNewListing(newCar);

    if (!saved) {
        return;
    }

    // Global veri
    addListingToGlobalData(newCar);

    alert(
        '🎉 İlanınız başarıyla yayınlandı!\n\n' +
        `${newCar.year} ${newCar.brand} ${newCar.model}`
    );

    // Formu temizle
    resetListingForm();

    // Araçlar sayfasına git
    if (typeof go === 'function') {

        setTimeout(() => {
            go('browse');
        }, 100);
    }
}


/* ==========================================================================
   SAYFA YÜKLENDİĞİNDE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // Başlangıç adımı
    goToSellStep(1);

    // Fotoğraf sayacı
    updateImageCounter();

    // Daha önce kaydedilmiş taslak
    loadListingDraft();
});


/* ==========================================================================
   GLOBAL EVENT
   ========================================================================== */

window.addEventListener(
    'arabamiBulListingsUpdated',
    function () {

        // Eğer uygulamada render fonksiyonu varsa çalıştır
        try {

            if (typeof renderCars === 'function') {
                renderCars();
            }

        } catch (error) {

            console.warn(
                'Araç listesi yenilenemedi:',
                error
            );
        }

        try {

            if (typeof renderBrowse === 'function') {
                renderBrowse();
            }

        } catch (error) {

            console.warn(
                'Browse yenilenemedi:',
                error
            );
        }
    }
);
