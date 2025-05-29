// --------------------------------------- Логіка для перемикання між формами входу та реєстрації ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const form = urlParams.get("form");

  const loginTab = document.querySelector(".auth-tab:nth-child(1)");
  const registerTab = document.querySelector(".auth-tab:nth-child(2)");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  function switchTab(activeTab, inactiveTab, activeForm, inactiveForm) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    activeForm.style.display = "block";
    inactiveForm.style.display = "none";
  }

  if (form === "register") {
    switchTab(registerTab, loginTab, registerForm, loginForm);
  } else {
    switchTab(loginTab, registerTab, loginForm, registerForm);
  }

  loginTab.addEventListener("click", () => switchTab(loginTab, registerTab, loginForm, registerForm));
  registerTab.addEventListener("click", () => switchTab(registerTab, loginTab, registerForm, loginForm));

  const roleOptions = document.querySelectorAll(".role-option");
  roleOptions.forEach((option) => {
    option.addEventListener("click", function () {
      roleOptions.forEach((opt) => opt.classList.remove("selected"));
      this.classList.add("selected");
    });
  });
});

// --------------------------------------- Дані для перевірки (тестові) ---------------------------------------
const users = [
  { email: "employer@example.com", password: "employer123", role: "employer", name: "Катерина", avatar: "К", isDemo: true },
  { email: "worker@example.com", password: "worker123", role: "worker", name: "Михайло", avatar: "М", isDemo: true },
  { email: "admin@example.com", password: "admin123", role: "admin", name: "Адміністратор", avatar: "А", isDemo: true },
];

// --------------------------------------- Робота з localStorage для нових користувачів ---------------------------------------
function getRegisteredUsers() {
  return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
}
function saveRegisteredUser(user) {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

// --------------------------------------- Обробка форми входу ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const registeredUser = getRegisteredUsers().find((u) => u.email === email && u.password === password);

      const demoUser = users.find((u) => u.email === email && u.password === password);

      const user = registeredUser || demoUser;

      if (user) {
        localStorage.setItem("role", user.role);
        localStorage.setItem("name", user.name);
        localStorage.setItem("avatar", user.avatar);
        localStorage.setItem("isDemo", user.isDemo ? "true" : "false");
        if (user.createdAt) {
          localStorage.setItem("createdAt", user.createdAt);
        } else {
          localStorage.removeItem("createdAt");
        }

        if (user.role === "admin") {
          window.location.href = "/Course-work/index.html";
        } else {
          window.location.href = "/Course-work/html/profile.html";
        }
      } else {
        loginError.textContent = "Невірний email або пароль!";
        loginError.style.display = "block";
      }
    });

    // Скрывать ошибку при вводе
    loginForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        loginError.style.display = "none";
      });
    });
  }
});

// --------------------------------------- Обробка форми реєстрації ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("reg-name").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;

      if (password !== confirmPassword) {
        showCustomAlert("Паролі не співпадають!");
        return;
      }

      const selectedRole = document.querySelector(".role-option.selected");
      const role = selectedRole.querySelector("h3").textContent.includes("працівника") ? "worker" : "employer";

      const allUsers = getRegisteredUsers().concat(users);
      if (allUsers.some((u) => u.email === email)) {
        alert("Користувач з такою поштою вже існує!");
        return;
      }

      saveRegisteredUser({
        email,
        password,
        role,
        name,
        avatar: name[0] || "U",
        isDemo: false,
        createdAt: new Date().toISOString(),
      });

      showCustomAlert("Реєстрація пройшла успішно! Тепер ви можете увійти використовуючи свій email та пароль.");

      registerForm.reset();

      document.querySelector(".alert-button").addEventListener(
        "click",
        function () {
          document.querySelector(".auth-tab:nth-child(1)").click();
        },
        { once: true }
      );
    });
  }
});

// --------------------------------------- Функція для кастомного алерту ---------------------------------------
function showCustomAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = alertBox.querySelector(".alert-message");
  const alertButton = alertBox.querySelector(".alert-button");

  alertMessage.textContent = message;
  alertBox.style.display = "flex";

  alertButton.onclick = function () {
    alertBox.style.display = "none";
  };
}

// --------------------------------------- Логіка для перемикання видимості пароля ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".toggle-password").forEach(function (eye) {
    eye.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const svg = this.querySelector("svg");
      if (input.type === "password") {
        input.type = "text";
        svg.innerHTML = `
          <ellipse cx="12" cy="12" rx="10" ry="7" stroke="#333" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="3" fill="#333"/>
        `;
      } else {
        input.type = "password";
        svg.innerHTML = `
          <path d="M1 12C3 7 8 3 12 3s9 4 11 9c-2 5-7 9-11 9S3 17 1 12z" stroke="#333" stroke-width="2" fill="none"/>
          <path d="M4 4l16 16" stroke="#333" stroke-width="2"/>
        `;
      }
    });
  });
});

// --------------------------------------- Збереження та відновлення даних для форм ---------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const loginFields = ["email", "password"];
  loginFields.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      const saved = localStorage.getItem("login_" + id);
      if (saved !== null) input.value = saved;
      input.addEventListener("input", function () {
        localStorage.setItem("login_" + id, this.value);
      });
    }
  });

  const registerFields = ["reg-name", "reg-email", "reg-phone", "reg-password", "reg-confirm-password"];
  registerFields.forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      const saved = localStorage.getItem("register_" + id);
      if (saved !== null) input.value = saved;
      input.addEventListener("input", function () {
        localStorage.setItem("register_" + id, this.value);
      });
    }
  });

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function () {
      loginFields.forEach((id) => localStorage.removeItem("login_" + id));
    });
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function () {
      registerFields.forEach((id) => localStorage.removeItem("register_" + id));
    });
  }
});
