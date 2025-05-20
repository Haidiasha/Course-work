document.addEventListener("DOMContentLoaded", function () {
  const packageName = localStorage.getItem("pendingPackage");
  const packagePrice = localStorage.getItem("pendingPrice");

  document.getElementById("packageName").textContent = packageName;
  document.getElementById("packagePrice").textContent = packagePrice;
  document.getElementById("paymentAmount").textContent = packagePrice;

  const cardNumber = document.getElementById("cardNumber");
  cardNumber.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    e.target.value = value;
  });

  cardNumber.addEventListener("blur", function () {
    const digits = cardNumber.value.replace(/\D/g, "");
    if (digits.length < 16) {
      cardNumber.setCustomValidity("Номер картки має містити 16 цифр");
    } else {
      cardNumber.setCustomValidity("");
    }
  });

  const expiry = document.getElementById("expiry");
  expiry.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    e.target.value = value;
  });

  expiry.addEventListener("blur", function () {
    const value = expiry.value;
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) {
      expiry.setCustomValidity("Введіть термін у форматі MM/YY (місяць має бути від 1 до 12)");
      return;
    }

    const [month, year] = value.split("/").map(Number);
    const now = new Date();
    const inputYear = 2000 + year;
    const inputMonth = month - 1;

    const expiryDate = new Date(inputYear, inputMonth + 1, 1);
    const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);

    if (expiryDate <= currentDate) {
      expiry.setCustomValidity("Термін дії картки вже минув");
      return;
    }

    expiry.setCustomValidity("");
  });
  // ---------------------------------------  Обробка відправлення форми ---------------------------------------
  const paymentForm = document.getElementById("paymentForm");
  const successModal = document.getElementById("successModal");
  const closeModal = document.querySelector(".close-modal");

  paymentForm.addEventListener("submit", function (e) {
    e.preventDefault();
    setTimeout(() => {
      localStorage.setItem("userPackage", packageName);
      localStorage.setItem("selectedPrice", packagePrice);
      localStorage.removeItem("pendingPackage");
      localStorage.removeItem("pendingPrice");

      successModal.style.display = "block";
    }, 1500);
  });

  closeModal.addEventListener("click", function () {
    successModal.style.display = "none";
    window.location.href = "/Course-work/htmlprofile.html";
  });

  window.addEventListener("click", function (e) {
    if (e.target === successModal) {
      successModal.style.display = "none";
      window.location.href = "/Course-work/html/profile.html";
    }
  });
});
