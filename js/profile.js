// ---------------------------------------  Функціонал для вкладок ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      tab.classList.add("active");
      tabContents[index].classList.add("active");
    });
  });

  const userMenu = document.querySelector(".user-menu");
  if (userMenu) {
    userMenu.addEventListener("click", function (e) {
      e.stopPropagation();
      const dropdownMenu = this.querySelector(".dropdown-menu");
      dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
      const dropdownMenu = userMenu.querySelector(".dropdown-menu");
      if (dropdownMenu.style.display === "block") {
        dropdownMenu.style.display = "none";
      }
    });
  }

  // --------------------------------------- Функціонал для календаря ---------------------------------------
  const calendarGrid = document.getElementById("calendar-grid");
  const currentMonthYear = document.getElementById("current-month-year");
  const prevMonthButton = document.getElementById("prev-month");
  const nextMonthButton = document.getElementById("next-month");

  const today = new Date();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const todayDate = today.getDate();

  let date = new Date();
  let currentMonth = date.getMonth();
  let currentYear = date.getFullYear();

  const months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

  function highlightCurrentDay(month, year) {
    if (month === todayMonth && year === todayYear) {
      const days = document.querySelectorAll(".calendar-day");
      days.forEach((day) => {
        if (parseInt(day.textContent) === todayDate) {
          day.classList.add("highlight");
        }
      });
    }
  }

  function updateCalendar(month, year) {
    calendarGrid.innerHTML = "";
    currentMonthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
    daysOfWeek.forEach((dayName) => {
      const dayElement = document.createElement("div");
      dayElement.classList.add("calendar-day-name");
      dayElement.textContent = dayName;
      calendarGrid.appendChild(dayElement);
    });

    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.classList.add("calendar-day");
      calendarGrid.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("calendar-day");
      dayElement.textContent = day;
      dayElement.addEventListener("click", () => toggleDayStatus(dayElement));
      calendarGrid.appendChild(dayElement);
    }
    highlightCurrentDay(month, year);
  }

  prevMonthButton.addEventListener("click", () => {
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
    updateCalendar(currentMonth, currentYear);
  });

  nextMonthButton.addEventListener("click", () => {
    currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
    updateCalendar(currentMonth, currentYear);
  });

  function toggleDayStatus(dayElement) {
    const day = parseInt(dayElement.textContent);
    const selectedDate = new Date(currentYear, currentMonth, day);
    const todayDateObj = new Date(todayYear, todayMonth, todayDate);

    if (selectedDate < todayDateObj || (selectedDate.getDate() === todayDateObj.getDate() && selectedDate.getMonth() === todayDateObj.getMonth() && selectedDate.getFullYear() === todayDateObj.getFullYear())) {
      return;
    }

    const statuses = ["available", "busy", "undefined"];
    let currentStatus = statuses.find((status) => dayElement.classList.contains(status));

    const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;

    dayElement.className = "calendar-day";
    if (isToday) {
      dayElement.classList.add("highlight");
    }

    if (currentStatus) {
      let nextStatusIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
      dayElement.classList.add(statuses[nextStatusIndex]);
    } else {
      dayElement.classList.add(statuses[0]);
    }
  }

  updateCalendar(currentMonth, currentYear);

  // --------------------------------------- Функціонал для перемикання між акаунтами ---------------------------------------
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const avatar = localStorage.getItem("avatar");

  if (role && name && avatar) {
    const userAvatar = document.querySelector(".user-avatar");
    const userName = document.querySelector(".user-menu span");

    if (userAvatar && userName) {
      userAvatar.textContent = avatar;
      userName.textContent = name;
    }

    if (role === "employer") {
      document.querySelector(".role-employer").style.display = "block";
      document.querySelector(".role-worker").style.display = "none";
    } else if (role === "worker") {
      document.querySelector(".role-worker").style.display = "block";
      document.querySelector(".role-employer").style.display = "none";
    }
  } else {
    alert("Ви не авторизовані! Поверніться на сторінку входу.");
    window.location.href = "/Course-work/html/login.html";
  }

  function updateUserPackageBadge() {
    const userPackage = localStorage.getItem("userPackage");
    document.querySelectorAll(".user-package").forEach((aboba) => {
      if (userPackage == "Premium") {
        aboba.textContent = "Premium";
        aboba.classList.add("premium");
        aboba.classList.remove("basic");
      } else if (userPackage == "Базовий") {
        aboba.textContent = "Базовий";
        aboba.classList.add("basic");
        aboba.classList.remove("premium");
      } else {
        aboba.textContent = "";
        aboba.classList.remove("premium", "basic");
      }
    });
  }

  updateUserPackageBadge();

  // --------------------------------------- Функціонал для створення нового замовлення ---------------------------------------
  const createOrderBtn = document.querySelector(".employer-order");
  if (createOrderBtn) {
    createOrderBtn.addEventListener("click", function () {
      window.location.href = "/Course-work/html/add-order.html";
    });
  }

  // --------------------------------------- Функціонал для створення нової послуги ---------------------------------------
  const addServiceBtn = document.querySelector(".worker-service");
  if (addServiceBtn) {
    addServiceBtn.addEventListener("click", function () {
      window.location.href = "/Course-work/html/add-service.html";
    });
  }

  // --------------------------------------- Функціонал для редагування профілю ---------------------------------------
  const editProfileEBtn = document.querySelectorAll(".edit");
  if (editProfileEBtn.length) {
    editProfileEBtn.forEach((btn) => {
      btn.addEventListener("click", function () {
        window.location.href = "/Course-work/html/edit-profile.html";
      });
    });
  }

  // --------------------------------------- Профіль для нового профілю ---------------------------------------
  const isDemo = localStorage.getItem("isDemo") === "true";

  if (!isDemo) {
    const employerBlock = document.querySelector(".role-employer");
    if (employerBlock && employerBlock.style.display !== "none") {
      const profileAvatar = employerBlock.querySelector(".profile-avatar");
      if (profileAvatar) {
        const plus = profileAvatar.querySelector(".upload-avatar");
        profileAvatar.textContent = localStorage.getItem("avatar") || "U";
        if (plus) profileAvatar.appendChild(plus);
      }
      const profileName = employerBlock.querySelector(".profile-info h1");
      if (profileName) profileName.innerHTML = (localStorage.getItem("name") || "Ваше ім'я") + "<span class='user-package'></span>";
    }

    const workerBlock = document.querySelector(".role-worker");
    if (workerBlock && workerBlock.style.display !== "none") {
      const profileAvatar = workerBlock.querySelector(".profile-avatar");
      if (profileAvatar) {
        const plus = profileAvatar.querySelector(".upload-avatar");
        profileAvatar.textContent = localStorage.getItem("avatar") || "U";
        if (plus) profileAvatar.appendChild(plus);
      }
      const profileName = workerBlock.querySelector(".profile-info h1");
      if (profileName) profileName.innerHTML = (localStorage.getItem("name") || "Ваше ім'я") + "<span class='user-package'></span>";
    }
    updateUserPackageBadge();

    document.querySelectorAll(".profile-info p:nth-child(2)").forEach((p) => {
      p.textContent = "Місто не вказано";
    });

    document.querySelectorAll(".profile-info p").forEach((p) => {
      if (p.textContent.trim().startsWith("На сайті з") || p.textContent.trim().startsWith("Вкажіть дату реєстрації")) {
        const createdAt = localStorage.getItem("createdAt");
        if (createdAt) {
          const date = new Date(createdAt);
          const months = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
          p.textContent = `На сайті з ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        } else {
          p.textContent = "Вкажіть дату реєстрації";
        }
      }
    });

    const skillsList = document.querySelector(".skills-list");
    if (skillsList) skillsList.innerHTML = "<span class='empty-placeholder'>Додайте свої навички</span>";

    const aboutSections = document.querySelectorAll(".profile-section .section-titles + p");
    aboutSections.forEach((aboutSection) => {
      aboutSection.textContent = "Заповніть інформацію про себе у розділі редагування профілю.";
    });

    document.querySelectorAll(".stat-value").forEach((el) => (el.textContent = "—"));
    document.querySelectorAll(".stat-label").forEach((el) => (el.textContent = ""));

    document.querySelectorAll(".experience-list, .results-grid, .review-list").forEach((list) => {
      list.innerHTML = "<div class='empty-placeholder'>Поки що немає даних</div>";
    });

    document.querySelectorAll(".verification-status").forEach((block) => {
      const statusTitle = block.querySelector("strong");
      const statusDate = block.querySelector("div[style]");
      const icon = block.querySelector(".status-icon");

      const role = localStorage.getItem("role");
      if (statusTitle) {
        if (role === "worker") {
          statusTitle.textContent = "Проходить верифікація працівника...";
        } else {
          statusTitle.textContent = "Проходить верифікація облікового запису...";
        }
      }
      if (statusDate) statusDate.textContent = "";

      if (icon) {
        icon.classList.remove("status-verified");
        icon.classList.add("status-pending");
      }
    });
  }

  document.querySelectorAll(".rating-overview").forEach((block) => {
    const avg = block.querySelector(".rating-avg");
    const stars = block.querySelector(".rating-stars");
    const count = block.querySelector(".rating-count");

    if (avg) avg.textContent = "0.0";
    if (count) count.textContent = "0 відгуків";
    if (stars) {
      stars.innerHTML = "★★★★★";
      stars.style.color = "#ccc"; // сірий колір
    }
  });
});

// --------------------------------------- Функціонал для попереднього перегляду аватара ---------------------------------------
const avatarInput = document.getElementById("avatar");
if (avatarInput) {
  avatarInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        document.getElementById("avatarPreview").src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

const addEducationForm = document.getElementById("addEducationForm");
if (addEducationForm) {
  addEducationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Освіту/досвід додано!");
    window.history.back();
  });
}
