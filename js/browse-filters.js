/* ============================================================
   ARABAMI BUL V2 — BROWSE FILTER ENGINE
   ------------------------------------------------------------
   Güvenli filtre sistemi
   - app.js'e dokunmaz
   - createCarCard() kullanır
   - window.dummyCars üzerinden çalışır
   - Filtre yokken TÜM araçları gösterir
   - Marka / Model / Kasa / Yakıt / Vites çoklu seçim
   - Fiyat / Yıl / KM aralığı
   - Sıralama
   - Aktif filtre etiketleri
   ============================================================ */

(function () {

  "use strict";

  let initialized = false;
  let rendering = false;


  /* ==========================================================
     YARDIMCI
     ========================================================== */

  function getEl(id) {
    return document.getElementById(id);
  }


  function getValue(id) {

    const el = getEl(id);

    if (!el) {
      return "";
    }

    return String(el.value || "").trim();

  }


  function getMultiValues(id) {

    const el = getEl(id);

    if (!el) {
      return [];
    }

    if (el.multiple) {

      return Array.from(el.selectedOptions || [])
        .map(option => option.value.trim())
        .filter(Boolean);

    }

    return el.value
      ? [el.value.trim()]
      : [];

  }


  function setMultiValues(id, values) {

    const el = getEl(id);

    if (!el) {
      return;
    }

    const list = Array.isArray(values)
      ? values
      : values
        ? [values]
        : [];


    if (el.multiple) {

      Array.from(el.options).forEach(option => {

        option.selected =
          list.includes(option.value);

      });

    } else {

      el.value =
        list[0] || "";

    }

  }


  function numberValue(id, fallback) {

    const raw = getValue(id);

    if (raw === "") {
      return fallback;
    }

    const number = Number(raw);

    return Number.isFinite(number)
      ? number
      : fallback;

  }


  /* ==========================================================
     ARAÇ VERİSİ
     ========================================================== */

  function getCars() {

    /*
      app.js'nin araçları oluşturmasını bekliyoruz.
    */

    if (
      Array.isArray(window.dummyCars)
    ) {

      return window.dummyCars;

    }

    return [];

  }


  function uniqueSorted(values) {

    return [
      ...new Set(
        values.filter(Boolean)
      )
    ].sort(
      (a, b) =>
        String(a).localeCompare(
          String(b),
          "tr-TR"
        )
    );

  }


  function getModels(selectedBrands) {

    let cars =
      getCars();


    if (
      selectedBrands &&
      selectedBrands.length
    ) {

      cars =
        cars.filter(
          car =>
            selectedBrands.includes(
              car.brand
            )
        );

    }


    return uniqueSorted(
      cars.map(
        car => car.model
      )
    );

  }


  /* ==========================================================
     SELECT HAZIRLA
     ========================================================== */

  function prepareSelect(id) {

    const el =
      getEl(id);

    if (
      !el ||
      el.tagName !== "SELECT"
    ) {
      return;
    }


    /*
      Multiple seçime geçiyoruz.
    */

    if (!el.multiple) {

      el.multiple = true;

    }


    /*
      Native browser'ın büyük kutu açmasını
      engellemek için size 1.
    */

    el.size = 1;

  }


  function prepareFilters() {

    [
      "fBrand",
      "fBody",
      "fFuel",
      "fTrans"
    ].forEach(
      prepareSelect
    );

  }


  /* ==========================================================
     MODEL FİLTRESİ
     ========================================================== */

  function ensureModelFilter() {

    if (
      getEl("fModel")
    ) {

      return;

    }


    const brand =
      getEl("fBrand");


    if (!brand) {
      return;
    }


    const section =
      brand.closest(
        ".browse-filter-section"
      );


    if (!section) {
      return;
    }


    const modelSection =
      document.createElement(
        "div"
      );


    modelSection.className =
      "browse-filter-section";


    modelSection.innerHTML = `

      <div class="browse-filter-section-title">
        Model
      </div>

      <select
        id="fModel"
        multiple
        size="1"
      >
        <option value="">
          Tüm Modeller
        </option>
      </select>

    `;


    section.insertAdjacentElement(
      "afterend",
      modelSection
    );

  }


  function updateModelOptions() {

    const model =
      getEl("fModel");


    if (!model) {
      return;
    }


    const selectedBrands =
      getMultiValues(
        "fBrand"
      );


    const oldModels =
      getMultiValues(
        "fModel"
      );


    const models =
      getModels(
        selectedBrands
      );


    model.innerHTML = `

      <option value="">
        Tüm Modeller
      </option>

    `;


    models.forEach(
      item => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          item;


        option.textContent =
          item;


        if (
          oldModels.includes(
            item
          )
        ) {

          option.selected =
            true;

        }


        model.appendChild(
          option
        );

      }
    );

  }


  /* ==========================================================
     FİLTRELER
     ========================================================== */

  function getFilters() {

    return {

      query:
        getValue(
          "fQuery"
        )
        .toLocaleLowerCase(
          "tr-TR"
        ),


      brands:
        getMultiValues(
          "fBrand"
        ),


      models:
        getMultiValues(
          "fModel"
        ),


      bodies:
        getMultiValues(
          "fBody"
        ),


      fuels:
        getMultiValues(
          "fFuel"
        ),


      trans:
        getMultiValues(
          "fTrans"
        ),


      priceMin:
        numberValue(
          "fPriceMin",
          null
        ),


      priceMax:
        numberValue(
          "fPriceMax",
          null
        ),


      yearMin:
        numberValue(
          "fYearMin",
          null
        ),


      yearMax:
        numberValue(
          "fYearMax",
          null
        ),


      kmMax:
        numberValue(
          "fKmMax",
          null
        ),


      sort:
        getValue(
          "fSort"
        ) || "default"

    };

  }


  /* ==========================================================
     ARAÇ UYGUN MU?
     ========================================================== */

  function carMatches(
    car,
    filters
  ) {

    if (!car) {
      return false;
    }


    /* ARAMA */

    if (
      filters.query
    ) {

      const searchable = `

        ${car.brand || ""}
        ${car.model || ""}
        ${car.title || ""}
        ${car.trim || ""}

      `
        .toLocaleLowerCase(
          "tr-TR"
        );


      if (
        !searchable.includes(
          filters.query
        )
      ) {

        return false;

      }

    }


    /* MARKA */

    if (
      filters.brands.length &&
      !filters.brands.includes(
        car.brand
      )
    ) {

      return false;

    }


    /* MODEL */

    if (
      filters.models.length &&
      !filters.models.includes(
        car.model
      )
    ) {

      return false;

    }


    /* KASA */

    if (
      filters.bodies.length
    ) {

      const body =
        car.body ||
        car.bodyType ||
        "";


      if (
        !filters.bodies.includes(
          body
        )
      ) {

        return false;

      }

    }


    /* YAKIT */

    if (
      filters.fuels.length &&
      !filters.fuels.includes(
        car.fuel
      )
    ) {

      return false;

    }


    /* VİTES */

    if (
      filters.trans.length
    ) {

      const transmission =
        car.trans ||
        car.transmission ||
        "";


      if (
        !filters.trans.includes(
          transmission
        )
      ) {

        return false;

      }

    }


    /* FİYAT */

    const price =
      Number(
        car.price
      ) || 0;


    if (
      filters.priceMin !== null &&
      price < filters.priceMin
    ) {

      return false;

    }


    if (
      filters.priceMax !== null &&
      price > filters.priceMax
    ) {

      return false;

    }


    /* YIL */

    const year =
      Number(
        car.year
      ) || 0;


    if (
      filters.yearMin !== null &&
      year < filters.yearMin
    ) {

      return false;

    }


    if (
      filters.yearMax !== null &&
      year > filters.yearMax
    ) {

      return false;

    }


    /* KM */

    const km =
      Number(
        car.km
      ) || 0;


    if (
      filters.kmMax !== null &&
      km > filters.kmMax
    ) {

      return false;

    }


    return true;

  }


  /* ==========================================================
     FİLTRELE
     ========================================================== */

  function filterCars() {

    const filters =
      getFilters();


    let cars =
      [...getCars()];


    /*
      ÖNEMLİ:
      Hiçbir filtre yoksa bütün araçlar kalır.
    */

    cars =
      cars.filter(
        car =>
          carMatches(
            car,
            filters
          )
      );


    /* SIRALAMA */

    switch (
      filters.sort
    ) {

      case "priceAsc":

        cars.sort(
          (a, b) =>
            (Number(a.price) || 0) -
            (Number(b.price) || 0)
        );

        break;


      case "priceDesc":

        cars.sort(
          (a, b) =>
            (Number(b.price) || 0) -
            (Number(a.price) || 0)
        );

        break;


      case "yearDesc":

        cars.sort(
          (a, b) =>
            (Number(b.year) || 0) -
            (Number(a.year) || 0)
        );

        break;


      case "kmAsc":

        cars.sort(
          (a, b) =>
            (Number(a.km) || 0) -
            (Number(b.km) || 0)
        );

        break;

    }


    return cars;

  }


  /* ==========================================================
     AKTİF FİLTRELER
     ========================================================== */

  function renderActiveFilters() {

    const container =
      getEl(
        "browseActiveFilters"
      );


    if (!container) {
      return;
    }


    const filters =
      getFilters();


    const chips = [];


    filters.brands.forEach(
      value => {

        chips.push({
          type: "brand",
          value: value,
          label: `Marka: ${value}`
        });

      }
    );


    filters.models.forEach(
      value => {

        chips.push({
          type: "model",
          value: value,
          label: `Model: ${value}`
        });

      }
    );


    filters.bodies.forEach(
      value => {

        chips.push({
          type: "body",
          value: value,
          label: `Kasa: ${value}`
        });

      }
    );


    filters.fuels.forEach(
      value => {

        chips.push({
          type: "fuel",
          value: value,
          label: `Yakıt: ${value}`
        });

      }
    );


    filters.trans.forEach(
      value => {

        chips.push({
          type: "trans",
          value: value,
          label: `Vites: ${value}`
        });

      }
    );


    if (
      filters.priceMin !== null
    ) {

      chips.push({
        type: "priceMin",
        value: filters.priceMin,
        label:
          `Min: ${filters.priceMin.toLocaleString("tr-TR")} TL`
      });

    }


    if (
      filters.priceMax !== null
    ) {

      chips.push({
        type: "priceMax",
        value: filters.priceMax,
        label:
          `Max: ${filters.priceMax.toLocaleString("tr-TR")} TL`
      });

    }


    if (
      filters.yearMin !== null
    ) {

      chips.push({
        type: "yearMin",
        value: filters.yearMin,
        label:
          `Min Yıl: ${filters.yearMin}`
      });

    }


    if (
      filters.yearMax !== null
    ) {

      chips.push({
        type: "yearMax",
        value: filters.yearMax,
        label:
          `Max Yıl: ${filters.yearMax}`
      });

    }


    if (
      filters.kmMax !== null
    ) {

      chips.push({
        type: "kmMax",
        value: filters.kmMax,
        label:
          `Max ${filters.kmMax.toLocaleString("tr-TR")} KM`
      });

    }


    if (
      filters.query
    ) {

      chips.push({
        type: "query",
        value: filters.query,
        label:
          `Arama: ${filters.query}`
      });

    }


    container.innerHTML =
      chips
        .map(
          chip => `

            <span class="browse-filter-chip">

              ${chip.label}

              <button
                type="button"
                title="Filtreyi kaldır"
                onclick="removeBrowseFilter('${chip.type}', '${String(chip.value).replace(/'/g, "\\'")}')"
              >
                ×
              </button>

            </span>

          `
        )
        .join("");

  }


  /* ==========================================================
     FİLTRE KALDIR
     ========================================================== */

  window.removeBrowseFilter =
    function (
      type,
      value
    ) {

      const map = {

        brand: "fBrand",
        model: "fModel",
        body: "fBody",
        fuel: "fFuel",
        trans: "fTrans"

      };


      if (
        map[type]
      ) {

        const el =
          getEl(
            map[type]
          );


        if (el) {

          const values =
            getMultiValues(
              map[type]
            );


          setMultiValues(
            map[type],
            values.filter(
              item =>
                item !== value
            )
          );

        }

      }


      const fieldMap = {

        priceMin: "fPriceMin",
        priceMax: "fPriceMax",
        yearMin: "fYearMin",
        yearMax: "fYearMax",
        kmMax: "fKmMax",
        query: "fQuery"

      };


      if (
        fieldMap[type]
      ) {

        const el =
          getEl(
            fieldMap[type]
          );


        if (el) {
          el.value = "";
        }

      }


      renderBrowse();

    };


  /* ==========================================================
     ARAÇ KARTLARINI RENDER ET
     ========================================================== */

  window.renderBrowse =
    function () {

      if (rendering) {
        return;
      }


      const grid =
        getEl(
          "browseGrid"
        );


      if (!grid) {
        return;
      }


      rendering = true;


      try {

        prepareFilters();

        ensureModelFilter();

        updateModelOptions();


        const cars =
          filterCars();


        /* SAYILAR */

        const resultCount =
          getEl(
            "resultCount"
          );


        if (resultCount) {

          resultCount.textContent =
            `${cars.length} araç bulundu`;

        }


        const summaryCount =
          getEl(
            "browseSummaryCount"
          );


        if (summaryCount) {

          summaryCount.textContent =
            cars.length;

        }


        const totalCount =
          getEl(
            "browseTotalCount"
          );


        if (totalCount) {

          totalCount.textContent =
            cars.length;

        }


        renderActiveFilters();


        /* ====================================================
           KARTLAR
           ==================================================== */

        if (
          cars.length > 0
        ) {

          if (
            typeof window.createCarCard ===
            "function"
          ) {

            grid.innerHTML =
              cars
                .map(
                  car =>
                    window.createCarCard(
                      car
                    )
                )
                .join("");

          } else {

            /*
              createCarCard henüz hazır değilse
              gridi boş bırakmıyoruz.
            */

            grid.innerHTML = cars
              .map(
                car => `

                  <div class="browse-empty">

                    <h3>
                      ${car.title || car.model || "Araç"}
                    </h3>

                  </div>

                `
              )
              .join("");

          }

        } else {

          grid.innerHTML = `

            <div
              class="browse-empty"
              style="grid-column:1/-1"
            >

              <div class="browse-empty-icon">
                🔎
              </div>

              <h3>
                Aradığın kriterlerde araç bulunamadı
              </h3>

              <p>
                Filtreleri biraz genişleterek tekrar deneyebilirsin.
              </p>

              <button
                type="button"
                class="btn-primary"
                onclick="resetFilters()"
              >
                Filtreleri Temizle
              </button>

            </div>

          `;

        }

      } finally {

        rendering = false;

      }

    };


  /* ==========================================================
     FİLTRELERİ SIFIRLA
     ========================================================== */

  window.resetFilters =
    function () {

      [
        "fQuery",
        "fPriceMin",
        "fPriceMax",
        "fYearMin",
        "fYearMax",
        "fKmMax"
      ].forEach(
        id => {

          const el =
            getEl(id);

          if (el) {
            el.value = "";
          }

        }
      );


      [
        "fBrand",
        "fModel",
        "fBody",
        "fFuel",
        "fTrans"
      ].forEach(
        id => {

          const el =
            getEl(id);

          if (!el) {
            return;
          }


          if (el.multiple) {

            Array.from(
              el.options
            ).forEach(
              option => {

                option.selected =
                  false;

              }
            );

          } else {

            el.value = "";

          }

        }
      );


      const sort =
        getEl(
          "fSort"
        );


      if (sort) {

        sort.value =
          "default";

      }


      updateModelOptions();

      renderBrowse();

    };


  /* ==========================================================
     MOBİL FİLTRE
     ========================================================== */

  window.toggleFilters =
    function () {

      const panel =
        getEl(
          "filterPanel"
        );


      const state =
        getEl(
          "filterState"
        );


      if (!panel) {
        return;
      }


      const open =
        panel.classList.toggle(
          "open"
        );


      if (state) {

        state.textContent =
          open
            ? "−"
            : "+";

      }

    };


  /* ==========================================================
     KATEGORİ
     ========================================================== */

  window.filterByCategory =
    function (
      category
    ) {

      /*
        Önce sayfaya geç.
      */

      if (
        typeof window.go ===
        "function"
      ) {

        window.go(
          "browse"
        );

      }


      /*
        Diğer filtreleri temizle.
      */

      [
        "fQuery",
        "fPriceMin",
        "fPriceMax",
        "fYearMin",
        "fYearMax",
        "fKmMax"
      ].forEach(
        id => {

          const el =
            getEl(id);

          if (el) {
            el.value = "";
          }

        }
      );


      setMultiValues(
        "fBrand",
        []
      );


      setMultiValues(
        "fModel",
        []
      );


      setMultiValues(
        "fBody",
        []
      );


      setMultiValues(
        "fFuel",
        []
      );


      setMultiValues(
        "fTrans",
        []
      );


      if (
        [
          "Sedan",
          "SUV",
          "Hatchback",
          "Coupe"
        ].includes(
          category
        )
      ) {

        setMultiValues(
          "fBody",
          [category]
        );

      }


      if (
        [
          "Elektrik",
          "Hibrit"
        ].includes(
          category
        )
      ) {

        setMultiValues(
          "fFuel",
          [category]
        );

      }


      renderBrowse();

    };


  /* ==========================================================
     EVENTLER
     ========================================================== */

  function attachEvents() {

    const textInputs = [

      "fQuery",
      "fPriceMin",
      "fPriceMax",
      "fYearMin",
      "fYearMax",
      "fKmMax"

    ];


    textInputs.forEach(
      id => {

        const el =
          getEl(id);


        if (!el) {
          return;
        }


        el.addEventListener(
          "input",
          function () {

            renderBrowse();

          }
        );


        el.addEventListener(
          "change",
          function () {

            renderBrowse();

          }
        );

      }
    );


    [
      "fBrand",
      "fModel",
      "fBody",
      "fFuel",
      "fTrans",
      "fSort"
    ].forEach(
      id => {

        const el =
          getEl(id);


        if (!el) {
          return;
        }


        el.addEventListener(
          "change",
          function () {

            if (
              id === "fBrand"
            ) {

              updateModelOptions();

            }


            renderBrowse();

          }
        );

      }
    );

  }


  /* ==========================================================
     BAŞLAT
     ========================================================== */

  function initBrowseFilters() {

    if (initialized) {
      return;
    }


    /*
      Araç verisi henüz hazır değilse
      biraz daha bekle.
    */

    if (
      !Array.isArray(
        window.dummyCars
      ) ||
      window.dummyCars.length === 0
    ) {

      setTimeout(
        initBrowseFilters,
        100
      );

      return;

    }


    /*
      Browse HTML'si de hazır olmalı.
    */

    if (
      !getEl("browseGrid")
    ) {

      setTimeout(
        initBrowseFilters,
        100
      );

      return;

    }


    initialized = true;


    prepareFilters();

    ensureModelFilter();

    updateModelOptions();

    attachEvents();


    /*
      İlk render.
      Burada artık dummyCars kesin hazır.
    */

    renderBrowse();

  }


  /* ==========================================================
     DOM HAZIR
     ========================================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      function () {

        setTimeout(
          initBrowseFilters,
          100
        );

      }
    );

  } else {

    setTimeout(
      initBrowseFilters,
      100
    );

  }


})();
