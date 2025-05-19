document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");

  if (!role) {
    window.location.href = "/Course-work//html/login.html";
    return;
  }

  const employerPackages = document.querySelector(".employer-packages");
  const workerPackages = document.querySelector(".worker-packages");

  if (role === "employer") {
    employerPackages.style.display = "flex";
    workerPackages.style.display = "none";
  } else if (role === "worker") {
    employerPackages.style.display = "none";
    workerPackages.style.display = "flex";
  }

  const packageButtons = document.querySelectorAll(".package-card button");
  const modal = document.getElementById("confirmModal");
  const closeModal = document.querySelector(".close-modal");
  const cancelButton = document.getElementById("cancelButton");
  const confirmButton = document.getElementById("confirmButton");
  const confirmMessage = document.getElementById("confirmMessage");

  function openModal(message) {
    confirmMessage.textContent = message;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeModalWindow() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  closeModal.addEventListener("click", closeModalWindow);

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModalWindow();
    }
  });

  cancelButton.addEventListener("click", closeModalWindow);

  packageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const packageCard = this.closest(".package-card");
      const packageName = packageCard.querySelector("h3").textContent;
      const packagePrice = packageCard.querySelector(".price").textContent;

      openModal(`Ви бажаєте придбати пакет "${packageName}" за ${packagePrice}?`);

      confirmButton.onclick = function () {
        const packageName = packageCard.querySelector("h3").textContent;

        const packagePrice = packageCard.querySelector(".price").textContent;

        localStorage.setItem("pendingPackage", packageName);
        localStorage.setItem("pendingPrice", packagePrice);

        closeModalWindow();
        window.location.href = "/Course-work/html/payment.html";
      };
    });
  });

  const currentPackage = localStorage.getItem("userPackage");
  const packages = document.querySelectorAll(".package-card");
  console.log("Текущий пакет:", currentPackage);

  packages.forEach((package) => {
    const packageName = package.querySelector("h3").textContent;
    const button = package.querySelector("button");

    if (packageName === currentPackage) {
      button.textContent = "Активний пакет";
      button.classList.add("active-package");
      button.disabled = true;
    } else {
      if (currentPackage) {
        const currentPrice = parseInt(localStorage.getItem("selectedPrice"));
        const packagePrice = parseInt(package.querySelector(".price").textContent);

        if (packagePrice > currentPrice) {
          button.textContent = "Оновити пакет";
          button.classList.add("upgrade-package");
        } else {
          button.disabled = true;
          button.textContent = "Недоступно";
        }
      }
    }
  });
  //localStorage.removeItem("userPackage");
  //console.log(localStorage.getItem("userPackage"));
});
