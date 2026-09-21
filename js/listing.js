/* ==========================================================================
   js/listing.js - Gelişmiş İlan Verme Modülü (Multi-Step & Details)
   ========================================================================== */

let uploadedImages = [];

/**
 * Adım Değiştirme Fonksiyonu (Multi-Step Form İçin)
 */
function goToSellStep(stepNumber) {
    // Tüm adımları gizle
    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`sellStep${i}`);
        const nodeEl = document.getElementById(`stepNode${i}`);
        if (stepEl) stepEl.classList.remove('active');
        if (nodeEl) nodeEl.classList.remove('active');
    }

    // Aktif adımı göster
    const activeStep = document.getElementById(`sellStep${stepNumber}`);
    const activeNode = document.getElementById(`stepNode${stepNumber}`);
    if (activeStep) activeStep.classList.add('active');
    if (activeNode) activeNode.classList.add('active');

    // İlerleme Çubuğunu Güncelle
    const fillEl = document.getElementById('sellStepFill');
    if (fillEl) {
        fillEl.style.width = `${stepNumber * 25}%`;
    }
}

/**
 * Fotoğraf Yükleme İşleyicisi
 */
function handleImageUpload(event) {
    const files = event.target.files;
    const previewGrid = document.getElementById('imgPreviewGrid');
    
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const imgData = e.target.result;
            uploadedImages.push(imgData);

            const card = document.createElement('div');
            card.style.cssText = `
                position: relative;
                width: 90px;
                height: 90px;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid #cbd5e1;
                display: inline-block;
                margin-right: 8px;
                margin-top: 10px;
            `;

            card.innerHTML = `
                <img src="${imgData}" style="width:100%; height:100%; object-fit:cover;">
                <button type="button" onclick="removeImage(${uploadedImages.length - 1}, this)" 
                    style="position:absolute; top:3px; right:3px; background:rgba(0,0,0,0.7); color:#fff; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">✕</button>
            `;

            if (previewGrid) previewGrid.appendChild(card);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Resim Silme
 */
function removeImage(index, btnElement) {
    uploadedImages.splice(index, 1);
    const card = btnElement.parentElement;
    if (card) card.remove();
}

/**
 * Formu Tamamlama & İlanı Kaydetme
 */
function submitNewCar(event) {
    event.preventDefault();

    // Seçilen Donanımları Topla
    const selectedFeatures = [];
    document.querySelectorAll('input[name="feature"]:checked').forEach(cb => {
        selectedFeatures.push(cb.value);
    });

    const brand = document.getElementById('addBrand')?.value.trim();
    const model = document.getElementById('addModel')?.value.trim();
    const price = document.getElementById('addPrice')?.value;
    const year = document.getElementById('addYear')?.value;

    if (!brand || !model || !price || !year) {
        alert("Lütfen marka, model, fiyat ve yıl bilgilerini eksiksiz doldurunuz!");
        return;
    }

    const newCar = {
        id: Date.now(),
        brand: brand,
        model: model,
        title: `${year} ${brand} ${model}`,
        price: Number(price),
        year: Number(year),
        km: Number(document.getElementById('addKm')?.value) || 0,
        color: document.getElementById('addColor')?.value.trim() || 'Belirtilmemiş',
        body: document.getElementById('addBody')?.value || 'Sedan',
        fuel: document.getElementById('addFuel')?.value || 'Benzin',
        transmission: document.getElementById('addTrans')?.value || 'Otomatik',
        features: selectedFeatures,
        damageStatus: document.getElementById('addDamage')?.value || 'Hatasız',
        tramer: Number(document.getElementById('addTramer')?.value) || 0,
        description: document.getElementById('addDesc')?.value.trim() || '',
        image: uploadedImages.length > 0 ? uploadedImages[0] : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
        date: new Date().toLocaleDateString('tr-TR')
    };

    // Global Dizilere Ekle
    if (typeof cars !== 'undefined' && Array.isArray(cars)) {
        cars.unshift(newCar);
    } else if (window.cars && Array.isArray(window.cars)) {
        window.cars.unshift(newCar);
    }

    // LocalStorage Kaydet
    try {
        let savedCars = JSON.parse(localStorage.getItem('my_listings') || '[]');
        savedCars.unshift(newCar);
        localStorage.setItem('my_listings', JSON.stringify(savedCars));
    } catch (e) {
        console.error("LocalStorage hatası:", e);
    }

    alert("🎉 İlanınız detaylı donanım ve ekspertiz bilgileriyle yayınlandı!");

    // Formu Sıfırla ve Adım 1'e Dön
    event.target.reset();
    uploadedImages = [];
    const previewGrid = document.getElementById('imgPreviewGrid');
    if (previewGrid) previewGrid.innerHTML = '';
    goToSellStep(1);

    // Listeleme sayfasına yönlendir
    if (typeof go === 'function') {
        go('browse');
    }
}
