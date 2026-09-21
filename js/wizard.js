```html
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Araba Bul Wizard</title>

<style>

*{
    box-sizing:border-box;
    margin:0;
    padding:0;
}

:root{
    --red:#e53935;
    --red-dark:#c62828;
    --red-soft:#fff1f1;
    --bg:#f5f6f8;
    --white:#fff;
    --text:#17191c;
    --muted:#737980;
    --border:#e2e4e8;
}

body{
    font-family:Arial,Helvetica,sans-serif;
    background:var(--bg);
    color:var(--text);
    min-height:100vh;
}

/* =========================
   HEADER
========================= */

.header{
    height:70px;
    background:#fff;
    border-bottom:1px solid var(--border);

    display:flex;
    align-items:center;
    justify-content:space-between;

    padding:0 6%;
}

.logo{
    font-size:22px;
    font-weight:800;
}

.logo span{
    color:var(--red);
}

.close-btn{
    text-decoration:none;
    color:var(--muted);
    font-size:14px;
}

/* =========================
   PAGE
========================= */

.page{
    width:min(1000px,92%);
    margin:35px auto 60px;
}

.heading{
    text-align:center;
    margin-bottom:28px;
}

.heading h1{
    font-size:32px;
    margin-bottom:8px;
}

.heading p{
    color:var(--muted);
    font-size:15px;
}

/* =========================
   WIZARD
========================= */

.wizard{
    background:#fff;
    border-radius:22px;
    overflow:hidden;

    box-shadow:
        0 10px 35px rgba(0,0,0,.08);
}

/* =========================
   PROGRESS
========================= */

.progress-area{
    padding:25px 30px 22px;
    border-bottom:1px solid var(--border);
}

.progress-top{
    display:flex;
    justify-content:space-between;
    align-items:center;

    margin-bottom:12px;
}

.progress-step{
    font-size:13px;
    font-weight:700;
}

.progress-percent{
    font-size:13px;
    font-weight:700;
    color:var(--red);
}

.progress{
    height:7px;
    background:#eee;
    border-radius:20px;
    overflow:hidden;
}

.progress-bar{
    width:16.66%;
    height:100%;
    background:var(--red);
    border-radius:20px;

    transition:.3s ease;
}

.dots{
    display:flex;
    justify-content:space-between;

    margin-top:17px;
}

.dot{
    width:28px;
    height:28px;

    border-radius:50%;

    display:flex;
    align-items:center;
    justify-content:center;

    background:#eee;
    color:#888;

    font-size:12px;
    font-weight:700;

    transition:.25s;
}

.dot.active{
    background:var(--red);
    color:#fff;
}

.dot.done{
    background:#ffd9d9;
    color:var(--red-dark);
}

/* =========================
   CONTENT
========================= */

.content{
    padding:42px;
}

.step{
    display:none;
}

.step.active{
    display:block;
}

.step-title{
    text-align:center;
    font-size:26px;
    margin-bottom:9px;
}

.step-description{
    text-align:center;
    color:var(--muted);
    font-size:14px;

    margin-bottom:30px;
}

/* =========================
   OPTIONS
========================= */

.options{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:15px;
}

.option{
    position:relative;

    padding:20px;

    border:2px solid var(--border);
    border-radius:15px;

    background:#fff;

    cursor:pointer;

    transition:.2s;
}

.option:hover{
    border-color:#f0a09e;
    transform:translateY(-2px);
}

.option.selected{
    border-color:var(--red);
    background:var(--red-soft);
}

.option.selected::after{
    content:"✓";

    position:absolute;

    top:12px;
    right:12px;

    width:23px;
    height:23px;

    border-radius:50%;

    background:var(--red);
    color:#fff;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:12px;
    font-weight:bold;
}

.option-icon{
    font-size:28px;
    margin-bottom:12px;
}

.option-title{
    font-size:16px;
    font-weight:700;

    margin-bottom:5px;
}

.option-description{
    color:var(--muted);

    font-size:12px;
    line-height:1.4;
}

/* =========================
   BUDGET
========================= */

.budget-wrapper{
    max-width:700px;
    margin:0 auto;
}

.budget-value{
    text-align:center;

    color:var(--red);

    font-size:34px;
    font-weight:800;

    margin-bottom:25px;
}

input[type="range"]{
    width:100%;
    accent-color:var(--red);
}

.range-labels{
    display:flex;
    justify-content:space-between;

    margin-top:10px;

    color:var(--muted);
    font-size:12px;
}

.info-box{
    margin-top:25px;

    background:#f7f7f8;

    border-radius:12px;

    padding:15px;

    text-align:center;

    color:var(--muted);

    font-size:12px;
}

/* =========================
   BUTTONS
========================= */

.actions{
    border-top:1px solid var(--border);

    padding:20px 30px;

    display:flex;
    align-items:center;
    justify-content:space-between;
}

.btn{
    border:0;
    border-radius:12px;

    padding:13px 22px;

    font-size:14px;
    font-weight:700;

    cursor:pointer;
}

.btn-back{
    background:#f0f1f3;
    color:#333;
}

.btn-next{
    background:var(--red);
    color:#fff;
}

.btn-next:hover{
    background:var(--red-dark);
}

.btn-back:hover{
    background:#e7e8ea;
}

.btn:disabled{
    opacity:.45;
    cursor:not-allowed;
}

/* =========================
   MOBILE
========================= */

@media(max-width:800px){

    .options{
        grid-template-columns:repeat(2,1fr);
    }

    .content{
        padding:28px 22px;
    }

}

@media(max-width:550px){

    .header{
        height:62px;
        padding:0 5%;
    }

    .page{
        width:94%;
        margin-top:22px;
    }

    .heading h1{
        font-size:27px;
    }

    .heading p{
        font-size:13px;
    }

    .wizard{
        border-radius:17px;
    }

    .progress-area{
        padding:18px;
    }

    .content{
        padding:25px 15px;
    }

    .options{
        grid-template-columns:1fr;
    }

    .option{
        padding:17px;
    }

    .step-title{
        font-size:22px;
    }

    .actions{
        padding:15px;
    }

    .btn{
        padding:12px 17px;
    }

    .dot{
        width:24px;
        height:24px;
        font-size:10px;
    }

}

</style>
</head>

<body>

<header class="header">

    <div class="logo">
        Arabamı <span>Bul</span>
    </div>

    <a href="#" class="close-btn">
        ← Geri
    </a>

</header>


<main class="page">

    <div class="heading">

        <h1>Sana Uygun Arabayı Bul</h1>

        <p>
            Birkaç soruyu cevapla, sana uygun araçları bulalım.
        </p>

    </div>


    <div class="wizard">

        <!-- PROGRESS -->

        <div class="progress-area">

            <div class="progress-top">

                <span
                    class="progress-step"
                    id="progressStep"
                >
                    Adım 1 / 6
                </span>

                <span
                    class="progress-percent"
                    id="progressPercent"
                >
                    %17
                </span>

            </div>


            <div class="progress">

                <div
                    class="progress-bar"
                    id="progressBar"
                ></div>

            </div>


            <div class="dots">

                <div class="dot active" data-dot="1">1</div>
                <div class="dot" data-dot="2">2</div>
                <div class="dot" data-dot="3">3</div>
                <div class="dot" data-dot="4">4</div>
                <div class="dot" data-dot="5">5</div>
                <div class="dot" data-dot="6">6</div>

            </div>

        </div>


        <!-- CONTENT -->

        <div class="content">


            <!-- STEP 1 -->

            <section
                class="step active"
                data-step="1"
            >

                <h2 class="step-title">
                    Bütçen ne kadar?
                </h2>

                <p class="step-description">
                    Araç için ayırdığın yaklaşık bütçeyi seç.
                </p>


                <div class="budget-wrapper">

                    <div
                        class="budget-value"
                        id="budgetValue"
                    >
                        1.500.000 TL
                    </div>


                    <input
                        type="range"
                        id="budget"
                        min="800000"
                        max="3000000"
                        step="50000"
                        value="1500000"
                    >


                    <div class="range-labels">

                        <span>
                            800.000 TL
                        </span>

                        <span>
                            3.000.000 TL
                        </span>

                    </div>


                    <div class="info-box">

                        Bütçene yakın araçları da
                        sonuçlarda değerlendirebiliriz.

                    </div>

                </div>

            </section>


            <!-- STEP 2 -->

            <section
                class="step"
                data-step="2"
            >

                <h2 class="step-title">
                    Arabayı ne için kullanacaksın?
                </h2>

                <p class="step-description">
                    Birden fazla seçenek seçebilirsin.
                </p>


                <div class="options">

                    <div
                        class="option"
                        data-group="usage"
                        data-value="sehir"
                    >

                        <div class="option-icon">🏙️</div>

                        <div class="option-title">
                            Şehir içi
                        </div>

                        <div class="option-description">
                            Günlük kullanım ve kısa mesafeler.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="usage"
                        data-value="uzun"
                    >

                        <div class="option-icon">🛣️</div>

                        <div class="option-title">
                            Uzun yol
                        </div>

                        <div class="option-description">
                            Sık şehirler arası yolculuk.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="usage"
                        data-value="aile"
                    >

                        <div class="option-icon">👨‍👩‍👧</div>

                        <div class="option-title">
                            Aile
                        </div>

                        <div class="option-description">
                            Geniş ve kullanışlı otomobil.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="usage"
                        data-value="is"
                    >

                        <div class="option-icon">💼</div>

                        <div class="option-title">
                            İş / Günlük
                        </div>

                        <div class="option-description">
                            Her gün düzenli kullanım.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="usage"
                        data-value="keyif"
                    >

                        <div class="option-icon">🏁</div>

                        <div class="option-title">
                            Keyif
                        </div>

                        <div class="option-description">
                            Sürüş keyfi ve performans.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="usage"
                        data-value="ilk"
                    >

                        <div class="option-icon">🚗</div>

                        <div class="option-title">
                            İlk arabam
                        </div>

                        <div class="option-description">
                            Kolay kullanılabilen otomobil.
                        </div>

                    </div>

                </div>

            </section>


            <!-- STEP 3 -->

            <section
                class="step"
                data-step="3"
            >

                <h2 class="step-title">
                    Yakıt tercihin nedir?
                </h2>

                <p class="step-description">
                    Birden fazla seçenek seçebilirsin.
                </p>


                <div class="options">

                    <div
                        class="option"
                        data-group="fuel"
                        data-value="benzin"
                    >

                        <div class="option-icon">⛽</div>

                        <div class="option-title">
                            Benzin
                        </div>

                        <div class="option-description">
                            Sessiz ve günlük kullanıma uygun.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="fuel"
                        data-value="dizel"
                    >

                        <div class="option-icon">🚛</div>

                        <div class="option-title">
                            Dizel
                        </div>

                        <div class="option-description">
                            Uzun yol ve yüksek kilometre.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="fuel"
                        data-value="hibrit"
                    >

                        <div class="option-icon">🔋</div>

                        <div class="option-title">
                            Hibrit
                        </div>

                        <div class="option-description">
                            Düşük tüketim odaklı.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="fuel"
                        data-value="elektrik"
                    >

                        <div class="option-icon">⚡</div>

                        <div class="option-title">
                            Elektrik
                        </div>

                        <div class="option-description">
                            Sessiz ve elektrikli sürüş.
                        </div>

                    </div>

                </div>

            </section>


            <!-- STEP 4 -->

            <section
                class="step"
                data-step="4"
            >

                <h2 class="step-title">
                    Vites tercihin?
                </h2>

                <p class="step-description">
                    Sana uygun şanzıman tipini seç.
                </p>


                <div class="options">

                    <div
                        class="option"
                        data-group="gear"
                        data-value="otomatik"
                    >

                        <div class="option-icon">⚙️</div>

                        <div class="option-title">
                            Otomatik
                        </div>

                        <div class="option-description">
                            Konforlu ve kolay kullanım.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="gear"
                        data-value="manuel"
                    >

                        <div class="option-icon">🔧</div>

                        <div class="option-title">
                            Manuel
                        </div>

                        <div class="option-description">
                            Daha kontrollü sürüş.
                        </div>

                    </div>

                </div>

            </section>


            <!-- STEP 5 -->

            <section
                class="step"
                data-step="5"
            >

                <h2 class="step-title">
                    Senin için en önemli şey ne?
                </h2>

                <p class="step-description">
                    Birden fazla seçenek seçebilirsin.
                </p>


                <div class="options">

                    <div
                        class="option"
                        data-group="priority"
                        data-value="ekonomi"
                    >

                        <div class="option-icon">💰</div>

                        <div class="option-title">
                            Az tüketim
                        </div>

                        <div class="option-description">
                            Yakıt ekonomisi öncelikli.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="priority"
                        data-value="konfor"
                    >

                        <div class="option-icon">🛋️</div>

                        <div class="option-title">
                            Konfor
                        </div>

                        <div class="option-description">
                            Rahat ve sessiz sürüş.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="priority"
                        data-value="performans"
                    >

                        <div class="option-icon">🚀</div>

                        <div class="option-title">
                            Performans
                        </div>

                        <div class="option-description">
                            Güçlü motor ve hızlanma.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="priority"
                        data-value="guvenlik"
                    >

                        <div class="option-icon">🛡️</div>

                        <div class="option-title">
                            Güvenlik
                        </div>

                        <div class="option-description">
                            Güvenlik ve sürüş destekleri.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="priority"
                        data-value="bagaj"
                    >

                        <div class="option-icon">🧳</div>

                        <div class="option-title">
                            Bagaj / Alan
                        </div>

                        <div class="option-description">
                            Geniş iç hacim ve bagaj.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="priority"
                        data-value="teknoloji"
                    >

                        <div class="option-icon">📱</div>

                        <div class="option-title">
                            Teknoloji
                        </div>

                        <div class="option-description">
                            Modern ekranlar ve donanımlar.
                        </div>

                    </div>

                </div>

            </section>


            <!-- STEP 6 -->

            <section
                class="step"
                data-step="6"
            >

                <h2 class="step-title">
                    Nasıl bir araç istiyorsun?
                </h2>

                <p class="step-description">
                    Birden fazla kasa tipi seçebilirsin.
                </p>


                <div class="options">

                    <div
                        class="option"
                        data-group="body"
                        data-value="hatchback"
                    >

                        <div class="option-icon">🚘</div>

                        <div class="option-title">
                            Hatchback
                        </div>

                        <div class="option-description">
                            Kompakt ve şehir dostu.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="body"
                        data-value="sedan"
                    >

                        <div class="option-icon">🚙</div>

                        <div class="option-title">
                            Sedan
                        </div>

                        <div class="option-description">
                            Konforlu ve geniş.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="body"
                        data-value="suv"
                    >

                        <div class="option-icon">🚙</div>

                        <div class="option-title">
                            SUV
                        </div>

                        <div class="option-description">
                            Yüksek sürüş ve geniş alan.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="body"
                        data-value="station"
                    >

                        <div class="option-icon">🚗</div>

                        <div class="option-title">
                            Station Wagon
                        </div>

                        <div class="option-description">
                            Geniş bagaj ve kullanım alanı.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="body"
                        data-value="coupe"
                    >

                        <div class="option-icon">🏎️</div>

                        <div class="option-title">
                            Coupe / Sportif
                        </div>

                        <div class="option-description">
                            Sportif görünüm ve sürüş.
                        </div>

                    </div>


                    <div
                        class="option"
                        data-group="body"
                        data-value="farketmez"
                    >

                        <div class="option-icon">✨</div>

                        <div class="option-title">
                            Fark etmez
                        </div>

                        <div class="option-description">
                            Önemli olan bana uygun olması.
                        </div>

                    </div>

                </div>

            </section>

        </div>


        <!-- ACTIONS -->

        <div class="actions">

            <button
                class="btn btn-back"
                id="backBtn"
                disabled
            >
                ← Geri
            </button>


            <button
                class="btn btn-next"
                id="nextBtn"
            >
                Devam Et →
            </button>

        </div>

    </div>

</main>


<script>

const state = {

    step:1,

    budget:1500000,

    usage:[],

    fuel:[],

    gear:[],

    priority:[],

    body:[]

};


const steps =
    document.querySelectorAll(".step");


const nextBtn =
    document.getElementById("nextBtn");


const backBtn =
    document.getElementById("backBtn");


const budget =
    document.getElementById("budget");


const budgetValue =
    document.getElementById("budgetValue");


/* =========================
   BÜTÇE
========================= */

function updateBudget(){

    state.budget =
        Number(budget.value);

    budgetValue.textContent =
        new Intl.NumberFormat("tr-TR")
        .format(state.budget)
        + " TL";

}

budget.addEventListener(
    "input",
    updateBudget
);


/* =========================
   OPTION SELECTION
========================= */

document
.querySelectorAll(".option")
.forEach(option => {

    option.addEventListener(
        "click",
        () => {

            const group =
                option.dataset.group;

            const value =
                option.dataset.value;


            if(!state[group]){
                state[group] = [];
            }


            /*
                Fark etmez seçilirse
                diğer seçimleri temizle
            */

            if(value === "farketmez"){

                state[group] =
                    ["farketmez"];

                document
                .querySelectorAll(
                    `.option[data-group="${group}"]`
                )
                .forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });

                option.classList.add(
                    "selected"
                );

                return;

            }


            /*
                Fark etmez seçimini kaldır
            */

            const farketmez =
                document.querySelector(
                    `.option[data-group="${group}"][data-value="farketmez"]`
                );

            if(farketmez){

                farketmez.classList.remove(
                    "selected"
                );

            }


            state[group] =
                state[group]
                .filter(
                    item => item !== "farketmez"
                );


            const index =
                state[group]
                .indexOf(value);


            if(index !== -1){

                state[group]
                .splice(index,1);

                option.classList.remove(
                    "selected"
                );

            }else{

                state[group]
                .push(value);

                option.classList.add(
                    "selected"
                );

            }

        }
    );

});


/* =========================
   SHOW STEP
========================= */

function showStep(){

    steps.forEach(step => {

        step.classList.toggle(
            "active",
            Number(step.dataset.step)
            === state.step
        );

    });


    const percent =
        Math.round(
            (state.step / 6) * 100
        );


    document.getElementById(
        "progressStep"
    ).textContent =
        `Adım ${state.step} / 6`;


    document.getElementById(
        "progressPercent"
    ).textContent =
        `%${percent}`;


    document.getElementById(
        "progressBar"
    ).style.width =
        `${percent}%`;


    document
    .querySelectorAll(".dot")
    .forEach(dot => {

        const number =
            Number(dot.dataset.dot);


        dot.classList.remove(
            "active",
            "done"
        );


        if(number === state.step){

            dot.classList.add(
                "active"
            );

        }


        if(number < state.step){

            dot.classList.add(
                "done"
            );

        }

    });


    backBtn.disabled =
        state.step === 1;


    if(state.step === 6){

        nextBtn.textContent =
            "Tercihlerimi Tamamla ✓";

    }else{

        nextBtn.textContent =
            "Devam Et →";

    }

}


/* =========================
   NEXT
========================= */

nextBtn.addEventListener(
    "click",
    () => {

        if(state.step < 6){

            state.step++;

            showStep();

        }else{

            /*
                BURASI DAHA SONRA
                GERÇEK ARAÇ ÖNERİ SİSTEMİNE
                BAĞLANACAK.
            */

            console.log(
                "Wizard tamamlandı:",
                state
            );

            alert(
                "Tercihlerin kaydedildi. Araç öneri sistemi bir sonraki aşamada bağlanacak."
            );

        }

    }
);


/* =========================
   BACK
========================= */

backBtn.addEventListener(
    "click",
    () => {

        if(state.step > 1){

            state.step--;

            showStep();

        }

    }
);


/* =========================
   INIT
========================= */

updateBudget();

showStep();

</script>

</body>
</html>
```
