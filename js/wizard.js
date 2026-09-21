(function () {
  'use strict';

  /*
   * =========================================================
   * ARABAMI BUL — WIZARD
   * 6 ADIMLI ARAÇ ÖNERİ SİSTEMİ
   * =========================================================
   */

  const TOTAL_STEPS = 6;

  let currentStep = 1;

  /*
   * Kullanıcının bütün seçimleri burada tutulur.
   *
   * İleride gerçek araç eşleştirme algoritmasını
   * doğrudan bu state üzerinden kuracağız.
   */
  const wizardState = {
    budget: null,
    usage: [],
    fuel: [],
    transmission: null,
    priorities: [],
    body: []
  };


  /*
   * =========================================================
   * SORULAR
   * =========================================================
   */

  const questions = [

    {
      step: 1,

      title: 'Bütçeniz nedir?',

      subtitle:
        'Satın almayı düşündüğünüz maksimum araç fiyatını seçin.',

      type: 'budget'
    },


    {
      step: 2,

      title: 'Aracı daha çok nasıl kullanacaksınız?',

      subtitle:
        'Birden fazla seçenek seçebilirsiniz.',

      type: 'multi',

      key: 'usage',

      options: [
        {
          value: 'city',
          icon: '🏙️',
          title: 'Şehir İçi',
          text: 'Günlük şehir kullanımım ağırlıklı.'
        },

        {
          value: 'longRoad',
          icon: '🛣️',
          title: 'Uzun Yol',
          text: 'Sık sık şehirler arası yol yaparım.'
        },

        {
          value: 'family',
          icon: '👨‍👩‍👧‍👦',
          title: 'Aile',
          text: 'Aile ve geniş kullanım önemli.'
        },

        {
          value: 'daily',
          icon: '💼',
          title: 'Günlük Kullanım',
          text: 'İşe, okula ve günlük işlere gitmek için.'
        },

        {
          value: 'fun',
          icon: '🏎️',
          title: 'Keyif / Performans',
          text: 'Sürüş keyfi ve performans önemli.'
        },

        {
          value: 'firstCar',
          icon: '🚗',
          title: 'İlk Arabam',
          text: 'İlk otomobilimi alıyorum.'
        }
      ]
    },


    {
      step: 3,

      title: 'Hangi yakıt tiplerini düşünüyorsunuz?',

      subtitle:
        'Birden fazla seçenek seçebilirsiniz.',

      type: 'multi',

      key: 'fuel',

      options: [
        {
          value: 'Benzin',
          icon: '⛽',
          title: 'Benzin',
          text: 'Klasik benzinli motor.'
        },

        {
          value: 'Dizel',
          icon: '🛢️',
          title: 'Dizel',
          text: 'Uzun yol ve düşük tüketim odaklı.'
        },

        {
          value: 'Hibrit',
          icon: '🔋',
          title: 'Hibrit',
          text: 'Yakıt ekonomisi ve elektrik desteği.'
        },

        {
          value: 'Elektrik',
          icon: '⚡',
          title: 'Elektrik',
          text: 'Tamamen elektrikli araçlar.'
        }
      ]
    },


    {
      step: 4,

      title: 'Vites tercihiniz nedir?',

      subtitle:
        'Size uygun vites tipini seçin.',

      type: 'single',

      key: 'transmission',

      options: [
        {
          value: 'Otomatik',
          icon: '⚙️',
          title: 'Otomatik',
          text: 'Konforlu ve kolay kullanım.'
        },

        {
          value: 'Manuel',
          icon: '🕹️',
          title: 'Manuel',
          text: 'Daha kontrollü sürüş deneyimi.'
        }
      ]
    },


    {
      step: 5,

      title: 'Sizin için en önemli özellikler neler?',

      subtitle:
        'Birden fazla özellik seçebilirsiniz.',

      type: 'multi',

      key: 'priorities',

      options: [
        {
          value: 'economy',
          icon: '💰',
          title: 'Az Tüketim',
          text: 'Yakıt ve kullanım maliyeti düşük olsun.'
        },

        {
          value: 'comfort',
          icon: '🛋️',
          title: 'Konfor',
          text: 'Rahat ve konforlu bir sürüş istiyorum.'
        },

        {
          value: 'performance',
          icon: '🚀',
          title: 'Performans',
          text: 'Güçlü motor ve hızlı tepki önemli.'
        },

        {
          value: 'safety',
          icon: '🛡️',
          title: 'Güvenlik',
          text: 'Güvenlik donanımları öncelikli.'
        },

        {
          value: 'space',
          icon: '🧳',
          title: 'Genişlik',
          text: 'İç hacim ve bagaj önemli.'
        },

        {
          value: 'technology',
          icon: '📱',
          title: 'Teknoloji',
          text: 'Modern ekranlar ve teknolojik özellikler.'
        }
      ]
    },


    {
      step: 6,

      title: 'Hangi kasa tiplerini düşünüyorsunuz?',

      subtitle:
        'Birden fazla kasa tipi seçebilirsiniz.',

      type: 'multi',

      key: 'body',

      options: [
        {
          value: 'Hatchback',
          icon: '🚗',
          title: 'Hatchback',
          text: 'Kompakt ve şehir dostu.'
        },

        {
          value: 'Sedan',
          icon: '🚘',
          title: 'Sedan',
          text: 'Konforlu ve klasik gövde.'
        },

        {
          value: 'SUV',
          icon: '🚙',
          title: 'SUV',
          text: 'Yüksek oturma ve geniş alan.'
        },

        {
          value: 'Coupe',
          icon: '🏎️',
          title: 'Coupe',
          text: 'Sportif ve dinamik tasarım.'
        },

        {
          value: 'Elektrik',
          icon: '⚡',
          title: 'Elektrikli',
          text: 'Elektrikli otomobil gövde seçenekleri.'
        }
      ]
    }

  ];


  /*
   * =========================================================
   * ELEMENTLER
   * =========================================================
   */

  function getElement(id) {
    return document.getElementById(id);
  }


  /*
   * =========================================================
   * WIZARD'I GÖSTER
   * =========================================================
   */

  function renderWizard() {

    const question = questions[currentStep - 1];

    if (!question) return;


    const badge = getElement('qBadge');
    const title = getElement('qTitle');
    const subtitle = getElement('qSub');
    const progress = getElement('pFill');
    const options = getElement('qOptions');
    const prevButton = getElement('prevBtn');


    if (!badge || !title || !subtitle || !progress || !options) {
      console.warn('Wizard elementleri bulunamadı.');
      return;
    }


    /*
     * Başlıklar
     */

    badge.textContent =
      `Soru ${currentStep} / ${TOTAL_STEPS}`;

    title.textContent =
      question.title;

    subtitle.textContent =
      question.subtitle;


    /*
     * Progress
     */

    const progressPercent =
      (currentStep / TOTAL_STEPS) * 100;

    progress.style.width =
      `${progressPercent}%`;


    /*
     * Geri butonu
     */

    if (prevButton) {

      prevButton.disabled =
        currentStep === 1;

      prevButton.style.opacity =
        currentStep === 1 ? '0.5' : '1';

      prevButton.style.cursor =
        currentStep === 1 ? 'not-allowed' : 'pointer';
    }


    /*
     * Seçenekleri temizle
     */

    options.innerHTML = '';


    /*
     * Bütçe sorusu
     */

    if (question.type === 'budget') {

      renderBudget(options);

      return;
    }


    /*
     * Normal seçenekler
     */

    question.options.forEach(option => {

      const selected =
        isSelected(question, option.value);


      const card =
        document.createElement('button');

      card.type = 'button';

      card.className =
        'wizard-option' +
        (selected ? ' selected' : '');


      card.dataset.value =
        option.value;


      card.innerHTML = `

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
          ${selected ? '✓' : ''}
        </div>

      `;


      card.addEventListener(
        'click',
        function () {

          selectOption(
            question,
            option.value
          );

          renderWizard();

        }
      );


      options.appendChild(card);

    });

  }


  /*
   * =========================================================
   * BÜTÇE
   * =========================================================
   */

  function renderBudget(container) {

    const currentBudget =
      wizardState.budget || 1500000;


    const wrapper =
      document.createElement('div');

    wrapper.className =
      'wizard-budget';


    wrapper.innerHTML = `

      <div class="budget-value">
        ${formatPrice(currentBudget)}
      </div>

      <input
        type="range"
        id="wizardBudget"
        min="500000"
        max="5000000"
        step="50000"
        value="${currentBudget}"
      >

      <div class="budget-labels">

        <span>
          500.000 TL
        </span>

        <span>
          5.000.000 TL
        </span>

      </div>

      <p class="budget-info">
        Bu tutar, araç için ayırabileceğiniz maksimum bütçedir.
      </p>

    `;


    container.appendChild(wrapper);


    const slider =
      getElement('wizardBudget');


    if (slider) {

      slider.addEventListener(
        'input',
        function () {

          wizardState.budget =
            Number(this.value);


          const value =
            wrapper.querySelector('.budget-value');


          if (value) {

            value.textContent =
              formatPrice(wizardState.budget);

          }

        }
      );

    }


    wizardState.budget =
      currentBudget;
  }


  /*
   * =========================================================
   * SEÇİM KONTROLÜ
   * =========================================================
   */

  function isSelected(question, value) {

    if (question.type === 'single') {

      return wizardState[question.key] === value;

    }


    if (question.type === 'multi') {

      return wizardState[question.key].includes(value);

    }


    return false;
  }


  /*
   * =========================================================
   * SEÇİM YAP
   * =========================================================
   */

  function selectOption(question, value) {

    /*
     * Tek seçim
     */

    if (question.type === 'single') {

      wizardState[question.key] =
        value;

      return;
    }


    /*
     * Çoklu seçim
     */

    if (question.type === 'multi') {

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

  }


  /*
   * =========================================================
   * SONRAKİ SORU
   * =========================================================
   */

  window.nextQ = function () {

    if (!validateCurrentStep()) {

      return;
    }


    if (currentStep < TOTAL_STEPS) {

      currentStep++;

      renderWizard();

      scrollToWizard();

      return;
    }


    /*
     * Son soru tamamlandı.
     */

    finishWizard();

  };


  /*
   * =========================================================
   * ÖNCEKİ SORU
   * =========================================================
   */

  window.prevQ = function () {

    if (currentStep <= 1) {

      return;
    }


    currentStep--;

    renderWizard();

    scrollToWizard();

  };


  /*
   * =========================================================
   * VALIDATION
   * =========================================================
   */

  function validateCurrentStep() {

    const question =
      questions[currentStep - 1];


    /*
     * Bütçe
     */

    if (question.type === 'budget') {

      if (!wizardState.budget) {

        showWizardMessage(
          'Lütfen bütçenizi seçin.'
        );

        return false;
      }

      return true;
    }


    /*
     * Tek seçim
     */

    if (question.type === 'single') {

      if (!wizardState[question.key]) {

        showWizardMessage(
          'Lütfen bir seçim yapın.'
        );

        return false;
      }

      return true;
    }


    /*
     * Çoklu seçim
     */

    if (question.type === 'multi') {

      if (
        !wizardState[question.key] ||
        wizardState[question.key].length === 0
      ) {

        showWizardMessage(
          'Devam etmek için en az bir seçenek seçin.'
        );

        return false;
      }

      return true;
    }


    return true;
  }


  /*
   * =========================================================
   * WIZARD TAMAMLANDI
   * =========================================================
   */

  function finishWizard() {

    console.log(
      'ARABAMI BUL — Kullanıcı tercihleri:',
      wizardState
    );


    /*
     * Burada henüz gerçek araç algoritmasını
     * çalıştırmıyoruz.
     *
     * Bir sonraki aşamada:
     *
     * wizardState
     *       ↓
     * araç verileri
     *       ↓
     * puanlama
     *       ↓
     * eşleşen araçlar
     *       ↓
     * wizardResultGrid
     *
     * şeklinde bağlayacağız.
     */


    const wizardCard =
      getElement('wizardCard');

    const result =
      getElement('wizardResult');


    if (!wizardCard || !result) {

      console.warn(
        'Wizard sonuç alanı bulunamadı.'
      );

      return;
    }


    wizardCard.style.display =
      'none';

    result.style.display =
      'block';


    renderTemporaryResults();


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  /*
   * =========================================================
   * GEÇİCİ SONUÇ EKRANI
   * =========================================================
   *
   * Gerçek araç algoritması gelene kadar
   * kullanıcının seçimlerini gösteriyoruz.
   */

  function renderTemporaryResults() {

    const grid =
      getElement('wizardResultGrid');


    if (!grid) return;


    grid.innerHTML = `

      <div
        style="
          grid-column:1/-1;
          background:#fff;
          border:1px solid var(--line);
          border-radius:16px;
          padding:28px;
          text-align:center;
        "
      >

        <div style="font-size:42px;margin-bottom:10px;">
          🎯
        </div>

        <h3 style="margin:0 0 8px;">
          Tercihleriniz kaydedildi
        </h3>

        <p
          style="
            color:var(--muted);
            font-size:14px;
            margin:0 0 20px;
          "
        >
          Araç eşleştirme sistemi için seçimleriniz hazır.
        </p>

        <div
          style="
            display:flex;
            flex-wrap:wrap;
            justify-content:center;
            gap:8px;
          "
        >

          ${createSummaryBadges()}

        </div>

      </div>

    `;

  }


  /*
   * =========================================================
   * SEÇİMLERİ ÖZETLE
   * =========================================================
   */

  function createSummaryBadges() {

    const badges = [];


    if (wizardState.budget) {

      badges.push(
        `Bütçe: ${formatPrice(wizardState.budget)}`
      );

    }


    if (wizardState.transmission) {

      badges.push(
        `Vites: ${wizardState.transmission}`
      );

    }


    if (wizardState.fuel.length) {

      badges.push(
        `Yakıt: ${wizardState.fuel.join(', ')}`
      );

    }


    if (wizardState.body.length) {

      badges.push(
        `Kasa: ${wizardState.body.join(', ')}`
      );

    }


    if (wizardState.usage.length) {

      badges.push(
        `Kullanım: ${wizardState.usage.join(', ')}`
      );

    }


    if (wizardState.priorities.length) {

      badges.push(
        `Öncelik: ${wizardState.priorities.join(', ')}`
      );

    }


    return badges
      .map(
        badge => `
          <span
            style="
              background:#fff1f1;
              color:#c62828;
              border:1px solid #ffd5d5;
              border-radius:999px;
              padding:7px 12px;
              font-size:12px;
              font-weight:700;
            "
          >
            ${badge}
          </span>
        `
      )
      .join('');

  }


  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  window.resetWizard = function () {

    currentStep = 1;


    wizardState.budget = null;

    wizardState.usage = [];

    wizardState.fuel = [];

    wizardState.transmission = null;

    wizardState.priorities = [];

    wizardState.body = [];


    const wizardCard =
      getElement('wizardCard');

    const result =
      getElement('wizardResult');


    if (wizardCard) {

      wizardCard.style.display =
        'block';

    }


    if (result) {

      result.style.display =
        'none';

    }


    renderWizard();


    scrollToWizard();

  };


  /*
   * =========================================================
   * WIZARD MESAJI
   * =========================================================
   */

  function showWizardMessage(message) {

    /*
     * Önce varsa eski mesajı kaldır.
     */

    const oldMessage =
      document.getElementById(
        'wizardMessage'
      );


    if (oldMessage) {

      oldMessage.remove();

    }


    const messageBox =
      document.createElement('div');


    messageBox.id =
      'wizardMessage';


    messageBox.style.cssText = `
      margin-top:12px;
      padding:11px 14px;
      border-radius:10px;
      background:#fff1f1;
      border:1px solid #ffd0d0;
      color:#c62828;
      font-size:13px;
      font-weight:700;
      text-align:center;
    `;


    messageBox.textContent =
      message;


    const options =
      getElement('qOptions');


    if (options) {

      options.parentNode.insertBefore(
        messageBox,
        options.nextSibling
      );

    }


    setTimeout(
      function () {

        if (messageBox.parentNode) {

          messageBox.remove();

        }

      },
      2500
    );

  }


  /*
   * =========================================================
   * SAYFAYI WIZARD'A KAYDIR
   * =========================================================
   */

  function scrollToWizard() {

    const card =
      getElement('wizardCard');


    if (!card) return;


    setTimeout(
      function () {

        card.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      },
      50
    );

  }


  /*
   * =========================================================
   * FİYAT FORMATLAMA
   * =========================================================
   */

  function formatPrice(value) {

    return new Intl.NumberFormat(
      'tr-TR'
    ).format(value) + ' TL';

  }


  /*
   * =========================================================
   * GLOBAL ERİŞİM
   * =========================================================
   *
   * İleride başka dosyalardan da kullanıcı
   * tercihlerini okuyabilmek için.
   */

  window.getWizardState = function () {

    return {
      ...wizardState,

      usage: [
        ...wizardState.usage
      ],

      fuel: [
        ...wizardState.fuel
      ],

      priorities: [
        ...wizardState.priorities
      ],

      body: [
        ...wizardState.body
      ]
    };

  };


  /*
   * =========================================================
   * BAŞLAT
   * =========================================================
   */

  function initWizard() {

    if (!getElement('wizardCard')) {

      console.warn(
        'Wizard başlatılamadı: wizardCard bulunamadı.'
      );

      return;
    }


    renderWizard();

  }


  /*
   * DOM hazır
   */

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initWizard
    );

  } else {

    initWizard();

  }

})();
