/* =========================================================
   ARABAMI BUL V2 — ACCOUNT / GİRİŞ SİSTEMİ
   ========================================================= */

(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  /* =======================================================
     GİRİŞ / KAYIT GEÇİŞİ
     ======================================================= */

  window.showLoginForm = function () {
    const login = $("accountLoginForm");
    const register = $("accountRegisterForm");

    if (login) login.classList.remove("account-form-hidden");
    if (register) register.classList.add("account-form-hidden");

    const title = $("accountFormTitle");
    const text = $("accountFormText");

    if (title) {
      title.textContent = "Tekrar hoş geldin";
    }

    if (text) {
      text.textContent =
        "Hesabına giriş yap ve Arabamı Bul deneyimine devam et.";
    }

    hideMessage();
  };

  window.showRegisterForm = function () {
    const login = $("accountLoginForm");
    const register = $("accountRegisterForm");

    if (login) login.classList.add("account-form-hidden");
    if (register) register.classList.remove("account-form-hidden");

    const title = $("accountFormTitle");
    const text = $("accountFormText");

    if (title) {
      title.textContent = "Hesabını oluştur";
    }

    if (text) {
      text.textContent =
        "Ücretsiz hesabını oluştur, araçlarını ve ilanlarını tek yerden yönet.";
    }

    hideMessage();
  };

  /* =======================================================
     ŞİFRE GÖSTER / GİZLE
     ======================================================= */

  window.toggleAccountPassword = function (inputId, button) {
    const input = $(inputId);

    if (!input) return;

    if (input.type === "password") {
      input.type = "text";

      if (button) {
        button.textContent = "Gizle";
      }
    } else {
      input.type = "password";

      if (button) {
        button.textContent = "Göster";
      }
    }
  };

  /* =======================================================
     MESAJ
     ======================================================= */

  function showMessage(message) {
    const box = $("accountMessage");

    if (!box) return;

    box.textContent = message;
    box.classList.add("show");
  }

  function hideMessage() {
    const box = $("accountMessage");

    if (!box) return;

    box.textContent = "";
    box.classList.remove("show");
  }

  /* =======================================================
     GİRİŞ
     ======================================================= */

  window.handleAccountLogin = function (event) {
    event.preventDefault();

    const email = $("loginEmail");
    const password = $("loginPassword");

    if (!email || !password) return;

    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (!emailValue) {
      email.focus();
      showMessage("Lütfen e-posta adresinizi girin.");
      return;
    }

    if (!passwordValue) {
      password.focus();
      showMessage("Lütfen parolanızı girin.");
      return;
    }

    if (!emailValue.includes("@")) {
      email.focus();
      showMessage("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    /*
      Şimdilik gerçek üyelik sistemi yok.
      Bu bölüm yalnızca arayüz testidir.
    */

    showMessage(
      "Giriş işlemi demo modunda çalışıyor. Gerçek üyelik sistemi daha sonra bağlanabilir."
    );
  };

  /* =======================================================
     KAYIT
     ======================================================= */

  window.handleAccountRegister = function (event) {
    event.preventDefault();

    const name = $("registerName");
    const email = $("registerEmail");
    const password = $("registerPassword");
    const passwordAgain = $("registerPasswordAgain");
    const terms = $("registerTerms");

    if (!name || !email || !password || !passwordAgain) return;

    if (!name.value.trim()) {
      name.focus();
      showMessage("Lütfen adınızı ve soyadınızı girin.");
      return;
    }

    if (!email.value.trim() || !email.value.includes("@")) {
      email.focus();
      showMessage("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    if (password.value.length < 6) {
      password.focus();
      showMessage("Parolanız en az 6 karakter olmalıdır.");
      return;
    }

    if (password.value !== passwordAgain.value) {
      passwordAgain.focus();
      showMessage("Parolalar eşleşmiyor.");
      return;
    }

    if (terms && !terms.checked) {
      showMessage("Devam etmek için kullanım koşullarını kabul edin.");
      return;
    }

    showMessage(
      "Hesap oluşturma demo modunda çalışıyor. Gerçek kayıt sistemi daha sonra bağlanabilir."
    );
  };

  /* =======================================================
     ŞİFREMİ UNUTTUM
     ======================================================= */

  window.accountForgotPassword = function () {
    const email = $("loginEmail");

    if (email && email.value.trim()) {
      showMessage(
        "Şifre yenileme bağlantısı bu e-posta adresine gönderilecek şekilde hazırlanabilir."
      );
    } else {
      showMessage(
        "Önce e-posta adresinizi girin, ardından şifrenizi yenileyebilirsiniz."
      );

      if (email) {
        email.focus();
      }
    }
  };

  /* =======================================================
     GOOGLE
     ======================================================= */

  window.accountGoogleLogin = function () {
    showMessage(
      "Google ile giriş arayüzü hazır. Gerçek Google bağlantısı daha sonra eklenebilir."
    );
  };

})();
