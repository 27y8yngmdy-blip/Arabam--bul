<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arabam Bul - İlan Ver (SPA Modülü)</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
        }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        .badge-checkbox:checked + label {
            background-color: #2563eb;
            color: #ffffff;
            border-color: #2563eb;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
        }

        .part-select {
            transition: all 0.2s ease;
        }
    </style>
</head>
<body class="text-slate-800 min-h-screen flex flex-col antialiased">

    <!-- Üst Navigasyon Çubuğu (SPA Navbar) -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20">
                    <i class="fa-solid font-black fa-car-side"></i>
                </div>
                <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">Arabam Bul</span>
            </div>

            <!-- Modül Menü Linkleri -->
            <nav class="hidden md:flex items-center space-x-1 font-medium text-sm">
                <a href="#" class="px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition">Ana Sayfa</a>
                <a href="#" class="px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition">
                    <i class="fa-solid fa-wand-magic-sparkles text-amber-500 mr-1"></i>Bana Araba Bul (Wizard)
                </a>
                <a href="#" class="px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition">Arama</a>
                <a href="#" class="px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition">Favoriler</a>
                <a href="#" class="px-3 py-2 rounded-lg text-blue-600 bg-blue-50 font-semibold transition">İlan Ver</a>
                <a href="#" class="px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition">Chat</a>
            </nav>

            <!-- Kod Görünümü Geçiş Butonu -->
            <button id="toggleCodeBtn" onclick="toggleCodeView()" class="flex items-center space-x-2 text-xs font-semibold bg-slate-900 text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800 transition shadow">
                <i class="fa-solid fa-code text-indigo-400"></i>
                <span>js/listing.js Kodunu Al</span>
            </button>
        </div>
    </header>

    <!-- Ana Uygulama Gövdesi -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Üst Başlık & Modül Bilgisi -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
                <div class="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
                    <span class="w-2 h-2 rounded-full bg-blue-600 inline-block animate-pulse"></span>
                    <span>JavaScript SPA Modülü (js/listing.js)</span>
                </div>
                <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">Aracını Ücretsiz İlana Koy</h1>
                <p class="text-slate-500 text-sm mt-1">İlan bilgilerini doldururken sağ taraftan anlık önizlemesini takip edebilirsin.</p>
            </div>
            
            <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-50/80 p-1.5 rounded-xl border border-blue-100">
                <button onclick="setActiveTab('form')" id="tabBtnForm" class="px-4 py-2 text-xs font-bold rounded-lg bg-white text-blue-600 shadow-sm transition">
                    <i class="fa-regular fa-pen-to-square mr-1.5"></i>İlan Formu
                </button>
                <button onclick="setActiveTab('code')" id="tabBtnCode" class="px-4 py-2 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition">
                    <i class="fa-brands fa-js mr-1.5 text-amber-500"></i>listing.js Kodu
                </button>
            </div>
        </div>

        <!-- FORM VE ÖNİZLEME GRİD ALANI -->
        <div id="formView" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <!-- Sol Taraf: İlan Formu (8 Kolon) -->
            <div class="lg:col-span-7 xl:col-span-8 space-y-6">
                
                <!-- Adım Mantığı İlerleme Çubuğu -->
                <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs font-medium text-slate-500 overflow-x-auto">
                    <div class="flex items-center text-blue-600 font-bold whitespace-nowrap">
                        <span class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2">1</span>
                        <span>Temel Bilgiler</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-slate-300 mx-2"></i>
                    <div class="flex items-center whitespace-nowrap">
                        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs mr-2">2</span>
                        <span>Fotoğraflar</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-slate-300 mx-2"></i>
                    <div class="flex items-center whitespace-nowrap">
                        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs mr-2">3</span>
                        <span>Donanım</span>
                    </div>
                    <i class="fa-solid fa-chevron-right text-slate-300 mx-2"></i>
                    <div class="flex items-center whitespace-nowrap">
                        <span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs mr-2">4</span>
                        <span>Ekspertiz</span>
                    </div>
                </div>

                <form id="carListingForm" onsubmit="handleFormSubmit(event)" class="space-y-6">
                    
                    <!-- BÖLÜM 1: Temel Bilgiler -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <h2 class="text-lg font-bold text-slate-900 flex items-center pb-3 border-b border-slate-100">
                            <i class="fa-solid fa-car text-blue-600 mr-2.5"></i>1. Araç Temel Bilgileri
                        </h2>

                        <div class="space-y-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">İlan Başlığı *</label>
                                <input type="text" id="inputTitle" oninput="updatePreview()" required placeholder="Örn: Sahibinden Temiz, Boyasız Golf 7" 
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Marka *</label>
                                    <select id="inputBrand" onchange="updatePreview()" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white transition">
                                        <option value="Volkswagen">Volkswagen</option>
                                        <option value="BMW">BMW</option>
                                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                                        <option value="Audi">Audi</option>
                                        <option value="Ford">Ford</option>
                                        <option value="Renault">Renault</option>
                                        <option value="Fiat">Fiat</option>
                                        <option value="Toyota">Toyota</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Model *</label>
                                    <input type="text" id="inputModel" oninput="updatePreview()" required placeholder="Örn: Golf 1.4 TSI" 
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Model Yılı *</label>
                                    <input type="number" id="inputYear" oninput="updatePreview()" required min="1980" max="2026" value="2020" 
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Fiyat (TL) *</label>
                                    <input type="number" id="inputPrice" oninput="updatePreview()" required placeholder="850000" 
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Kilometre (KM) *</label>
                                    <input type="number" id="inputKm" oninput="updatePreview()" required placeholder="95000" 
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Renk</label>
                                    <input type="text" id="inputColor" oninput="updatePreview()" placeholder="Örn: Beyaz" 
                                        class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Yakıt Tipi *</label>
                                    <select id="inputFuel" onchange="updatePreview()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white transition">
                                        <option value="Benzin">Benzin</option>
                                        <option value="Dizel">Dizel</option>
                                        <option value="LPG & Benzin">LPG & Benzin</option>
                                        <option value="Hibrit">Hibrit</option>
                                        <option value="Elektrik">Elektrik</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Vites Tipi *</label>
                                    <select id="inputGear" onchange="updatePreview()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white transition">
                                        <option value="Otomatik">Otomatik</option>
                                        <option value="Manuel">Manuel</option>
                                        <option value="Yarı Otomatik">Yarı Otomatik</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Kasa Tipi</label>
                                    <select id="inputBody" onchange="updatePreview()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white transition">
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Coupe">Coupe</option>
                                        <option value="Station Wagon">Station Wagon</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- BÖLÜM 2: Fotoğraf Yükleme -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <h2 class="text-lg font-bold text-slate-900 flex items-center pb-3 border-b border-slate-100">
                            <i class="fa-solid fa-camera text-blue-600 mr-2.5"></i>2. Araç Fotoğrafları
                        </h2>

                        <div class="border-2 border-dashed border-slate-200 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-6 text-center transition cursor-pointer" onclick="document.getElementById('imageInput').click()">
                            <input type="file" id="imageInput" multiple accept="image/*" class="hidden" onchange="handleImageUpload(event)">
                            <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i class="fa-solid fa-cloud-arrow-up text-xl"></i>
                            </div>
                            <p class="text-sm font-semibold text-slate-800">Fotoğrafları seçmek için tıklayın veya sürükleyin</p>
                            <p class="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (En fazla 10 adet)</p>
                        </div>

                        <!-- Yüklenen Görsellerin Listesi -->
                        <div id="imageList" class="grid grid-cols-4 gap-3 pt-2">
                            <!-- JS ile yüklenecek veya varsayılan mock fotoğraflar -->
                        </div>
                    </div>

                    <!-- BÖLÜM 3: Donanım ve Özellikler -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <h2 class="text-lg font-bold text-slate-900 flex items-center pb-3 border-b border-slate-100">
                            <i class="fa-solid fa-[#2563eb] fa-list-check text-blue-600 mr-2.5"></i>3. Donanım & Özellikler
                        </h2>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="featuresContainer">
                            <!-- JS ile checkbox'lar eklenecek -->
                        </div>
                    </div>

                    <!-- BÖLÜM 4: Ekspertiz & Tramer Durumu -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <h2 class="text-lg font-bold text-slate-900 flex items-center pb-3 border-b border-slate-100">
                            <i class="fa-solid fa-shield-halved text-blue-600 mr-2.5"></i>4. Ekspertiz & Hasar Durumu
                        </h2>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Boya / Değişen Durumu</label>
                                <select id="inputDamageStatus" onchange="updatePreview()" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white transition">
                                    <option value="Hatasız / Boyasız">Hatasız / Boyasız</option>
                                    <option value="Lokal Boyalı">Lokal Boyalı Parça Var</option>
                                    <option value="Boyalı">Boyalı Parça Var</option>
                                    <option value="Değişenli">Değişen Parça Var</option>
                                    <option value="Ağır Hasarlı">Ağır Hasar Kayıtlı</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Tramer Kaydı (TL)</label>
                                <input type="number" id="inputTramer" oninput="updatePreview()" placeholder="0" value="0" 
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                            </div>
                        </div>
                    </div>

                    <!-- BÖLÜM 5: Açıklama ve İletişim -->
                    <div class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                        <h2 class="text-lg font-bold text-slate-900 flex items-center pb-3 border-b border-slate-100">
                            <i class="fa-solid fa-align-left text-blue-600 mr-2.5"></i>5. Açıklama & İletişim Bilgileri
                        </h2>

                        <div>
                            <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">İlan Açıklaması</label>
                            <textarea id="inputDescription" oninput="updatePreview()" rows="4" placeholder="Aracınızın bakım geçmişi, ekstra donanımları veya ekspertiz durumu hakkında detay verin..." 
                                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition"></textarea>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Şehir / İlçe</label>
                                <input type="text" id="inputLocation" oninput="updatePreview()" placeholder="Örn: İstanbul / Kadıköy" value="İstanbul / Kadıköy"
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Telefon Numarası</label>
                                <input type="tel" id="inputPhone" oninput="updatePreview()" placeholder="05xx xxx xx xx" value="0532 000 00 00"
                                    class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition">
                            </div>
                        </div>
                    </div>

                    <!-- Form Gönderme Butonu -->
                    <button type="submit" class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-500/25 transition transform active:scale-[0.99] flex items-center justify-center space-x-2">
                        <i class="fa-solid fa-paper-plane"></i>
                        <span>İlanı Yayınla</span>
                    </button>
                </form>
            </div>

            <!-- Sağ Taraf: Canlı İlan Kartı Önizlemesi (5 Kolon Sticky) -->
            <div class="lg:col-span-5 xl:col-span-4">
                <div class="sticky top-24 space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>Canlı İlan Önizlemesi
                        </span>
                        <span class="text-xs bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded font-medium">Önizleme</span>
                    </div>

                    <!-- Canlı Kart -->
                    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                        <!-- Kart Resim Alanı -->
                        <div class="relative h-52 bg-slate-900 group overflow-hidden">
                            <img id="previewImage" src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" alt="Araba Önizleme" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                            
                            <div class="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                                <span id="previewYear">2020</span>
                            </div>

                            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 w-8 h-8 rounded-full flex items-center justify-center shadow">
                                <i class="fa-regular fa-heart"></i>
                            </div>

                            <div class="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-md">
                                <span id="previewPrice">850.000</span> TL
                            </div>
                        </div>

                        <!-- Kart Gövde Bilgileri -->
                        <div class="p-5 space-y-4">
                            <div>
                                <h3 id="previewTitle" class="font-bold text-slate-900 text-base leading-snug line-clamp-2">Sahibinden Temiz Golf 7</h3>
                                <p id="previewSub" class="text-xs text-slate-500 font-medium mt-1">Volkswagen • Golf 1.4 TSI</p>
                            </div>

                            <!-- Rozetler Özeti -->
                            <div class="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
                                <div class="bg-slate-50 p-2 rounded-xl">
                                    <p class="text-[10px] text-slate-400 uppercase font-semibold">Kilometre</p>
                                    <p id="previewKm" class="text-xs font-bold text-slate-800 mt-0.5">95.000 km</p>
                                </div>
                                <div class="bg-slate-50 p-2 rounded-xl">
                                    <p class="text-[10px] text-slate-400 uppercase font-semibold">Yakıt</p>
                                    <p id="previewFuel" class="text-xs font-bold text-slate-800 mt-0.5">Benzin</p>
                                </div>
                                <div class="bg-slate-50 p-2 rounded-xl">
                                    <p class="text-[10px] text-slate-400 uppercase font-semibold">Vites</p>
                                    <p id="previewGear" class="text-xs font-bold text-slate-800 mt-0.5">Otomatik</p>
                                </div>
                            </div>

                            <!-- Donanım Etiketleri Önizlemesi -->
                            <div>
                                <p class="text-[11px] font-semibold text-slate-400 uppercase mb-1.5">Seçilen Özellikler</p>
                                <div id="previewBadges" class="flex flex-wrap gap-1">
                                    <!-- Dynamic badges -->
                                </div>
                            </div>

                            <!-- Ekspertiz Durum Özeti -->
                            <div class="bg-blue-50/60 p-3 rounded-xl border border-blue-100/80 flex items-center justify-between text-xs">
                                <span class="text-slate-600 font-medium"><i class="fa-solid fa-shield text-blue-600 mr-1.5"></i>Boya / Hasar:</span>
                                <span id="previewDamage" class="font-bold text-blue-900">Hatasız / Boyasız</span>
                            </div>

                            <!-- Konum ve İletişim -->
                            <div class="flex items-center justify-between pt-2 text-xs text-slate-500">
                                <span id="previewLocation"><i class="fa-solid fa-location-dot mr-1 text-slate-400"></i>İstanbul / Kadıköy</span>
                                <span id="previewPhone"><i class="fa-solid fa-phone mr-1 text-slate-400"></i>0532 *** ** **</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- KOD GÖRÜNÜMÜ TABI (js/listing.js Dosyası İçin) -->
        <div id="codeView" class="hidden space-y-4">
            <div class="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-sm text-white flex items-center">
                        <i class="fa-brands fa-js text-amber-400 mr-2 text-lg"></i> js/listing.js Dosyası
                    </h3>
                    <p class="text-xs text-slate-400 mt-0.5">Bu kodu kopyalayıp GitHub projenizdeki <code class="text-indigo-300">js/listing.js</code> dosyasına yapıştırabilirsiniz.</p>
                </div>
                <button onclick="copyModuleCode()" class="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center space-x-1.5 shadow">
                    <i class="fa-regular fa-copy"></i>
                    <span>Kodu Kopyala</span>
                </button>
            </div>

            <pre class="bg-slate-950 text-emerald-400 p-6 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 leading-relaxed custom-scrollbar max-h-[600px]"><code id="codeBlock">
/**
 * Arabam Bul - İlan Ver Modülü (js/listing.js)
 * SPA Mimarinize Tam Uyumlu JS Modülü
 */

export const ListingModule = {
    // Varsayılan Donanım Seçenekleri
    featuresList: [
        'Sunroof / Cam Tavan', 'Deri Koltuk', 'Isıtmalı Koltuklar', 
        'Park Sensörü', 'Geri Görüş Kamerası', 'Şerit Takip Sistemi', 
        'Bluetooth / Carplay', 'Hayalet Gösterge', 'Hız Sabitleyici',
        'LED Matrix Far', 'Anahtarsız Çalıştırma', 'Kör Nokta Uyarısı'
    ],

    // Modülü Başlatır
    init: function(containerId = 'app') {
        const container = document.getElementById(containerId);
        if(!container) return;

        container.innerHTML = this.renderHTML();
        this.bindEvents();
    },

    // HTML Şablonunu Oluşturur
    renderHTML: function() {
        return `
            &lt;div class="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm"&gt;
                &lt;h1 class="text-2xl font-bold mb-6"&gt;İlan Oluştur&lt;/h1&gt;
                &lt;form id="jsCarListingForm" class="space-y-6"&gt;
                    &lt;!-- Form Alanları --&gt;
                    &lt;div class="grid grid-cols-2 gap-4"&gt;
                        &lt;input type="text" id="jsTitle" placeholder="İlan Başlığı" class="border p-2 rounded" required&gt;
                        &lt;input type="number" id="jsPrice" placeholder="Fiyat (TL)" class="border p-2 rounded" required&gt;
                    &lt;/div&gt;
                    &lt;button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"&gt;Kaydet&lt;/button&gt;
                &lt;/form&gt;
            &lt;/div&gt;
        `;
    },

    // Etkinlik Dinleyicilerini Bağlar
    bindEvents: function() {
        const form = document.getElementById('jsCarListingForm');
        if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('İlan başarıyla kaydedildi!');
            });
        }
    }
};
            </code></pre>
        </div>

    </main>

    <!-- Başarı Modal / Popup -->
    <div id="successModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                <i class="fa-solid fa-check font-black"></i>
            </div>
            
            <div>
                <h3 class="text-xl font-extrabold text-slate-900">İlanın Başarıyla Yayınlandı!</h3>
                <p class="text-slate-500 text-sm mt-1">Aracın artık "Arabam Bul" arama listesinde ve kullanıcı eşleştirmelerinde görünüyor.</p>
            </div>

            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1 text-slate-600">
                <p><strong>İlan ID:</strong> #AB-2026-884</p>
                <p><strong>İlan Başlığı:</strong> <span id="modalTitle">Golf 7</span></p>
                <p><strong>Fiyat:</strong> <span id="modalPrice">850.000</span> TL</p>
            </div>

            <div class="flex flex-col space-y-2">
                <button onclick="closeSuccessModal()" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow">
                    İlanı Gör (Detay Modülü)
                </button>
                <button onclick="closeSuccessModal()" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition">
                    Yeni İlan Ekle
                </button>
            </div>
        </div>
    </div>

    <!-- UYGULAMA MANTIĞI VE DİNAMİK ETKİLEŞİMLER (VANILLA JS) -->
    <script>
        // Donanım Özellik Listesi
        const availableFeatures = [
            'Sunroof / Cam Tavan', 'Deri Koltuk', 'Isıtmalı Koltuklar', 
            'Park Sensörü', 'Geri Görüş Kamerası', 'Şerit Takip', 
            'Bluetooth / Carplay', 'Hayalet Gösterge', 'Hız Sabitleyici',
            'LED Matrix Far', 'Anahtarsız Çalıştırma', 'Kör Nokta Uyarısı'
        ];

        let uploadedImages = [
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
        ];

        // Sayfa Yüklendiğinde Başlatılacak Kodlar
        window.onload = function() {
            renderFeatures();
            updatePreview();
        };

        // Donanım Checkbox'larını Oluşturma
        function renderFeatures() {
            const container = document.getElementById('featuresContainer');
            container.innerHTML = '';

            availableFeatures.forEach((feature, index) => {
                const id = `feat_${index}`;
                const checked = index < 4 ? 'checked' : ''; // İlk 4'ü varsayılan seçili

                container.innerHTML += `
                    <div>
                        <input type="checkbox" id="${id}" value="${feature}" ${checked} onchange="updatePreview()" class="badge-checkbox hidden">
                        <label for="${id}" class="block text-center px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition truncate">
                            ${feature}
                        </label>
                    </div>
                `;
            });
        }

        // Canlı Önizleme Güncelleme Fonksiyonu
        function updatePreview() {
            const title = document.getElementById('inputTitle').value || 'İlan Başlığı Giriniz';
            const brand = document.getElementById('inputBrand').value;
            const model = document.getElementById('inputModel').value || 'Model Bilgisi';
            const year = document.getElementById('inputYear').value || '2020';
            const price = document.getElementById('inputPrice').value;
            const km = document.getElementById('inputKm').value;
            const fuel = document.getElementById('inputFuel').value;
            const gear = document.getElementById('inputGear').value;
            const damage = document.getElementById('inputDamageStatus').value;
            const location = document.getElementById('inputLocation').value || 'Lokasyon Belirtilmedi';
            const phone = document.getElementById('inputPhone').value || '05xx xxx xx xx';

            // DOM Güncellemeleri
            document.getElementById('previewTitle').innerText = title;
            document.getElementById('previewSub').innerText = `${brand} • ${model}`;
            document.getElementById('previewYear').innerText = year;
            document.getElementById('previewPrice').innerText = price ? Number(price).toLocaleString('tr-TR') : '0';
            document.getElementById('previewKm').innerText = km ? `${Number(km).toLocaleString('tr-TR')} km` : '0 km';
            document.getElementById('previewFuel').innerText = fuel;
            document.getElementById('previewGear').innerText = gear;
            document.getElementById('previewDamage').innerText = damage;
            document.getElementById('previewLocation').innerHTML = `<i class="fa-solid fa-location-dot mr-1 text-slate-400"></i>${location}`;
            document.getElementById('previewPhone').innerHTML = `<i class="fa-solid fa-phone mr-1 text-slate-400"></i>${phone}`;

            // Seçili Özellik Rozetleri
            const selectedCheckboxes = document.querySelectorAll('#featuresContainer input[type="checkbox"]:checked');
            const badgesContainer = document.getElementById('previewBadges');
            badgesContainer.innerHTML = '';

            selectedCheckboxes.forEach(cb => {
                badgesContainer.innerHTML += `
                    <span class="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-100">
                        ${cb.value}
                    </span>
                `;
            });

            if(selectedCheckboxes.length === 0) {
                badgesContainer.innerHTML = `<span class="text-xs text-slate-400 italic">Henüz özellik seçilmedi</span>`;
            }
        }

        // Fotoğraf Yükleme Simülasyonu
        function handleImageUpload(e) {
            const files = e.target.files;
            if(!files || files.length === 0) return;

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedImages.unshift(event.target.result);
                    renderImageList();
                    // İlk resmi önizleme kartına koy
                    document.getElementById('previewImage').src = event.target.result;
                };
                reader.readAsDataURL(file);
            });
        }

        function renderImageList() {
            const list = document.getElementById('imageList');
            list.innerHTML = '';

            uploadedImages.forEach((imgSrc, index) => {
                list.innerHTML += `
                    <div class="relative h-16 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src="${imgSrc}" class="w-full h-full object-cover">
                        <button type="button" onclick="removeImage(${index})" class="absolute top-1 right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            ✕
                        </button>
                    </div>
                `;
            });
        }

        function removeImage(index) {
            uploadedImages.splice(index, 1);
            renderImageList();
            if(uploadedImages.length > 0) {
                document.getElementById('previewImage').src = uploadedImages[0];
            }
        }

        // Form Gönderim Yakalama
        function handleFormSubmit(e) {
            e.preventDefault();

            const title = document.getElementById('inputTitle').value;
            const price = document.getElementById('inputPrice').value;

            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalPrice').innerText = Number(price).toLocaleString('tr-TR');

            // Modalı Göster
            const modal = document.getElementById('successModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeSuccessModal() {
            const modal = document.getElementById('successModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Tab Değişimi (Form / Kod Görünümü)
        function setActiveTab(tab) {
            const formView = document.getElementById('formView');
            const codeView = document.getElementById('codeView');
            const tabBtnForm = document.getElementById('tabBtnForm');
            const tabBtnCode = document.getElementById('tabBtnCode');

            if(tab === 'form') {
                formView.classList.remove('hidden');
                codeView.classList.add('hidden');

                tabBtnForm.className = "px-4 py-2 text-xs font-bold rounded-lg bg-white text-blue-600 shadow-sm transition";
                tabBtnCode.className = "px-4 py-2 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition";
            } else {
                formView.classList.add('hidden');
                codeView.classList.remove('hidden');

                tabBtnCode.className = "px-4 py-2 text-xs font-bold rounded-lg bg-white text-blue-600 shadow-sm transition";
                tabBtnForm.className = "px-4 py-2 text-xs font-bold rounded-lg text-slate-600 hover:text-slate-900 transition";
            }
        }

        function toggleCodeView() {
            const codeView = document.getElementById('codeView');
            if(codeView.classList.contains('hidden')) {
                setActiveTab('code');
            } else {
                setActiveTab('form');
            }
        }

        // Kod Kopyalama Fonksiyonu
        function copyModuleCode() {
            const codeText = document.getElementById('codeBlock').innerText;
            
            // Clipboard API kopyalama
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = codeText;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);

            alert('js/listing.js kodları pano kopyalandı! GitHub dosyanıza yapıştırabilirsiniz.');
        }
    </script>
</body>
</html>
