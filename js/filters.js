/* ============================================================
   ARABAMI BUL V2 — filters.js
   ARAÇ İNCELE V2 FİLTRE SİSTEMİ
   ============================================================

   NOT:
   - app.js'ye dokunmaz.
   - createCarCard() değiştirilmez.
   - Mevcut renderBrowse() sistemiyle birlikte çalışır.
   - Araç İncele V2 hızlı filtrelerini yönetir.
   ============================================================ */


/* ============================================================
   FİLTRELERİ SIFIRLA
   ============================================================ */

function resetFilters() {

  const fields = [
    "fQuery",
    "fBrand",
    "fBody",
    "fPriceMin",
    "fPriceMax",
    "fYearMin",
    "fYearMax",
    "fKmMax",
    "fFuel",
    "fTrans"
  ];

  fields.forEach(function(id) {

    const el = document.getElementById(id);

    if (!el) return;

    el.value = "";

  });


  const sort = document.getElementById("fSort");

  if (sort) {
    sort.value = "default";
  }


  /*
     Hızlı kategori butonlarında
     "Tüm Araçlar" aktif olsun.
  */

  syncBrowseQuickButtons();


  /*
     Mobil filtre paneli açıksa kapat.
  */

  const panel = document.getElementById("filterPanel");

  const state = document.getElementById("filterState");

  if (panel && panel.classList.contains("open")) {

    panel.classList.remove("open");

    if (state) {
      state.textContent = "+";
    }

  }


  /*
     Ana filtreleme fonksiyonu.
  */

  if (typeof renderBrowse === "function") {
    renderBrowse();
  }


  /*
     V2 sayaçlarını güncelle.
  */

  updateBrowseV2UI();

}



/* ============================================================
   MOBİL FİLTRE PANELİ
   ============================================================ */

function toggleFilters() {

  const panel = document.getElementById("filterPanel");

  const state = document.getElementById("filterState");

  if (!panel) return;


  panel.classList.toggle("open");


  if (state) {

    state.textContent =
      panel.classList.contains("open")
        ? "−"
        : "+";

  }

}



/* ============================================================
   HIZLI KASA FİLTRESİ
   ============================================================ */

function browseQuickFilter(body, button) {

  const bodySelect = document.getElementById("fBody");

  const fuelSelect = document.getElementById("fFuel");

  if (!bodySelect) return;


  /*
     Kasa tipi seç.
  */

  bodySelect.value = body || "";


  /*
     Kasa seçildiğinde yakıt filtresini temizle.
  */

  if (fuelSelect) {
    fuelSelect.value = "";
  }


  /*
     Aktif butonu değiştir.
  */

  setActiveBrowseQuickButton(button);


  /*
     Araçları yeniden getir.
  */

  if (typeof renderBrowse === "function") {
    renderBrowse();
  }


  updateBrowseV2UI();

}



/* ============================================================
   HIZLI YAKIT FİLTRESİ
   ============================================================ */

function browseQuickFuel(fuel, button) {

  const bodySelect = document.getElementById("fBody");

  const fuelSelect = document.getElementById("fFuel");

  if (!fuelSelect) return;


  /*
     Yakıt seç.
  */

  fuelSelect.value = fuel || "";


  /*
     Yakıt seçildiğinde kasa filtresini temizle.
  */

  if (bodySelect) {
    bodySelect.value = "";
  }


  /*
     Aktif butonu değiştir.
  */

  setActiveBrowseQuickButton(button);


  /*
     Araçları yeniden getir.
  */

  if (typeof renderBrowse === "function") {
    renderBrowse();
  }


  updateBrowseV2UI();

}



/* ============================================================
   AKTİF HIZLI FİLTRE BUTONU
   ============================================================ */

function setActiveBrowseQuickButton(button) {

  const buttons =
    document.querySelectorAll(".browse-quick button");


  buttons.forEach(function(btn) {

    btn.classList.remove("active");

  });


  if (button) {
    button.classList.add("active");
  }

}



/* ============================================================
   HIZLI FİLTRE BUTONLARINI SENKRONİZE ET
   ============================================================ */

function syncBrowseQuickButtons() {

  const buttons =
    document.querySelectorAll(".browse-quick button");

  if (!buttons.length) return;


  buttons.forEach(function(btn) {

    btn.classList.remove("active");

  });


  const body =
    document.getElementById("fBody")?.value || "";

  const fuel =
    document.getElementById("fFuel")?.value || "";


  /*
     0 = Tüm Araçlar
     1 = Sedan
     2 = SUV
     3 = Hatchback
     4 = Coupe
     5 = Elektrikli
     6 = Hibrit
  */

  let activeIndex = 0;


  if (body === "Sedan") {
    activeIndex = 1;
  }

  else if (body === "SUV") {
    activeIndex = 2;
  }

  else if (body === "Hatchback") {
    activeIndex = 3;
  }

  else if (body === "Coupe") {
    activeIndex = 4;
  }

  else if (fuel === "Elektrik") {
    activeIndex = 5;
  }

  else if (fuel === "Hibrit") {
    activeIndex = 6;
  }


  if (buttons[activeIndex]) {
    buttons[activeIndex].classList.add("active");
  }

}



/* ============================================================
   AKTİF FİLTRE ETİKETLERİ
   ============================================================ */

function renderBrowseActiveFilters() {

  const container =
    document.getElementById("browseActiveFilters");

  if (!container) return;


  container.innerHTML = "";


  const filters = [];


  const query =
    document.getElementById("fQuery")?.value.trim();

  const brand =
    document.getElementById("fBrand")?.value;

  const body =
    document.getElementById("fBody")?.value;

  const priceMin =
    document.getElementById("fPriceMin")?.value;

  const priceMax =
    document.getElementById("fPriceMax")?.value;

  const yearMin =
    document.getElementById("fYearMin")?.value;

  const yearMax =
    document.getElementById("fYearMax")?.value;

  const kmMax =
    document.getElementById("fKmMax")?.value;

  const fuel =
    document.getElementById("fFuel")?.value;

  const trans =
    document.getElementById("fTrans")?.value;


  if (query) {

    filters.push({
      label: `"${query}"`,
      type: "fQuery"
    });

  }


  if (brand) {

    filters.push({
      label: brand,
      type: "fBrand"
    });

  }


  if (body) {

    filters.push({
      label: body,
      type: "fBody"
    });

  }


  if (priceMin || priceMax) {

    let label = "Fiyat";

    if (priceMin && priceMax) {
      label =
        Number(priceMin).toLocaleString("tr-TR") +
        " - " +
        Number(priceMax).toLocaleString("tr-TR") +
        " TL";
    }

    else if (priceMin) {
      label =
        Number(priceMin).toLocaleString("tr-TR") +
        " TL+";
    }

    else if (priceMax) {
      label =
        Number(priceMax).toLocaleString("tr-TR") +
        " TL altı";
    }


    filters.push({
      label: label,
      type: "price"
    });

  }


  if (yearMin || yearMax) {

    let label = "Model Yılı";

    if (yearMin && yearMax) {
      label = yearMin + " - " + yearMax;
    }

    else if (yearMin) {
      label = yearMin + "+";
    }

    else if (yearMax) {
      label = yearMax + " ve altı";
    }


    filters.push({
      label: label,
      type: "year"
    });

  }


  if (kmMax) {

    filters.push({
      label:
        Number(kmMax).toLocaleString("tr-TR") +
        " KM altı",
      type: "km"
    });

  }


  if (fuel) {

    filters.push({
      label: fuel,
      type: "fFuel"
    });

  }


  if (trans) {

    filters.push({
      label: trans,
      type: "fTrans"
    });

  }


  filters.forEach(function(filter) {

    const chip =
      document.createElement("span");

    chip.className =
      "browse-filter-chip";


    const text =
      document.createElement("span");

    text.textContent =
      filter.label;


    const close =
      document.createElement("button");

    close.type = "button";

    close.innerHTML = "×";

    close.setAttribute(
      "aria-label",
      "Filtreyi kaldır"
    );


    close.onclick = function() {

      removeBrowseFilter(filter.type);

    };


    chip.appendChild(text);

    chip.appendChild(close);

    container.appendChild(chip);

  });

}



/* ============================================================
   AKTİF FİLTREYİ KALDIR
   ============================================================ */

function removeBrowseFilter(type) {

  const ids = {

    fQuery: "fQuery",
    fBrand: "fBrand",
    fBody: "fBody",
    fFuel: "fFuel",
    fTrans: "fTrans"

  };


  if (ids[type]) {

    const el =
      document.getElementById(ids[type]);

    if (el) {
      el.value = "";
    }

  }


  if (type === "price") {

    const min =
      document.getElementById("fPriceMin");

    const max =
      document.getElementById("fPriceMax");

    if (min) min.value = "";

    if (max) max.value = "";

  }


  if (type === "year") {

    const min =
      document.getElementById("fYearMin");

    const max =
      document.getElementById("fYearMax");

    if (min) min.value = "";

    if (max) max.value = "";

  }


  if (type === "km") {

    const km =
      document.getElementById("fKmMax");

    if (km) {
      km.value = "";
    }

  }


  syncBrowseQuickButtons();


  if (typeof renderBrowse === "function") {
    renderBrowse();
  }


  updateBrowseV2UI();

}



/* ============================================================
   V2 SAYACI + AKTİF FİLTRELER
   ============================================================ */

function updateBrowseV2UI() {

  /*
     Aktif filtreleri çiz.
  */

  renderBrowseActiveFilters();


  /*
     Hızlı filtre butonlarını senkronize et.
  */

  syncBrowseQuickButtons();


  /*
     Toplam araç sayısını mümkün olduğunca
     mevcut data üzerinden göster.
  */

  const total =
    document.getElementById("browseTotalCount");

  if (total && Array.isArray(window.dummyCars)) {

    total.textContent =
      window.dummyCars.length.toLocaleString("tr-TR");

  }

}



/* ============================================================
   RENDER BROWSE SONRASI V2 ARAYÜZÜNÜ GÜNCELLE
   ============================================================ */

(function initBrowseFilterEnhancements() {

  /*
     DOM henüz hazır değilse bekle.
  */

  function init() {

    updateBrowseV2UI();


    /*
       Kullanıcı filtre alanlarını elle değiştirdiğinde
       aktif filtre çiplerini güncelle.
    */

    const ids = [

      "fQuery",
      "fBrand",
      "fBody",
      "fPriceMin",
      "fPriceMax",
      "fYearMin",
      "fYearMax",
      "fKmMax",
      "fFuel",
      "fTrans"

    ];


    ids.forEach(function(id) {

      const el =
        document.getElementById(id);

      if (!el) return;


      el.addEventListener(
        "input",
        function() {
          updateBrowseV2UI();
        }
      );


      el.addEventListener(
        "change",
        function() {
          updateBrowseV2UI();
        }
      );

    });

  }


  if (document.readyState === "loading") {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
