/* ==========================================================================
   js/listing.js - İlan Verme Modülü
   ========================================================================== */

// Fotoğraf yükleme ve önizleme dizisi
let uploadedImages = [];

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

            // Önizleme kartı oluştur
            const card = document.createElement('div');
            card.className = 'preview-card';
            card.style.cssText = `
                position: relative;
                width: 80px;
                height: 80px;
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid var(--line, #e2e8f0);
                display: inline-block;
                margin-right: 8px;
                margin-top: 8px;
            `;

            card.innerHTML = `
                <img src="${imgData}" style="width:100%; height:100%; object-fit:cover;">
                <button type="button" onclick="removeImage(${uploadedImages.length - 1}, this)" 
                    style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.6); color:#fff; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;">✕</button>
            `;

            if (previewGrid) {
                previewGrid.appendChild(card);
            }
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
 * Yeni İlan Gönderme (Form Submit)
 */
function submitNewCar(event) {
    event.preventDefault();

    // Form Elemanlarından Değerleri Al
    const brand = document.getElementById('addBrand')?.value.trim();
    const model = document.getElementById('addModel')?.value.trim();
    const price = document.getElementById('addPrice')?.value;
    const year = document.getElementById('addYear')?.value;
    const body = document.getElementById('addBody')?.value;
    const fuel = document.getElementById('addFuel')?.value;
    const trans = document.getElementById('addTrans')?.value;
    const km = document.getElementById('addKm')?.value;
    const desc = document.getElementById('addDesc')?.value.trim();

    if (!brand || !model || !price || !year) {
        alert("Lütfen gerekli alanları doldurunuz!");
        return;
    }

    // Yeni Araç Objesi
    const newCar = {
        id: Date.now(),
        brand: brand,
        model: model,
        title: `${year} ${brand} ${model}`,
        price: Number(price),
        year: Number(year),
        body: body,
        fuel: fuel,
        transmission: trans,
        km: Number(km),
        description: desc,
        image: uploadedImages.length > 0 ? uploadedImages[0] : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
        images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'],
        date: new Date().toLocaleDateString('tr-TR')
    };

    // Global araç listesine ekle (varsa)
    if (typeof cars !== 'undefined' && Array.isArray(cars)) {
        cars.unshift(newCar);
    } else if (window.cars && Array.isArray(window.cars)) {
        window.cars.unshift(newCar);
    }

    // LocalStorage'a Kaydet
    try {
        let savedCars = JSON.parse(localStorage.getItem('my_listings') || '[]');
        savedCars.unshift(newCar);
        localStorage.setItem('my_listings', JSON.stringify(savedCars));
    } catch (e) {
        console.error("LocalStorage kaydı başarısız:", e);
    }

    alert("🎉 İlanınız başarıyla yayınlandı!");

    // Formu Sıfırla
    event.target.reset();
    uploadedImages = [];
    const previewGrid = document.getElementById('imgPreviewGrid');
    if (previewGrid) previewGrid.innerHTML = '';

    // Ana sayfaya veya araç listesine yönlendir
    if (typeof go === 'function') {
        go('browse');
    }
}
