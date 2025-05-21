document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  const employerFilters = document.querySelector(".employer-filters");
  const workerFilters = document.querySelector(".worker-filters");

  if (role === "employer") {
    employerFilters.style.display = "block";
    workerFilters.style.display = "none";
  } else if (role === "worker") {
    employerFilters.style.display = "none";
    workerFilters.style.display = "block";
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    if (role === "worker") {
      Array.from(sortSelect.options).forEach((option) => {
        if (option.value === "rating" || option.value === "experience") {
          option.style.display = "none";
        }
      });
      if (sortSelect.value === "rating" || sortSelect.value === "experience") {
        sortSelect.value = "relevance";
        currentSort = "relevance";
      }
    } else {
      Array.from(sortSelect.options).forEach((option) => {
        option.style.display = "";
      });
    }
  }

  function updateResultsCount(totalFound) {
    const searchSummary = document.querySelector(".search-summary");
    if (searchSummary) {
      searchSummary.innerHTML = `Знайдено <strong>${totalFound}</strong> результатів`;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function generateCardHTML(card) {
    if (role === "employer" && card.role === "employer") {
      return `
      <div class="result-card">
        <div class="card-image">
          <img src="${card.img}" alt="${card.name}" />
          <div class="card-badge">${card.badge}</div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${card.name}</h3>
          <p class="card-subtitle">${card.subtitle}</p>
          <div class="card-rating">
            <div class="stars">${"★".repeat(card.rating)}${"☆".repeat(5 - card.rating)}</div>
            <div class="count">(${card.reviews} відгуків)</div>
          </div>
          <div class="card-details">
            <div class="card-detail">⌛ ${card.experience}</div>
            <div class="card-detail">📍 ${card.location}</div>
            <div class="card-detail">🕒 ${card.schedule}</div>
          </div>
          <div class="card-price">${card.price} грн/год</div>
          <div class="card-actions-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div class="card-actions">
              <a href="#" class="btn btn-outline">Деталі</a>
              <a href="#" class="btn btn-primary">Зв'язатися</a>
            </div>
            <div class="card-created">
              <span class="card-created-label">Створено:</span>
              <span class="card-created-date">${formatDate(card.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    if (role === "worker" && card.role === "worker") {
      return `
      <div class="result-card">
        <div class="card-image">
          <div class="card-badge">${card.badge}</div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${card.title}</h3>
          <p class="card-subtitle">${card.subtitle}</p>
          <div class="card-details">
            <div class="card-detail">📍 ${card.location}</div>
            <div class="card-detail">🕒 ${card.schedule}</div>
            <div class="card-detail">👥 ${card.employment}</div>
            <div class="card-detail">📅 ${card.frequency}</div>
          </div>
          <div class="card-price">${card.price} грн/год</div>
          <div class="card-actions-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div class="card-actions">
              <a href="#" class="btn btn-outline">Деталі</a>
              <a href="#" class="btn btn-primary">Відгукнутися</a>
            </div>
            <div class="card-created">
              <span class="card-created-label">Створено:</span>
              <span class="card-created-date">${formatDate(card.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    return "";
  }

  let currentPage = 1;
  const cardsPerPage = 10;
  let currentSort = "relevance";

  document.getElementById("sort-select").addEventListener("change", function () {
    currentSort = this.value;
    currentPage = 1;
    displaySearchResults();
  });

  function sortCards(cards) {
    switch (currentSort) {
      case "rating":
        return cards.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "price-low":
        return cards.slice().sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-high":
        return cards.slice().sort((a, b) => (b.price || 0) - (a.price || 0));
      case "experience":
        return cards.slice().sort((a, b) => {
          const getExp = (exp) => parseInt((exp || "").match(/\d+/)?.[0] || 0);
          return (b.experience ? getExp(b.experience) : 0) - (a.experience ? getExp(a.experience) : 0);
        });
      default:
        return cards;
    }
  }

  function renderPagination(totalCards) {
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalCards / cardsPerPage);
    let html = "";

    for (let i = 1; i <= totalPages; i++) {
      html += `<div class="pagination-item${i === currentPage ? " active" : ""}" data-page="${i}">${i}</div>`;
    }
    paginationContainer.innerHTML = html;

    paginationContainer.querySelectorAll(".pagination-item").forEach((item) => {
      item.addEventListener("click", function () {
        currentPage = parseInt(this.dataset.page);
        displaySearchResults();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function getSelectedFilters() {
    const filters = {};
    filters.category = Array.from(document.querySelectorAll('input[name="category"]:checked')).map((i) => i.value);
    filters.scheduleType = Array.from(document.querySelectorAll('input[name="schedule"]:checked')).map((i) => i.value);
    filters.locationKey = Array.from(document.querySelectorAll('input[name="location"]:checked')).map((i) => i.value);
    filters.employmentType = Array.from(document.querySelectorAll('input[name="employment"]:checked')).map((i) => i.value);
    filters.frequencyType = Array.from(document.querySelectorAll('input[name="frequency"]:checked')).map((i) => i.value);
    filters.experience = Array.from(document.querySelectorAll('input[name="experience"]:checked')).map((i) => i.value);
    const visiblePriceInputs = Array.from(document.querySelectorAll('.price-inputs input[type="number"]')).filter((input) => input.offsetParent !== null);
    filters.priceMin = visiblePriceInputs[0]?.value ? parseInt(visiblePriceInputs[0].value) : null;
    filters.priceMax = visiblePriceInputs[1]?.value ? parseInt(visiblePriceInputs[1].value) : null;
    return filters;
  }

  function filterCards(cards, filters) {
    return cards.filter((card) => {
      if (filters.category.length && !filters.category.includes(card.category)) return false;
      if (filters.scheduleType.length && !filters.scheduleType.includes(card.scheduleType)) return false;
      if (filters.locationKey.length && !filters.locationKey.includes(card.locationKey)) return false;
      if (filters.employmentType.length && !filters.employmentType.includes(card.employmentType)) return false;
      if (filters.frequencyType.length && !filters.frequencyType.includes(card.frequencyType)) return false;
      if (filters.experience.length && card.experienceYears !== undefined) {
        let match = false;
        for (const exp of filters.experience) {
          if (exp === "1" && card.experienceYears <= 1) match = true;
          if (exp === "1-3" && card.experienceYears > 1 && card.experienceYears <= 3) match = true;
          if (exp === "3-5" && card.experienceYears > 3 && card.experienceYears <= 5) match = true;
          if (exp === "5+" && card.experienceYears > 5) match = true;
        }
        if (!match) return false;
      }
      if (filters.priceMin !== null && card.price < filters.priceMin) return false;
      if (filters.priceMax !== null && card.price > filters.priceMax) return false;
      return true;
    });
  }

  function showResponseModal() {
    const modal = document.getElementById("responseModal");
    if (!modal) return;
    modal.style.display = "flex";
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = "none";
      };
    }
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };
  }

  function showDetailsModal(card) {
    const oldModal = document.getElementById("detailsModal");
    if (oldModal) oldModal.remove();

    const modal = document.createElement("div");
    modal.className = "modals";
    modal.id = "detailsModal";
    modal.style.display = "flex";
    const userRole = localStorage.getItem("role");
    const detailsTitle = userRole === "worker" ? "Деталі замовлення" : "Деталі послуги";
    const employmentHtml = userRole === "worker" ? `<p><strong>Тип зайнятості:</strong> ${card.employment || "—"}</p>` : "";
    const frequencyHtml = userRole === "worker" ? `<p><strong>Регулярність:</strong> ${card.frequency || "—"}</p>` : "";
    modal.innerHTML = `
      <div class="modals-content">
        <div class="modals-header">
          <h3>${detailsTitle}</h3>
          <button class="close-modals">&times;</button>
        </div>
        <div class="modals-body">
          <p><strong>Назва:</strong> ${card.title || card.name}</p>
          <p><strong>Опис:</strong> ${card.description ? card.description : "—"}</p>
          ${card.requirements ? `<p><strong>Вимоги:</strong> ${card.requirements}</p>` : ""}
          ${card.contacts ? `<p><strong>Контакти:</strong> ${card.contacts}</p>` : ""}
          ${card.bonus ? `<p><strong>Бонуси/Додатково:</strong> ${card.bonus}</p>` : ""}
          <p><strong>Локація:</strong> ${card.location || "—"}</p>
          <p><strong>Графік:</strong> ${card.schedule || "—"}</p>
          ${employmentHtml}
          ${frequencyHtml}
          <p><strong>Оплата:</strong> ${card.price ? card.price + " грн/год" : "—"}</p>
          <p><strong>Створено:</strong> ${card.createdAt ? formatDate(card.createdAt) : "—"}</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close-modals").onclick = () => modal.remove();
    modal.onclick = (e) => {
      if (e.target === modal) modal.remove();
    };
  }

  function attachDetailsHandlers(cardsToShow) {
    document.querySelectorAll(".btn.btn-outline").forEach((button, idx) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        showDetailsModal(cardsToShow[idx]);
      });
    });
  }

  function displaySearchResults() {
    const resultsGrid = document.querySelector(".results-grid");
    resultsGrid.innerHTML = "";

    let filteredCards = window.mockCards.filter((card) => card.role === role);

    const filters = getSelectedFilters();
    filteredCards = filterCards(filteredCards, filters);

    filteredCards = sortCards(filteredCards);

    const totalCards = filteredCards.length;
    const startIdx = (currentPage - 1) * cardsPerPage;
    const endIdx = startIdx + cardsPerPage;
    const cardsToShow = filteredCards.slice(startIdx, endIdx);

    resultsGrid.innerHTML = cardsToShow.map(generateCardHTML).join("");

    updateResultsCount(totalCards);
    renderPagination(totalCards);

    if (role === "worker") {
      document.querySelectorAll(".btn.btn-primary").forEach((button) => {
        button.addEventListener("click", function (e) {
          e.preventDefault();
          showResponseModal();
        });
      });
    }

    attachDetailsHandlers(cardsToShow);
  }

  document.querySelectorAll(".filters input, .filters select").forEach((el) => {
    el.addEventListener("change", () => {
      currentPage = 1;
      displaySearchResults();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Очищення всіх фільтрів
  const clearFiltersBtn = document.querySelector(".clear-filters");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function (e) {
      e.preventDefault();

      // Знімаємо всі чекбокси
      document.querySelectorAll('.filters input[type="checkbox"]').forEach((el) => {
        el.checked = false;
      });

      // Очищаємо всі поля з ціною
      document.querySelectorAll('.filters .price-inputs input[type="number"]').forEach((el) => {
        el.value = "";
      });

      // Якщо є select, скидаємо їх (опціонально)
      document.querySelectorAll(".filters select").forEach((el) => {
        el.selectedIndex = 0;
      });

      // Сброс страницы на первую
      currentPage = 1;

      // Обновить результати пошуку
      displaySearchResults();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  displaySearchResults();

  function updatePageTitle() {
    const pageTitle = document.querySelector(".page-title");
    const pageDescription = pageTitle.nextElementSibling;

    if (role === "employer") {
      pageTitle.textContent = "Пошук домашнього персоналу";
      pageDescription.textContent = "Знайдіть ідеального працівника для вашого дому з нашими розширеними фільтрами пошуку";
    } else if (role === "worker") {
      pageTitle.textContent = "Пошук замовлень";
      pageDescription.textContent = "Знайдіть відповідні вакансії та замовлення за допомогою зручних фільтрів";
    }
  }

  updatePageTitle();
});
