/* ARABAMI BUL V1.2 — chat.js
   Bağımsız özellik modülü. Ortak durum/data: core.js
*/
function toggleChat() { document.getElementById('chatWindow').classList.toggle('open'); }

function generateAIResponse(q) {
  const lower = q.toLowerCase('tr-TR');

  if (lower.includes('suv') || lower.includes('jeep')) {
    const suvs = dummyCars.filter(c => c.seg === 'SUV').slice(0, 2);
    return `Sistemimizde harika SUV seçeneklerimiz var! Örneğin şunları inceleyebilirsiniz: <br>• <b>${suvs[0]?.brand} ${suvs[0]?.model}</b> (${suvs[0]?.price.toLocaleString('tr-TR')} TL)<br>• <b>${suvs[1]?.brand} ${suvs[1]?.model}</b> (${suvs[1]?.price.toLocaleString('tr-TR')} TL)<br>Dilerseniz "Araç İncele" bölümünden tümünü filtreleyebilirsiniz.`;
  }
  if (lower.includes('bütçe') || lower.includes('ucuz') || lower.includes('para')) {
    const cheapest = [...dummyCars].sort((a,b) => a.price - b.price)[0];
    return `Bütçe dostu araçlarımız arasında şu an en avantajlısı: <b>${cheapest.brand} ${cheapest.model}</b>, fiyatı ise ${cheapest.price.toLocaleString('tr-TR')} TL. "Bana Araba Bul" sihirbazını kullanarak tam bütçenize göre filtreleme yapabilirsiniz!`;
  }
  if (lower.includes('ilan') || lower.includes('satmak') || lower.includes('aracımı')) {
    return `Aracınızı satmak çok kolay! Üst menüden veya hızlı komutlardan <b>"İlan Ver"</b> sayfasına giderek fotoğraflarını yükleyebilir ve hemen yayına alabilirsiniz.`;
  }
  if (lower.includes('ekspertiz') || lower.includes('boya') || lower.includes('kaza')) {
    return `Tüm araçlarımızda %100 doğrulanmış detaylı oto ekspertiz raporu bulunmaktadır. İlgilendiğiniz aracın detay kartına tıklayarak ön kaput, şase ve motor sağlığı durumunu detaylıca görebilirsiniz.`;
  }

  return `Anladım! Sizin için platformumuzdaki 70 aktif veri tabanını taradım. Aradığınız kriterlere en uygun modeli bulmak için üst menüdeki <b>"Bana Araba Bul"</b> sihirbazını kullanabilir ya da aradığınız markayı (örn: BMW, Mercedes, Tesla) yazabilirsiniz. Size nasıl yardımcı olmamı istersiniz?`;
}