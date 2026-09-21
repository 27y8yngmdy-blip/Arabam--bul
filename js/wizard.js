(function () {
  "use strict";

  /* =========================================================
     ARABAMI BUL
     GELİŞMİŞ ARAÇ ÖNERİ SİSTEMİ
     ========================================================= */

  const TOTAL_STEPS = 6;
  let currentStep = 1;

  const wizardState = {
    budgetMin: 1000000,
    budgetMax: 1500000,
    budgetPreset: "1-1.5",
    customBudget: false,

    usage: [],
    fuel: [],
    transmission: null,
    priorities: [],
    body: []
  };

  /* =========================================================
     SORULAR
     ========================================================= */

  const questions = [

    {
      step: 1,
      title: "Bütçeniz nedir?",
      subtitle: "Araç için ayırabileceğiniz bütçe aralığını seçin.",
      type: "budget"
    },

    {
      step: 2,
      title: "Aracı daha çok nasıl kullanacaksınız?",
      subtitle: "Birden fazla seçenek seçebilirsiniz.",
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
      subtitle: "Birden fazla seçenek seçebilirsiniz.",
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
      subtitle: "Size uygun vites tipini seçin.",
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
      subtitle: "Birden fazla özellik seçebilirsiniz.",
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
      subtitle: "Birden fazla kasa tipi seçebilirsiniz.",
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

  /* =========================================================
     YARDIMCI
     ========================================================= */

  function $(id) {
    return document.getElementById(id);
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("tr-TR").format(value) + " TL";
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("tr-TR").format(value);
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     WIZARD RENDER
     ========================================================= */

  function renderWizard() {

    const question = questions[currentStep - 1];

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

    badge.textContent = `Soru ${currentStep} / ${TOTAL_STEPS}`;

    title.textContent = question.title;

    sub.textContent = question.subtitle;

    progress.style.width =
      `${(currentStep / TOTAL_STEPS) * 100}%`;

    if (prevBtn) {

      prevBtn.disabled = currentStep === 1;

      prevBtn.style.opacity =
        currentStep === 1 ? "0.5" : "1";

      prevBtn.style.visibility = "visible";
    }

    options.innerHTML = "";

    if (question.type === "budget") {
      renderBudget(options);
      return;
    }

    question.options.forEach(option => {

      const selected =
        isSelected(question, option.value);

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
          <strong>${escapeHtml(option.title)}</strong>
          <span>${escapeHtml(option.text)}</span>
        </div>

        <div class="wizard-check">
          ${selected ? "✓" : ""}
        </div>
      `;

      button.addEventListener("click", () => {

        selectOption(
          question,
          option.value
        );

        renderWizard();
      });

      options.appendChild(button);
    });
  }

  /* =========================================================
     BÜTÇE
     ========================================================= */

  function renderBudget(container) {

    const presets = [
      {
        id: "1-1.5",
        min: 1000000,
        max: 1500000,
        title: "1.000.000 – 1.500.000 TL"
      },
      {
        id: "1.5-2",
        min: 1500000,
        max: 2000000,
        title: "1.500.000 – 2.000.000 TL"
      },
      {
        id: "2-2.5",
        min: 2000000,
        max: 2500000,
        title: "2.000.000 – 2.500.000 TL"
      },
      {
        id: "2.5-3",
        min: 2500000,
        max: 3000000,
        title: "2.500.000 – 3.000.000 TL"
      },
      {
        id: "3-4",
        min: 3000000,
        max: 4000000,
        title: "3.000.000 – 4.000.000 TL"
      },
      {
        id: "4+",
        min: 4000000,
        max: 10000000,
        title: "4.000.000 TL ve üzeri"
      }
    ];

    container.innerHTML = `

      <div class="wizard-budget">

        <div style="
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:12px;
        ">

          ${presets.map(preset => `

            <button
              type="button"
              data-budget="${preset.id}"
              style="
                text-align:left;
                border:1px solid ${
                  wizardState.budgetPreset === preset.id &&
                  !wizardState.customBudget
                    ? "#e53935"
                    : "#e6e8eb"
                };
                background:${
                  wizardState.budgetPreset === preset.id &&
                  !wizardState.customBudget
                    ? "#fff3f3"
                    : "#fff"
                };
                border-radius:14px;
                padding:16px;
                cursor:pointer;
                transition:.2s;
              "
            >

              <div style="
                font-size:13px;
                font-weight:800;
                color:#17191c;
              ">
                ${preset.title}
              </div>

              <div style="
                margin-top:6px;
                font-size:11px;
                color:#777;
              ">
                ${
                  wizardState.budgetPreset === preset.id &&
                  !wizardState.customBudget
                    ? "✓ Seçildi"
                    : "Bu aralığı seç"
                }
              </div>

            </button>

          `).join("")}

        </div>

        <button
          type="button"
          id="customBudgetButton"
          style="
            width:100%;
            margin-top:12px;
            text-align:left;
            border:1px solid ${
              wizardState.customBudget
                ? "#e53935"
                : "#e6e8eb"
            };
            background:${
              wizardState.customBudget
                ? "#fff3f3"
                : "#fff"
            };
            border-radius:14px;
            padding:16px;
            cursor:pointer;
          "
        >

          <div style="
            font-size:13px;
            font-weight:900;
          ">
            ✏️ Kendi bütçemi girmek istiyorum
          </div>

          <div style="
            margin-top:5px;
            font-size:11px;
            color:#777;
          ">
            Minimum ve maksimum bütçenizi kendiniz belirleyin.
          </div>

        </button>

        <div
          id="customBudgetArea"
          style="
            display:${wizardState.customBudget ? "block" : "none"};
            margin-top:16px;
            padding:18px;
            background:#fafafa;
            border:1px solid #e6e8eb;
            border-radius:14px;
          "
        >

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
          ">

            <div>
              <label style="
                display:block;
                font-size:12px;
                font-weight:800;
                margin-bottom:6px;
              ">
                Minimum bütçe
              </label>

              <input
                id="budgetMinInput"
                type="number"
                value="${wizardState.budgetMin}"
                min="0"
                step="50000"
                placeholder="Örn. 1300000"
                style="
                  width:100%;
                  box-sizing:border-box;
                  padding:13px;
                  border:1px solid #ddd;
                  border-radius:10px;
                  font-size:14px;
                "
              >
            </div>

            <div>
              <label style="
                display:block;
                font-size:12px;
                font-weight:800;
                margin-bottom:6px;
              ">
                Maksimum bütçe
              </label>

              <input
                id="budgetMaxInput"
                type="number"
                value="${wizardState.budgetMax}"
                min="0"
                step="50000"
                placeholder="Örn. 1600000"
                style="
                  width:100%;
                  box-sizing:border-box;
                  padding:13px;
                  border:1px solid #ddd;
                  border-radius:10px;
                  font-size:14px;
                "
              >
            </div>

          </div>

          <div
            id="budgetValidation"
            style="
              margin-top:10px;
              font-size:12px;
              color:#777;
            "
          >
            ${formatPrice(wizardState.budgetMin)}
            –
            ${formatPrice(wizardState.budgetMax)}
          </div>

        </div>

      </div>
    `;

    /* preset buttons */

    container
      .querySelectorAll("[data-budget]")
      .forEach(button => {

        button.addEventListener("click", () => {

          const preset =
            presets.find(
              item =>
                item.id === button.dataset.budget
            );

          if (!preset) return;

          wizardState.budgetMin = preset.min;
          wizardState.budgetMax = preset.max;
          wizardState.budgetPreset = preset.id;
          wizardState.customBudget = false;

          renderWizard();
        });

      });

    /* custom budget */

    const customButton =
      $("customBudgetButton");

    if (customButton) {

      customButton.addEventListener("click", () => {

        wizardState.customBudget = true;

        wizardState.budgetPreset = "custom";

        renderWizard();

      });

    }

    const minInput =
      $("budgetMinInput");

    const maxInput =
      $("budgetMaxInput");

    const validation =
      $("budgetValidation");

    function updateCustomBudget() {

      if (!minInput || !maxInput) return;

      const min =
        Number(minInput.value);

      const max =
        Number(maxInput.value);

      if (
        min > 0 &&
        max > 0 &&
        max >= min
      ) {

        wizardState.budgetMin = min;
        wizardState.budgetMax = max;

        if (validation) {

          validation.textContent =
            `${formatPrice(min)} – ${formatPrice(max)}`;

          validation.style.color =
            "#18864b";
        }

      } else {

        if (validation) {

          validation.textContent =
            "Maksimum bütçe minimum bütçeden küçük olamaz.";

          validation.style.color =
            "#d93025";
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

  /* =========================================================
     SEÇİM
     ========================================================= */

  function isSelected(question, value) {

    if (question.type === "single") {

      return wizardState[question.key] === value;
    }

    if (question.type === "multi") {

      return wizardState[question.key]
        .includes(value);
    }

    return false;
  }

  function selectOption(question, value) {

    if (question.type === "single") {

      wizardState[question.key] = value;

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

  /* =========================================================
     NEXT
     ========================================================= */

  window.nextQ = function () {

    if (!validateStep()) return;

    if (currentStep < TOTAL_STEPS) {

      currentStep++;

      renderWizard();

      scrollToWizard();

      return;
    }

    showWizardResults();
  };

  /* =========================================================
     PREVIOUS
     ========================================================= */

  window.prevQ = function () {

    if (currentStep <= 1) return;

    currentStep--;

    renderWizard();

    scrollToWizard();
  };

  /* =========================================================
     VALIDATION
     ========================================================= */

  function validateStep() {

    const question =
      questions[currentStep - 1];

    if (question.type === "budget") {

      if (
        !wizardState.budgetMin ||
        !wizardState.budgetMax ||
        wizardState.budgetMax <
        wizardState.budgetMin
      ) {

        alert(
          "Lütfen geçerli bir bütçe aralığı seçin."
        );

        return false;
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

  /* =========================================================
     SONUÇLAR
     ========================================================= */

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

      wizardCard.style.display = "none";

      result.style.display = "block";

      grid.innerHTML = `
        <div style="
          padding:50px 20px;
          text-align:center;
          grid-column:1/-1;
        ">
          <div style="
            font-size:40px;
            margin-bottom:15px;
          ">
            🚗
          </div>

          <strong>
            Henüz araç verisi bulunamadı.
          </strong>
        </div>
      `;

      return;
    }

    const scoredCars =
      cars
        .map(car => {

          const analysis =
            calculateScore(car);

          return {
            car,
            score: analysis.score,
            reasons: analysis.reasons,
            breakdown: analysis.breakdown
          };

        })
        .sort((a, b) => {

          if (b.score !== a.score) {

            return b.score - a.score;
          }

          return (
            budgetDistance(a.car) -
            budgetDistance(b.car)
          );

        });

    const best =
      scoredCars[0];

    const others =
      scoredCars.slice(1, 6);

    wizardCard.style.display =
      "none";

    result.style.display =
      "block";

    grid.innerHTML =
      createResultsPage(
        best,
        others,
        cars.length
      );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* =========================================================
     SKORLAMA SİSTEMİ
     ========================================================= */

  function calculateScore(car) {

    /*
      TOPLAM 100 PUAN

      Bütçe       30
      Yakıt       15
      Vites       15
      Kasa        15
      Kullanım    10
      Öncelikler  15
    */

    let score = 0;

    const reasons = [];

    const breakdown = {
      budget: 0,
      fuel: 0,
      transmission: 0,
      body: 0,
      usage: 0,
      priorities: 0
    };

    /* -------------------------
       BÜTÇE
       ------------------------- */

    const budget =
      calculateBudgetScore(car);

    breakdown.budget =
      budget.points;

    score += budget.points;

    if (budget.reason) {
      reasons.push(budget.reason);
    }

    /* -------------------------
       YAKIT
       ------------------------- */

    if (
      wizardState.fuel.length > 0
    ) {

      if (
        wizardState.fuel.includes(
          car.fuel
        )
      ) {

        breakdown.fuel = 15;

        score += 15;

        reasons.push(
          `${car.fuel} tercihinizle uyumlu`
        );

      } else {

        breakdown.fuel = 0;
      }

    } else {

      breakdown.fuel = 8;

      score += 8;
    }

    /* -------------------------
       VİTES
       ------------------------- */

    if (
      wizardState.transmission
    ) {

      if (
        car.trans ===
        wizardState.transmission
      ) {

        breakdown.transmission = 15;

        score += 15;

        reasons.push(
          `${car.trans} vites tercihinizle uyumlu`
        );

      }

    } else {

      breakdown.transmission = 8;

      score += 8;
    }

    /* -------------------------
       KASA
       ------------------------- */

    if (
      wizardState.body.length > 0
    ) {

      if (
        wizardState.body.includes(
          car.seg
        )
      ) {

        breakdown.body = 15;

        score += 15;

        reasons.push(
          `${car.seg} kasa tercihinizle uyumlu`
        );

      }

    } else {

      breakdown.body = 8;

      score += 8;
    }

    /* -------------------------
       KULLANIM
       ------------------------- */

    let usagePoints = 0;

    wizardState.usage.forEach(
      usage => {

        if (
          usage === "city" &&
          car.seg === "Hatchback"
        ) {

          usagePoints += 5;

        }

        if (
          usage === "city" &&
          car.fuel === "Hibrit"
        ) {

          usagePoints += 3;

        }

        if (
          usage === "longRoad" &&
          (
            car.seg === "Sedan" ||
            car.seg === "SUV"
          )
        ) {

          usagePoints += 5;

        }

        if (
          usage === "family" &&
          (
            car.seg === "SUV" ||
            car.seg === "Sedan"
          )
        ) {

          usagePoints += 5;

        }

        if (
          usage === "daily" &&
          car.trans === "Otomatik"
        ) {

          usagePoints += 3;

        }

        if (
          usage === "fun" &&
          car.seg === "Coupe"
        ) {

          usagePoints += 7;

        }

        if (
          usage === "firstCar" &&
          car.price <= wizardState.budgetMax
        ) {

          usagePoints += 3;

        }

      }
    );

    breakdown.usage =
      Math.min(10, usagePoints);

    score += breakdown.usage;

    if (breakdown.usage >= 6) {

      reasons.push(
        "Kullanım şeklinizle güçlü uyum"
      );
    }

    /* -------------------------
       ÖNCELİKLER
       ------------------------- */

    let priorityPoints = 0;

    wizardState.priorities.forEach(
      priority => {

        if (
          priority === "economy"
        ) {

          if (
            car.fuel === "Hibrit" ||
            car.fuel === "Elektrik"
          ) {

            priorityPoints += 5;

          } else if (
            car.fuel === "Dizel"
          ) {

            priorityPoints += 4;

          }

        }

        if (
          priority === "comfort"
        ) {

          if (
            car.seg === "Sedan" ||
            car.seg === "SUV"
          ) {

            priorityPoints += 4;
          }

        }

        if (
          priority === "performance"
        ) {

          if (
            car.seg === "Coupe"
          ) {

            priorityPoints += 6;

          } else if (
            Number.parseInt(
              car.power
            ) >= 140
          ) {

            priorityPoints += 4;
          }

        }

        if (
          priority === "safety"
        ) {

          if (
            car.year >= 2022
          ) {

            priorityPoints += 4;
          }

        }

        if (
          priority === "space"
        ) {

          if (
            car.seg === "SUV" ||
            car.seg === "Sedan"
          ) {

            priorityPoints += 4;
          }

        }

        if (
          priority === "technology"
        ) {

          if (
            car.year >= 2023 ||
            car.fuel === "Elektrik"
          ) {

            priorityPoints += 5;
          }

        }

      }
    );

    breakdown.priorities =
      Math.min(15, priorityPoints);

    score += breakdown.priorities;

    if (
      breakdown.priorities >= 7
    ) {

      reasons.push(
        "Önceliklerinize güçlü şekilde uyuyor"
      );
    }

    /* -------------------------
       SONUÇ
       ------------------------- */

    score =
      Math.round(
        Math.min(
          99,
          Math.max(
            35,
            score
          )
        )
      );

    return {
      score,
      reasons: [
        ...new Set(reasons)
      ].slice(0, 4),
      breakdown
    };
  }

  /* =========================================================
     BÜTÇE SKORU
     ========================================================= */

  function calculateBudgetScore(car) {

    const min =
      wizardState.budgetMin;

    const max =
      wizardState.budgetMax;

    const price =
      Number(car.price) || 0;

    if (
      price >= min &&
      price <= max
    ) {

      return {
        points: 30,
        reason: "Bütçe aralığınızın içinde"
      };
    }

    if (price < min) {

      const difference =
        min - price;

      const ratio =
        difference / min;

      if (ratio <= 0.10) {

        return {
          points: 26,
          reason:
            "Bütçenizin altında, avantajlı fiyat"
        };

      }

      if (ratio <= 0.20) {

        return {
          points: 21,
          reason:
            "Bütçenizin altında"
        };

      }

      return {
        points: 15,
        reason:
          "Belirlediğiniz bütçenin altında"
      };
    }

    const difference =
      price - max;

    const ratio =
      difference / max;

    if (ratio <= 0.05) {

      return {
        points: 25,
        reason:
          "Bütçenizin biraz üzerinde"
      };
    }

    if (ratio <= 0.10) {

      return {
        points: 18,
        reason:
          "Bütçenizin üzerinde"
      };
    }

    if (ratio <= 0.20) {

      return {
        points: 10,
        reason:
          "Bütçenizin belirgin şekilde üzerinde"
      };
    }

    return {
      points: 3,
      reason:
        "Bütçenizin oldukça üzerinde"
    };
  }

  function budgetDistance(car) {

    const price =
      Number(car.price) || 0;

    if (
      price >= wizardState.budgetMin &&
      price <= wizardState.budgetMax
    ) {

      return 0;
    }

    if (
      price < wizardState.budgetMin
    ) {

      return wizardState.budgetMin - price;
    }

    return price - wizardState.budgetMax;
  }

  /* =========================================================
     SONUÇ SAYFASI
     ========================================================= */

  function createResultsPage(
    best,
    others,
    totalCars
  ) {

    const preferenceChips =
      createPreferenceChips();

    return `

      <div style="
        grid-column:1/-1;
        width:100%;
      ">

        <!-- HERO -->

        <div style="
          background:linear-gradient(
            135deg,
            #e53935 0%,
            #c62828 100%
          );
          border-radius:22px;
          padding:28px;
          color:#fff;
          margin-bottom:20px;
          box-shadow:0 12px 30px rgba(229,57,53,.18);
        ">

          <div style="
            font-size:12px;
            font-weight:800;
            opacity:.85;
            text-transform:uppercase;
            letter-spacing:.5px;
          ">
            ARABAMI BUL
          </div>

          <h2 style="
            margin:7px 0 8px;
            font-size:28px;
            line-height:1.15;
          ">
            Senin için araçları analiz ettik.
          </h2>

          <p style="
            margin:0;
            max-width:700px;
            font-size:14px;
            line-height:1.6;
            opacity:.92;
          ">
            ${totalCars} araç tercihlerinize göre karşılaştırıldı
            ve size en uygun seçenekler sıralandı.
          </p>

          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:8px;
            margin-top:18px;
          ">

            <span style="
              background:rgba(255,255,255,.15);
              border:1px solid rgba(255,255,255,.2);
              padding:8px 12px;
              border-radius:999px;
              font-size:12px;
            ">
              💰 ${formatPrice(wizardState.budgetMin)}
              – ${formatPrice(wizardState.budgetMax)}
            </span>

            <span style="
              background:rgba(255,255,255,.15);
              border:1px solid rgba(255,255,255,.2);
              padding:8px 12px;
              border-radius:999px;
              font-size:12px;
            ">
              🏆 En yüksek uyum: %${best.score}
            </span>

          </div>

        </div>

        <!-- TERCİHLER -->

        <div style="
          background:#fff;
          border:1px solid #e8e9ec;
          border-radius:18px;
          padding:18px;
          margin-bottom:20px;
        ">

          <div style="
            font-size:13px;
            font-weight:900;
            margin-bottom:11px;
          ">
            Tercihleriniz
          </div>

          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:7px;
          ">
            ${preferenceChips}
          </div>

        </div>

        <!-- EN İYİ ARAÇ -->

        <div style="
          background:#fff;
          border:1px solid #e6e8eb;
          border-radius:22px;
          overflow:hidden;
          margin-bottom:25px;
          box-shadow:0 8px 25px rgba(0,0,0,.05);
        ">

          <div style="
            padding:18px 20px;
            border-bottom:1px solid #eee;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            flex-wrap:wrap;
          ">

            <div>
              <div style="
                font-size:11px;
                color:#e53935;
                font-weight:900;
                text-transform:uppercase;
              ">
                🏆 EN GÜÇLÜ EŞLEŞME
              </div>

              <div style="
                font-size:20px;
                font-weight:900;
                margin-top:4px;
              ">
                ${escapeHtml(best.car.brand)}
                ${escapeHtml(best.car.model)}
              </div>
            </div>

            <div style="
              background:#fff0f0;
              color:#d52f2f;
              border-radius:12px;
              padding:10px 15px;
              font-size:20px;
              font-weight:900;
            ">
              %${best.score} Uyumlu
            </div>

          </div>

          <div style="
            display:grid;
            grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);
          ">

            <!-- FOTO -->

            <div style="
              min-height:330px;
              background-image:url('${escapeHtml(best.car.img)}');
              background-size:cover;
              background-position:center;
              position:relative;
            ">

              <div style="
                position:absolute;
                left:14px;
                bottom:14px;
                background:rgba(0,0,0,.72);
                color:#fff;
                padding:8px 12px;
                border-radius:10px;
                font-size:12px;
                font-weight:800;
              ">
                ${escapeHtml(best.car.year)}
                •
                ${formatNumber(best.car.km)} KM
              </div>

            </div>

            <!-- BİLGİ -->

            <div style="
              padding:24px;
            ">

              <div style="
                font-size:26px;
                font-weight:900;
                margin-bottom:4px;
              ">
                ${formatPrice(best.car.price)}
              </div>

              <div style="
                font-size:12px;
                color:#777;
                margin-bottom:20px;
              ">
                Tahmini yürütme:
                ~${formatNumber(best.car.tco)}
                TL / ay
              </div>

              <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:9px;
                margin-bottom:22px;
              ">

                ${resultSpec(
                  "⛽",
                  "Yakıt",
                  best.car.fuel
                )}

                ${resultSpec(
                  "⚙️",
                  "Vites",
                  best.car.trans
                )}

                ${resultSpec(
                  "🚗",
                  "Kasa",
                  best.car.seg
                )}

                ${resultSpec(
                  "📅",
                  "Model",
                  best.car.year
                )}

              </div>

              <div style="
                font-size:13px;
                font-weight:900;
                margin-bottom:10px;
              ">
                Neden bu araç?
              </div>

              <div style="
                display:flex;
                flex-direction:column;
                gap:7px;
                margin-bottom:20px;
              ">

                ${
                  best.reasons.length
                    ? best.reasons.map(
                        reason => `
                          <div style="
                            font-size:12px;
                            color:#555;
                          ">
                            <span style="
                              color:#18a05e;
                              font-weight:900;
                            ">
                              ✓
                            </span>
                            ${escapeHtml(reason)}
                          </div>
                        `
                      ).join("")
                    : `
                      <div style="
                        font-size:12px;
                        color:#666;
                      ">
                        Tercihlerinizle genel olarak uyumlu.
                      </div>
                    `
                }

              </div>

              <div style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
              ">

                <button
                  type="button"
                  onclick="openDetail(${best.car.id})"
                  style="
                    flex:1;
                    min-width:150px;
                    border:0;
                    background:#e53935;
                    color:#fff;
                    padding:13px 16px;
                    border-radius:11px;
                    font-weight:900;
                    cursor:pointer;
                  "
                >
                  Aracı İncele →
                </button>

                <button
                  type="button"
                  onclick="toggleFav(${best.car.id}, event)"
                  style="
                    width:48px;
                    border:1px solid #ddd;
                    background:#fff;
                    border-radius:11px;
                    font-size:18px;
                    cursor:pointer;
                  "
                  aria-label="Favorilere ekle"
                >
                  ${
                    isFavorite(best.car.id)
                      ? "❤️"
                      : "♡"
                  }
                </button>

              </div>

            </div>

          </div>

        </div>

        <!-- UYUM ANALİZİ -->

        <div style="
          background:#fff;
          border:1px solid #e6e8eb;
          border-radius:20px;
          padding:22px;
          margin-bottom:25px;
        ">

          <div style="
            font-size:18px;
            font-weight:900;
            margin-bottom:5px;
          ">
            📊 Uyum Analizi
          </div>

          <div style="
            font-size:12px;
            color:#777;
            margin-bottom:20px;
          ">
            ${escapeHtml(best.car.brand)}
            ${escapeHtml(best.car.model)}
            için tercihlerinize göre hesaplanan dağılım.
          </div>

          ${scoreBar(
            "Bütçe",
            best.breakdown.budget,
            30
          )}

          ${scoreBar(
            "Yakıt",
            best.breakdown.fuel,
            15
          )}

          ${scoreBar(
            "Vites",
            best.breakdown.transmission,
            15
          )}

          ${scoreBar(
            "Kasa",
            best.breakdown.body,
            15
          )}

          ${scoreBar(
            "Kullanım",
            best.breakdown.usage,
            10
          )}

          ${scoreBar(
            "Öncelikler",
            best.breakdown.priorities,
            15
          )}

        </div>

        <!-- DİĞER ARAÇLAR -->

        <div style="
          margin-bottom:15px;
        ">

          <div style="
            font-size:21px;
            font-weight:900;
            margin-bottom:5px;
          ">
            Diğer güçlü eşleşmeler
          </div>

          <div style="
            font-size:12px;
            color:#777;
            margin-bottom:15px;
          ">
            Tercihlerinize göre öne çıkan diğer araçlar.
          </div>

        </div>

        <div style="
          display:grid;
          grid-template-columns:
            repeat(auto-fit,minmax(240px,1fr));
          gap:15px;
        ">

          ${
            others.length
              ? others.map(
                  item =>
                    createSmallResultCard(item)
                ).join("")
              : `
                <div style="
                  padding:30px;
                  background:#fff;
                  border:1px solid #eee;
                  border-radius:15px;
                  color:#777;
                ">
                  Başka uygun araç bulunamadı.
                </div>
              `
          }

        </div>

        <!-- YENİDEN BAŞLAT -->

        <div style="
          text-align:center;
          margin-top:30px;
          padding:25px 0 10px;
        ">

          <button
            type="button"
            onclick="resetWizard()"
            style="
              border:1px solid #ddd;
              background:#fff;
              padding:12px 18px;
              border-radius:11px;
              font-weight:800;
              cursor:pointer;
            "
          >
            ↻ Tercihlerimi Değiştir
          </button>

        </div>

      </div>
    `;
  }

  /* =========================================================
     TERCİH CHIPS
     ========================================================= */

  function createPreferenceChips() {

    const chips = [];

    chips.push(
      `💰 ${formatPrice(wizardState.budgetMin)} – ${formatPrice(wizardState.budgetMax)}`
    );

    if (
      wizardState.transmission
    ) {

      chips.push(
        `⚙️ ${wizardState.transmission}`
      );
    }

    wizardState.fuel.forEach(
      fuel => chips.push(`⛽ ${fuel}`)
    );

    wizardState.body.forEach(
      body => chips.push(`🚗 ${body}`)
    );

    const priorityNames = {
      economy: "Az Tüketim",
      comfort: "Konfor",
      performance: "Performans",
      safety: "Güvenlik",
      space: "Genişlik",
      technology: "Teknoloji"
    };

    wizardState.priorities.forEach(
      priority => {

        chips.push(
          `✓ ${priorityNames[priority] || priority}`
        );

      }
    );

    return chips.map(
      chip => `
        <span style="
          display:inline-flex;
          align-items:center;
          background:#f6f7f8;
          border:1px solid #e8e9eb;
          padding:7px 10px;
          border-radius:999px;
          font-size:11px;
          font-weight:700;
        ">
          ${escapeHtml(chip)}
        </span>
      `
    ).join("");
  }

  /* =========================================================
     SPEC
     ========================================================= */

  function resultSpec(
    icon,
    label,
    value
  ) {

    return `
      <div style="
        border:1px solid #eee;
        border-radius:11px;
        padding:10px;
      ">

        <div style="
          font-size:11px;
          color:#888;
          margin-bottom:4px;
        ">
          ${icon} ${escapeHtml(label)}
        </div>

        <div style="
          font-size:12px;
          font-weight:900;
        ">
          ${escapeHtml(value)}
        </div>

      </div>
    `;
  }

  /* =========================================================
     SCORE BAR
     ========================================================= */

  function scoreBar(
    label,
    value,
    max
  ) {

    const percent =
      Math.round(
        (value / max) * 100
      );

    return `
      <div style="
        margin-bottom:15px;
      ">

        <div style="
          display:flex;
          justify-content:space-between;
          font-size:12px;
          font-weight:800;
          margin-bottom:6px;
        ">

          <span>
            ${escapeHtml(label)}
          </span>

          <span>
            %${percent}
          </span>

        </div>

        <div style="
          width:100%;
          height:8px;
          background:#eee;
          border-radius:999px;
          overflow:hidden;
        ">

          <div style="
            width:${percent}%;
            height:100%;
            background:#e53935;
            border-radius:999px;
            transition:width .5s ease;
          "></div>

        </div>

      </div>
    `;
  }

  /* =========================================================
     KÜÇÜK SONUÇ KARTI
     ========================================================= */

  function createSmallResultCard(item) {

    const car =
      item.car;

    return `
      <div style="
        background:#fff;
        border:1px solid #e6e8eb;
        border-radius:17px;
        overflow:hidden;
        position:relative;
        box-shadow:0 4px 15px rgba(0,0,0,.04);
      ">

        <div
          onclick="openDetail(${car.id})"
          style="
            height:175px;
            background-image:url('${escapeHtml(car.img)}');
            background-size:cover;
            background-position:center;
            cursor:pointer;
            position:relative;
          "
        >

          <div style="
            position:absolute;
            left:10px;
            top:10px;
            background:#fff;
            color:#d83232;
            padding:7px 9px;
            border-radius:9px;
            font-size:11px;
            font-weight:900;
          ">
            %${item.score} Uyumlu
          </div>

        </div>

        <div style="
          padding:15px;
        ">

          <div style="
            font-size:15px;
            font-weight:900;
            margin-bottom:5px;
          ">
            ${escapeHtml(car.brand)}
            ${escapeHtml(car.model)}
          </div>

          <div style="
            font-size:18px;
            font-weight:900;
            margin-bottom:8px;
          ">
            ${formatPrice(car.price)}
          </div>

          <div style="
            font-size:11px;
            color:#777;
            line-height:1.7;
          ">
            ${car.year}
            • ${formatNumber(car.km)} KM
            • ${escapeHtml(car.fuel)}
            • ${escapeHtml(car.trans)}
          </div>

          <div style="
            margin-top:11px;
            padding-top:10px;
            border-top:1px solid #eee;
            font-size:11px;
            color:#555;
          ">
            ${
              item.reasons[0]
                ? "✓ " + escapeHtml(item.reasons[0])
                : "✓ Tercihlerinizle uyumlu"
            }
          </div>

          <button
            type="button"
            onclick="openDetail(${car.id})"
            style="
              width:100%;
              margin-top:12px;
              padding:10px;
              border:1px solid #e53935;
              background:#fff;
              color:#d83232;
              border-radius:9px;
              font-weight:900;
              cursor:pointer;
            "
          >
            Aracı İncele
          </button>

        </div>

      </div>
    `;
  }

  /* =========================================================
     FAVORİ
     ========================================================= */

  function isFavorite(id) {

    return (
      Array.isArray(window.favorites) &&
      window.favorites.includes(id)
    );
  }

  /* =========================================================
     RESET
     ========================================================= */

  window.resetWizard = function () {

    currentStep = 1;

    wizardState.budgetMin =
      1000000;

    wizardState.budgetMax =
      1500000;

    wizardState.budgetPreset =
      "1-1.5";

    wizardState.customBudget =
      false;

    wizardState.usage = [];

    wizardState.fuel = [];

    wizardState.transmission =
      null;

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

  /* =========================================================
     SCROLL
     ========================================================= */

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

  /* =========================================================
     PUBLIC STATE
     ========================================================= */

  window.getWizardState =
    function () {

      return {

        budgetMin:
          wizardState.budgetMin,

        budgetMax:
          wizardState.budgetMax,

        budgetPreset:
          wizardState.budgetPreset,

        customBudget:
          wizardState.customBudget,

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

  /* =========================================================
     INIT
     ========================================================= */

  function initWizard() {

    if (!$("wizardCard")) return;

    renderWizard();
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initWizard
    );

  } else {

    initWizard();
  }

})();
