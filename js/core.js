/* ARABAMI BUL V1.2 — core.js
   Ortak uygulama sözleşmesi ve yardımcılar.
   Mevcut değişkenler app.js'de tutulduğu için burada tekrar tanımlanmıyor.
*/
window.ArabamiBul = window.ArabamiBul || {};

window.ArabamiBul.version = "1.2";

window.ArabamiBul.ready = function () {
  return document.readyState !== "loading";
};
