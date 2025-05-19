document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("searchButton");
  const serviceSelect = document.getElementById("serviceType");
  const locationInput = document.getElementById("locationInput");

  searchButton.addEventListener("click", function () {
    const role = localStorage.getItem("role");

    if (!role) {
      const modal = document.createElement("div");
      modal.className = "auth-modal";
      modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Увійдіть до свого акаунту</h2>
                        <p>Для перегляду послуг необхідно увійти або зареєструватися</p>
                    </div>
                    <div class="modal-actions">
                        <a href="html/login.html?form=login" class="btn btn-outline">Увійти</a>
                        <a href="html/login.html?form=register" class="btn btn-primary">Зареєструватися</a>
                    </div>
                    <button class="close-modal">&times;</button>
                </div>
            `;

      document.body.appendChild(modal);

      const closeBtn = modal.querySelector(".close-modal");
      closeBtn.onclick = () => document.body.removeChild(modal);
      modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
      };
      return;
    }
  });
});
