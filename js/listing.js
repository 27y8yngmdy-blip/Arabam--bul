/* ==========================================================================
   ARABAMI BUL V2
   js/listing.js
   Gelişmiş İlan Verme Sistemi
   ========================================================================== */

(function () {
    'use strict';

    /* =========================================================
       GLOBAL STATE
       ========================================================= */

    let uploadedImages = [];
    let currentSellStep = 1;

    const MAX_IMAGES = 15;
    const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB


    /* =========================================================
       YARDIMCI FONKSİYONLAR
       ========================================================= */

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function getNumber(id) {
        const value = getValue(id);
        if (!value) return 0;

        return Number(
            value
                .replace(/\./g, '')
                .replace(',', '.')
        ) || 0;
    }

    function getCheckedFeatures() {
        return Array.from(
            document.querySelectorAll('input[name="feature"]:checked')
        ).map(input => input.value);
    }


    /* =========================================================
       ADIM DEĞİŞTİRME
       ========================================================= */

    function goToSellStep(stepNumber) {

        if (stepNumber < 1 || stepNumber > 4) return;

        /*
         * İleri giderken mevcut adımı kontrol et
         */
        if (stepNumber > currentSellStep) {
            if (!validateSellStep(currentSellStep)) {
                return;
            }
        }

        /*
         * Tüm adımları kapat
         */
        for (let i = 1; i <= 4; i++) {

            const step = document.getElementById(`sellStep${i}`);
            const node = document.getElementById(`stepNode${i}`);

            if (step) {
                step.classList.remove('active');
            }

            if (node) {
                node.classList.remove('active');
                node.classList.remove('completed');
            }
        }

        /*
         * Önceki adımları completed yap
         */
        for (let i = 1; i < stepNumber; i++) {

            const node = document.getElementById(`stepNode${i}`);

            if (node) {
                node.classList.add('completed');
            }
        }

        /*
         * Yeni aktif adım
         */
        const activeStep = document.getElementById(`sellStep${stepNumber}`);
        const activeNode = document.getElementById(`stepNode${stepNumber}`);

        if (activeStep) {
            activeStep.classList.add('active');
        }

        if (activeNode) {
            activeNode.classList.add('active');
        }

        /*
         * Progress bar
         */
        const fill = document.getElementById('sellStepFill');

        if (fill) {
            const percentage = ((stepNumber - 1) / 3) * 100;
            fill.style.width = `${percentage}%`;
        }

        currentSellStep = stepNumber;

        /*
         * Sayfanın üstüne dön
         */
        const sellContainer =
            document.querySelector('.sell-page') ||
            document.querySelector('#sell') ||
            document.querySelector('.form-card');

        if (sellContainer) {
            sellContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        /*
         * Son adıma gelindiyse özeti oluştur
         */
        if (stepNumber === 4) {
            updateListingSummary();
        }
    }


    /* =========================================================
       ADIM DOĞRULAMA
       ========================================================= */

    function validateSellStep(step) {

        /*
         * 1. ADIM
         * Temel araç bilgileri
         */
        if (step === 1) {

            const brand = getValue('addBrand');
            const model = getValue('addModel');
            const price = getNumber('addPrice');
            const year = getNumber('addYear');

            if (!brand) {
                alert('Lütfen araç markasını seçin.');
                focusElement('addBrand');
                return false;
            }

            if (!model) {
                alert('Lütfen araç modelini girin.');
                focusElement('addModel');
                return false;
            }

            if (!price || price <= 0) {
                alert('Lütfen geçerli bir araç fiyatı girin.');
                focusElement('addPrice');
                return false;
            }

            if (!year || year < 1950 || year > new Date().getFullYear() + 1) {
                alert('Lütfen geçerli bir model yılı girin.');
                focusElement('addYear');
                return false;
            }

            return true;
        }


        /*
         * 2. ADIM
         * Teknik bilgiler
         */
        if (step === 2) {

            const km = getNumber('addKm');

            if (km < 0) {
                alert('Kilometre bilgisi geçerli değil.');
                focusElement('addKm');
                return false;
            }

            return true;
        }


        /*
         * 3. ADIM
         * Fotoğraflar
         */
        if (step === 3) {

            if (uploadedImages.length === 0) {

                const continueWithoutPhoto =
                    confirm(
                        'Henüz fotoğraf eklemediniz.\n\n' +
                        'Fotoğrafsız ilan yayınlamak istediğinize emin misiniz?'
                    );

                if (!continueWithoutPhoto) {
                    return false;
                }
            }

            return true;
        }

        return true;
    }


    function focusElement(id) {

        const element = document.getElementById(id);

        if (!element) return;

        setTimeout(() => {
            element.focus();

            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    }


    /* =========================================================
       SONRAKİ / ÖNCEKİ BUTONLARI
       ========================================================= */

    function nextSellStep() {

        if (currentSellStep >= 4) return;

        goToSellStep(currentSellStep + 1);
    }


    function previousSellStep() {

        if (currentSellStep <= 1) return;

        goToSellStep(currentSellStep - 1);
    }


    /* =========================================================
       FOTOĞRAF YÜKLEME
       ========================================================= */

    function handleImageUpload(event) {

        const files = Array.from(event.target.files || []);

        if (!files.length) return;

        const remainingSlots = MAX_IMAGES - uploadedImages.length;

        if (remainingSlots <= 0) {

            alert(
                `En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz.`
            );

            event.target.value = '';
            return;
        }

        const filesToUpload = files.slice(0, remainingSlots);

        if (files.length > remainingSlots) {

            alert(
                `En fazla ${MAX_IMAGES} fotoğraf yükleyebilirsiniz.\n\n` +
                `${remainingSlots} fotoğraf eklenecek.`
            );
        }


        filesToUpload.forEach(file => {

            if (!file.type.startsWith('image/')) {

                alert(
                    `"${file.name}" bir görsel dosyası değil.`
                );

                return;
            }

            if (file.size > MAX_IMAGE_SIZE) {

                alert(
                    `"${file.name}" çok büyük.\n` +
                    `Maksimum dosya boyutu 8 MB.`
                );

                return;
            }


            const reader = new FileReader();

            reader.onload = function (e) {

                const imageData = e.target.result;

                uploadedImages.push({
                    id: `${Date.now()}-${Math.random()}`,
                    name: file.name,
                    data: imageData
                });

                renderImagePreviews();
            };

            reader.onerror = function () {

                alert(
                    `"${file.name}" yüklenirken bir hata oluştu.`
                );
            };

            reader.readAsDataURL(file);
        });

        /*
         * Aynı dosyayı tekrar seçebilmek için
         */
        event.target.value = '';
    }


    /* =========================================================
       FOTOĞRAFLARI GÖSTER
       ========================================================= */

    function renderImagePreviews() {

        const previewGrid =
            document.getElementById('imgPreviewGrid');

        if (!previewGrid) return;

        previewGrid.innerHTML = '';


        uploadedImages.forEach((image, index) => {

            const card = document.createElement('div');

            card.className = 'listing-image-preview';

            card.style.position = 'relative';
            card.style.overflow = 'hidden';


            const img = document.createElement('img');

            img.src = image.data;
            img.alt = `Araç fotoğrafı ${index + 1}`;


            const number = document.createElement('span');

            number.textContent =
                index === 0
                    ? 'Kapak'
                    : `${index + 1}`;


            const deleteButton =
                document.createElement('button');

            deleteButton.type = 'button';
            deleteButton.textContent = '×';
            deleteButton.className =
                'listing-image-delete';


            deleteButton.addEventListener(
                'click',
                function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    removeImage(image.id);
                }
            );


            /*
             * Kapak fotoğrafı yap
             */
            if (index === 0) {
                card.classList.add('cover-image');
            }


            card.appendChild(img);
            card.appendChild(number);
            card.appendChild(deleteButton);

            previewGrid.appendChild(card);
        });


        updateImageCounter();
    }


    /* =========================================================
       FOTOĞRAF SİL
       ========================================================= */

    function removeImage(imageId) {

        uploadedImages =
            uploadedImages.filter(
                image => image.id !== imageId
            );

        renderImagePreviews();
    }


    /* =========================================================
       FOTOĞRAF SAYACI
       ========================================================= */

    function updateImageCounter() {

        const counter =
            document.getElementById('imageCounter');

        if (!counter) return;

        counter.textContent =
            `${uploadedImages.length}/${MAX_IMAGES} fotoğraf`;
    }


    /* =========================================================
       KAPAK FOTOĞRAFI DEĞİŞTİR
       ========================================================= */

    function setCoverImage(index) {

        if (
            index < 0 ||
            index >= uploadedImages.length
        ) {
            return;
        }

        const selected =
            uploadedImages.splice(index, 1)[0];

        uploadedImages.unshift(selected);

        renderImagePreviews();
    }


    /* =========================================================
       İLAN VERİSİNİ TOPLA
       ========================================================= */

    function collectListingData() {

        const selectedFeatures =
            getCheckedFeatures();


        const images =
            uploadedImages.map(
                image => image.data
            );


        const brand = getValue('addBrand');
        const model = getValue('addModel');
        const year = getNumber('addYear');


        const newCar = {

            id: Date.now(),

            /*
             * Temel bilgiler
             */
            brand: brand,
            model: model,

            title:
                `${year} ${brand} ${model}`,

            price:
                getNumber('addPrice'),

            year:
                year,

            km:
                getNumber('addKm'),

            color:
                getValue('addColor') ||
                'Belirtilmemiş',


            /*
             * Teknik bilgiler
             */
            body:
                getValue('addBody') ||
                'Sedan',

            fuel:
                getValue('addFuel') ||
                'Benzin',

            transmission:
                getValue('addTrans') ||
                'Otomatik',


            /*
             * Hasar bilgileri
             */
            damageStatus:
                getValue('addDamage') ||
                'Hatasız',

            tramer:
                getNumber('addTramer'),


            /*
             * Donanımlar
             */
            features:
                selectedFeatures,


            /*
             * Açıklama
             */
            description:
                getValue('addDesc'),


            /*
             * Fotoğraflar
             */
            image:
                images.length
                    ? images[0]
                    : getDefaultCarImage(),

            images:
                images.length
                    ? images
                    : [getDefaultCarImage()],


            /*
             * İlan bilgileri
             */
            date:
                new Date().toLocaleDateString('tr-TR'),

            createdAt:
                new Date().toISOString(),

            sellerType:
                'Bireysel',

            listingStatus:
                'active',

            source:
                'user',

            isUserListing:
                true
        };


        return newCar;
    }


    /* =========================================================
       VARSAYILAN FOTOĞRAF
       ========================================================= */

    function getDefaultCarImage() {

        return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200';
    }


    /* =========================================================
       İLAN ÖZETİ
       ========================================================= */

    function updateListingSummary() {

        const summary =
            document.getElementById('listingSummary');

        if (!summary) return;


        const car =
            collectListingData();


        summary.innerHTML = `

            <div class="listing-summary-card">

                <div class="listing-summary-image">
                    <img
                        src="${car.image}"
                        alt="${escapeHtml(car.title)}"
                    >
                </div>

                <div class="listing-summary-info">

                    <span class="listing-summary-label">
                        İLAN ÖZETİ
                    </span>

                    <h3>
                        ${escapeHtml(car.title)}
                    </h3>

                    <strong>
                        ${formatPrice(car.price)}
                    </strong>

                    <div class="listing-summary-grid">

                        <span>
                            📅 ${car.year}
                        </span>

                        <span>
                            🛣️ ${formatNumber(car.km)} km
                        </span>

                        <span>
                            ⛽ ${escapeHtml(car.fuel)}
                        </span>

                        <span>
                            ⚙️ ${escapeHtml(car.transmission)}
                        </span>

                    </div>

                </div>

            </div>

        `;
    }


    /* =========================================================
       FİYAT FORMAT
       ========================================================= */

    function formatPrice(price) {

        if (!price) return 'Fiyat belirtilmedi';

        return new Intl.NumberFormat(
            'tr-TR'
        ).format(price) + ' TL';
    }


    function formatNumber(number) {

        return new Intl.NumberFormat(
            'tr-TR'
        ).format(number || 0);
    }


    /* =========================================================
       HTML GÜVENLİĞİ
       ========================================================= */

    function escapeHtml(value) {

        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }


    /* =========================================================
       İLANI KAYDET
       ========================================================= */

    function saveListing(car) {

        /*
         * Kullanıcı ilanları
         */
        try {

            const savedListings =
                JSON.parse(
                    localStorage.getItem('my_listings') || '[]'
                );

            savedListings.unshift(car);

            localStorage.setItem(
                'my_listings',
                JSON.stringify(savedListings)
            );

        } catch (error) {

            console.error(
                'my_listings kayıt hatası:',
                error
            );
        }


        /*
         * Genel araç listesine ekle
         */
        try {

            if (
                typeof window.cars !== 'undefined' &&
                Array.isArray(window.cars)
            ) {

                window.cars.unshift(car);
            }

        } catch (error) {

            console.error(
                'cars listesi güncelleme hatası:',
                error
            );
        }


        /*
         * Ayrı kullanıcı araç listesi
         */
        try {

            const userCars =
                JSON.parse(
                    localStorage.getItem('user_cars') || '[]'
                );

            userCars.unshift(car);

            localStorage.setItem(
                'user_cars',
                JSON.stringify(userCars)
            );

        } catch (error) {

            console.error(
                'user_cars kayıt hatası:',
                error
            );
        }
    }


    /* =========================================================
       FORMU TEMİZLE
       ========================================================= */

    function resetListingForm() {

        const form =
            document.querySelector('#sell form') ||
            document.querySelector('.sell-page form') ||
            document.querySelector('form');

        if (form) {
            form.reset();
        }


        uploadedImages = [];

        currentSellStep = 1;


        const previewGrid =
            document.getElementById('imgPreviewGrid');

        if (previewGrid) {
            previewGrid.innerHTML = '';
        }


        updateImageCounter();


        goToSellStep(1);
    }


    /* =========================================================
       İLANI YAYINLA
       ========================================================= */

    function submitNewCar(event) {

        if (event) {
            event.preventDefault();
        }


        /*
         * Son adım kontrolü
         */
        if (!validateSellStep(1)) {
            goToSellStep(1);
            return;
        }

        if (!validateSellStep(2)) {
            goToSellStep(2);
            return;
        }

        if (!validateSellStep(3)) {
            goToSellStep(3);
            return;
        }


        const newCar =
            collectListingData();


        /*
         * Kaydet
         */
        saveListing(newCar);


        /*
         * Başarı mesajı
         */
        alert(
            '🎉 İlanınız başarıyla yayınlandı!\n\n' +
            `${newCar.title}\n` +
            `${formatPrice(newCar.price)}`
        );


        /*
         * Formu temizle
         */
        resetListingForm();


        /*
         * Araçları İncele sayfasına git
         */
        if (typeof window.go === 'function') {

            setTimeout(() => {
                window.go('browse');
            }, 100);

        } else {

            /*
             * go fonksiyonu yoksa sadece formda kal
             */
            console.log(
                'İlan başarıyla kaydedildi:',
                newCar
            );
        }
    }


    /* =========================================================
       TASLAK KAYDET
       ========================================================= */

    function saveListingDraft() {

        const draft = {

            brand: getValue('addBrand'),
            model: getValue('addModel'),
            price: getValue('addPrice'),
            year: getValue('addYear'),
            km: getValue('addKm'),
            color: getValue('addColor'),
            body: getValue('addBody'),
            fuel: getValue('addFuel'),
            transmission: getValue('addTrans'),
            damageStatus: getValue('addDamage'),
            tramer: getValue('addTramer'),
            description: getValue('addDesc'),
            features: getCheckedFeatures(),

            images:
                uploadedImages.map(
                    image => image.data
                ),

            step: currentSellStep,

            savedAt:
                new Date().toISOString()
        };


        try {

            localStorage.setItem(
                'listing_draft',
                JSON.stringify(draft)
            );

            alert(
                '💾 İlan taslağınız kaydedildi.'
            );

        } catch (error) {

            console.error(
                'Taslak kaydetme hatası:',
                error
            );

            alert(
                'Taslak kaydedilirken bir hata oluştu.'
            );
        }
    }


    /* =========================================================
       TASLAĞI YÜKLE
       ========================================================= */

    function loadListingDraft() {

        try {

            const raw =
                localStorage.getItem('listing_draft');

            if (!raw) return false;

            const draft =
                JSON.parse(raw);


            setValue('addBrand', draft.brand);
            setValue('addModel', draft.model);
            setValue('addPrice', draft.price);
            setValue('addYear', draft.year);
            setValue('addKm', draft.km);
            setValue('addColor', draft.color);
            setValue('addBody', draft.body);
            setValue('addFuel', draft.fuel);
            setValue('addTrans', draft.transmission);
            setValue('addDamage', draft.damageStatus);
            setValue('addTramer', draft.tramer);
            setValue('addDesc', draft.description);


            /*
             * Donanımlar
             */
            if (Array.isArray(draft.features)) {

                document
                    .querySelectorAll(
                        'input[name="feature"]'
                    )
                    .forEach(input => {

                        input.checked =
                            draft.features.includes(
                                input.value
                            );
                    });
            }


            /*
             * Fotoğraflar
             */
            if (
                Array.isArray(draft.images) &&
                draft.images.length
            ) {

                uploadedImages =
                    draft.images.map(
                        (image, index) => ({

                            id:
                                `draft-${Date.now()}-${index}`,

                            name:
                                `Taslak fotoğraf ${index + 1}`,

                            data:
                                image
                        })
                    );

                renderImagePreviews();
            }


            if (
                draft.step &&
                draft.step >= 1 &&
                draft.step <= 4
            ) {

                goToSellStep(
                    Number(draft.step)
                );
            }


            return true;

        } catch (error) {

            console.error(
                'Taslak yükleme hatası:',
                error
            );

            return false;
        }
    }


    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (
            element &&
            value !== undefined &&
            value !== null
        ) {

            element.value = value;
        }
    }


    /* =========================================================
       TASLAĞI SİL
       ========================================================= */

    function deleteListingDraft() {

        localStorage.removeItem(
            'listing_draft'
        );
    }


    /* =========================================================
       SAYFA HAZIR
       ========================================================= */

    document.addEventListener(
        'DOMContentLoaded',
        function () {

            /*
             * İlk adım
             */
            goToSellStep(1);

            /*
             * Fotoğraf sayacı
             */
            updateImageCounter();

            /*
             * Eski taslak var mı?
             */
            const hasDraft =
                localStorage.getItem(
                    'listing_draft'
                );

            if (hasDraft) {

                const restore =
                    confirm(
                        'Kaydedilmiş bir ilan taslağınız var.\n\n' +
                        'Taslağı geri yüklemek ister misiniz?'
                    );

                if (restore) {

                    loadListingDraft();

                } else {

                    deleteListingDraft();
                }
            }
        }
    );


    /* =========================================================
       GLOBAL FONKSİYONLAR
       HTML onclick İÇİN
       ========================================================= */

    window.goToSellStep =
        goToSellStep;

    window.nextSellStep =
        nextSellStep;

    window.previousSellStep =
        previousSellStep;

    window.handleImageUpload =
        handleImageUpload;

    window.removeImage =
        removeImage;

    window.setCoverImage =
        setCoverImage;

    window.submitNewCar =
        submitNewCar;

    window.saveListingDraft =
        saveListingDraft;

    window.loadListingDraft =
        loadListingDraft;

    window.deleteListingDraft =
        deleteListingDraft;

    window.resetListingForm =
        resetListingForm;

})();
