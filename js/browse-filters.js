/* ============================================================
   ARABAMI BUL V2 — BROWSE FILTER ENGINE
   ------------------------------------------------------------
   app.js'e dokunmaz.
   createCarCard() kullanmaya devam eder.
   window.dummyCars üzerinden çalışır.
   ============================================================ */

(function () {

  "use strict";


  /* ==========================================================
     YARDIMCI FONKSİYONLAR
     ========================================================== */

  function getEl(id) {
    return document.getElementById(id);
  }


  function getValue(id) {

    const el = getEl(id);

    if (!el) {
      return "";
    }

    return el.value || "";

  }


  function getMultiValues(id) {

    const el = getEl(id);

    if (!el) {
      return [];
    }

    /*
      Normal select de destekleniyor.
      Multiple select de destekleniyor.
    */

    if (el.multiple) {

      return Array.from(el.selectedOptions)
        .map(option => option.value)
        .filter(Boolean);

    }

    return el.value
      ? [el.value]
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

    const value =
      Number(
        getValue(id)
      );

    return Number.isFinite(value)
      ? value
      : fallback;

  }


  /* ==========================================================
     VERİ
     ========================================================== */

  function getCars() {

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


  function getBrands() {

    return uniqueSorted(
      getCars().map(
        car => car.brand
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
     SELECT'I MULTI SELECT YAP
     ========================================================== */

  function prepareSelect(id) {

    const el =
      getEl(id);

    if (!el) {
      return;
    }

    /*
      Zaten multiple ise dokunma.
    */

    if (
      el.multiple
    ) {

      return;

    }

    /*
      index.html'deki mevcut selectleri
      bozmadan multiple hale getiriyoruz.
    */

    el.multiple = true;

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
     MODEL FİLTRESİ OLUŞTUR
     ========================================================== */

  function ensureModelFilter() {

    const brand =
      getEl("fBrand");

    if (!brand) {
      return;
    }


    /*
      Eğer fModel zaten index.html'de varsa
      onu kullan.
    */

    if (
      getEl("fModel")
    ) {

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


    const model =
      getEl("fModel");


    if (model) {

      model.addEventListener(
        "change",
        renderBrowse
      );

    }


    updateModelOptions();

  }


  /* ==========================================================
     MODEL SEÇENEKLERİNİ GÜNCELLE
     ========================================================== */

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

        option.selected =
          oldModels.includes(
            item
          );

        model.appendChild(
          option
        );

      }
    );

  }


  /* ==========================================================
     FİLTRE DEĞERLERİNİ TOPLA
     ========================================================== */

  function getFilters() {

    return {

      query:
        getValue(
          "fQuery"
        )
          .trim()
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
          0
        ),

      priceMax:
        numberValue(
          "fPriceMax",
          Infinity
        ),

      yearMin:
        numberValue(
          "fYearMin",
          0
        ),

      yearMax:
        numberValue(
          "fYearMax",
          Infinity
        ),

      kmMax:
        numberValue(
          "fKmMax",
          Infinity
        ),

      sort:
        getValue(
          "fSort"
        ) || "default"

    };

  }


  /* ==========================================================
     ARAÇ FİLTRELEME
     ========================================================== */

  function filterCars() {

    const filters =
      getFilters();


    let cars =
      getCars();


    cars =
      cars.filter(
        car => {

          /*
            ARAMA
          */

          if (
            filters.query
          ) {

            const searchable = (

              `${car.brand || ""} ` +
              `${car.model || ""} ` +
              `${car.trim || ""}`

            )
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


          /*
            MARKA
          */

          if (
            filters.brands.length &&
            !filters.brands.includes(
              car.brand
            )
          ) {

            return false;

          }


          /*
            MODEL
          */

          if (
            filters.models.length &&
            !filters.models.includes(
              car.model
            )
          ) {

            return false;

          }


          /*
            KASA
          */

          if (
            filters.bodies.length &&
            !filters.bodies.includes(
              car.body || car.seg
            )
          ) {

            return false;

          }


          /*
            YAKIT
          */

          if (
            filters.fuels.length &&
            !filters.fuels.includes(
              car.fuel
            )
          ) {

            return false;

          }


          /*
            VİTES
          */

          if (
            filters.trans.length &&
            !filters.trans.includes(
              car.trans ||
              car.transmission
            )
          ) {

            return false;

          }


          /*
            FİYAT MIN
          */

          if (
            filters.priceMin > 0 &&
            Number(car.price) <
            filters.priceMin
          ) {

            return false;

          }


          /*
            FİYAT MAX
          */

          if (
            filters.priceMax !== Infinity &&
            Number(car.price) >
            filters.priceMax
          ) {

            return false;

          }


          /*
            YIL MIN
          */

          if (
            filters.yearMin > 0 &&
            Number(car.year) <
            filters.yearMin
          ) {

            return false;

          }


          /*
            YIL MAX
          */

          if (
            filters.yearMax !== Infinity &&
            Number(car.year) >
            filters.yearMax
          ) {

            return false;

          }


          /*
            KM MAX
          */

          if (
            filters.kmMax !== Infinity &&
            Number(car.km) >
            filters.kmMax
          ) {

            return false;

          }


          return true;

        }
      );


    /* ========================================================
       SIRALAMA
       ======================================================== */

    switch (
      filters.sort
    ) {

      case "priceAsc":

        cars.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );

        break;


      case "priceDesc":

        cars.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );

        break;


      case "yearDesc":

        cars.sort(
          (a, b) =>
            Number(b.year) -
            Number(a.year)
        );

        break;


      case "kmAsc":

        cars.sort(
          (a, b) =>
            Number(a.km) -
            Number(b.km)
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

          label:
            `Marka: ${value}`

        });

      }
    );


    filters.models.forEach(
      value => {

        chips.push({

          type: "model",

          value: value,

          label:
            `Model: ${value}`

        });

      }
    );


    filters.bodies.forEach(
      value => {

        chips.push({

          type: "body",

          value: value,

          label:
            `Kasa: ${value}`

        });

      }
    );


    filters.fuels.forEach(
      value => {

        chips.push({

          type: "fuel",

          value: value,

          label:
            `Yakıt: ${value}`

        });

      }
    );


    filters.trans.forEach(
      value => {

        chips.push({

          type: "trans",

          value: value,

          label:
            `Vites: ${value}`

        });

      }
    );


    if (
      filters.priceMin > 0
    ) {

      chips.push({

        type: "priceMin",

        value:
          filters.priceMin,

        label:
          `Min: ${filters.priceMin.toLocaleString("tr-TR")} TL`

      });

    }


    if (
      filters.priceMax !== Infinity
    ) {

      chips.push({

        type: "priceMax",

        value:
          filters.priceMax,

        label:
          `Max: ${filters.priceMax.toLocaleString("tr-TR")} TL`

      });

    }


    if (
      filters.yearMin > 0
    ) {

      chips.push({

        type: "yearMin",

        value:
          filters.yearMin,

        label:
          `Min Yıl: ${filters.yearMin}`

      });

    }


    if (
      filters.yearMax !== Infinity
    ) {

      chips.push({

        type: "yearMax",

        value:
          filters.yearMax,

        label:
          `Max Yıl: ${filters.yearMax}`

      });

    }


    if (
      filters.kmMax !== Infinity
    ) {

      chips.push({

        type: "kmMax",

        value:
          filters.kmMax,

        label:
          `Max ${filters.kmMax.toLocaleString("tr-TR")} KM`

      });

    }


    if (
      filters.query
    ) {

      chips.push({

        type: "query",

        value:
          filters.query,

        label:
          `Arama: ${filters.query}`

      });

    }


    container.innerHTML =
      chips.map(
        chip => `

          <span
            class="browse-filter-chip"
          >

            ${chip.label}

            <button
              type="button"
              title="Filtreyi kaldır"
              onclick="
                removeBrowseFilter(
                  '${chip.type}',
                  '${String(
                    chip.value
                  ).replace(
                    /'/g,
                    "\\'"
                  )}'
                )
              "
            >
              ×
            </button>

          </span>

        `
      )
      .join("");

  }


  /* ==========================================================
     TEK FİLTRE SİL
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

        if (!el) {
          return;
        }


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


      if (
        type === "priceMin"
      ) {

        const el =
          getEl(
            "fPriceMin"
          );

        if (el) {
          el.value = "";
        }

      }


      if (
        type === "priceMax"
      ) {

        const el =
          getEl(
            "fPriceMax"
          );

        if (el) {
          el.value = "";
        }

      }


      if (
        type === "yearMin"
      ) {

        const el =
          getEl(
            "fYearMin"
          );

        if (el) {
          el.value = "";
        }

      }


      if (
        type === "yearMax"
      ) {

        const el =
          getEl(
            "fYearMax"
          );

        if (el) {
          el.value = "";
        }

      }


      if (
        type === "kmMax"
      ) {

        const el =
          getEl(
            "fKmMax"
          );

        if (el) {
          el.value = "";
        }

      }


      if (
        type === "query"
      ) {

        const el =
          getEl(
            "fQuery"
          );

        if (el) {
          el.value = "";
        }

      }


      renderBrowse();

    };


  /* ==========================================================
     RENDER BROWSE
     ========================================================== */

  window.renderBrowse =
    function () {

      const grid =
        getEl(
          "browseGrid"
        );


      if (!grid) {
        return;
      }


      prepareFilters();

      ensureModelFilter();

      updateModelOptions();


      const cars =
        filterCars();


      const resultCount =
        getEl(
          "resultCount"
        );


      if (resultCount) {

        resultCount.textContent =
          `Bulunan Araç: ${cars.length}`;

      }


      const summaryCount =
        getEl(
          "browseSummaryCount"
        );


      if (summaryCount) {

        summaryCount.textContent =
          cars.length;

      }


      renderActiveFilters();


      /*
        Araç kartlarını mevcut app.js'deki
        createCarCard() fonksiyonuyla oluştur.
      */

      if (
        cars.length
      ) {

        grid.innerHTML =
          cars
            .map(
              car =>
                typeof createCarCard ===
                "function"

                  ?

                createCarCard(
                  car
                )

                  :

                ""
            )
            .join("");

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

    };


  /* ==========================================================
     FİLTRELERİ TEMİZLE
     ========================================================== */

  window.resetFilters =
    function () {

      const ids = [

        "fQuery",
        "fPriceMin",
        "fPriceMax",
        "fYearMin",
        "fYearMax",
        "fKmMax"

      ];


      ids.forEach(
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
     EVENTLER
     ========================================================== */

  function attachEvents() {

    const ids = [

      "fQuery",
      "fPriceMin",
      "fPriceMax",
      "fYearMin",
      "fYearMax",
      "fKmMax",
      "fSort"

    ];


    ids.forEach(
      id => {

        const el =
          getEl(id);

        if (!el) {
          return;
        }


        el.addEventListener(
          "input",
          renderBrowse
        );


        el.addEventListener(
          "change",
          renderBrowse
        );

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
     KATEGORİ FONKSİYONUNU UYUMLU HALE GETİR
     ========================================================== */

  window.filterByCategory =
    function (
      category
    ) {

      go("browse");


      const body =
        getEl(
          "fBody"
        );

      const fuel =
        getEl(
          "fFuel"
        );


      if (body) {

        setMultiValues(
          "fBody",
          category === "Elektrik"
            ? []
            : category
              ? [category]
              : []
        );

      }


      if (fuel) {

        setMultiValues(
          "fFuel",
          category === "Elektrik"
            ? ["Elektrik"]
            : []
        );

      }


      renderBrowse();

    };


  /* ==========================================================
     HAZIRLIK
     ========================================================== */

  function initBrowseFilters() {

    prepareFilters();

    ensureModelFilter();

    attachEvents();

    renderBrowse();

  }


  /*
    app.js'deki DOMContentLoaded'dan sonra
    çalışması için küçük gecikme kullanıyoruz.
  */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      function () {

        setTimeout(
          initBrowseFilters,
          50
        );

      }
    );

  } else {

    setTimeout(
      initBrowseFilters,
      50
    );

  }


})();
