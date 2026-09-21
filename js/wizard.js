(function () {
  "use strict";

  // =========================================================
  // ARABAMI BUL — WIZARD V4
  // GELİŞMİŞ SONUÇ EKRANI
  // =========================================================

  const TOTAL_STEPS = 6;

  let currentStep = 1;
  let showingAllResults = false;

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
  // BÜTÇE ARALIKLARI
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
  // WIZARD RENDER
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


    if (
      !badge ||
      !title ||
      !sub ||
      !progress ||
      !options
    ) {

      console.warn(
        "Wizard HTML elementleri bulunamadı."
      );

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


    if (question.type === "budget") {

      renderBudget(options);

      return;

    }


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
  // BÜTÇE EKRANI
  // =========================================================

  function renderBudget(container) {

    container.innerHTML = `

      <div
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
                class="wizard-option ${
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
                    ${
                      index === 0
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
          class="wizard-option ${
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


    const customButton =
      $("customBudgetButton");


    if (customButton) {

      customButton.addEventListener(
        "click",
        () => {

          const old =
            wizardState.budget;


          wizardState.budget = {

            type: "custom",

            min:
              old &&
              old.type === "custom"
                ? old.min
                : 1500000,

            max:
              old &&
              old.type === "custom"
                ? old.max
                : 2200000,

            label:
              old &&
              old.type === "custom"
                ? old.label
                : "1.500.000 – 2.200.000 TL"

          };


          renderWizard();


          setTimeout(() => {

            const input =
              $("customBudgetMin");

            if (input) {
              input.focus();
            }

          }, 50);

        }
      );

    }


    const minInput =
      $("customBudgetMin");

    const maxInput =
      $("customBudgetMax");

    const preview =
      $("customBudgetPreview");


    function updateCustomBudget() {

      if (!minInput || !maxInput) {
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
  // SEÇİM KONTROL
  // =========================================================

  function isSelected(
    question,
    value
  ) {

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
  // SEÇİM
  // =========================================================

  function selectOption(
    question,
    value
  ) {

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


    if (question.type === "single") {

      if (!wizardState[question.key]) {

        alert(
          "Lütfen bir seçim yapın."
        );

        return false;

      }

      return true;

    }


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
  // SONUÇLAR
  // =========================================================

  function showWizardResults() {

    const wizardCard =
      $("wizardCard");

    const result =
      $("wizardResult");

    const grid =
      $("wizardResultGrid");


    if (
      !wizardCard ||
      !result ||
      !grid
    ) {

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

      grid.innerHTML = `
        <div style="
          grid-column:1/-1;
          padding:50px 20px;
          text-align:center;
          background:#fff;
          border-radius:20px;
        ">
          Araç verileri bulunamadı.
        </div>
      `;


      wizardCard.style.display =
        "none";

      result.style.display =
        "block";

      return;

    }


    const scoredCars =
      cars
        .map(car => {

          const result =
            calculateScore(car);


          return {

            car,

            score:
              result.score,

            reasons:
              result.reasons,

            budgetMatch:
              result.budgetMatch

          };

        })
        .sort(
          (a, b) =>
            b.score - a.score
        );


    const best =
      scoredCars[0];


    const alternatives =
      showingAllResults
        ? scoredCars.slice(1)
        : scoredCars.slice(1, 6);


    wizardCard.style.display =
      "none";

    result.style.display =
      "block";


    grid.innerHTML = `

      <div
        style="
          grid-column:1/-1;
        "
      >

        ${createResultHeader()}

        ${createTopRecommendation(best)}

        ${createAlternativeHeader(
          scoredCars.length - 1,
          showingAllResults
        )}

        <div
          class="wizard-results-grid"
          style="
            display:grid;
            grid-template-columns:
              repeat(3,minmax(0,1fr));
            gap:18px;
          "
        >

          ${alternatives
            .map(item =>
              createAlternativeCard(
                item
              )
            )
            .join("")}

        </div>


        <div
          style="
            display:flex;
            justify-content:center;
            flex-wrap:wrap;
            gap:10px;
            margin-top:24px;
          "
        >

          ${
            scoredCars.length > 6
              ? `
                <button
                  type="button"
                  class="btn-secondary"
                  onclick="toggleWizardAllResults()"
                >
                  ${
                    showingAllResults
                      ? "Daha Az Göster"
                      : "Tüm Eşleşmeleri Gör"
                  }
                </button>
              `
              : ""
          }


          <button
            type="button"
            class="btn-secondary"
            onclick="editWizardPreferences()"
          >
            ✏️ Tercihlerimi Değiştir
          </button>

        </div>

      </div>

    `;


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // =========================================================
  // SONUÇ BAŞLIĞI
  // =========================================================

  function createResultHeader() {

    const budgetLabel =
      wizardState.budget
        ? wizardState.budget.label
        : "-";


    const fuel =
      wizardState.fuel.length
        ? wizardState.fuel.join(" / ")
        : "Fark etmez";


    const transmission =
      wizardState.transmission ||
      "Fark etmez";


    const body =
      wizardState.body.length
        ? wizardState.body.join(" / ")
        : "Fark etmez";


    return `

      <div
        style="
          background:
            linear-gradient(
              135deg,
              #fff,
              #fff7f7
            );
          border:1px solid #f0d6d6;
          border-radius:22px;
          padding:24px;
          margin-bottom:20px;
        "
      >

        <div
          style="
            display:flex;
            align-items:flex-start;
            justify-content:space-between;
            gap:20px;
            flex-wrap:wrap;
          "
        >

          <div>

            <div
              style="
                display:inline-flex;
                align-items:center;
                gap:7px;
                background:#fff;
                border:1px solid #f0d6d6;
                border-radius:999px;
                padding:7px 11px;
                font-size:11px;
                font-weight:900;
                color:var(--red);
                margin-bottom:12px;
              "
            >
              🚗 ARABAMI BUL
            </div>


            <h2
              style="
                margin:0;
                font-size:26px;
                line-height:1.15;
                font-weight:950;
              "
            >
              Senin için araçları bulduk.
            </h2>


            <p
              style="
                margin:9px 0 0;
                color:var(--muted);
                font-size:13px;
                line-height:1.5;
              "
            >
              Verdiğin cevapları analiz ederek
              sana en uygun araçları sıraladık.
            </p>

          </div>


          <div
            style="
              font-size:34px;
              line-height:1;
            "
          >
            🎯
          </div>

        </div>


        <div
          style="
            display:grid;
            grid-template-columns:
              repeat(4,minmax(0,1fr));
            gap:10px;
            margin-top:20px;
          "
        >

          ${createPreferencePill(
            "Bütçe",
            budgetLabel
          )}

          ${createPreferencePill(
            "Yakıt",
            fuel
          )}

          ${createPreferencePill(
            "Vites",
            transmission
          )}

          ${createPreferencePill(
            "Kasa",
            body
          )}

        </div>

      </div>

    `;

  }


  // =========================================================
  // TERCİH PİL
  // =========================================================

  function createPreferencePill(
    title,
    value
  ) {

    return `

      <div
        style="
          background:#fff;
          border:1px solid var(--line);
          border-radius:14px;
          padding:12px;
          min-width:0;
        "
      >

        <div
          style="
            font-size:10px;
            color:var(--muted);
            font-weight:800;
            margin-bottom:4px;
          "
        >
          ${title}
        </div>


        <div
          style="
            font-size:12px;
            font-weight:900;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          "
          title="${value}"
        >
          ${value}
        </div>

      </div>

    `;

  }


  // =========================================================
  // EN UYGUN ARAÇ
  // =========================================================

  function createTopRecommendation(
    item
  ) {

    if (!item) {
      return "";
    }


    const car =
      item.car;


    const reasons =
      item.reasons;


    return `

      <div
        style="
          background:#fff;
          border:1px solid var(--line);
          border-radius:22px;
          overflow:hidden;
          margin-bottom:28px;
          box-shadow:
            0 10px 30px rgba(0,0,0,.06);
        "
      >

        <div
          style="
            padding:16px 20px;
            border-bottom:1px solid var(--line);
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
          "
        >

          <div
            style="
              font-size:15px;
              font-weight:950;
            "
          >
            🥇 Sana en uygun araç
          </div>


          <div
            style="
              font-size:11px;
              color:var(--muted);
              font-weight:700;
            "
          >
            En yüksek eşleşme
          </div>

        </div>


        <div
          style="
            display:grid;
            grid-template-columns:
              minmax(0,1.1fr)
              minmax(0,1fr);
            min-height:390px;
          "
        >

          <div
            style="
              min-height:320px;
              background-image:
                url('${car.img}');
              background-size:cover;
              background-position:center;
              position:relative;
            "
          >

            <div
              style="
                position:absolute;
                top:16px;
                left:16px;
                background:var(--red);
                color:#fff;
                padding:9px 13px;
                border-radius:999px;
                font-size:14px;
                font-weight:950;
                box-shadow:0 5px 15px rgba(0,0,0,.15);
              "
            >
              %${item.score} Uyum
            </div>


            <button
              type="button"
              onclick="toggleFav(${car.id}, event)"
              style="
                position:absolute;
                top:14px;
                right:14px;
                width:42px;
                height:42px;
                border:0;
                border-radius:50%;
                background:#fff;
                cursor:pointer;
                font-size:19px;
                box-shadow:0 5px 15px rgba(0,0,0,.15);
              "
            >
              ${
                isCarFavorite(car.id)
                  ? "❤️"
                  : "🤍"
              }
            </button>

          </div>


          <div
            style="
              padding:28px;
              display:flex;
              flex-direction:column;
              justify-content:center;
            "
          >

            <div
              style="
                font-size:12px;
                color:var(--muted);
                font-weight:800;
                margin-bottom:7px;
              "
            >
              EN GÜÇLÜ EŞLEŞME
            </div>


            <h3
              style="
                margin:0;
                font-size:25px;
                line-height:1.15;
                font-weight:950;
              "
            >
              ${car.brand} ${car.model}
            </h3>


            <div
              style="
                margin-top:13px;
                font-size:24px;
                font-weight:950;
                color:var(--red);
              "
            >
              ${car.price.toLocaleString("tr-TR")} TL
            </div>


            <div
              style="
                display:flex;
                flex-wrap:wrap;
                gap:7px;
                margin-top:13px;
              "
            >

              ${createSpec(
                car.year,
                "Model"
              )}

              ${createSpec(
                car.km.toLocaleString("tr-TR") +
                  " KM",
                "Kilometre"
              )}

              ${createSpec(
                car.fuel,
                "Yakıt"
              )}

              ${createSpec(
                car.trans,
                "Vites"
              )}

            </div>


            <div
              style="
                margin-top:20px;
              "
            >

              <div
                style="
                  font-size:12px;
                  font-weight:950;
                  margin-bottom:9px;
                "
              >
                Neden bunu öneriyoruz?
              </div>


              <div
                style="
                  display:flex;
                  flex-direction:column;
                  gap:7px;
                "
              >

                ${
                  reasons.length
                    ? reasons
                        .map(reason => `
                          <div
                            style="
                              display:flex;
                              align-items:flex-start;
                              gap:7px;
                              font-size:12px;
                              color:var(--muted);
                            "
                          >
                            <span
                              style="
                                color:#19a463;
                                font-weight:950;
                              "
                            >
                              ✓
                            </span>

                            <span>
                              ${reason}
                            </span>
                          </div>
                        `)
                        .join("")
                    : `
                      <div
                        style="
                          font-size:12px;
                          color:var(--muted);
                        "
                      >
                        ✓ Genel tercihlerinize uyumlu.
                      </div>
                    `
                }

              </div>

            </div>


            <button
              type="button"
              class="btn-primary"
              onclick="openDetail(${car.id})"
              style="
                width:100%;
                margin-top:22px;
              "
            >
              Aracı İncele →
            </button>

          </div>

        </div>

      </div>

    `;

  }


  // =========================================================
  // ARAÇ ÖZELLİĞİ
  // =========================================================

  function createSpec(
    value,
    label
  ) {

    return `

      <div
        style="
          background:#f7f7f8;
          border-radius:10px;
          padding:8px 10px;
        "
      >

        <div
          style="
            font-size:10px;
            color:var(--muted);
            margin-bottom:2px;
          "
        >
          ${label}
        </div>

        <div
          style="
            font-size:11px;
            font-weight:900;
          "
        >
          ${value}
        </div>

      </div>

    `;

  }


  // =========================================================
  // ALTERNATİFLER BAŞLIK
  // =========================================================

  function createAlternativeHeader(
    count,
    all
  ) {

    return `

      <div
        style="
          display:flex;
          justify-content:space-between;
          align-items:flex-end;
          gap:15px;
          margin-bottom:14px;
        "
      >

        <div>

          <h3
            style="
              margin:0;
              font-size:20px;
              font-weight:950;
            "
          >
            Diğer güçlü eşleşmeler
          </h3>


          <p
            style="
              margin:5px 0 0;
              font-size:12px;
              color:var(--muted);
            "
          >
            ${
              all
                ? `${count} alternatif araç`
                : `${Math.min(count, 5)} alternatif araç gösteriliyor`
            }
          </p>

        </div>

      </div>

    `;

  }


  // =========================================================
  // ALTERNATİF KART
  // =========================================================

  function createAlternativeCard(
    item
  ) {

    const car =
      item.car;


    return `

      <div
        class="vehicle-card wizard-result-card"
        style="
          position:relative;
          cursor:pointer;
        "
        onclick="openDetail(${car.id})"
      >

        <button
          type="button"
          class="fav-btn"
          onclick="toggleFav(${car.id}, event)"
        >
          ${
            isCarFavorite(car.id)
              ? "❤️"
              : "🤍"
          }
        </button>


        <div
          class="car-img"
          style="
            background-image:
              url('${car.img}');
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

          <div
            style="
              display:flex;
              align-items:center;
              justify-content:space-between;
              gap:8px;
              margin-bottom:8px;
            "
          >

            <span
              class="match-badge"
            >
              %${item.score} Uyum
            </span>


            ${
              item.budgetMatch === "exact"
                ? `
                  <span
                    style="
                      font-size:10px;
                      color:#15945a;
                      font-weight:900;
                    "
                  >
                    ✓ Bütçede
                  </span>
                `
                : ""
            }

          </div>


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
              padding-top:11px;
              border-top:1px solid var(--line);
            "
          >

            ${
              item.reasons.length
                ? item.reasons
                    .slice(0, 2)
                    .map(reason => `
                      <div
                        style="
                          font-size:11px;
                          color:var(--muted);
                          margin-bottom:4px;
                        "
                      >
                        ✓ ${reason}
                      </div>
                    `)
                    .join("")
                : `
                  <div
                    style="
                      font-size:11px;
                      color:var(--muted);
                    "
                  >
                    ✓ Tercihlerinizle uyumlu
                  </div>
                `
            }

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
  // PUANLAMA
  // =========================================================

  function calculateScore(car) {

    let score = 35;

    const reasons = [];


    // -------------------------------------------------------
    // BÜTÇE
    // -------------------------------------------------------

    const budgetResult =
      getBudgetMatch(
        car.price,
        wizardState.budget
      );


    score +=
      budgetResult.points;


    if (budgetResult.reason) {

      reasons.push(
        budgetResult.reason
      );

    }


    // -------------------------------------------------------
    // YAKIT
    // -------------------------------------------------------

    if (
      wizardState.fuel.length &&
      wizardState.fuel.includes(car.fuel)
    ) {

      score += 12;

      reasons.push(
        `${car.fuel} tercihinizle uyumlu`
      );

    }


    // -------------------------------------------------------
    // VİTES
    // -------------------------------------------------------

    if (
      wizardState.transmission &&
      car.trans ===
        wizardState.transmission
    ) {

      score += 10;

      reasons.push(
        `${car.trans} vites tercihinizle uyumlu`
      );

    }


    // -------------------------------------------------------
    // KASA
    // -------------------------------------------------------

    if (
      wizardState.body.length &&
      wizardState.body.includes(car.seg)
    ) {

      score += 12;

      reasons.push(
        `${car.seg} kasa tercihinizle uyumlu`
      );

    }


    // -------------------------------------------------------
    // KULLANIM
    // -------------------------------------------------------

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
        budgetResultIsWithinBudget(
          car.price
        )
      ) {

        score += 2;

      }

    });


    // -------------------------------------------------------
    // ÖNCELİKLER
    // -------------------------------------------------------

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
        uniqueReasons,

      budgetMatch:
        budgetResult.matchType

    };

  }


  // =========================================================
  // BÜTÇE EŞLEŞMESİ
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
        reason: "",
        matchType: "none"
      };

    }


    const min =
      Number(budget.min);

    const max =
      Number(budget.max);


    // -------------------------------------------------------
    // 4 MİLYON +
    // -------------------------------------------------------

    if (max === Infinity) {

      if (price >= min) {

        return {

          points: 30,

          reason:
            "Bütçe aralığınıza uygun",

          matchType:
            "exact"

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
            "Bütçenize oldukça yakın",

          matchType:
            "near"

        };

      }


      if (ratio <= 0.20) {

        return {

          points: 8,

          reason:
            "Bütçenizin biraz altında",

          matchType:
            "near"

        };

      }


      return {

        points: 0,

        reason: "",

        matchType: "far"

      };

    }


    // -------------------------------------------------------
    // TAM ARALIK
    // -------------------------------------------------------

    if (
      price >= min &&
      price <= max
    ) {

      return {

        points: 30,

        reason:
          "Bütçe aralığınıza uygun",

        matchType:
          "exact"

      };

    }


    // -------------------------------------------------------
    // ALTINDA
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
            "Bütçenizin altında ve bütçenizi verimli kullanıyor",

          matchType:
            "near"

        };

      }


      if (ratio <= 0.20) {

        return {

          points: 18,

          reason:
            "Bütçenizin altında",

          matchType:
            "near"

        };

      }


      return {

        points: 10,

        reason:
          "Bütçenizin altında",

        matchType:
          "low"

      };

    }


    // -------------------------------------------------------
    // ÜZERİNDE
    // -------------------------------------------------------

    const difference =
      price - max;

    const ratio =
      difference / max;


    if (ratio <= 0.10) {

      return {

        points: 18,

        reason:
          "Bütçenizin biraz üzerinde",

        matchType:
          "near"

      };

    }


    if (ratio <= 0.20) {

      return {

        points: 8,

        reason:
          "Bütçenizin üzerinde",

        matchType:
          "over"

      };

    }


    return {

      points: 0,

      reason: "",

      matchType:
        "far"

    };

  }


  // =========================================================
  // BÜTÇEDE Mİ?
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
  // FAVORİ KONTROL
  // =========================================================

  function isCarFavorite(id) {

    return (
      Array.isArray(window.favorites) &&
      window.favorites.includes(id)
    );

  }


  // =========================================================
  // TÜM SONUÇLARI GÖSTER
  // =========================================================

  window.toggleWizardAllResults =
    function () {

      showingAllResults =
        !showingAllResults;

      showWizardResults();

    };


  // =========================================================
  // TERCİHLERİ DEĞİŞTİR
  // =========================================================

  window.editWizardPreferences =
    function () {

      showingAllResults =
        false;

      currentStep =
        1;


      const card =
        $("wizardCard");

      const result =
        $("wizardResult");


      if (card) {

        card.style.display =
          "block";

      }


      if (result) {

        result.style.display =
          "none";

      }


      renderWizard();

      scrollToWizard();

    };


  // =========================================================
  // RESET
  // =========================================================

  window.resetWizard =
    function () {

      currentStep =
        1;

      showingAllResults =
        false;


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

        card.style.display =
          "block";

      }


      if (result) {

        result.style.display =
          "none";

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


    if (!card) {
      return;
    }


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
  // DIŞARIDAN STATE
  // =========================================================

  window.getWizardState =
    function () {

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
