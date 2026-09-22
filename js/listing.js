/* ============================================================
   ARABAMI BUL V2 — listing.js
   İLAN VER SİSTEMİ
   HTML yapısıyla birebir uyumlu sürüm

   V2.2
   - Marka seçmeli
   - Model markaya göre seçmeli
   - Versiyon modele göre seçmeli
   - Yıl seçmeli
   - Kasa / Yakıt / Vites mevcut select yapısıyla uyumlu
   - KM ve Fiyat manuel giriş
   - Mevcut ilan, fotoğraf ve adım sistemi korunmuştur
   ============================================================ */

(function () {

  'use strict';

  /* ============================================================
     GLOBAL STATE
     ============================================================ */

  window.ArabamiBul = window.ArabamiBul || {};

  window.ArabamiBul.listing =
    window.ArabamiBul.listing || {
      uploadedImages: [],
      currentSellStep: 1
    };

  const listingState =
    window.ArabamiBul.listing;

  const MAX_IMAGES = 20;


  /* ============================================================
     MARKA / MODEL / VERSİYON VERİLERİ
     ============================================================ */

  const vehicleData = {

    "Audi": {
      "A3": ["Sportback", "Sedan"],
      "A4": ["Advanced", "S Line"],
      "A5": ["Advanced", "S Line"],
      "Q3": ["Advanced", "S Line"],
      "Q5": ["Advanced", "S Line"]
    },

    "BMW": {
      "1 Serisi": ["120", "120d"],
      "2 Serisi": ["220i", "M240i"],
      "3 Serisi": ["320i", "330i", "M340i"],
      "5 Serisi": ["520i", "530i"],
      "X1": ["sDrive18i", "xDrive20i"],
      "X3": ["xDrive20i", "xDrive30i"]
    },

    "Citroen": {
      "C3": ["Feel", "Shine"],
      "C4": ["Feel", "Shine"],
      "C5 Aircross": ["Feel", "Shine"]
    },

    "Ford": {
      "Fiesta": ["Titanium", "ST-Line"],
      "Focus": ["Titanium", "ST-Line"],
      "Puma": ["Titanium", "ST-Line"],
      "Kuga": ["Titanium", "ST-Line"]
    },

    "Honda": {
      "Civic": ["Elegance", "Executive+"],
      "HR-V": ["Elegance", "Advance"],
      "CR-V": ["Elegance", "Executive+"]
    },

    "Hyundai": {
      "i10": ["Jump", "Style"],
      "i20": ["Jump", "Style", "Elite"],
      "Bayon": ["Jump", "Style", "Elite"],
      "Tucson": ["Prime", "Elite"]
    },

    "Kia": {
      "Picanto": ["Feel", "Live"],
      "Rio": ["Cool", "Elegance"],
      "Stonic": ["Cool", "Elegance"],
      "Sportage": ["Cool", "Elegance"]
    },

    "Mercedes-Benz": {
      "A Serisi": ["A180", "A200"],
      "C Serisi": ["C180", "C200"],
      "E Serisi": ["E200", "E220d"],
      "GLA": ["180", "200"],
      "GLC": ["200", "220d"]
    },

    "Nissan": {
      "Micra": ["Tekna", "Platinum"],
      "Juke": ["Tekna", "Platinum"],
      "Qashqai": ["Tekna", "Platinum"],
      "X-Trail": ["Tekna", "Platinum"]
    },

    "Opel": {
      "Corsa": ["Edition", "GS"],
      "Astra": ["Edition", "GS"],
      "Mokka": ["Edition", "GS"],
      "Grandland": ["Edition", "GS"]
    },

    "Peugeot": {
      "208": ["Active", "Allure", "GT"],
      "308": ["Active", "Allure", "GT"],
      "2008": ["Active", "Allure", "GT"],
      "3008": ["Active", "Allure", "GT"]
    },

    "Renault": {
      "Clio": ["Evolution", "Techno"],
      "Megane": ["Joy", "Touch", "Icon"],
      "Captur": ["Evolution", "Techno"],
      "Austral": ["Techno", "Esprit Alpine"]
    },

    "Seat": {
      "Ibiza": ["Style", "FR"],
      "Leon": ["Style", "FR"],
      "Arona": ["Style", "FR"],
      "Ateca": ["Style", "FR"]
    },

    "Skoda": {
      "Fabia": ["Elite", "Premium"],
      "Scala": ["Elite", "Premium"],
      "Octavia": ["Elite", "Premium"],
      "Karoq": ["Elite", "Premium"],
      "Kodiaq": ["Elite", "Premium"]
    },

    "Tesla": {
      "Model 3": [
        "Standard Range",
        "Long Range",
        "Performance"
      ],
      "Model Y": [
        "Standard Range",
        "Long Range",
        "Performance"
      ]
    },

    "Toyota": {
      "Yaris": ["Vision", "Passion"],
      "Corolla": ["Dream", "Flame", "Passion"],
      "C-HR": ["Flame", "Passion"],
      "RAV4": ["Passion", "Adventure"]
    },

    "Volkswagen": {
      "Polo": ["Life", "Style"],
      "Golf": ["Life", "Style", "R-Line"],
      "Passat": ["Business", "Elegance"],
      "T-Roc": ["Life", "Style"],
      "Tiguan": ["Life", "Elegance"]
    },

    "Volvo": {
      "XC40": ["Core", "Plus"],
      "XC60": ["Core", "Plus", "Ultimate"],
      "XC90": ["Plus", "Ultimate"]
    }

  };


  /* ============================================================
     YIL VERİLERİ
     ============================================================ */

  const currentYear =
    new Date().getFullYear();

  const vehicleYears = [];

  for (
    let year = currentYear;
    year >= 1990;
    year--
  ) {

    vehicleYears.push(String(year));

  }


  /* ============================================================
     YARDIMCI FONKSİYONLAR
     ============================================================ */

  function getEl(id) {

    return document.getElementById(id);

  }


  function getValue(id) {

    const el = getEl(id);

    return el
      ? String(el.value || '').trim()
      : '';

  }


  function setValue(id, value) {

    const el = getEl(id);

    if (!el) return;

    el.value = value ?? '';

  }


  function getNumberValue(id) {

    const value = getValue(id);

    if (!value) return 0;

    return Number(
      value
        .replace(/\./g, '')
        .replace(',', '.')
    ) || 0;

  }


  function formatMoney(value) {

    const number = Number(value) || 0;

    return number.toLocaleString('tr-TR') + ' TL';

  }


  function formatNumber(value) {

    const number = Number(value) || 0;

    return number.toLocaleString('tr-TR');

  }


  function escapeHtml(value) {

    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  }


  /* ============================================================
     SELECT YARDIMCILARI
     ============================================================ */

  function clearSelect(select, placeholder) {

    if (!select) return;

    select.innerHTML = '';

    const option =
      document.createElement('option');

    option.value = '';
    option.textContent =
      placeholder || 'Seçiniz';

    select.appendChild(option);

  }


  function addSelectOption(select, value, text) {

    if (!select) return;

    const option =
      document.createElement('option');

    option.value = value;
    option.textContent =
      text || value;

    select.appendChild(option);

  }


  function fillSelect(select, values, placeholder) {

    if (!select) return;

    clearSelect(
      select,
      placeholder
    );

    values.forEach(function (value) {

      addSelectOption(
        select,
        value,
        value
      );

    });

  }


  /* ============================================================
     MARKA SELECT
     ============================================================ */

  function initializeBrandSelector() {

    const brand =
      getEl('addBrand');

    if (!brand) {
      return;
    }

    /*
      Eğer HTML'de input olarak kalmışsa
      otomatik olarak select'e çevir.
    */

    if (
      brand.tagName.toLowerCase() !== 'select'
    ) {

      const select =
        document.createElement('select');

      select.id =
        brand.id;

      select.name =
        brand.name || brand.id;

      select.className =
        brand.className;

      select.required =
        brand.required;

      select.setAttribute(
        'aria-label',
        'Marka'
      );

      brand.parentNode.replaceChild(
        select,
        brand
      );

    }

    const brandSelect =
      getEl('addBrand');

    fillSelect(
      brandSelect,
      Object.keys(vehicleData),
      'Marka seçiniz'
    );

  }


  /* ============================================================
     MODEL SELECT
     ============================================================ */

  function initializeModelSelector(
    selectedModel
  ) {

    const model =
      getEl('addModel');

    if (!model) {
      return;
    }

    if (
      model.tagName.toLowerCase() !== 'select'
    ) {

      const select =
        document.createElement('select');

      select.id =
        model.id;

      select.name =
        model.name || model.id;

      select.className =
        model.className;

      select.required =
        model.required;

      select.setAttribute(
        'aria-label',
        'Model'
      );

      model.parentNode.replaceChild(
        select,
        model
      );

    }

    const modelSelect =
      getEl('addModel');

    const brand =
      getValue('addBrand');

    const models =
      brand &&
      vehicleData[brand]
        ? Object.keys(
            vehicleData[brand]
          )
        : [];

    fillSelect(
      modelSelect,
      models,
      brand
        ? 'Model seçiniz'
        : 'Önce marka seçiniz'
    );

    if (
      selectedModel &&
      models.includes(selectedModel)
    ) {

      modelSelect.value =
        selectedModel;

    }

  }


  /* ============================================================
     VERSİYON SELECT
     ============================================================ */

  function initializeVersionSelector(
    selectedVersion
  ) {

    const version =
      getEl('addVersion');

    if (!version) {
      return;
    }

    if (
      version.tagName.toLowerCase() !== 'select'
    ) {

      const select =
        document.createElement('select');

      select.id =
        version.id;

      select.name =
        version.name || version.id;

      select.className =
        version.className;

      select.required =
        false;

      select.setAttribute(
        'aria-label',
        'Versiyon'
      );

      version.parentNode.replaceChild(
        select,
        version
      );

    }

    const versionSelect =
      getEl('addVersion');

    const brand =
      getValue('addBrand');

    const model =
      getValue('addModel');

    const versions =
      brand &&
      model &&
      vehicleData[brand] &&
      vehicleData[brand][model]
        ? vehicleData[brand][model]
        : [];

    fillSelect(
      versionSelect,
      versions,
      model
        ? 'Versiyon seçiniz'
        : 'Önce model seçiniz'
    );

    if (
      selectedVersion &&
      versions.includes(selectedVersion)
    ) {

      versionSelect.value =
        selectedVersion;

    }

  }


  /* ============================================================
     YIL SELECT
     ============================================================ */

  function initializeYearSelector(
    selectedYear
  ) {

    const year =
      getEl('addYear');

    if (!year) {
      return;
    }

    if (
      year.tagName.toLowerCase() !== 'select'
    ) {

      const select =
        document.createElement('select');

      select.id =
        year.id;

      select.name =
        year.name || year.id;

      select.className =
        year.className;

      select.required =
        year.required;

      select.setAttribute(
        'aria-label',
        'Model yılı'
      );

      year.parentNode.replaceChild(
        select,
        year
      );

    }

    const yearSelect =
      getEl('addYear');

    fillSelect(
      yearSelect,
      vehicleYears,
      'Model yılı seçiniz'
    );

    if (
      selectedYear &&
      vehicleYears.includes(
        String(selectedYear)
      )
    ) {

      yearSelect.value =
        String(selectedYear);

    }

  }


  /* ============================================================
     SELECT EVENTLERİ
     ============================================================ */

  function setupVehicleSelectorEvents() {

    const brand =
      getEl('addBrand');

    const model =
      getEl('addModel');

    const version =
      getEl('addVersion');


    if (brand) {

      if (
        brand.dataset.selectorReady !== 'true'
      ) {

        brand.dataset.selectorReady =
          'true';

        brand.addEventListener(
          'change',
          function () {

            initializeModelSelector();

            initializeVersionSelector();

            saveListingDraft();

          }
        );

      }

    }


    if (model) {

      if (
        model.dataset.selectorReady !== 'true'
      ) {

        model.dataset.selectorReady =
          'true';

        model.addEventListener(
          'change',
          function () {

            initializeVersionSelector();

            saveListingDraft();

          }
        );

      }

    }


    if (version) {

      if (
        version.dataset.selectorReady !== 'true'
      ) {

        version.dataset.selectorReady =
          'true';

        version.addEventListener(
          'change',
          function () {

            saveListingDraft();

          }
        );

      }

    }

  }


  /* ============================================================
     TÜM ARAÇ SELECTORLARINI BAŞLAT
     ============================================================ */

  function initializeListingSelectors(
    savedValues
  ) {

    savedValues =
      savedValues || {};


    /*
      1. Marka
    */

    initializeBrandSelector();


    const brand =
      getEl('addBrand');


    if (
      savedValues.brand
    ) {

      brand.value =
        savedValues.brand;

    }


    /*
      2. Model
    */

    initializeModelSelector(
      savedValues.model
    );


    /*
      3. Versiyon
    */

    initializeVersionSelector(
      savedValues.version
    );


    /*
      4. Yıl
    */

    initializeYearSelector(
      savedValues.year
    );


    /*
      Eventleri en son bağla.
    */

    setupVehicleSelectorEvents();

  }


  /* ============================================================
     ADIM ELEMENTLERİNİ BUL
     ============================================================ */

  function getSellPanel(stepNumber) {

    return document.querySelector(
      '[data-listing-step="' + stepNumber + '"]'
    );

  }


  function getSellStepNode(stepNumber) {

    return document.querySelector(
      '.listing-step[data-step="' + stepNumber + '"]'
    );

  }


  /* ============================================================
     ADIM DEĞİŞTİRME
     ============================================================ */

  function goToSellStep(stepNumber) {

    stepNumber = Number(stepNumber);

    if (!Number.isInteger(stepNumber)) {
      stepNumber = 1;
    }

    if (stepNumber < 1) {
      stepNumber = 1;
    }

    if (stepNumber > 4) {
      stepNumber = 4;
    }


    document.querySelectorAll(
      '[data-listing-step]'
    ).forEach(function (panel) {

      panel.classList.remove('active');
      panel.classList.remove('listing-panel-active');

      panel.style.display = 'none';

    });


    const targetPanel =
      getSellPanel(stepNumber);

    if (targetPanel) {

      targetPanel.classList.add('active');
      targetPanel.classList.add(
        'listing-panel-active'
      );

      panelDisplay(targetPanel);

    }


    document.querySelectorAll(
      '.listing-step'
    ).forEach(function (node) {

      node.classList.remove('active');
      node.classList.remove('completed');

    });


    const activeNode =
      getSellStepNode(stepNumber);

    if (activeNode) {

      activeNode.classList.add('active');

    }


    document.querySelectorAll(
      '.listing-step'
    ).forEach(function (node) {

      const nodeStep =
        Number(
          node.getAttribute('data-step')
        );

      if (
        Number.isFinite(nodeStep) &&
        nodeStep < stepNumber
      ) {

        node.classList.add('completed');

      }

    });


    listingState.currentSellStep =
      stepNumber;


    const progressFill =
      getEl('sellStepFill');

    if (progressFill) {

      const percentage =
        stepNumber === 1 ? 25 :
        stepNumber === 2 ? 50 :
        stepNumber === 3 ? 75 :
        100;

      progressFill.style.width =
        percentage + '%';

    }


    const backButton =
      getEl('listingBackBtn');

    const nextButton =
      getEl('listingNextBtn');

    const publishButton =
      getEl('listingPublishBtn');


    if (backButton) {

      backButton.style.display =
        stepNumber === 1
          ? 'none'
          : '';

    }


    if (nextButton) {

      nextButton.style.display =
        stepNumber === 4
          ? 'none'
          : '';

    }


    if (publishButton) {

      publishButton.style.display =
        stepNumber === 4
          ? ''
          : 'none';

    }


    if (stepNumber === 4) {

      buildListingSummary();

    }


    updateImageCounter();

  }


  function panelDisplay(panel) {

    if (!panel) return;

    panel.style.display = 'block';

  }


  /* ============================================================
     ADIM VALIDASYONU
     ============================================================ */

  function validateSellStep(stepNumber) {

    stepNumber = Number(stepNumber);


    if (stepNumber === 1) {

      const requiredFields = [

        {
          id: 'addBrand',
          name: 'Marka'
        },

        {
          id: 'addModel',
          name: 'Model'
        },

        {
          id: 'addYear',
          name: 'Model Yılı'
        },

        {
          id: 'addBody',
          name: 'Kasa Tipi'
        },

        {
          id: 'addFuel',
          name: 'Yakıt Tipi'
        },

        {
          id: 'addTrans',
          name: 'Vites Tipi'
        },

        {
          id: 'addKm',
          name: 'Kilometre'
        },

        {
          id: 'addPrice',
          name: 'Satış Fiyatı'
        }

      ];


      for (
        let i = 0;
        i < requiredFields.length;
        i++
      ) {

        const field =
          requiredFields[i];

        const element =
          getEl(field.id);

        if (!element) {
          continue;
        }


        if (
          !String(
            element.value || ''
          ).trim()
        ) {

          alert(
            field.name +
            ' alanını doldurmalısın.'
          );

          element.focus();

          return false;

        }

      }


      return true;

    }


    if (stepNumber === 2) {

      if (
        listingState.uploadedImages.length === 0
      ) {

        const continueWithoutPhoto =
          confirm(
            'Henüz fotoğraf eklemedin.\n\n' +
            'Fotoğraf eklemeden devam etmek istiyor musun?'
          );

        if (!continueWithoutPhoto) {

          return false;

        }

      }


      return true;

    }


    if (stepNumber === 3) {

      const titleInput =
        getEl('addTitle');


      if (titleInput) {

        if (
          !titleInput.value.trim()
        ) {

          alert(
            'İlan başlığını yazmalısın.'
          );

          titleInput.focus();

          return false;

        }

      }


      return true;

    }


    if (stepNumber === 4) {

      return true;

    }


    return true;

  }


  /* ============================================================
     SONRAKİ ADIM
     ============================================================ */

  function listingNextStep() {

    const currentStep =
      Number(
        listingState.currentSellStep
      ) || 1;


    if (
      !validateSellStep(currentStep)
    ) {

      return;

    }


    if (currentStep < 4) {

      goToSellStep(
        currentStep + 1
      );

    }

  }


  /* ============================================================
     ÖNCEKİ ADIM
     ============================================================ */

  function listingPrevStep() {

    const currentStep =
      Number(
        listingState.currentSellStep
      ) || 1;


    if (currentStep > 1) {

      goToSellStep(
        currentStep - 1
      );

    }

  }


  /* ============================================================
     ESKİ İSİMLERLE UYUMLULUK
     ============================================================ */

  function nextSellStep() {

    listingNextStep();

  }


  function previousSellStep() {

    listingPrevStep();

  }


  /* ============================================================
     FOTOĞRAF SİSTEMİ
     ============================================================ */

  function processImageFiles(files) {

    if (
      !files ||
      !files.length
    ) {

      return;

    }


    const remainingSlots =
      MAX_IMAGES -
      listingState.uploadedImages.length;


    if (remainingSlots <= 0) {

      alert(
        'En fazla ' +
        MAX_IMAGES +
        ' fotoğraf ekleyebilirsin.'
      );

      return;

    }


    const selectedFiles =
      Array.from(files)
        .slice(0, remainingSlots);


    let processedCount = 0;


    selectedFiles.forEach(
      function (file) {

        if (
          !file.type.startsWith('image/')
        ) {

          processedCount++;

          return;

        }


        const reader =
          new FileReader();


        reader.onload =
          function (event) {

            listingState.uploadedImages.push({

              id:
                Date.now() +
                '_' +
                Math.random()
                  .toString(36)
                  .substring(2, 9),

              name:
                file.name,

              type:
                file.type,

              size:
                file.size,

              data:
                event.target.result

            });


            processedCount++;


            if (
              processedCount >=
              selectedFiles.length
            ) {

              renderImagePreviews();

              updateImageCounter();

              saveListingDraft();

            }

          };


        reader.onerror =
          function () {

            processedCount++;


            if (
              processedCount >=
              selectedFiles.length
            ) {

              renderImagePreviews();

              updateImageCounter();

            }

          };


        reader.readAsDataURL(file);

      }
    );


    if (
      files.length > remainingSlots
    ) {

      alert(
        'En fazla ' +
        MAX_IMAGES +
        ' fotoğraf ekleyebilirsin.'
      );

    }

  }


  function handleImageUpload(event) {

    if (!event) {
      return;
    }


    const input =
      event.target ||
      event.srcElement;


    if (
      !input ||
      !input.files
    ) {

      return;

    }


    processImageFiles(
      Array.from(input.files)
    );


    setTimeout(
      function () {

        try {

          input.value = '';

        } catch (error) {

          /* boş */

        }

      },
      100
    );

  }


  /* ============================================================
     FOTOĞRAF ÖNİZLEMELERİ
     ============================================================ */

  function renderImagePreviews() {

    const grid =
      getEl('imgPreviewGrid');


    if (!grid) {
      return;
    }


    grid.innerHTML = '';


    listingState.uploadedImages.forEach(
      function (image, index) {

        const card =
          document.createElement('div');


        card.className =
          'image-preview-card preview-card';


        card.innerHTML = `

          <div class="image-preview-image">

            <img
              src="${escapeHtml(image.data)}"
              alt="Araç fotoğrafı ${index + 1}"
            >

            ${
              index === 0
                ? `
                  <span class="image-cover-badge">
                    Kapak
                  </span>
                `
                : ''
            }

          </div>

          <button
            type="button"
            class="image-remove-btn"
            data-image-id="${escapeHtml(image.id)}"
            aria-label="Fotoğrafı sil"
          >
            ×
          </button>

        `;


        const removeButton =
          card.querySelector(
            '.image-remove-btn'
          );


        if (removeButton) {

          removeButton.addEventListener(
            'click',
            function (event) {

              event.preventDefault();

              event.stopPropagation();

              removeImageById(
                image.id
              );

            }
          );

        }


        grid.appendChild(card);

      }
    );


    updateImageCounter();

  }


  /* ============================================================
     FOTOĞRAF SİL
     ============================================================ */

  function removeImageById(imageId) {

    listingState.uploadedImages =
      listingState.uploadedImages.filter(
        function (image) {

          return image.id !== imageId;

        }
      );


    renderImagePreviews();

    updateImageCounter();

    saveListingDraft();

  }


  function removeImage(index) {

    index = Number(index);


    if (
      Number.isNaN(index) ||
      index < 0 ||
      index >=
        listingState.uploadedImages.length
    ) {

      return;

    }


    listingState.uploadedImages.splice(
      index,
      1
    );


    renderImagePreviews();

    updateImageCounter();

    saveListingDraft();

  }


  /* ============================================================
     FOTOĞRAF SAYACI
     ============================================================ */

  function updateImageCounter() {

    const count =
      listingState.uploadedImages.length;


    const newCounter =
      getEl('listingPhotoCount');


    if (newCounter) {

      newCounter.textContent =
        count +
        '/' +
        MAX_IMAGES +
        ' fotoğraf';

    }


    const oldCounter =
      getEl('imageCounter');


    if (oldCounter) {

      oldCounter.textContent =
        count +
        '/' +
        MAX_IMAGES +
        ' fotoğraf';

    }


    const emptyMessage =
      getEl('listingPhotoEmpty');


    if (emptyMessage) {

      emptyMessage.style.display =
        count === 0
          ? 'block'
          : 'none';

    }


    const uploadBox =
      getEl('listingUploadBox');


    if (uploadBox) {

      if (count >= MAX_IMAGES) {

        uploadBox.classList.add(
          'listing-upload-disabled'
        );

      } else {

        uploadBox.classList.remove(
          'listing-upload-disabled'
        );

      }

    }

  }


  /* ============================================================
     DRAG & DROP
     ============================================================ */

  function setupImageDropzone() {

    const box =
      getEl('listingUploadBox');


    if (!box) {
      return;
    }


    if (
      box.dataset.dropReady === 'true'
    ) {

      return;

    }


    box.dataset.dropReady = 'true';


    box.addEventListener(
      'dragenter',
      function (event) {

        event.preventDefault();

        box.classList.add(
          'dragover'
        );

      }
    );


    box.addEventListener(
      'dragover',
      function (event) {

        event.preventDefault();

        box.classList.add(
          'dragover'
        );

      }
    );


    box.addEventListener(
      'dragleave',
      function (event) {

        event.preventDefault();

        box.classList.remove(
          'dragover'
        );

      }
    );


    box.addEventListener(
      'drop',
      function (event) {

        event.preventDefault();

        box.classList.remove(
          'dragover'
        );


        const files =
          event.dataTransfer &&
          event.dataTransfer.files
            ? Array.from(
                event.dataTransfer.files
              )
            : [];


        processImageFiles(files);

      }
    );

  }


  /* ============================================================
     ÖNİZLEME ÖZETİ
     ============================================================ */

  function buildListingSummary() {

    const brand =
      getValue('addBrand');

    const model =
      getValue('addModel');

    const version =
      getValue('addVersion');

    const year =
      getValue('addYear');

    const fuel =
      getValue('addFuel');

    const trans =
      getValue('addTrans');

    const km =
      getNumberValue('addKm');

    const price =
      getNumberValue('addPrice');

    const title =
      getValue('addTitle');

    const description =
      getValue('addDesc');

    const city =
      getValue('addCity');

    const district =
      getValue('addDistrict');


    const previewTitle =
      getEl('listingPreviewTitle');


    if (previewTitle) {

      previewTitle.textContent =
        title ||
        (
          year +
          ' ' +
          brand +
          ' ' +
          model +
          (
            version
              ? ' ' + version
              : ''
          )
        ).trim() ||
        'Araç ilan başlığı';

    }


    const previewPrice =
      getEl('listingPreviewPrice');


    if (previewPrice) {

      previewPrice.textContent =
        price
          ? formatMoney(price)
          : '0 TL';

    }


    const previewYear =
      getEl('previewYear');


    if (previewYear) {

      previewYear.textContent =
        year || '-';

    }


    const previewKm =
      getEl('previewKm');


    if (previewKm) {

      previewKm.textContent =
        km
          ? formatNumber(km) + ' KM'
          : '-';

    }


    const previewFuel =
      getEl('previewFuel');


    if (previewFuel) {

      previewFuel.textContent =
        fuel || '-';

    }


    const previewTrans =
      getEl('previewTrans');


    if (previewTrans) {

      previewTrans.textContent =
        trans || '-';

    }


    const previewLocation =
      getEl(
        'listingPreviewLocation'
      );


    if (previewLocation) {

      if (city || district) {

        const locationParts = [];


        if (city) {

          locationParts.push(city);

        }


        if (district) {

          locationParts.push(
            district
          );

        }


        previewLocation.textContent =
          '📍 ' +
          locationParts.join(
            ' / '
          );

      } else {

        previewLocation.textContent =
          '📍 Konum belirtilmedi';

      }

    }


    const previewDesc =
      getEl(
        'listingPreviewDesc'
      );


    if (previewDesc) {

      previewDesc.textContent =
        description ||
        'İlan açıklaması burada görünecek.';

    }


    const previewImage =
      getEl(
        'listingPreviewImage'
      );


    if (previewImage) {

      previewImage.innerHTML = '';


      if (
        listingState.uploadedImages.length > 0
      ) {

        const image =
          listingState.uploadedImages[0];


        previewImage.style.backgroundImage =
          'url("' +
          image.data +
          '")';


        previewImage.style.backgroundSize =
          'cover';


        previewImage.style.backgroundPosition =
          'center';


        previewImage.classList.add(
          'has-image'
        );

      } else {

        previewImage.style.backgroundImage =
          'none';


        previewImage.classList.remove(
          'has-image'
        );


        const span =
          document.createElement(
            'span'
          );


        span.textContent =
          'Fotoğraf eklenmedi';


        previewImage.appendChild(
          span
        );

      }

    }

  }


  /* ============================================================
     DRAFT KAYDET
     ============================================================ */

  function saveListingDraft() {

    try {

      const draft = {

        brand:
          getValue('addBrand'),

        model:
          getValue('addModel'),

        version:
          getValue('addVersion'),

        year:
          getValue('addYear'),

        body:
          getValue('addBody'),

        fuel:
          getValue('addFuel'),

        trans:
          getValue('addTrans'),

        km:
          getValue('addKm'),

        price:
          getValue('addPrice'),

        title:
          getValue('addTitle'),

        damage:
          getValue('addDamage'),

        paint:
          getValue('addPaint'),

        tramer:
          getValue('addTramer'),

        expertise:
          getValue('addExpertise'),

        city:
          getValue('addCity'),

        district:
          getValue('addDistrict'),

        desc:
          getValue('addDesc'),

        trade:
          !!getEl('addTrade') &&
          getEl('addTrade').checked,

        credit:
          !!getEl('addCredit') &&
          getEl('addCredit').checked,

        uploadedImages:
          listingState.uploadedImages,

        currentSellStep:
          listingState.currentSellStep

      };


      localStorage.setItem(
        'arabamiBulListingDraft',
        JSON.stringify(draft)
      );

    } catch (error) {

      console.warn(
        'İlan taslağı kaydedilemedi:',
        error
      );

    }

  }


  /* ============================================================
     DRAFT YÜKLE
     ============================================================ */

  function loadListingDraft() {

    try {

      const raw =
        localStorage.getItem(
          'arabamiBulListingDraft'
        );


      if (!raw) {
        return;
      }


      const draft =
        JSON.parse(raw);


      if (!draft) {
        return;
      }


      /*
        Selectorları draft değerleriyle
        birlikte kur.
      */

      initializeListingSelectors({
        brand: draft.brand,
        model: draft.model,
        version: draft.version,
        year: draft.year
      });


      setValue(
        'addBody',
        draft.body
      );

      setValue(
        'addFuel',
        draft.fuel
      );

      setValue(
        'addTrans',
        draft.trans
      );

      setValue(
        'addKm',
        draft.km
      );

      setValue(
        'addPrice',
        draft.price
      );


      setValue(
        'addTitle',
        draft.title
      );

      setValue(
        'addDamage',
        draft.damage
      );

      setValue(
        'addPaint',
        draft.paint
      );

      setValue(
        'addTramer',
        draft.tramer
      );

      setValue(
        'addExpertise',
        draft.expertise
      );

      setValue(
        'addCity',
        draft.city
      );

      setValue(
        'addDistrict',
        draft.district
      );


      setValue(
        'addDesc',
        draft.desc
      );


      const trade =
        getEl('addTrade');


      if (trade) {

        trade.checked =
          !!draft.trade;

      }


      const credit =
        getEl('addCredit');


      if (credit) {

        credit.checked =
          !!draft.credit;

      }


      if (
        Array.isArray(
          draft.uploadedImages
        )
      ) {

        listingState.uploadedImages =
          draft.uploadedImages.slice(
            0,
            MAX_IMAGES
          );

      }


      renderImagePreviews();

      updateImageCounter();

      setupDescriptionCounter();


    } catch (error) {

      console.warn(
        'İlan taslağı yüklenemedi:',
        error
      );

    }

  }


  /* ============================================================
     DRAFT TEMİZLE
     ============================================================ */

  function clearListingDraft() {

    try {

      localStorage.removeItem(
        'arabamiBulListingDraft'
      );

    } catch (error) {

      console.warn(
        'Taslak temizlenemedi:',
        error
      );

    }

  }


  /* ============================================================
     YENİ ARAÇ OBJEKTİ
     ============================================================ */

  function createNewCarObject() {

    const brand =
      getValue('addBrand');

    const model =
      getValue('addModel');

    const version =
      getValue('addVersion');

    const year =
      Number(
        getValue('addYear')
      ) ||
      new Date().getFullYear();

    const body =
      getValue('addBody');

    const fuel =
      getValue('addFuel');

    const trans =
      getValue('addTrans');

    const km =
      getNumberValue('addKm');

    const price =
      getNumberValue('addPrice');

    const customTitle =
      getValue('addTitle');


    const title =
      customTitle ||
      (
        year +
        ' ' +
        brand +
        ' ' +
        model +
        (
          version
            ? ' ' + version
            : ''
        )
      ).trim();


    const city =
      getValue('addCity');

    const district =
      getValue('addDistrict');

    const description =
      getValue('addDesc');

    const damage =
      getValue('addDamage');

    const paint =
      getValue('addPaint');

    const tramer =
      getNumberValue('addTramer');

    const expertise =
      getValue('addExpertise');

    const trade =
      !!getEl('addTrade') &&
      getEl('addTrade').checked;

    const credit =
      !!getEl('addCredit') &&
      getEl('addCredit').checked;


    const firstImage =
      listingState.uploadedImages.length > 0
        ? listingState.uploadedImages[0].data
        : 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80';


    const id =
      Date.now();


    return {

      id: id,

      brand: brand,

      model: model,

      version: version,

      title: title,

      listingTitle: customTitle,

      year: year,

      body: body,

      fuel: fuel,

      trans: trans,

      km: km,

      price: price,

      img: firstImage,

      images:
        listingState.uploadedImages.map(
          function (image) {

            return image.data;

          }
        ),

      city: city,

      district: district,

      description: description,

      desc: description,

      damage: damage,

      paint: paint,

      tramer: tramer,

      expertise: expertise,

      trade: trade,

      credit: credit,

      tco: 0,

      expert:
        expertise ||
        'Belirtilmemiş',

      source: 'user',

      isUserListing: true,

      createdAt:
        new Date().toISOString()

    };

  }


  /* ============================================================
     GLOBAL DATA'YA EKLE
     ============================================================ */

  function addListingToGlobalData(car) {

    if (
      !Array.isArray(
        window.dummyCars
      )
    ) {

      window.dummyCars = [];

    }


    const exists =
      window.dummyCars.some(
        function (item) {

          return item.id === car.id;

        }
      );


    if (!exists) {

      window.dummyCars.unshift(
        car
      );

    }

  }


  /* ============================================================
     KAYDET
     ============================================================ */

  function persistNewListing(car) {

    try {

      const stored =
        JSON.parse(
          localStorage.getItem(
            'arabamiBulUserListings'
          ) || '[]'
        );


      const list =
        Array.isArray(stored)
          ? stored
          : [];


      list.unshift(car);


      localStorage.setItem(
        'arabamiBulUserListings',
        JSON.stringify(list)
      );


    } catch (error) {

      console.warn(
        'İlan localStorage içine kaydedilemedi:',
        error
      );

    }

  }


  /* ============================================================
     KAYITLI İLANLARI YÜKLE
     ============================================================ */

  function loadSavedListingsIntoCatalog() {

    try {

      const stored =
        JSON.parse(
          localStorage.getItem(
            'arabamiBulUserListings'
          ) || '[]'
        );


      if (
        !Array.isArray(stored)
      ) {

        return;

      }


      stored.forEach(
        function (car) {

          addListingToGlobalData(
            car
          );

        }
      );


    } catch (error) {

      console.warn(
        'Kayıtlı ilanlar yüklenemedi:',
        error
      );

    }

  }


  /* ============================================================
     FORM SIFIRLA
     ============================================================ */

  function resetListingForm() {

    const form =
      getEl('listingForm');


    if (form) {

      form.reset();

    }


    listingState.uploadedImages =
      [];

    listingState.currentSellStep =
      1;


    /*
      Form reset sonrası selectorları
      tekrar başlangıç durumuna getir.
    */

    initializeListingSelectors();


    renderImagePreviews();

    updateImageCounter();

    goToSellStep(1);

    clearListingDraft();


    const previewTitle =
      getEl(
        'listingPreviewTitle'
      );


    if (previewTitle) {

      previewTitle.textContent =
        'Araç ilan başlığı';

    }


    const previewPrice =
      getEl(
        'listingPreviewPrice'
      );


    if (previewPrice) {

      previewPrice.textContent =
        '0 TL';

    }


    const previewDesc =
      getEl(
        'listingPreviewDesc'
      );


    if (previewDesc) {

      previewDesc.textContent =
        'İlan açıklaması burada görünecek.';

    }


    const previewLocation =
      getEl(
        'listingPreviewLocation'
      );


    if (previewLocation) {

      previewLocation.textContent =
        '📍 Konum belirtilmedi';

    }


    const previewImage =
      getEl(
        'listingPreviewImage'
      );


    if (previewImage) {

      previewImage.style.backgroundImage =
        'none';

      previewImage.innerHTML =
        '<span>Fotoğraf eklenmedi</span>';

      previewImage.classList.remove(
        'has-image'
      );

    }

  }


  /* ============================================================
     İLANI YAYINLA
     ============================================================ */

  function submitNewCar(event) {

    if (event) {

      event.preventDefault();

    }


    for (
      let step = 1;
      step <= 3;
      step++
    ) {

      if (
        !validateSellStep(step)
      ) {

        goToSellStep(step);

        return false;

      }

    }


    const car =
      createNewCarObject();


    if (!car) {

      alert(
        'İlan oluşturulurken bir hata oluştu.'
      );

      return false;

    }


    addListingToGlobalData(
      car
    );


    persistNewListing(
      car
    );


    clearListingDraft();


    alert(
      '🎉 İlanın başarıyla oluşturuldu!'
    );


    resetListingForm();


    if (
      typeof window.go === 'function'
    ) {

      window.go('browse');

    }


    if (
      typeof window.renderBrowse === 'function'
    ) {

      window.renderBrowse();

    }


    return true;

  }


  /* ============================================================
     FORM DEĞİŞİKLİKLERİNİ OTOMATİK KAYDET
     ============================================================ */

  function setupAutoSave() {

    const form =
      getEl('listingForm');


    if (!form) {
      return;
    }


    if (
      form.dataset.autoSaveReady === 'true'
    ) {

      return;

    }


    form.dataset.autoSaveReady =
      'true';


    form.addEventListener(
      'input',
      function () {

        saveListingDraft();

      }
    );


    form.addEventListener(
      'change',
      function () {

        saveListingDraft();

      }
    );

  }


  /* ============================================================
     KARAKTER SAYACI
     ============================================================ */

  function setupDescriptionCounter() {

    const textarea =
      getEl('addDesc');


    if (!textarea) {
      return;
    }


    const counter =
      textarea.parentElement
        ? textarea.parentElement.querySelector(
            '.listing-character-count'
          )
        : null;


    function update() {

      if (!counter) {
        return;
      }


      counter.textContent =
        textarea.value.length +
        ' / 2000 karakter';

    }


    if (
      textarea.dataset.counterReady !== 'true'
    ) {

      textarea.dataset.counterReady =
        'true';


      textarea.addEventListener(
        'input',
        update
      );

    }


    update();

  }


  /* ============================================================
     STEP GÖSTERGELERİNE TIKLAMA
     ============================================================ */

  function setupStepNavigation() {

    document.querySelectorAll(
      '.listing-step'
    ).forEach(function (node) {

      if (
        node.dataset.clickReady === 'true'
      ) {

        return;

      }


      node.dataset.clickReady =
        'true';


      node.addEventListener(
        'click',
        function () {

          const step =
            Number(
              node.getAttribute(
                'data-step'
              )
            );


          if (!step) {
            return;
          }


          const current =
            Number(
              listingState.currentSellStep
            ) || 1;


          if (step <= current) {

            goToSellStep(step);

            return;

          }


          if (
            !validateSellStep(current)
          ) {

            return;

          }


          goToSellStep(step);

        }
      );

    });

  }


  /* ============================================================
     SAYFA BAŞLAT
     ============================================================ */

  function initializeListing() {

    /*
      Kayıtlı ilanlar
    */

    loadSavedListingsIntoCatalog();


    /*
      Önce selector sistemini oluştur.
    */

    initializeListingSelectors();


    /*
      Drag & Drop
    */

    setupImageDropzone();


    /*
      Auto Save
    */

    setupAutoSave();


    /*
      Açıklama sayacı
    */

    setupDescriptionCounter();


    /*
      Step tıklamaları
    */

    setupStepNavigation();


    /*
      Fotoğraflar
    */

    renderImagePreviews();

    updateImageCounter();


    /*
      İlk adım
    */

    goToSellStep(1);


    /*
      Draft yükle.
      Draft içindeki marka/model/versiyon/yıl
      selectorlara otomatik yerleştirilecek.
    */

    loadListingDraft();


    /*
      Draft sonrası güncelle
    */

    renderImagePreviews();

    updateImageCounter();

    setupDescriptionCounter();

  }


  /* ============================================================
     SAYFA HAZIR
     ============================================================ */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initializeListing
    );

  } else {

    initializeListing();

  }


  /* ============================================================
     GLOBAL FONKSİYONLAR
     HTML ONCLICK İÇİN
     ============================================================ */

  window.goToSellStep =
    goToSellStep;


  window.listingNextStep =
    listingNextStep;


  window.listingPrevStep =
    listingPrevStep;


  window.nextSellStep =
    nextSellStep;


  window.previousSellStep =
    previousSellStep;


  window.handleImageUpload =
    handleImageUpload;


  window.removeImage =
    removeImage;


  window.removeImageById =
    removeImageById;


  window.submitNewCar =
    submitNewCar;


  window.resetListingForm =
    resetListingForm;


  window.saveListingDraft =
    saveListingDraft;


  window.loadListingDraft =
    loadListingDraft;


  window.clearListingDraft =
    clearListingDraft;


  window.renderImagePreviews =
    renderImagePreviews;


  window.buildListingSummary =
    buildListingSummary;


  window.updateImageCounter =
    updateImageCounter;


  window.validateSellStep =
    validateSellStep;


})();
