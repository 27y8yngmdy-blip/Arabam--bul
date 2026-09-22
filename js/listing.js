/* ==========================================================================
   ARABAMI BUL V2 — listing.js
   İlan Ver / Araç Ekle Modülü
   ========================================================================== */

'use strict';


/* ==========================================================================
   MODÜL DURUMU
   app.js ile çakışmaması için let/const global değişken kullanılmıyor.
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
   YARDIMCI
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
        String(value).replace(/\./g, '').replace(',', '.')
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


/* ==========================================================================
   GÜVENLİ HTML
   ========================================================================== */

function escapeHtml(value) {

    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


/* ==========================================================================
   ADIM YÖNETİMİ
   ========================================================================== */

function goToSellStep(stepNumber) {

    if (stepNumber < 1 || stepNumber > 4) {
        return;
    }

    listingState.currentSellStep = stepNumber;

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


    const activeStep =
        document.getElementById(`sellStep${stepNumber}`);

    const activeNode =
        document.getElementById(`stepNode${stepNumber}`);


    if (activeStep) {
        activeStep.classList.add('active');
    }

    if (activeNode) {
        activeNode.classList.add('active');
    }


    // Önceki adımlar tamamlandı
    for (let i = 1; i < stepNumber; i++) {

        const node =
            document.getElementById(`stepNode${i}`);

        if (node) {
            node.classList.add('completed');
        }
    }


    // Sonraki adımları temizle
    for (let i = stepNumber; i <= 4; i++) {

        const node =
            document.getElementById(`stepNode${i}`);

        if (node && i !== stepNumber) {
            node.classList.remove('completed');
        }
    }


    // Progress
    const fill =
        document.getElementById('sellStepFill');

    if (fill) {
        fill.style.width = `${stepNumber * 25}%`;
    }


    // Son adım
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
        goToSellStep(current + 1);
    }
}


/* ==========================================================================
   ÖNCEKİ ADIM
   ========================================================================== */

function previousSellStep() {

    const current =
        listingState.currentSellStep;

    if (current > 1) {
        goToSellStep(current - 1);
    }
}


/* ==========================================================================
   ADIM DOĞRULAMA
   ========================================================================== */

function validateSellStep(step) {


    /* ----------------------------------------------------------------------
       STEP 1
       ---------------------------------------------------------------------- */

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

            alert('Lütfen marka seçiniz.');

            document
                .getElementById('addBrand')
                ?.focus();

            return false;
        }


        if (!model) {

            alert('Lütfen model bilgisini giriniz.');

            document
                .getElementById('addModel')
                ?.focus();

            return false;
        }


        if (!price || price <= 0) {

            alert('Lütfen geçerli bir fiyat giriniz.');

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

            alert('Lütfen geçerli bir model yılı giriniz.');

            document
                .getElementById('addYear')
                ?.focus();

            return false;
        }


        return true;
    }


    /* ----------------------------------------------------------------------
       STEP 2
       ---------------------------------------------------------------------- */

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

            alert('Lütfen kilometre bilgisini giriniz.');

            document
                .getElementById('addKm')
                ?.focus();

            return false;
        }


        if (!fuel) {

            alert('Lütfen yakıt tipini seçiniz.');

            document
                .getElementById('addFuel')
                ?.focus();

            return false;
        }


        if (!trans) {

            alert('Lütfen vites tipini seçiniz.');

            document
                .getElementById('addTrans')
                ?.focus();

            return false;
        }


        return true;
    }


    /* ----------------------------------------------------------------------
       STEP 3
       ---------------------------------------------------------------------- */

    if (step === 3) {

        if (listingState.uploadedImages.length === 0) {

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

    if (!event || !event.target) {
        return;
    }


    const files =
        Array.from(event.target.files || []);


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
        files.slice(0, remainingSlots);


    if (files.length > remainingSlots) {

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


        if (!allowedTypes.includes(file.type)) {

            alert(
                `"${file.name}" desteklenmeyen bir format.\n\n` +
                'JPG, PNG veya WEBP kullanın.'
            );

            return;
        }


        if (file.size > MAX_FILE_SIZE) {

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


        reader.onload = function (e) {

            listingState.uploadedImages.push({

                id: imageId,

                data: e.target.result,

                name: file.name
            });


            renderImagePreviews();

            updateImageCounter();
        };


        reader.onerror = function () {

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
        document.getElementById('imgPreviewGrid');


    if (!previewGrid) {
        return;
    }


    previewGrid.innerHTML = '';


    listingState.uploadedImages.forEach(
        (image, index) => {

            const card =
                document.createElement('div');


            card.className =
                'image-preview-card';


            card.dataset.imageId =
                image.id;


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
                    ${
                        index === 0
                            ? 'ANA FOTOĞRAF'
                            : index + 1
                    }
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
        }
    );
}


/* ==========================================================================
   FOTOĞRAF SİL
   ========================================================================== */

function removeImageById(imageId) {

    listingState.uploadedImages =
        listingState.uploadedImages.filter(
            image => image.id !== imageId
        );


    renderImagePreviews();

    updateImageCounter();
}


/* ==========================================================================
   ESKİ SİSTEM UYUMLULUĞU
   ========================================================================== */

function removeImage(index) {

    if (
        typeof index !== 'number' ||
        index < 0 ||
        index >= listingState.uploadedImages.length
    ) {
        return;
    }


    listingState.uploadedImages.splice(index, 1);


    renderImagePreviews();

    updateImageCounter();
}


/* ==========================================================================
   FOTOĞRAF SAYACI
   ========================================================================== */

function updateImageCounter() {

    const counter =
        document.getElementById('imageCounter');


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
        document.getElementById('listingSummary');


    if (!summary) {
        return;
    }


    const brand =
        getFieldValue('addBrand') || '-';

    const model =
        getFieldValue('addModel') || '-';

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
            ? new Intl.NumberFormat('tr-TR')
                .format(price) + ' TL'
            : '-';


    const formattedKm =
        new Intl.NumberFormat('tr-TR')
            .format(km) + ' km';


    const formattedTramer =
        new Intl.NumberFormat('tr-TR')
            .format(tramer) + ' TL';


    const featureHtml =
        features.length

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
                    ${escapeHtml(feature)}
                </span>
            `).join('')

            : '<span>Ek donanım seçilmedi.</span>';


    summary.innerHTML = `

        <div style="
            display:grid;
            grid-template-columns:
                repeat(auto-fit,minmax(180px,1fr));
            gap:12px;
        ">

            <div>
                <small>İlan Başlığı</small>
                <strong>
                    ${escapeHtml(year)}
                    ${escapeHtml(brand)}
                    ${escapeHtml(model)}
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
                    ${escapeHtml(fuel)}
                </strong>
            </div>

            <div>
                <small>Vites</small>
                <strong>
                    ${escapeHtml(trans)}
                </strong>
            </div>

            <div>
                <small>Kasa</small>
                <strong>
                    ${escapeHtml(body)}
                </strong>
            </div>

            <div>
                <small>Renk</small>
                <strong>
                    ${escapeHtml(color)}
                </strong>
            </div>

            <div>
                <small>Hasar Durumu</small>
                <strong>
                    ${escapeHtml(damage)}
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
                    ${listingState.uploadedImages.length}
                    adet
                </strong>
            </div>

        </div>


        <div style="
            margin-top:20px;
            padding-top:20px;
            border-top:1px solid #eee;
        ">

            <small style="
                display:block;
                margin-bottom:8px;
            ">
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

            <small style="
                display:block;
                margin-bottom:8px;
            ">
                Açıklama
            </small>

            <p style="
                margin:0;
                line-height:1.7;
                color:#555;
                white-space:pre-line;
            ">
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
                JSON.stringify(smallDraft)
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
            localStorage.getItem(DRAFT_KEY);


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


        if (Array.isArray(draft.features)) {

            document
                .querySelectorAll('input[name="feature"]')
                .forEach(input => {

                    input.checked =
                        draft.features.includes(
                            input.value
                        );
                });
        }


        if (Array.isArray(draft.images)) {

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
                .map(image => image.data)

            : [fallbackImage];


    const id =
        Date.now();


    /*
       ÖNEMLİ:

       Burada hem eski hem yeni veri isimlerini
       tutuyoruz.

       Böylece mevcut app.js / kart sistemi
       bozulmuyor.
    */

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
                .toLocaleDateString('tr-TR'),

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


        if (!Array.isArray(savedCars)) {
            savedCars = [];
        }


        /*
           Aynı ID varsa tekrar ekleme
        */

        savedCars =
            savedCars.filter(
                car => car.id !== newCar.id
            );


        savedCars.unshift(newCar);


        localStorage.setItem(
            MY_LISTINGS_KEY,
            JSON.stringify(savedCars)
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


        if (!Array.isArray(savedCars)) {
            return;
        }


        if (
            !Array.isArray(window.dummyCars)
        ) {
            return;
        }


        /*
           Daha önce yüklenmiş user listingleri
           tekrar eklemiyoruz.
        */

        const existingIds =
            new Set(
                window.dummyCars.map(
                    car => String(car.id)
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


        if (newListings.length) {

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

function addListingToGlobalData(newCar) {

    /*
       Ana araç dizisi
    */

    if (
        Array.isArray(window.dummyCars)
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


    /*
       Eski sistem cars kullanıyorsa
       onu da destekle.
    */

    if (
        Array.isArray(window.cars)
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


    /*
       Diğer modüllere haber ver
    */

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

    const form =
        document.getElementById('sellForm');


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
        .forEach(input => {

            input.checked = false;
        });


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


    /*
       1 → 2 → 3 kontrolleri
    */

    for (
        let step = 1;
        step <= 3;
        step++
    ) {

        if (!validateSellStep(step)) {

            goToSellStep(step);

            return;
        }
    }


    /*
       Araç oluştur
    */

    const newCar =
        createNewCarObject();


    /*
       LocalStorage
    */

    const saved =
        persistNewListing(newCar);


    if (!saved) {
        return;
    }


    /*
       Ana katalog
    */

    addListingToGlobalData(
        newCar
    );


    /*
       Taslağı sil
    */

    clearListingDraft();


    /*
       Kullanıcıya bilgi
    */

    alert(
        '🎉 İlanınız başarıyla yayınlandı!\n\n' +
        `${newCar.year} ${newCar.brand} ${newCar.model}`
    );


    /*
       Formu temizle
    */

    resetListingForm();


    /*
       Araçlar sayfasına git
    */

    if (typeof go === 'function') {

        setTimeout(() => {

            go('browse');

        }, 150);
    }
}


/* ==========================================================================
   SAYFA AÇILIŞI
   ========================================================================== */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        /*
           Önceden yayınlanmış ilanları
           ana araç listesine getir.
        */

        loadSavedListingsIntoCatalog();


        /*
           İlk adım
        */

        goToSellStep(1);


        /*
           Fotoğraf sayacı
        */

        updateImageCounter();


        /*
           Taslak
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

        /*
           Browse varsa yenile
        */

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


        /*
           Ana araç listesi varsa yenile
        */

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
