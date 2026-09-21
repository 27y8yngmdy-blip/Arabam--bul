(function () {
  "use strict";

  // =========================================================
  // ARABAMI BUL — WIZARD V3
  // app.js -> window.dummyCars ile çalışır
  // =========================================================

  const TOTAL_STEPS = 6;

  let currentStep = 1;

  const wizardState = {
    budget: {
      type: "range",
      min: 1000000,
      max: 1500000,
      label: "1.000.000 – 1.500.000 TL"
    },

    usage: [],
    fuel: [],
    transmission: null,
    priorities: [],
    body: []
  };


  // =========================================================
  // SORULAR
  // =========================================================

  const questions = [

    {
      step: 1,
      title: "Bütçeniz nedir?",
      subtitle:
        "Araç için ayırdığınız bütçe aralığını seçin.",
      type: "budget"
    },

    {
      step: 2,
      title: "Aracı daha çok nasıl kullanacaksınız?",
      subtitle:
        "Birden fazla seçenek seçebilirsiniz.",
      type: "multi",
      key: "usage",

      options: [
        {
          value: "city",
          icon: "🏙️",
          title: "Şehir İçi",
          text: "Günlük şehir kullanımım ağırlıklı."
        },
        {
          value: "longRoad",
          icon: "🛣️",
          title: "Uzun Yol",
          text: "Sık sık şehirler arası yol yaparım."
        },
        {
          value: "family",
          icon: "👨‍👩‍👧‍👦",
          title: "Aile",
          text: "Aile ve geniş kullanım önemli."
        },
        {
          value: "daily",
          icon: "💼",
          title: "Günlük Kullanım",
          text: "İşe, okula ve günlük işlere gitmek için."
        },
        {
          value: "fun",
          icon: "🏎️",
          title: "Keyif / Performans",
          text: "Sürüş keyfi ve performans önemli."
        },
        {
          value: "firstCar",
          icon: "🚗",
          title: "İlk Arabam",
          text: "İlk otomobilimi alıyorum."
        }
      ]
    },

    {
      step: 3,
      title: "Hangi yakıt tiplerini düşünüyorsunuz?",
      subtitle:
        "Birden fazla seçenek seçebilirsiniz.",
      type: "multi",
      key: "fuel",

      options: [
        {
          value: "Benzin",
          icon: "⛽",
          title: "Benzin",
          text: "Klasik benzinli motor."
        },
        {
          value: "Dizel",
          icon: "🛢️",
          title: "Dizel",
          text: "Uzun yol ve düşük tüketim odaklı."
        },
        {
          value: "Hibrit",
          icon: "🔋",
          title: "Hibrit",
          text: "Yakıt ekonomisi ve elektrik desteği."
        },
        {
          value: "Elektrik",
          icon: "⚡",
          title: "Elektrik",
          text: "Tamamen elektrikli araçlar."
        }
      ]
    },

    {
      step: 4,
      title: "Vites tercihiniz nedir?",
      subtitle:
        "Size uygun vites tipini seçin.",
      type: "single",
      key: "transmission",

      options: [
        {
          value: "Otomatik",
          icon: "⚙️",
          title: "Otomatik",
          text: "Konforlu ve kolay kullanım."
        },
        {
          value: "Manuel",
          icon: "🕹️",
          title: "Manuel",
          text: "Daha kontrollü sürüş deneyimi."
        }
      ]
    },

    {
      step: 5,
      title: "Sizin için en önemli özellikler neler?",
      subtitle:
        "Birden fazla özellik seçebilirsiniz.",
      type: "multi",
      key: "priorities",

      options: [
        {
          value: "economy",
          icon: "💰",
          title: "Az Tüketim",
          text: "Yakıt ve kullanım maliyeti düşük olsun."
        },
        {
          value: "comfort",
          icon: "🛋️",
          title: "Konfor",
          text: "Rahat ve konforlu bir sürüş istiyorum."
        },
        {
          value: "performance",
          icon: "🚀",
          title: "Performans",
          text: "Güçlü motor ve hızlı tepki önemli."
        },
        {
          value: "safety",
          icon: "🛡️",
          title: "Güvenlik",
          text: "Güvenlik donanımları öncelikli."
        },
        {
          value: "space",
          icon: "🧳",
          title: "Genişlik",
          text: "İç hacim ve bagaj önemli."
        },
        {
          value: "technology",
          icon: "📱",
          title: "Teknoloji",
          text: "Modern ve teknolojik özellikler."
        }
      ]
    },

    {
      step: 6,
      title: "Hangi kasa tiplerini düşünüyorsunuz?",
      subtitle:
        "Birden fazla kasa tipi seçebilirsiniz.",
      type: "multi",
      key: "body",

      options: [
        {
          value: "Hatchback",
          icon: "🚗",
          title: "Hatchback",
          text: "Kompakt ve şehir dostu."
        },
        {
          value: "Sedan",
          icon: "🚘",
          title: "Sedan",
          text: "Konforlu ve klasik gövde."
        },
        {
          value: "SUV",
          icon: "🚙",
          title: "SUV",
          text: "Yüksek oturma ve geniş alan."
        },
        {
          value: "Coupe",
          icon: "🏎️",
          title: "Coupe",
          text: "Sportif ve dinamik tasarım."
        }
      ]
    }

  ];


  // =========================================================
  // ELEMENT
  // =========================================================

  function $(id) {
    return document.getElementById(id);
  }


  // =========================================================
  // WIZARD'I GÖSTER
  // =========================================================

  function renderWizard() {

    const question =
      questions[currentStep - 1];

    if (!question) return;


    const badge = $("qBadge");
    const title = $("qTitle");
    const sub = $("qSub");
    const progress = $("pFill");
    const options = $("qOptions");
    const prevBtn = $("prevBtn");


    if (!badge || !title || !sub || !progress || !options) {
      console.warn("Wizard HTML elementleri bulunamadı.");
      return;
    }


    badge.textContent =
      `Soru ${currentStep} / ${TOTAL_STEPS}`;

    title.textContent =
      question.title;

    sub.textContent =
      question.subtitle;

    progress.style.width =
      `${(currentStep / TOTAL_STEPS) * 100}%`;


    if (prevBtn) {

      prevBtn.disabled =
        currentStep === 1;

      prevBtn.style.opacity =
        currentStep === 1 ? "0.5" : "1";

      prevBtn.style.visibility =
        "visible";
    }


    options.innerHTML = "";


    // =======================================================
    // BÜTÇE
    // =======================================================

    if (question.type === "budget") {

      renderBudget(options);

      return;
    }


    // =======================================================
    // DİĞER SEÇENEKLER
    // =======================================================

    question.options.forEach(option => {

      const selected =
        isSelected(
          question,
          option.value
        );


      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "wizard-option" +
        (selected ? " selected" : "");


      button.innerHTML = `

        <div class="wizard-option-icon">
          ${option.icon}
        </div>

        <div class="wizard-option-content">

          <strong>
            ${option.title}
          </strong>

          <span>
            ${option.text}
          </span>

        </div>

        <div class="wizard-check">
          ${selected ? "✓" : ""}
        </div>

      `;


      button.addEventListener(
        "click",
        () => {

          selectOption(
            question,
            option.value
          );

          renderWizard();

        }
      );


      options.appendChild(button);

    });

  }


  // =========================================================
  // BÜTÇE SEÇENEKLERİ
  // =========================================================

  const budgetRanges = [

    {
      min: 1000000,
      max: 1500000,
      label: "1.000.000 – 1.500.000 TL"
    },

    {
      min: 1500000,
      max: 2000000,
      label: "1.500.000 – 2.000.000 TL"
    },

    {
      min: 2000000,
      max: 2500000,
      label: "2.000.000 – 2.500.000 TL"
    },

    {
      min: 2500000,
      max: 3000000,
      label: "2.500.000 – 3.000.000 TL"
    },

    {
      min: 3000000,
      max: 4000000,
      label: "3.000.000 – 4.000.000 TL"
    },

    {
      min: 4000000,
      max: Infinity,
      label: "4.000.000 TL ve üzeri"
    }

  ];


  // =========================================================
  // BÜTÇE RENDER
  // =========================================================

  function renderBudget(container) {

    container.innerHTML = `

      <div
        class="wizard-budget-options"
        style="
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px;
          width:100%;
        "
      >

        ${budgetRanges
          .map((range, index) => {

            const selected =
              wizardState.budget &&
              wizardState.budget.type === "range" &&
              wizardState.budget.min === range.min &&
              wizardState.budget.max === range.max;


            return `

              <button
                type="button"
                class="wizard-option budget-range-option ${
                  selected ? "selected" : ""
                }"
                data-budget-index="${index}"
              >

                <div class="wizard-option-icon">
                  💰
                </div>

                <div class="wizard-option-content">

                  <strong>
                    ${range.label}
                  </strong>

                  <span>
                    ${index === 0
                      ? "Ekonomik bütçe"
                      : index === 1
                      ? "Orta bütçe"
                      : index === 2
                      ? "Orta-üst bütçe"
                      : index === 3
                      ? "Geniş seçenek"
                      : index === 4
                      ? "Üst segment"
                      : "4 milyon TL ve üzeri"
                    }
                  </span>

                </div>

                <div class="wizard-check">
                  ${selected ? "✓" : ""}
                </div>

              </button>

            `;

          })
          .join("")}


        <button
          type="button"
          class="wizard-option budget-custom-option ${
            wizardState.budget &&
            wizardState.budget.type === "custom"
              ? "selected"
              : ""
          }"
          id="customBudgetButton"
        >

          <div class="wizard-option-icon">
            ✏️
          </div>

          <div class="wizard-option-content">

            <strong>
              Kendi bütçemi girmek istiyorum
            </strong>

            <span>
              Minimum ve maksimum bütçenizi kendiniz belirleyin.
            </span>

          </div>

          <div class="wizard-check">
            ${
              wizardState.budget &&
              wizardState.budget.type === "custom"
                ? "✓"
                : ""
            }
          </div>

        </button>

      </div>


      <div
        id="customBudgetBox"
        style="
          display:${
            wizardState.budget &&
            wizardState.budget.type === "custom"
              ? "block"
              : "none"
          };
          margin-top:16px;
          padding:18px;
          border:1px solid var(--line);
          border-radius:16px;
          background:#fff;
        "
      >

        <div
          style="
            font-size:13px;
            font-weight:800;
            margin-bottom:12px;
          "
        >
          Bütçenizi kendiniz belirleyin
        </div>


        <div
          style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
          "
        >

          <div>

            <label
              style="
                display:block;
                font-size:12px;
                font-weight:800;
                margin-bottom:6px;
              "
            >
              Minimum bütçe
            </label>

            <input
              type="number"
              id="customBudgetMin"
              min="1"
              step="50000"
              placeholder="1.500.000"
              value="${
                wizardState.budget &&
                wizardState.budget.type === "custom"
                  ? wizardState.budget.min
                  : ""
              }"
              style="
                width:100%;
                padding:12px;
                border:1px solid var(--line);
                border-radius:10px;
                font-size:14px;
                box-sizing:border-box;
              "
            >

          </div>


          <div>

            <label
              style="
                display:block;
                font-size:12px;
                font-weight:800;
                margin-bottom:6px;
              "
            >
              Maksimum bütçe
            </label>

            <input
              type="number"
              id="customBudgetMax"
              min="1"
              step="50000"
              placeholder="2.200.000"
              value="${
                wizardState.budget &&
                wizardState.budget.type === "custom"
                  ? wizardState.budget.max
                  : ""
              }"
              style="
                width:100%;
                padding:12px;
                border:1px solid var(--line);
                border-radius:10px;
                font-size:14px;
                box-sizing:border-box;
              "
            >

          </div>

        </div>


        <div
          id="customBudgetPreview"
          style="
            margin-top:12px;
            font-size:12px;
            color:var(--muted);
          "
        >
          Örnek: 1.500.000 TL – 2.200.000 TL
        </div>

      </div>

    `;


    // =======================================================
    // HAZIR BÜTÇE BUTONLARI
    // =======================================================

    container
      .querySelectorAll("[data-budget-index]")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const index =
              Number(
                button.dataset.budgetIndex
              );

            const range =
              budgetRanges[index];


            wizardState.budget = {

              type: "range",

              min: range.min,

              max: range.max,

              label: range.label

            };


            renderWizard();

          }
        );

      });


    // =======================================================
    // ÖZEL BÜTÇE BUTONU
    // =======================================================

    const customButton =
      $("customBudgetButton");


    if (customButton) {

      customButton.addEventListener(
        "click",
        () => {

          const current =
            wizardState.budget;


          wizardState.budget = {

            type: "custom",

            min:
              current &&
              current.type === "custom"
                ? current.min
                : 1500000,

            max:
              current &&
              current.type === "custom"
                ? current.max
                : 2200000,

            label:
              current &&
              current.type === "custom"
                ? current.label
                : "1.500.000 – 2.200.000 TL"

          };


          renderWizard();


          setTimeout(() => {

            const minInput =
              $("customBudgetMin");

            if (minInput) {
              minInput.focus();
            }

          }, 50);

        }
      );

    }


    // =======================================================
    // ÖZEL BÜTÇE INPUTLARI
    // =======================================================

    const minInput =
      $("customBudgetMin");

    const maxInput =
      $("customBudgetMax");

    const preview =
      $("customBudgetPreview");


    function updateCustomBudget() {

      if (
        !minInput ||
        !maxInput
      ) {
        return;
      }


      const min =
        Number(minInput.value);

      const max =
        Number(maxInput.value);


      if (
        min > 0 &&
        max > 0 &&
        max >= min
      ) {

        wizardState.budget = {

          type: "custom",

          min,

          max,

          label:
            `${formatNumber(min)} – ${formatNumber(max)} TL`

        };


        if (preview) {

          preview.textContent =
            `Seçilen aralık: ${formatNumber(min)} TL – ${formatNumber(max)} TL`;

        }

      }

    }


    if (minInput) {

      minInput.addEventListener(
        "input",
        updateCustomBudget
      );

    }


    if (maxInput) {

      maxInput.addEventListener(
        "input",
        updateCustomBudget
      );

    }

  }


  // =========================================================
  // SEÇİM KONTROLÜ
  // =========================================================

  function isSelected(question, value) {

    if (question.type === "single") {

      return (
        wizardState[question.key] === value
      );

    }


    if (question.type === "multi") {

      return (
        wizardState[question.key]
          .includes(value)
      );

    }


    return false;

  }


  // =========================================================
  // SEÇİM YAP
  // =========================================================

  function selectOption(question, value) {

    if (question.type === "single") {

      wizardState[question.key] =
        value;

      return;

    }


    const list =
      wizardState[question.key];


    const index =
      list.indexOf(value);


    if (index === -1) {

      list.push(value);

    } else {

      list.splice(index, 1);

    }

  }


  // =========================================================
  // İLERİ
  // =========================================================

  window.nextQ = function () {

    if (!validateStep()) {
      return;
    }


    if (currentStep < TOTAL_STEPS) {

      currentStep++;

      renderWizard();

      scrollToWizard();

      return;

    }


    showWizardResults();

  };


  // =========================================================
  // GERİ
  // =========================================================

  window.prevQ = function () {

    if (currentStep <= 1) {
      return;
    }


    currentStep--;

    renderWizard();

    scrollToWizard();

  };


  // =========================================================
  // VALIDATION
  // =========================================================

  function validateStep() {

    const question =
      questions[currentStep - 1];


    // -------------------------------------------------------
    // BÜTÇE
    // -------------------------------------------------------

    if (question.type === "budget") {

      const budget =
        wizardState.budget;


      if (!budget) {

        alert(
          "Lütfen bütçenizi seçin."
        );

        return false;

      }


      if (
        budget.type === "custom"
      ) {

        const min =
          Number(budget.min);

        const max =
          Number(budget.max);


        if (
          !min ||
          !max
        ) {

          alert(
            "Lütfen minimum ve maksimum bütçenizi girin."
          );

          return false;

        }


        if (max < min) {

          alert(
            "Maksimum bütçe minimum bütçeden düşük olamaz."
          );

          return false;

        }

      }


      return true;

    }


    // -------------------------------------------------------
    // SINGLE
    // -------------------------------------------------------

    if (question.type === "single") {

      if (!wizardState[question.key]) {

        alert(
          "Lütfen bir seçim yapın."
        );

        return false;

      }

      return true;

    }


    // -------------------------------------------------------
    // MULTI
    // -------------------------------------------------------

    if (
      !wizardState[question.key] ||
      wizardState[question.key].length === 0
    ) {

      alert(
        "Devam etmek için en az bir seçenek seçin."
      );

      return false;

    }


    return true;

  }


  // =========================================================
  // SONUÇLARI HESAPLA
  // =========================================================

  function showWizardResults() {

    const wizardCard =
      $("wizardCard");

    const result =
      $("wizardResult");

    const grid =
      $("wizardResultGrid");


    if (!wizardCard || !result || !grid) {

      console.error(
        "Wizard sonuç alanı bulunamadı."
      );

      return;

    }


    const cars =
      Array.isArray(window.dummyCars)
        ? window.dummyCars
        : [];


    if (!cars.length) {

      console.error(
        "window.dummyCars bulunamadı."
      );

      grid.innerHTML = `
        <div style="
          grid-column:1/-1;
          padding:40px;
          text-align:center;
        ">
          Araç verileri bulunamadı.
        </div>
      `;


      wizardCard.style.display = "none";

      result.style.display = "block";

      return;

    }


    const scoredCars =
      cars.map(car => {

        const result =
          calculateScore(car);


        return {

          car: car,

          score: result.score,

          reasons: result.reasons

        };

      });


    scoredCars.sort(
      (a, b) =>
        b.score - a.score
    );


    const bestCars =
      scoredCars.slice(0, 6);


    wizardCard.style.display =
      "none";

    result.style.display =
      "block";


    grid.innerHTML = `

      <div
        style="
          grid-column:1/-1;
          margin-bottom:4px;
        "
      >

        <div
          style="
            background:#fff;
            border:1px solid var(--line);
            border-radius:16px;
            padding:18px;
            margin-bottom:16px;
          "
        >

          <div
            style="
              font-size:13px;
              color:var(--muted);
              margin-bottom:6px;
            "
          >
            Tercihleriniz analiz edildi
          </div>

          <strong
            style="
              font-size:18px;
              font-weight:900;
            "
          >
            Size en uygun ${bestCars.length} araç
          </strong>

          <div
            style="
              margin-top:8px;
              font-size:12px;
              color:var(--muted);
            "
          >
            Bütçe:
            ${wizardState.budget.label}
          </div>

        </div>

      </div>

      ${bestCars
        .map(item => {

          return createResultCard(
            item.car,
            item.score,
            item.reasons
          );

        })
        .join("")}

    `;


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // =========================================================
  // PUANLAMA
  // =========================================================

  function calculateScore(car) {

    let score = 35;

    const reasons = [];


    // =======================================================
    // BÜTÇE
    // =======================================================

    const budget =
      wizardState.budget;


    const budgetResult =
      getBudgetMatch(
        car.price,
        budget
      );


    score +=
      budgetResult.points;


    if (budgetResult.reason) {

      reasons.push(
        budgetResult.reason
      );

    }


    // =======================================================
    // YAKIT
    // =======================================================

    if (
      wizardState.fuel.length &&
      wizardState.fuel.includes(car.fuel)
    ) {

      score += 12;

      reasons.push(
        `${car.fuel} tercihinizle uyumlu`
      );

    }


    // =======================================================
    // VİTES
    // =======================================================

    if (
      wizardState.transmission &&
      car.trans === wizardState.transmission
    ) {

      score += 10;

      reasons.push(
        `${car.trans} vites tercihinizle uyumlu`
      );

    }


    // =======================================================
    // KASA
    // =======================================================

    if (
      wizardState.body.length &&
      wizardState.body.includes(car.seg)
    ) {

      score += 12;

      reasons.push(
        `${car.seg} kasa tercihinizle uyumlu`
      );

    }


    // =======================================================
    // KULLANIM
    // =======================================================

    wizardState.usage.forEach(use => {

      if (
        use === "city" &&
        car.seg === "Hatchback"
      ) {

        score += 3;

        reasons.push(
          "Şehir içi kullanım için uygun"
        );

      }


      if (
        use === "family" &&
        (
          car.seg === "SUV" ||
          car.seg === "Sedan"
        )
      ) {

        score += 3;

        reasons.push(
          "Aile kullanımı için uygun"
        );

      }


      if (
        use === "fun" &&
        car.seg === "Coupe"
      ) {

        score += 4;

        reasons.push(
          "Sürüş keyfi önceliğinizle uyumlu"
        );

      }


      if (
        use === "longRoad" &&
        (
          car.seg === "Sedan" ||
          car.seg === "SUV"
        )
      ) {

        score += 3;

        reasons.push(
          "Uzun yol kullanımına uygun"
        );

      }


      if (
        use === "firstCar" &&
        budgetResultIsWithinBudget(car.price)
      ) {

        score += 2;

      }

    });


    // =======================================================
    // ÖNCELİKLER
    // =======================================================

    wizardState.priorities.forEach(priority => {

      if (
        priority === "economy" &&
        (
          car.fuel === "Hibrit" ||
          car.fuel === "Elektrik" ||
          car.fuel === "Dizel"
        )
      ) {

        score += 4;

        reasons.push(
          "Ekonomi önceliğinize uygun"
        );

      }


      if (
        priority === "comfort" &&
        (
          car.seg === "Sedan" ||
          car.seg === "SUV"
        )
      ) {

        score += 3;

        reasons.push(
          "Konfor önceliğinize uygun"
        );

      }


      if (
        priority === "performance" &&
        car.seg === "Coupe"
      ) {

        score += 5;

        reasons.push(
          "Performans önceliğinize uygun"
        );

      }


      if (
        priority === "space" &&
        (
          car.seg === "SUV" ||
          car.seg === "Sedan"
        )
      ) {

        score += 3;

        reasons.push(
          "Genişlik önceliğinize uygun"
        );

      }


      if (
        priority === "technology" &&
        (
          car.fuel === "Elektrik" ||
          car.year >= 2023
        )
      ) {

        score += 3;

        reasons.push(
          "Teknoloji önceliğinize uygun"
        );

      }


      if (
        priority === "safety" &&
        car.year >= 2022
      ) {

        score += 3;

        reasons.push(
          "Yeni model yılı güvenlik tercihinizle uyumlu"
        );

      }

    });


    // =======================================================
    // SINIR
    // =======================================================

    score =
      Math.max(
        35,
        Math.min(
          99,
          Math.round(score)
        )
      );


    const uniqueReasons =
      [...new Set(reasons)]
        .slice(0, 3);


    return {

      score,

      reasons:
        uniqueReasons

    };

  }


  // =========================================================
  // BÜTÇE UYUMU
  // =========================================================

  function getBudgetMatch(
    price,
    budget
  ) {

    if (
      !budget ||
      !price
    ) {

      return {
        points: 0,
        reason: ""
      };

    }


    const min =
      Number(budget.min);

    const max =
      Number(budget.max);


    // -------------------------------------------------------
    // 4 MİLYON VE ÜZERİ
    // -------------------------------------------------------

    if (max === Infinity) {

      if (price >= min) {

        return {

          points: 30,

          reason:
            "Bütçe aralığınıza uygun"

        };

      }


      const difference =
        min - price;


      const ratio =
        difference / min;


      if (ratio <= 0.10) {

        return {

          points: 18,

          reason:
            "Bütçenize oldukça yakın"

        };

      }


      if (ratio <= 0.20) {

        return {

          points: 8,

          reason:
            "Bütçenizin biraz altında"

        };

      }


      return {

        points: 0,

        reason: ""

      };

    }


    // -------------------------------------------------------
    // TAM ARALIK İÇİNDE
    // -------------------------------------------------------

    if (
      price >= min &&
      price <= max
    ) {

      return {

        points: 30,

        reason:
          "Bütçe aralığınıza uygun"

      };

    }


    // -------------------------------------------------------
    // BÜTÇENİN ALTINDA
    // -------------------------------------------------------

    if (price < min) {

      const difference =
        min - price;

      const ratio =
        difference / min;


      if (ratio <= 0.10) {

        return {

          points: 24,

          reason:
            "Bütçenizin altında ve bütçenizi verimli kullanıyor"

        };

      }


      if (ratio <= 0.20) {

        return {

          points: 18,

          reason:
            "Bütçenizin altında"

        };

      }


      return {

        points: 10,

        reason:
          "Bütçenizin altında"

      };

    }


    // -------------------------------------------------------
    // BÜTÇENİN ÜZERİNDE
    // -------------------------------------------------------

    const difference =
      price - max;

    const ratio =
      difference / max;


    if (ratio <= 0.10) {

      return {

        points: 18,

        reason:
          "Bütçenizin biraz üzerinde"

      };

    }


    if (ratio <= 0.20) {

      return {

        points: 8,

        reason:
          "Bütçenizin üzerinde"

      };

    }


    return {

      points: 0,

      reason: ""

    };

  }


  // =========================================================
  // ARAÇ BÜTÇEDE Mİ?
  // =========================================================

  function budgetResultIsWithinBudget(
    price
  ) {

    const budget =
      wizardState.budget;


    if (!budget) {
      return false;
    }


    if (
      budget.max === Infinity
    ) {

      return price >= budget.min;

    }


    return (
      price >= budget.min &&
      price <= budget.max
    );

  }


  // =========================================================
  // SONUÇ KARTI
  // =========================================================

  function createResultCard(
    car,
    score,
    reasons
  ) {

    const isFav =
      Array.isArray(window.favorites) &&
      window.favorites.includes(car.id);


    return `

      <div
        class="vehicle-card wizard-result-card"
        onclick="openDetail(${car.id})"
      >

        <button
          class="fav-btn"
          type="button"
          onclick="toggleFav(${car.id}, event)"
        >
          ${isFav ? "❤️" : "🤍"}
        </button>


        <div
          class="car-img"
          style="
            background-image:url('${car.img}')
          "
        >

          <div class="car-overlay">

            <span>
              ${car.brand} ${car.model}
            </span>

            <span>
              ${car.year}
            </span>

          </div>

        </div>


        <div class="car-body">

          <span
            class="match-badge"
            style="
              display:inline-block;
              margin-bottom:8px;
            "
          >
            %${score} Uyumlu
          </span>


          <div class="car-title">
            ${car.brand} ${car.model}
          </div>


          <div class="car-price">
            ${car.price.toLocaleString("tr-TR")} TL
          </div>


          <div class="car-meta">

            <span>
              ${car.fuel}
            </span>

            •

            <span>
              ${car.trans}
            </span>

            •

            <span>
              ${car.km.toLocaleString("tr-TR")} KM
            </span>

          </div>


          <div
            style="
              margin-top:12px;
              padding-top:12px;
              border-top:1px solid var(--line);
            "
          >

            <div
              style="
                font-size:11px;
                font-weight:900;
                margin-bottom:6px;
              "
            >
              Neden öneriyoruz?
            </div>

            <div
              style="
                display:flex;
                flex-direction:column;
                gap:4px;
              "
            >

              ${
                reasons.length
                  ? reasons
                      .map(reason => `
                        <span
                          style="
                            font-size:11px;
                            color:var(--muted);
                          "
                        >
                          ✓ ${reason}
                        </span>
                      `)
                      .join("")
                  : `
                    <span
                      style="
                        font-size:11px;
                        color:var(--muted);
                      "
                    >
                      ✓ Genel tercihlerinize uyumlu
                    </span>
                  `
              }

            </div>

          </div>


          <div
            class="badge-tco"
            style="margin-top:12px;"
          >
            Tahmini Yürütme:
            ~${car.tco.toLocaleString("tr-TR")} TL / ay
          </div>

        </div>

      </div>

    `;

  }


  // =========================================================
  // RESET
  // =========================================================

  window.resetWizard = function () {

    currentStep = 1;


    wizardState.budget = {

      type: "range",

      min: 1000000,

      max: 1500000,

      label:
        "1.000.000 – 1.500.000 TL"

    };


    wizardState.usage = [];

    wizardState.fuel = [];

    wizardState.transmission = null;

    wizardState.priorities = [];

    wizardState.body = [];


    const card =
      $("wizardCard");

    const result =
      $("wizardResult");


    if (card) {
      card.style.display = "block";
    }


    if (result) {
      result.style.display = "none";
    }


    renderWizard();

    scrollToWizard();

  };


  // =========================================================
  // SCROLL
  // =========================================================

  function scrollToWizard() {

    const card =
      $("wizardCard");


    if (!card) return;


    setTimeout(() => {

      card.scrollIntoView({

        behavior: "smooth",

        block: "start"

      });

    }, 50);

  }


  // =========================================================
  // SAYI FORMAT
  // =========================================================

  function formatNumber(value) {

    return new Intl.NumberFormat(
      "tr-TR"
    ).format(value);

  }


  // =========================================================
  // FİYAT FORMAT
  // =========================================================

  function formatPrice(value) {

    return (
      formatNumber(value) +
      " TL"
    );

  }


  // =========================================================
  // DIŞARIDAN STATE'E ERİŞİM
  // =========================================================

  window.getWizardState = function () {

    return {

      budget: {
        ...wizardState.budget
      },

      usage:
        [...wizardState.usage],

      fuel:
        [...wizardState.fuel],

      transmission:
        wizardState.transmission,

      priorities:
        [...wizardState.priorities],

      body:
        [...wizardState.body]

    };

  };


  // =========================================================
  // BAŞLAT
  // =========================================================

  function initWizard() {

    if (!$("wizardCard")) {
      return;
    }


    renderWizard();

  }


  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initWizard
    );

  } else {

    initWizard();

  }

})();
