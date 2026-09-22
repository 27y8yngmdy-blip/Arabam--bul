/* ============================================================
   ARABAMI BUL V2 — filters.js
   ARAÇ İNCELE V2 GELİŞMİŞ FİLTRE SİSTEMİ
   ============================================================

   ÖZELLİKLER
   ------------------------------------------------------------
   - Arama
   - Marka
   - Kasa tipi
   - Fiyat min / max
   - Yıl min / max
   - Maksimum KM
   - Yakıt
   - Vites
   - Sıralama
   - Hızlı filtreler
   - Aktif filtre çipleri
   - Aktif filtre sayısı
   - Tek tek filtre kaldırma
   - Tüm filtreleri temizleme
   - Otomatik render
   - Mobil filtre paneli
   - Mevcut renderBrowse() ile uyumlu
   - app.js'e dokunmaz
   - createCarCard() değiştirilmez
   ============================================================ */


/* ============================================================
   GLOBAL DURUM
   ============================================================ */

let browseFilterInitialized = false;
let browseSearchTimer = null;


/* ============================================================
   YARDIMCI FONKSİYONLAR
   ============================================================ */

function getBrowseValue(id) {

  const el = document.getElementById(id);

  if (!el) return "";

  return String(el.value || "").trim();

}


function setBrowseValue(id, value) {

  const el = document.getElementById(id);

  if (!el) return;

  el.value = value ?? "";

}


function renderBrowseSafe() {

  if (typeof renderBrowse === "function") {

    renderBrowse();

  }

}


function updateBrowseUI() {

  updateBrowseV2UI();

}


function formatNumber(value) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {

    return "";

  }

  const number = Number(
    String(value).replace(/[^\d.-]/g, "")
  );

  if (Number.isNaN(number)) {

    return String(value);

  }

  return number.toLocaleString("tr-TR");

}


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

    const el =
      document.getElementById(id);

    if (!el) return;

    el.value = "";

  });


  /* Sıralama */

  const sort =
    document.getElementById("fSort");

  if (sort) {

    sort.value = "default";

  }


  /* Hızlı butonlar */

  syncBrowseQuickButtons();


  /* Mobil paneli kapat */

  const panel =
    document.getElementById("filterPanel");

  const state =
    document.getElementById("filterState");


  if (
    panel &&
    panel.classList.contains("open")
  ) {

    panel.classList.remove("open");

  }


  if (state) {

    state.textContent = "+";

  }


  /* Araçları yeniden getir */

  renderBrowseSafe();


  /* Arayüzü yenile */

  updateBrowseV2UI();

}


/* ============================================================
   MOBİL FİLTRE PANELİ
   ============================================================ */

function toggleFilters() {

  const panel =
    document.getElementById("filterPanel");

  const state =
    document.getElementById("filterState");


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
   MOBİL FİLTRE PANELİNİ KAPAT
   ============================================================ */

function closeFilters() {

  const panel =
    document.getElementById("filterPanel");

  const state =
    document.getElementById("filterState");


  if (!panel) return;


  panel.classList.remove("open");


  if (state) {

    state.textContent = "+";

  }

}


/* ============================================================
   HIZLI KASA FİLTRESİ
   ============================================================ */

function browseQuickFilter(body, button) {

  const bodySelect =
    document.getElementById("fBody");

  const fuelSelect =
    document.getElementById("fFuel");


  if (!bodySelect) return;


  bodySelect.value =
    body || "";


  /*
     Kasa seçildiğinde
     yakıt hızlı filtresini temizle.
  */

  if (fuelSelect) {

    fuelSelect.value = "";

  }


  setActiveBrowseQuickButton(button);


  renderBrowseSafe();


  updateBrowseV2UI();

}


/* ============================================================
   HIZLI YAKIT FİLTRESİ
   ============================================================ */

function browseQuickFuel(fuel, button) {

  const bodySelect =
    document.getElementById("fBody");

  const fuelSelect =
    document.getElementById("fFuel");


  if (!fuelSelect) return;


  fuelSelect.value =
    fuel || "";


  /*
     Yakıt seçildiğinde
     kasa hızlı filtresini temizle.
  */

  if (bodySelect) {

    bodySelect.value = "";

  }


  setActiveBrowseQuickButton(button);


  renderBrowseSafe();


  updateBrowseV2UI();

}


/* ============================================================
   AKTİF HIZLI FİLTRE BUTONU
   ============================================================ */

function setActiveBrowseQuickButton(button) {

  const buttons =
    document.querySelectorAll(
      ".browse-quick button"
    );


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
    document.querySelectorAll(
      ".browse-quick button"
    );


  if (!buttons.length) return;


  buttons.forEach(function(btn) {

    btn.classList.remove("active");

  });


  const body =
    getBrowseValue("fBody");

  const fuel =
    getBrowseValue("fFuel");


  /*
     Beklenen sıra:

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

  else if (
    fuel === "Elektrik" ||
    fuel === "Elektrikli"
  ) {

    activeIndex = 5;

  }

  else if (fuel === "Hibrit") {

    activeIndex = 6;

  }


  if (buttons[activeIndex]) {

    buttons[activeIndex]
      .classList.add("active");

  }

}


/* ============================================================
   AKTİF FİLTRE SAYISI
   ============================================================ */

function getBrowseActiveFilterCount() {

  let count = 0;


  const simpleFields = [

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


  simpleFields.forEach(function(id) {

    const value =
      getBrowseValue(id);

    if (value) {

      count++;

    }

  });


  return count;

}


/* ============================================================
   AKTİF FİLTRE SAYISINI GÖSTER
   ============================================================ */

function updateBrowseFilterCount() {

  const count =
    getBrowseActiveFilterCount();


  const elements =
    document.querySelectorAll(
      "[data-filter-count], #filterCount, #activeFilterCount"
    );


  elements.forEach(function(el) {

    if (count > 0) {

      el.textContent =
        count.toString();

      el.classList.add("has-filters");

      el.style.display = "";

    }

    else {

      el.textContent = "0";

      el.classList.remove("has-filters");

      /*
         Elementin kendi CSS'i görünürlüğünü
         yönetiyorsa zorlamıyoruz.
      */

    }

  });


  /*
     Filtre butonunda sayı göstermek için
     destek.
  */

  const filterButton =
    document.querySelector(
      "[data-filter-button]"
    );


  if (
    filterButton &&
    !filterButton.querySelector(".filter-count")
  ) {

    const badge =
      document.createElement("span");

    badge.className =
      "filter-count";

    filterButton.appendChild(badge);

  }


  const badge =
    filterButton?.querySelector(
      ".filter-count"
    );


  if (badge) {

    badge.textContent =
      count > 0 ? count : "";

    badge.style.display =
      count > 0 ? "inline-flex" : "none";

  }

}


/* ============================================================
   AKTİF FİLTRE ETİKETLERİ
   ============================================================ */

function renderBrowseActiveFilters() {

  const container =
    document.getElementById(
      "browseActiveFilters"
    );


  if (!container) return;


  container.innerHTML = "";


  const filters = [];


  const query =
    getBrowseValue("fQuery");

  const brand =
    getBrowseValue("fBrand");

  const body =
    getBrowseValue("fBody");

  const priceMin =
    getBrowseValue("fPriceMin");

  const priceMax =
    getBrowseValue("fPriceMax");

  const yearMin =
    getBrowseValue("fYearMin");

  const yearMax =
    getBrowseValue("fYearMax");

  const kmMax =
    getBrowseValue("fKmMax");

  const fuel =
    getBrowseValue("fFuel");

  const trans =
    getBrowseValue("fTrans");


  /* Arama */

  if (query) {

    filters.push({

      label: `"${query}"`,

      type: "fQuery"

    });

  }


  /* Marka */

  if (brand) {

    filters.push({

      label: brand,

      type: "fBrand"

    });

  }


  /* Kasa */

  if (body) {

    filters.push({

      label: body,

      type: "fBody"

    });

  }


  /* Fiyat */

  if (priceMin || priceMax) {

    let label =
      "Fiyat";


    if (
      priceMin &&
      priceMax
    ) {

      label =
        formatNumber(priceMin) +
        " - " +
        formatNumber(priceMax) +
        " TL";

    }

    else if (priceMin) {

      label =
        formatNumber(priceMin) +
        " TL+";

    }

    else if (priceMax) {

      label =
        formatNumber(priceMax) +
        " TL altı";

    }


    filters.push({

      label: label,

      type: "price"

    });

  }


  /* Yıl */

  if (yearMin || yearMax) {

    let label =
      "Model Yılı";


    if (
      yearMin &&
      yearMax
    ) {

      label =
        yearMin +
        " - " +
        yearMax;

    }

    else if (yearMin) {

      label =
        yearMin +
        "+";

    }

    else if (yearMax) {

      label =
        yearMax +
        " ve altı";

    }


    filters.push({

      label: label,

      type: "year"

    });

  }


  /* KM */

  if (kmMax) {

    filters.push({

      label:
        formatNumber(kmMax) +
        " KM altı",

      type: "km"

    });

  }


  /* Yakıt */

  if (fuel) {

    filters.push({

      label: fuel,

      type: "fFuel"

    });

  }


  /* Vites */

  if (trans) {

    filters.push({

      label: trans,

      type: "fTrans"

    });

  }


  /* Çipleri oluştur */

  filters.forEach(function(filter) {

    const chip =
      document.createElement("span");


    chip.className =
      "browse-filter-chip";


    const text =
      document.createElement("span");


    text.className =
      "browse-filter-chip-text";


    text.textContent =
      filter.label;


    const close =
      document.createElement("button");


    close.type =
      "button";


    close.innerHTML =
      "×";


    close.setAttribute(
      "aria-label",
      "Filtreyi kaldır"
    );


    close.addEventListener(
      "click",
      function(event) {

        event.preventDefault();

        event.stopPropagation();

        removeBrowseFilter(
          filter.type
        );

      }
    );


    chip.appendChild(text);

    chip.appendChild(close);

    container.appendChild(chip);

  });


  /*
     Hiç filtre yoksa container boş kalır.
  */

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


  /* Tekli filtre */

  if (ids[type]) {

    const el =
      document.getElementById(
        ids[type]
      );


    if (el) {

      el.value = "";

    }

  }


  /* Fiyat */

  if (type === "price") {

    const min =
      document.getElementById(
        "fPriceMin"
      );

    const max =
      document.getElementById(
        "fPriceMax"
      );


    if (min) {

      min.value = "";

    }


    if (max) {

      max.value = "";

    }

  }


  /* Yıl */

  if (type === "year") {

    const min =
      document.getElementById(
        "fYearMin"
      );

    const max =
      document.getElementById(
        "fYearMax"
      );


    if (min) {

      min.value = "";

    }


    if (max) {

      max.value = "";

    }

  }


  /* KM */

  if (type === "km") {

    const km =
      document.getElementById(
        "fKmMax"
      );


    if (km) {

      km.value = "";

    }

  }


  syncBrowseQuickButtons();


  renderBrowseSafe();


  updateBrowseV2UI();

}


/* ============================================================
   FİLTRE DEĞİŞTİĞİNDE ARAÇLARI GÜNCELLE
   ============================================================ */

function applyBrowseFilters() {

  syncBrowseQuickButtons();


  renderBrowseSafe();


  updateBrowseV2UI();

}


/* ============================================================
   ARAMA KUTUSU
   ============================================================ */

function handleBrowseSearch() {

  clearTimeout(
    browseSearchTimer
  );


  browseSearchTimer =
    setTimeout(function() {

      renderBrowseSafe();

      updateBrowseV2UI();

    }, 250);

}


/* ============================================================
   FİLTRE DEĞİŞİKLİKLERİNİ DİNLE
   ============================================================ */

function bindBrowseFilterEvents() {

  const ids = [

    "fBrand",
    "fBody",
    "fPriceMin",
    "fPriceMax",
    "fYearMin",
    "fYearMax",
    "fKmMax",
    "fFuel",
    "fTrans",
    "fSort"

  ];


  ids.forEach(function(id) {

    const el =
      document.getElementById(id);


    if (!el) return;


    /*
       Daha önce bağlanmışsa
       tekrar bağlamıyoruz.
    */

    if (
      el.dataset.browseFilterBound === "true"
    ) {

      return;

    }


    el.dataset.browseFilterBound =
      "true";


    el.addEventListener(
      "change",
      function() {

        applyBrowseFilters();

      }
    );


    /*
       Sayısal alanlarda Enter
       ile de filtre uygula.
    */

    if (
      id === "fPriceMin" ||
      id === "fPriceMax" ||
      id === "fYearMin" ||
      id === "fYearMax" ||
      id === "fKmMax"
    ) {

      el.addEventListener(
        "keydown",
        function(event) {

          if (
            event.key === "Enter"
          ) {

            event.preventDefault();

            applyBrowseFilters();

          }

        }
      );

    }

  });


  /* Arama */

  const query =
    document.getElementById(
      "fQuery"
    );


  if (
    query &&
    query.dataset.browseSearchBound !== "true"
  ) {

    query.dataset.browseSearchBound =
      "true";


    query.addEventListener(
      "input",
      function() {

        updateBrowseV2UI();

        handleBrowseSearch();

      }
    );


    query.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter"
        ) {

          event.preventDefault();

          clearTimeout(
            browseSearchTimer
          );

          applyBrowseFilters();

        }

      }
    );

  }

}


/* ============================================================
   TOPLAM ARAÇ SAYISI
   ============================================================ */

function updateBrowseTotalCount() {

  const total =
    document.getElementById(
      "browseTotalCount"
    );


  if (!total) return;


  /*
     renderBrowse() filtrelenmiş sonuç
     sayısını farklı bir elementte
     yönetiyorsa ona müdahale etmiyoruz.

     Burada yalnızca mevcut veri sayısını
     güvenli şekilde kullanıyoruz.
  */

  if (
    Array.isArray(
      window.dummyCars
    )
  ) {

    /*
       Eğer renderBrowse tarafından
       özel bir değer atanmışsa
       üzerine yazma.
    */

    if (
      !total.dataset.renderControlled
    ) {

      total.textContent =
        window.dummyCars.length
          .toLocaleString("tr-TR");

    }

  }

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
     Hızlı filtreleri senkronize et.
  */

  syncBrowseQuickButtons();


  /*
     Aktif filtre sayısı.
  */

  updateBrowseFilterCount();


  /*
     Toplam araç sayısı.
  */

  updateBrowseTotalCount();

}


/* ============================================================
   DIŞARIDAN FİLTRE UYGULAMA
   ============================================================ */

function applyFilterAndRender() {

  applyBrowseFilters();

}


/* ============================================================
   DIŞARIDAN TEK FİLTRE AYARLAMA
   ============================================================ */

function setBrowseFilter(id, value) {

  const el =
    document.getElementById(id);


  if (!el) return;


  el.value =
    value ?? "";


  applyBrowseFilters();

}


/* ============================================================
   MARKA FİLTRESİ
   ============================================================ */

function setBrowseBrand(brand) {

  setBrowseFilter(
    "fBrand",
    brand
  );

}


/* ============================================================
   KASA FİLTRESİ
   ============================================================ */

function setBrowseBody(body) {

  setBrowseFilter(
    "fBody",
    body
  );

}


/* ============================================================
   YAKIT FİLTRESİ
   ============================================================ */

function setBrowseFuel(fuel) {

  setBrowseFilter(
    "fFuel",
    fuel
  );

}


/* ============================================================
   VİTES FİLTRESİ
   ============================================================ */

function setBrowseTransmission(trans) {

  setBrowseFilter(
    "fTrans",
    trans
  );

}


/* ============================================================
   FİLTRE DURUMU
   ============================================================ */

function hasActiveBrowseFilters() {

  return (
    getBrowseActiveFilterCount() > 0
  );

}


/* ============================================================
   SAYFA AÇILDIĞINDA BAŞLAT
   ============================================================ */

(function initBrowseFilterEnhancements() {

  function init() {

    if (browseFilterInitialized) {

      return;

    }


    browseFilterInitialized =
      true;


    /*
       Eventleri bağla.
    */

    bindBrowseFilterEvents();


    /*
       İlk UI.
    */

    updateBrowseV2UI();

  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  }

  else {

    init();

  }

})();


/* ============================================================
   SAYFA SONRADAN DEĞİŞTİĞİNDE
   FİLTRE ALANLARINI TEKRAR BUL
   ============================================================ */

document.addEventListener(
  "click",
  function(event) {

    /*
       SPA yapısında Araç İncele
       sayfasına sonradan geçildiğinde
       filtre elementleri DOM'a gelmiş
       olabilir.

       Bu yüzden bir sonraki event
       döngüsünde tekrar kontrol ediyoruz.
    */

    const target =
      event.target;


    if (
      target &&
      (
        target.closest?.(
          '[data-page="browse"]'
        ) ||
        target.closest?.(
          '[data-page="browse"]'
        )
      )
    ) {

      setTimeout(function() {

        bindBrowseFilterEvents();

        updateBrowseV2UI();

      }, 50);

    }

  }
);


/* ============================================================
   GLOBAL YARDIMCI
   ============================================================ */

window.AB_BrowseFilters = {

  reset:
    resetFilters,

  apply:
    applyBrowseFilters,

  toggle:
    toggleFilters,

  close:
    closeFilters,

  set:
    setBrowseFilter,

  setBrand:
    setBrowseBrand,

  setBody:
    setBrowseBody,

  setFuel:
    setBrowseFuel,

  setTransmission:
    setBrowseTransmission,

  remove:
    removeBrowseFilter,

  count:
    getBrowseActiveFilterCount,

  hasFilters:
    hasActiveBrowseFilters

};
