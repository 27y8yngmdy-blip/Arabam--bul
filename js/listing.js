/* ==========================================================================
   ARABAMI BUL V2
   js/listing.js
   Gelişmiş İlan Verme Modülü
   - Multi Step
   - Fotoğraf yönetimi
   - Form doğrulama
   - İlan önizleme
   - LocalStorage
   - Global araç listesine ekleme
   ========================================================================== */

(function () {
    'use strict';

    /* ============================================================
       GLOBAL STATE
       ============================================================ */

    let uploadedImages = [];
    let currentPreviewCar = null;

    window.uploadedImages = uploadedImages;


    /* ============================================================
       YARDIMCI FONKSİYONLAR
       ============================================================ */

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function getNumber(id) {
        const value = getValue(id).replace(/\./g, '').replace(/,/g, '');
        return Number(value) || 0;
    }

    function showMessage(message, type = 'error') {
        const oldMessage = document.getElementById('listingFormMessage');

        if (oldMessage) {
            oldMessage.remove();
        }

        const messageEl = document.createElement('div');

        messageEl.id = 'listingFormMessage';
        messageEl.textContent = message;

        messageEl.style.cssText = `
            position: fixed;
            top: 85px;
            right: 20px;
            z-index: 99999;
            max-width: 420px;
            padding: 15px 18px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            line-height: 1.5;
            box-shadow: 0 10px 30px rgba(0,0,0,.15);
            background: ${type === 'success' ? '#ecfdf3' : '#fff1f2'};
            color: ${type === 'success' ? '#087443' : '#b42318'};
            border: 1px solid ${type === 'success' ? '#abefc6' : '#fecdca'};
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3500);
    }

    function formatPrice(value) {
        return Number(value || 0).toLocaleString('tr-TR') + ' TL';
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString('tr-TR');
    }


    /* ============================================================
       ADIM YÖNETİMİ
       ============================================================ */

    function goToSellStep(stepNumber) {

        stepNumber = Math.max(1, Math.min(4, Number(stepNumber)));

        for (let i = 1; i <= 4; i++) {

            const stepEl = document.getElementById(`sellStep${i}`);
            const nodeEl = document.getElementById(`stepNode${i}`);

            if (stepEl) {
                stepEl.classList.toggle(
                    'active',
                    i === stepNumber
                );
            }

            if (nodeEl) {
                nodeEl.classList.toggle(
                    'active',
                    i === stepNumber
                );
            }
        }

        const fillEl = document.getElementById('sellStepFill');

        if (fillEl) {
            fillEl.style.width = `${stepNumber * 25}%`;
        }

        // Adım değişince yukarı çık
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    window.goToSellStep = goToSellStep;


    /* ============================================================
       ADIM DOĞRULAMA
       ============================================================ */

    function validateStep(stepNumber) {

        // 1 — Fotoğraf
        if (stepNumber === 1) {

            if (uploadedImages.length === 0) {
                showMessage(
                    'Lütfen ilanınız için en az 1 araç fotoğrafı ekleyin.'
                );
                return false;
            }

            return true;
        }


        // 2 — Araç bilgileri
        if (stepNumber === 2) {

            const brand = getValue('addBrand');
            const model = getValue('addModel');
            const price = getNumber('addPrice');
            const year = getNumber('addYear');

            if (!brand) {
                showMessage('Lütfen araç markasını seçin.');
                return false;
            }

            if (!model) {
                showMessage('Lütfen araç modelini girin.');
                return false;
            }

            if (!price || price <= 0) {
                showMessage('Lütfen geçerli bir araç fiyatı girin.');
                return false;
            }

            if (!year || year < 1950 || year > new Date().getFullYear() + 1) {
                showMessage('Lütfen geçerli bir model yılı girin.');
                return false;
            }

            return true;
        }


        // 3 — Araç detayları
        if (stepNumber === 3) {

            const km = getNumber('addKm');

            if (km < 0) {
                showMessage('Kilometre bilgisi geçerli değil.');
                return false;
            }

            return true;
        }


        // 4 — İlan açıklaması
        if (stepNumber === 4) {

            const description = getValue('addDesc');

            if (description.length < 20) {
                showMessage(
                    'İlan açıklaması en az 20 karakter olmalıdır.'
                );
                return false;
            }

            return true;
        }

        return true;
    }


    /* ============================================================
       SONRAKİ ADIM
       ============================================================ */

    function nextSellStep(currentStep) {

        if (!validateStep(currentStep)) {
            return;
        }

        goToSellStep(Number(currentStep) + 1);
    }

    window.nextSellStep = nextSellStep;


    /* ============================================================
       ÖNCEKİ ADIM
       ============================================================ */

    function previousSellStep(currentStep) {
        goToSellStep(Number(currentStep) - 1);
    }

    window.previousSellStep = previousSellStep;


    /* ============================================================
       FOTOĞRAF YÜKLEME
       ============================================================ */

    function handleImageUpload(event) {

        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        const maxImages = 12;

        if (uploadedImages.length + files.length > maxImages) {

            showMessage(
                `En fazla ${maxImages} fotoğraf yükleyebilirsiniz.`
            );

            event.target.value = '';
            return;
        }

        files.forEach(file => {

            if (!file.type.startsWith('image/')) {

                showMessage(
                    `${file.name} bir resim dosyası değil.`
                );

                return;
            }

            // 8 MB sınırı
            if (file.size > 8 * 1024 * 1024) {

                showMessage(
                    `${file.name} 8 MB'dan büyük olduğu için eklenemedi.`
                );

                return;
            }

            const reader = new FileReader();

            reader.onload = function (e) {

                uploadedImages.push({
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    name: file.name
                });

                renderImagePreview();

                window.uploadedImages = uploadedImages;
            };

            reader.readAsDataURL(file);
        });

        event.target.value = '';
    }

    window.handleImageUpload = handleImageUpload;


    /* ============================================================
       FOTOĞRAF ÖNİZLEME
       ============================================================ */

    function renderImagePreview() {

        const previewGrid =
            document.getElementById('imgPreviewGrid');

        if (!previewGrid) {
            return;
        }

        previewGrid.innerHTML = '';

        uploadedImages.forEach((image, index) => {

            const card = document.createElement('div');

            card.className = 'listing-image-preview';
            card.dataset.index = index;

            card.style.cssText = `
                position: relative;
                width: 120px;
                height: 100px;
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid ${index === 0 ? '#e30613' : '#e5e7eb'};
                background: #f8fafc;
                flex: 0 0 auto;
            `;

            card.innerHTML = `

                <img
                    src="${image.src}"
                    alt="Araç fotoğrafı ${index + 1}"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                        display:block;
                    "
                >

                ${index === 0 ? `
                    <span style="
                        position:absolute;
                        left:6px;
                        bottom:6px;
                        background:#e30613;
                        color:#fff;
                        padding:4px 7px;
                        border-radius:6px;
                        font-size:10px;
                        font-weight:700;
                    ">
                        KAPAK
                    </span>
                ` : ''}

                <button
                    type="button"
                    onclick="removeImage(${index})"
                    aria-label="Fotoğrafı sil"
                    style="
                        position:absolute;
                        top:6px;
                        right:6px;
                        width:25px;
                        height:25px;
                        border:0;
                        border-radius:50%;
                        background:rgba(0,0,0,.72);
                        color:#fff;
                        cursor:pointer;
                        font-size:13px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >
                    ×
                </button>

                ${index !== 0 ? `
                    <button
                        type="button"
                        onclick="setCoverImage(${index})"
                        style="
                            position:absolute;
                            left:6px;
                            top:6px;
                            border:0;
                            background:rgba(255,255,255,.92);
                            color:#17191c;
                            padding:4px 6px;
                            border-radius:5px;
                            cursor:pointer;
                            font-size:9px;
                            font-weight:700;
                        "
                    >
                        Kapak Yap
                    </button>
                ` : ''}
            `;

            previewGrid.appendChild(card);
        });
    }


    /* ============================================================
       FOTOĞRAF SİL
       ============================================================ */

    function removeImage(index) {

        if (
            index < 0 ||
            index >= uploadedImages.length
        ) {
            return;
        }

        uploadedImages.splice(index, 1);

        renderImagePreview();

        window.uploadedImages = uploadedImages;
    }

    window.removeImage = removeImage;


    /* ============================================================
       KAPAK FOTOĞRAFI
       ============================================================ */

    function setCoverImage(index) {

        if (
            index < 0 ||
            index >= uploadedImages.length
        ) {
            return;
        }

        const selected = uploadedImages.splice(index, 1)[0];

        uploadedImages.unshift(selected);

        renderImagePreview();

        showMessage(
            'Kapak fotoğrafı değiştirildi.',
            'success'
        );
    }

    window.setCoverImage = setCoverImage;


    /* ============================================================
       ARAÇ VERİSİNİ TOPLA
       ============================================================ */

    function collectCarData() {

        const selectedFeatures = [];

        document
            .querySelectorAll('input[name="feature"]:checked')
            .forEach(cb => {

                selectedFeatures.push(cb.value);
            });


        const brand = getValue('addBrand');
        const model = getValue('addModel');
        const price = getNumber('addPrice');
        const year = getNumber('addYear');

        const images = uploadedImages.map(image => image.src);

        return {

            id:
                `user-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            brand,

            model,

            title:
                `${year} ${brand} ${model}`,

            price,

            year,

            km:
                getNumber('addKm'),

            color:
                getValue('addColor') ||
                'Belirtilmemiş',

            body:
                getValue('addBody') ||
                'Sedan',

            fuel:
                getValue('addFuel') ||
                'Benzin',

            transmission:
                getValue('addTrans') ||
                'Otomatik',

            features:
                selectedFeatures,

            damageStatus:
                getValue('addDamage') ||
                'Belirtilmemiş',

            tramer:
                getNumber('addTramer'),

            description:
                getValue('addDesc'),

            image:
                images[0] ||
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000',

            images:
                images.length
                    ? images
                    : [
                        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000'
                    ],

            date:
                new Date().toLocaleDateString('tr-TR'),

            createdAt:
                new Date().toISOString(),

            source:
                'user-listing',

            isUserListing:
                true
        };
    }


    /* ============================================================
       İLAN ÖNİZLEMESİ
       ============================================================ */

    function showListingPreview(car) {

        currentPreviewCar = car;

        let modal =
            document.getElementById('listingPreviewModal');

        if (!modal) {

            modal = document.createElement('div');

            modal.id = 'listingPreviewModal';

            modal.innerHTML = `
                <div class="listing-preview-backdrop"></div>

                <div class="listing-preview-box">

                    <button
                        type="button"
                        class="listing-preview-close"
                        id="listingPreviewClose"
                    >
                        ×
                    </button>

                    <div class="listing-preview-header">
                        <span>İlan Önizleme</span>
                        <small>Yayınlamadan önce kontrol edin</small>
                    </div>

                    <div
                        id="listingPreviewContent"
                        class="listing-preview-content"
                    ></div>

                    <div class="listing-preview-actions">

                        <button
                            type="button"
                            id="listingPreviewEdit"
                        >
                            Düzenle
                        </button>

                        <button
                            type="button"
                            id="listingPreviewPublish"
                        >
                            İlanı Yayınla
                        </button>

                    </div>

                </div>
            `;

            document.body.appendChild(modal);

            document
                .getElementById('listingPreviewClose')
                .onclick = closeListingPreview;

            document
                .querySelector('.listing-preview-backdrop')
                .onclick = closeListingPreview;

            document
                .getElementById('listingPreviewEdit')
                .onclick = closeListingPreview;

            document
                .getElementById('listingPreviewPublish')
                .onclick = function () {

                    closeListingPreview();

                    publishCar(currentPreviewCar);
                };
        }

        const content =
            document.getElementById(
                'listingPreviewContent'
            );

        if (!content) return;


        content.innerHTML = `

            <div class="listing-preview-main">

                <div class="listing-preview-image">

                    <img
                        src="${car.image}"
                        alt="${car.title}"
                    >

                </div>

                <div class="listing-preview-info">

                    <h2>${car.title}</h2>

                    <div class="listing-preview-price">
                        ${formatPrice(car.price)}
                    </div>

                    <div class="listing-preview-specs">

                        <span>
                            <b>Yıl</b>
                            ${car.year}
                        </span>

                        <span>
                            <b>KM</b>
                            ${formatNumber(car.km)}
                        </span>

                        <span>
                            <b>Yakıt</b>
                            ${car.fuel}
                        </span>

                        <span>
                            <b>Vites</b>
                            ${car.transmission}
                        </span>

                        <span>
                            <b>Kasa</b>
                            ${car.body}
                        </span>

                        <span>
                            <b>Renk</b>
                            ${car.color}
                        </span>

                    </div>

                </div>

            </div>

            <div class="listing-preview-section">

                <h3>Açıklama</h3>

                <p>
                    ${car.description || 'Açıklama belirtilmedi.'}
                </p>

            </div>

            <div class="listing-preview-section">

                <h3>Hasar / Ekspertiz</h3>

                <p>
                    Durum: <strong>${car.damageStatus}</strong>
                    <br>
                    Tramer:
                    <strong>${formatPrice(car.tramer)}</strong>
                </p>

            </div>

            ${
                car.features.length
                    ? `
                    <div class="listing-preview-section">

                        <h3>Öne Çıkan Özellikler</h3>

                        <div class="listing-preview-features">

                            ${car.features
                                .map(
                                    feature =>
                                        `<span>${feature}</span>`
                                )
                                .join('')}

                        </div>

                    </div>
                    `
                    : ''
            }

            <div class="listing-preview-section">

                <h3>Fotoğraflar</h3>

                <div class="listing-preview-gallery">

                    ${car.images
                        .map(
                            image =>
                                `
                                <img
                                    src="${image}"
                                    alt="Araç fotoğrafı"
                                >
                                `
                        )
                        .join('')}

                </div>

            </div>
        `;


        modal.style.display = 'flex';

        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    }

    window.showListingPreview = showListingPreview;


    /* ============================================================
       ÖNİZLEME KAPAT
       ============================================================ */

    function closeListingPreview() {

        const modal =
            document.getElementById(
                'listingPreviewModal'
            );

        if (!modal) return;

        modal.classList.remove('show');

        setTimeout(() => {
            modal.style.display = 'none';
        }, 180);
    }


    /* ============================================================
       İLANI KAYDET
       ============================================================ */

    function saveUserListing(car) {

        try {

            const saved =
                JSON.parse(
                    localStorage.getItem(
                        'my_listings'
                    ) || '[]'
                );

            saved.unshift(car);

            localStorage.setItem(
                'my_listings',
                JSON.stringify(saved)
            );

        } catch (error) {

            console.error(
                'İlan LocalStorage kayıt hatası:',
                error
            );
        }
    }


    /* ============================================================
       GLOBAL ARAÇ LİSTESİNE EKLE
       ============================================================ */

    function addCarToGlobalData(car) {

        try {

            if (
                Array.isArray(window.cars) &&
                !window.cars.some(
                    item => String(item.id) === String(car.id)
                )
            ) {

                window.cars.unshift(car);
            }


            if (
                Array.isArray(window.dummyCars) &&
                !window.dummyCars.some(
                    item => String(item.id) === String(car.id)
                )
            ) {

                window.dummyCars.unshift(car);
            }


            // Bazı eski modüllerde kullanılan isimler
            if (
                Array.isArray(window.AB_Cars) &&
                !window.AB_Cars.some(
                    item => String(item.id) === String(car.id)
                )
            ) {

                window.AB_Cars.unshift(car);
            }

        } catch (error) {

            console.error(
                'Global araç listesine ekleme hatası:',
                error
            );
        }
    }


    /* ============================================================
       İLANI YAYINLA
       ============================================================ */

    function publishCar(car) {

        if (!car) {
            showMessage(
                'İlan bilgileri bulunamadı.'
            );
            return;
        }

        saveUserListing(car);

        addCarToGlobalData(car);

        showMessage(
            '🎉 İlanınız başarıyla yayınlandı!',
            'success'
        );

        resetListingForm();

        setTimeout(() => {

            if (typeof go === 'function') {
                go('browse');
            }

        }, 900);
    }


    /* ============================================================
       FORM SUBMIT
       ============================================================ */

    function submitNewCar(event) {

        if (event) {
            event.preventDefault();
        }

        // Bütün adımları kontrol et
        for (let i = 1; i <= 4; i++) {

            if (!validateStep(i)) {

                goToSellStep(i);

                return;
            }
        }


        const newCar = collectCarData();

        currentPreviewCar = newCar;

        // Direkt yayınlamak yerine önce önizleme
        showListingPreview(newCar);
    }

    window.submitNewCar = submitNewCar;


    /* ============================================================
       FORM RESET
       ============================================================ */

    function resetListingForm() {

        uploadedImages = [];

        window.uploadedImages = uploadedImages;

        const form =
            document.querySelector(
                '#sell form'
            ) ||
            document.querySelector(
                '#sellForm'
            );

        if (form) {
            form.reset();
        }


        const previewGrid =
            document.getElementById(
                'imgPreviewGrid'
            );

        if (previewGrid) {
            previewGrid.innerHTML = '';
        }


        const fileInput =
            document.getElementById(
                'carImgInput'
            );

        if (fileInput) {
            fileInput.value = '';
        }


        currentPreviewCar = null;

        goToSellStep(1);
    }

    window.resetListingForm = resetListingForm;


    /* ============================================================
       SAYFA HAZIR
       ============================================================ */

    function initListingModule() {

        const fileInput =
            document.getElementById(
                'carImgInput'
            );

        if (fileInput) {

            fileInput.addEventListener(
                'change',
                handleImageUpload
            );
        }


        // Önizleme modal CSS'i
        injectPreviewStyles();


        // Mevcut aktif adımı koru
        const activeStep =
            document.querySelector(
                '[id^="sellStep"].active'
            );

        if (!activeStep) {
            goToSellStep(1);
        }
    }


    /* ============================================================
       ÖNİZLEME CSS
       ============================================================ */

    function injectPreviewStyles() {

        if (
            document.getElementById(
                'listingPreviewStyles'
            )
        ) {
            return;
        }

        const style =
            document.createElement('style');

        style.id =
            'listingPreviewStyles';

        style.textContent = `

            #listingPreviewModal {
                position: fixed;
                inset: 0;
                z-index: 100000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                transition: opacity .18s ease;
            }

            #listingPreviewModal.show {
                opacity: 1;
            }

            .listing-preview-backdrop {
                position: absolute;
                inset: 0;
                background: rgba(15, 23, 42, .68);
                backdrop-filter: blur(5px);
            }

            .listing-preview-box {
                position: relative;
                z-index: 2;
                width: min(900px, 100%);
                max-height: 92vh;
                overflow-y: auto;
                background: #fff;
                border-radius: 20px;
                box-shadow: 0 30px 80px rgba(0,0,0,.25);
                padding: 24px;
            }

            .listing-preview-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 38px;
                height: 38px;
                border: 0;
                border-radius: 50%;
                background: #f3f4f6;
                color: #111827;
                font-size: 24px;
                cursor: pointer;
                z-index: 5;
            }

            .listing-preview-header {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding-right: 50px;
                margin-bottom: 22px;
            }

            .listing-preview-header span {
                font-size: 22px;
                font-weight: 800;
                color: #17191c;
            }

            .listing-preview-header small {
                color: #707780;
                font-size: 13px;
            }

            .listing-preview-main {
                display: grid;
                grid-template-columns: 1.2fr 1fr;
                gap: 24px;
                align-items: start;
            }

            .listing-preview-image {
                width: 100%;
                height: 300px;
                overflow: hidden;
                border-radius: 16px;
                background: #f3f4f6;
            }

            .listing-preview-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .listing-preview-info h2 {
                margin: 0 0 12px;
                font-size: 25px;
                line-height: 1.2;
                color: #17191c;
            }

            .listing-preview-price {
                font-size: 25px;
                font-weight: 800;
                color: #e30613;
                margin-bottom: 20px;
            }

            .listing-preview-specs {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            .listing-preview-specs span {
                background: #f8fafc;
                border: 1px solid #e5e7eb;
                border-radius: 10px;
                padding: 10px;
                font-size: 12px;
                color: #667085;
            }

            .listing-preview-specs b {
                display: block;
                color: #17191c;
                margin-bottom: 3px;
                font-size: 11px;
            }

            .listing-preview-section {
                margin-top: 24px;
                padding-top: 20px;
                border-top: 1px solid #eaecf0;
            }

            .listing-preview-section h3 {
                margin: 0 0 10px;
                font-size: 16px;
                color: #17191c;
            }

            .listing-preview-section p {
                margin: 0;
                color: #667085;
                line-height: 1.7;
                font-size: 14px;
            }

            .listing-preview-features {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .listing-preview-features span {
                padding: 7px 10px;
                border-radius: 8px;
                background: #fff1f2;
                color: #b9000b;
                font-size: 12px;
                font-weight: 600;
            }

            .listing-preview-gallery {
                display: flex;
                gap: 10px;
                overflow-x: auto;
                padding-bottom: 5px;
            }

            .listing-preview-gallery img {
                width: 100px;
                height: 75px;
                flex: 0 0 auto;
                object-fit: cover;
                border-radius: 9px;
                border: 1px solid #e5e7eb;
            }

            .listing-preview-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 25px;
                padding-top: 20px;
                border-top: 1px solid #eaecf0;
            }

            .listing-preview-actions button {
                border: 0;
                border-radius: 10px;
                padding: 12px 18px;
                font-weight: 700;
                cursor: pointer;
            }

            #listingPreviewEdit {
                background: #f2f4f7;
                color: #344054;
            }

            #listingPreviewPublish {
                background: #e30613;
                color: #fff;
            }

            @media (max-width: 700px) {

                #listingPreviewModal {
                    padding: 10px;
                }

                .listing-preview-box {
                    padding: 16px;
                    border-radius: 16px;
                    max-height: 95vh;
                }

                .listing-preview-main {
                    grid-template-columns: 1fr;
                }

                .listing-preview-image {
                    height: 220px;
                }

                .listing-preview-actions {
                    flex-direction: column;
                }

                .listing-preview-actions button {
                    width: 100%;
                }
            }

        `;

        document.head.appendChild(style);
    }


    /* ============================================================
       DOM READY
       ============================================================ */

    if (document.readyState === 'loading') {

        document.addEventListener(
            'DOMContentLoaded',
            initListingModule
        );

    } else {

        initListingModule();

    }

})();
