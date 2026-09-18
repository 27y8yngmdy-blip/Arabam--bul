/* ARABAMI BUL V1.2 — app.js
   Uygulama çekirdeği + ortak değişkenler + başlangıç kodu.
   Özellikler ayrı modüllerde tutulur.
*/
// 70 ARAÇ VERİ TABANI
const brands = ["BMW", "Mercedes-Benz", "Audi", "Tesla", "Volkswagen", "Volvo", "Porsche", "Toyota", "Honda", "Ford"];
const bodyTypes = ["Sedan", "SUV", "Hatchback", "Coupe"];
const fuels = ["Benzin", "Dizel", "Elektrik", "Hibrit"];
const imgPool = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
  "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80"
];

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
      tramer: i % 3 === 0 ? `${(i * 1200).toLocaleString('tr-TR')} TL` : "Hasar Kayıtsız",
      engineScore: "%" + (90 + (i % 10)),
      transmissionScore: "Kusursuz / Test Edildi"
    }
  });
}

let favorites = JSON.parse(localStorage.getItem('favs') || '[]');
let uploadedImages = [];

function go(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.navlinks button, .mobile-bottom-nav button').forEach(b => {
    b.classList.toggle('active', b.dataset.page === pageId);
  });

  if (pageId === 'home') renderHome();
  if (pageId === 'browse') renderBrowse();
  if (pageId === 'favorites') renderFavorites();
  window.scrollTo(0, 0);
}

// AKILLI ARAMA
function handleSearchInput(val) {
  const dropdown = document.getElementById('searchDropdown');
  const q = val.trim().toLowerCase('tr-TR');
  if (!q) { dropdown.classList.remove('open'); return; }

  let cmdItems = [];
  let carItems = [];

  if ("favoriler".includes(q) || "fav".includes(q)) cmdItems.push({ text: "⭐ Favorilerim Sayfasına Git", action: () => { go('favorites'); clearSearch(); } });
  if ("ilan ver".includes(q) || "sat".includes(q)) cmdItems.push({ text: "📝 İlan Ver Sayfasına Git", action: () => { go('sell'); clearSearch(); } });
  if ("sihirbaz".includes(q) || "bul".includes(q)) cmdItems.push({ text: "🪄 Bana Araba Bul Sihirbazı", action: () => { go('find'); clearSearch(); } });

  const matchedCars = dummyCars.filter(c => c.brand.toLowerCase('tr-TR').includes(q) || c.model.toLowerCase('tr-TR').includes(q)).slice(0, 5);
  matchedCars.forEach(c => {
    carItems.push({ text: `${c.brand} ${c.model} (${c.price.toLocaleString('tr-TR')} TL)`, action: () => { openDetail(c.id); clearSearch(); }, tag: c.fuel });
  });

  let html = '';
  if (cmdItems.length > 0) {
    html += '<div class="search-group-title">Hızlı Komutlar</div>';
    cmdItems.forEach((item, idx) => { html += `<div class="search-item" onclick="execCmd(${idx})"><span>${item.text}</span><span class="type-tag">Komut</span></div>`; });
    dropdown.cmdActions = cmdItems.map(i => i.action);
  }
  if (carItems.length > 0) {
    html += '<div class="search-group-title">Eşleşen Araçlar</div>';
    carItems.forEach((item, idx) => { html += `<div class="search-item" onclick="execCar(${idx})"><span>${item.text}</span><span class="type-tag">${item.tag}</span></div>`; });
    dropdown.carActions = carItems.map(i => i.action);
  }
  if (!html) {
    html = `<div class="search-item" onclick="executeBrowseSearch('${q}')">🔍 "${q}" için araçlarda detaylı ara...</div>`;
    dropdown.cmdActions = [() => executeBrowseSearch(q)];
  }
  dropdown.innerHTML = html;
  dropdown.classList.add('open');
}

function execCmd(idx) { const dropdown = document.getElementById('searchDropdown'); if (dropdown.cmdActions && dropdown.cmdActions[idx]) dropdown.cmdActions[idx](); }
function execCar(idx) { const dropdown = document.getElementById('searchDropdown'); if (dropdown.carActions && dropdown.carActions[idx]) dropdown.carActions[idx](); }
function executeBrowseSearch(q) { go('browse'); document.getElementById('fQuery').value = q; renderBrowse(); clearSearch(); }
function clearSearch() { document.getElementById('globalSearchInput').value = ''; document.getElementById('searchDropdown').classList.remove('open'); }

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('globalSearchInput').focus(); }
});

function toggleFav(id, e) {
  if (e) e.stopPropagation();
  if (favorites.includes(id)) favorites = favorites.filter(x => x !== id);
  else favorites.push(id);
  localStorage.setItem('favs', JSON.stringify(favorites));
  renderHome(); renderBrowse(); renderFavorites();
}

function renderHome() {
  const grid = document.getElementById('homeGrid');
  if (grid) grid.innerHTML = dummyCars.slice(0, 6).map(c => createCarCard(c)).join('');
}

function filterByCategory(cat) {
  document.querySelectorAll('.category-pills .pill').forEach(p => {
    p.classList.toggle('active', p.textContent.includes(cat) || (cat === '' && p.textContent.includes('Tüm')));
  });
  go('browse');
  document.getElementById('fBody').value = cat === 'Elektrik' ? '' : cat;
  document.getElementById('fFuel').value = cat === 'Elektrik' ? 'Elektrik' : '';
  renderBrowse();
}

function renderBrowse() {
  const grid = document.getElementById('browseGrid');
  if (!grid) return;
  const q = (document.getElementById('fQuery')?.value || '').toLowerCase('tr-TR');
  const brand = document.getElementById('fBrand')?.value || '';
  const body = document.getElementById('fBody')?.value || '';
  const pMin = Number(document.getElementById('fPriceMin')?.value || 0);
  const pMax = Number(document.getElementById('fPriceMax')?.value || Infinity);
  const yMin = Number(document.getElementById('fYearMin')?.value || 0);
  const yMax = Number(document.getElementById('fYearMax')?.value || Infinity);
  const kmMax = Number(document.getElementById('fKmMax')?.value || Infinity);
  const fuel = document.getElementById('fFuel')?.value || '';
  const trans = document.getElementById('fTrans')?.value || '';
  const sort = document.getElementById('fSort')?.value || 'default';

  let filtered = dummyCars.filter(c => {
    if (q && !(c.brand.toLowerCase('tr-TR').includes(q) || c.model.toLowerCase('tr-TR').includes(q))) return false;
    if (brand && c.brand !== brand) return false;
    if (body && c.seg !== body) return false;
    if (c.price < pMin) return false;
    if (pMax && c.price > pMax) return false;
    if (c.year < yMin) return false;
    if (yMax && c.year > yMax) return false;
    if (c.km > kmMax) return false;
    if (fuel && c.fuel !== fuel) return false;
    if (trans && c.trans !== trans) return false;
    return true;
  });

  if (sort === 'priceAsc') filtered.sort((a,b) => a.price - b.price);
  if (sort === 'priceDesc') filtered.sort((a,b) => b.price - a.price);
  if (sort === 'yearDesc') filtered.sort((a,b) => b.year - a.year);

  document.getElementById('resultCount').textContent = `Bulunan Araç: ${filtered.length}`;
  grid.innerHTML = filtered.length > 0 ? filtered.map(c => createCarCard(c)).join('') : '<div style="grid-column:1/-1; padding:40px; text-align:center; color:var(--muted);">Aramanıza uygun araç bulunamadı.</div>';
}



function createCarCard(c, matchRate) {
  const isFav = favorites.includes(c.id);
  return `
    <div class="vehicle-card" onclick="openDetail(${c.id})">
      <button class="fav-btn" onclick="toggleFav(${c.id}, event)">${isFav ? '❤️' : '🤍'}</button>
      <div class="car-img" style="background-image: url('${c.img}')">
        <div class="car-overlay"><span>${c.brand} ${c.model}</span><span>${c.year}</span></div>
      </div>
      <div class="car-body">
        ${matchRate ? `<span class="match-badge">%${matchRate} Uyumlu</span>` : ''}
        <div class="car-title">${c.brand} ${c.model}</div>
        <div class="car-price">${c.price.toLocaleString('tr-TR')} TL</div>
        <div class="car-meta"><span>${c.fuel}</span> • <span>${c.trans}</span> • <span>${c.km.toLocaleString('tr-TR')} KM</span></div>
        <div class="badge-tco">Tahmini Yürütme: ~${c.tco.toLocaleString('tr-TR')} TL / ay</div>
      </div>
    </div>
  `;
}



// SİHİRBAZ
let wizardAnswers = {};
let qIndex = 0;
const wizardQuestions = [
  { key: "price", title: "Bütçe Aralığınız", sub: "Maksimum alım bütçenizi seçin.", options: ["1.500.000 TL Altı", "1.500.000 - 3.000.000 TL", "3.000.000 TL Üzeri"] },
  { key: "body", title: "Kasa Tipi / Kullanım Amacı", sub: "Aracı en çok nerede ve nasıl kullanacaksınız?", options: ["Sedan (Konfor & Aile)", "SUV (Geniş & Yüksek)", "Hatchback (Şehir İçi Pratik)", "Coupe (Performans)"] },
  { key: "fuel", title: "Yakıt & Enerji Tercihi", sub: "Hangi yakıt tipi sizin için daha uygun?", options: ["Elektrik", "Benzin", "Dizel", "Hibrit"] },
  { key: "trans", title: "Vites Tipi", sub: "Sürüş alışkanlığınız nedir?", options: ["Otomatik", "Manuel"] },
  { key: "year", title: "Model Yılı Beklentisi", sub: "Aracın yaşı ne olmalı?", options: ["2022 ve Üzeri (Yeni)", "2018 - 2021 (Orta Yaş)", "Fark Etmez"] },
  { key: "priority", title: "En Önemli Kriteriniz", sub: "Aracınızda ilk aradığınız nitelik.", options: ["Düşük Yürütme Gideri", "Yüksek Performans", "Maksimum Konfor", "İkinci El Değeri"] }
];

function renderWizard() {
  const q = wizardQuestions[qIndex];
  document.getElementById('qBadge').textContent = `Soru ${qIndex + 1} / ${wizardQuestions.length}`;
  document.getElementById('qTitle').textContent = q.title;
  document.getElementById('qSub').textContent = q.sub;
  document.getElementById('pFill').style.width = `${((qIndex + 1) / wizardQuestions.length) * 100}%`;
  document.getElementById('prevBtn').style.visibility = qIndex === 0 ? 'hidden' : 'visible';

  const opts = document.getElementById('qOptions');
  opts.innerHTML = q.options.map(o => `
    <div class="option-btn ${wizardAnswers[q.key] === o ? 'selected' : ''}" onclick="selectWizardOpt('${q.key}', '${o}', this)">
      <span>${o}</span>
      <span class="check-icon">✓</span>
    </div>
  `).join('');
}

function selectWizardOpt(key, val, el) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  wizardAnswers[key] = val;
}

function nextQ() {
  if (!wizardAnswers[wizardQuestions[qIndex].key]) { alert("Lütfen devam etmek için bir seçim yapın."); return; }
  if (qIndex < wizardQuestions.length - 1) { qIndex++; renderWizard(); } else { showWizardResults(); }
}

function prevQ() { if (qIndex > 0) { qIndex--; renderWizard(); } }

function showWizardResults() {
  document.getElementById('wizardCard').style.display = 'none';
  document.getElementById('wizardResult').style.display = 'block';

  let scoredCars = dummyCars.map(c => {
    let score = 70;
    if (wizardAnswers.fuel && c.fuel === wizardAnswers.fuel) score += 10;
    if (wizardAnswers.trans && c.trans === wizardAnswers.trans) score += 10;
    if (wizardAnswers.body && c.seg === wizardAnswers.body.split(' ')[0]) score += 10;
    return { car: c, score: Math.min(score, 98) };
  });
  scoredCars.sort((a,b) => b.score - a.score);
  document.getElementById('wizardResultGrid').innerHTML = scoredCars.slice(0, 4).map(item => createCarCard(item.car, item.score)).join('');
}

function resetWizard() {
  wizardAnswers = {};
  qIndex = 0;
  document.getElementById('wizardCard').style.display = 'block';
  document.getElementById('wizardResult').style.display = 'none';
  renderWizard();
}

// İLAN YÜKLEME
function handleImageUpload(e) {
  const files = e.target.files;
  if(!files.length) return;
  for(let file of files) {
    const reader = new FileReader();
    reader.onload = function(evt) { uploadedImages.push(evt.target.result); renderImgPreviews(); }
    reader.readAsDataURL(file);
  }
}

function renderImgPreviews() {
  document.getElementById('imgPreviewGrid').innerHTML = uploadedImages.map((src, idx) => `
    <div class="preview-card"><img src="${src}"><button type="button" class="remove-btn" onclick="removeImg(${idx})">✕</button></div>
  `).join('');
}
function removeImg(idx) { uploadedImages.splice(idx, 1); renderImgPreviews(); }

function submitNewCar(e) {
  e.preventDefault();
  const newCar = {
    id: dummyCars.length + 1,
    brand: document.getElementById('addBrand').value,
    model: document.getElementById('addModel').value,
    seg: document.getElementById('addBody').value,
    price: Number(document.getElementById('addPrice').value),
    fuel: document.getElementById('addFuel').value,
    trans: document.getElementById('addTrans').value,
    year: Number(document.getElementById('addYear').value),
    km: Number(document.getElementById('addKm').value),
    tco: Math.round(Number(document.getElementById('addPrice').value) * 0.006),
    img: uploadedImages[0] || imgPool[0],
    expert: { hood: "Orijinal", fenderLeft: "Orijinal", roof: "Orijinal", doorRight: "Orijinal", tramer: "Beyan Edilmedi", engineScore: "%95", transmissionScore: "Kontrol Edildi" }
  };
  dummyCars.unshift(newCar);
  alert("İlanınız başarıyla eklendi!");
  uploadedImages = [];
  renderImgPreviews();
  e.target.reset();
  go('browse');
}

// MODAL VE İLETİŞİM
function openDetail(id) {
  const car = dummyCars.find(c => c.id === id);
  if (!car) return;
  document.getElementById('modalBody').innerHTML = `
    <h2 style="margin-top:0;">${car.brand} ${car.model} (${car.year})</h2>
    <img src="${car.img}" style="width:100%; border-radius:14px; height:280px; object-fit:cover; margin:12px 0;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="margin:0; font-size:24px; color:var(--text);">${car.price.toLocaleString('tr-TR')} TL</h3>
      <span class="badge-tco">Aylık Yürütme: ~${car.tco.toLocaleString('tr-TR')} TL</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; background:#f8fafc; padding:12px; border-radius:12px; font-size:13px; font-weight:600; margin-bottom:16px;">
      <div>Yakıt: ${car.fuel}</div><div>Vites: ${car.trans}</div><div>KM: ${car.km.toLocaleString('tr-TR')}</div>
    </div>
    <div class="expert-section">
      <div class="expert-title">📋 Detaylı Oto Ekspertiz Raporu</div>
      <table class="expert-table">
        <thead><tr><th>Parça</th><th>Durum</th><th>Açıklama</th></tr></thead>
        <tbody>
          <tr><td>Ön Kaput</td><td><span class="${car.expert.hood === 'Orijinal' ? 'tag-orig' : 'tag-paint'}">${car.expert.hood}</span></td><td>Fabrika çıkış standartlarında.</td></tr>
          <tr><td>Sol Çamurluk</td><td><span class="${car.expert.fenderLeft === 'Orijinal' ? 'tag-orig' : 'tag-paint'}">${car.expert.fenderLeft}</span></td><td>Mikron değeri normal.</td></tr>
          <tr><td>Tavan & Şase</td><td><span class="tag-orig">Orijinal</span></td><td>İşlemsiz.</td></tr>
          <tr><td>Motor Sağlığı</td><td><span class="tag-orig">${car.expert.engineScore}</span></td><td>Test edildi.</td></tr>
          <tr><td>Tramer Kaydı</td><td colspan="2"><b>${car.expert.tramer}</b></td></tr>
        </tbody>
      </table>
    </div>
    <div class="contact-actions">
      <button class="btn-primary" style="width:100%; background:var(--green);" onclick="alert('Satıcı aranıyor: +90 (532) 555 00 00')">📞 Satıcıyı Ara</button>
      <button class="btn-primary" style="width:100%;" onclick="alert('Satıcıya mesajınız iletildi.')">💬 Detaylı Mesaj Gönder</button>
    </div>
  `;
  document.getElementById('modalBg').classList.add('open');
}


// YAPAY ZEKA DESTEK MOTORU (GEMINI MANTIK ENTEGRASYONU)


async function sendAIChat() {
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  if (!query) return;

  const body = document.getElementById('chatBody');
  body.innerHTML += `<div class="chat-msg user">${query}</div>`;
  input.value = '';
  body.scrollTop = body.scrollHeight;

  // Yazıyor animasyonu ekle
  const typingId = 'typing_' + Date.now();
  body.innerHTML += `<div class="chat-msg bot" id="${typingId}"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  body.scrollTop = body.scrollHeight;

  // Akıllı Yapay Zeka Yanıt Simülasyonu & Eşleştirme Motoru
  setTimeout(() => {
    document.getElementById(typingId)?.remove();
    let reply = generateAIResponse(query);
    body.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
    body.scrollTop = body.scrollHeight;
  }, 900);
}





window.addEventListener('DOMContentLoaded', () => {
  go('home');
  renderWizard();
});
