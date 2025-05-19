function checkAuth(e) {
  const role = localStorage.getItem("role");
  const link = e.target.closest("a");

  if (link && link.getAttribute("href").includes("search.html")) {
    if (!role) {
      e.preventDefault();
      showAuthModal();
      return;
    }
    if (role === "admin") {
      e.preventDefault();
      showAdminBlockModal();
      return;
    }
  }
}

function showAuthModal() {
  const modal = document.createElement("div");
  modal.className = "auth-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Увійдіть до свого акаунту</h2>
        <p>Для перегляду послуг необхідно увійти або зареєструватися</p>
      </div>
      <div class="modal-actions">
        <a href="/Course-work/html/login.html?form=login" class="btn btn-outline">Увійти</a>
        <a href="/Course-work/html/login.html?form=register" class="btn btn-primary">Зареєструватися</a>
      </div>
      <button class="close-modal">&times;</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close-modal").onclick = () => document.body.removeChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal);
  };
}

function showAdminBlockModal() {
  const modal = document.createElement("div");
  modal.className = "auth-modal";
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Доступ заборонено</h2>
        <p>Адміністратор не має доступу до сторінки "Послуги"</p>
      </div>
      <button class="close-modal">&times;</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector(".close-modal").onclick = () => document.body.removeChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) document.body.removeChild(modal);
  };
}

function getComponentPath(file) {
  // если путь содержит /html/, значит мы в подпапке
  if (window.location.pathname.includes("/html/")) {
    return `../html/${file}`;
  }
  return `html/${file}`;
}

async function loadHeader() {
  const headerContainer = document.getElementById("header");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "Користувач";
  const avatar = localStorage.getItem("avatar") || "?";

  if (!role) {
    headerContainer.innerHTML = `
      <header>
        <div class="container">
          <div class="header-content">
            <a href="/Course-work/index.html" class="logo">Help<span>&</span>Home</a>
            <nav>
              <ul>
                <li><a href="/Course-work/index.html">Головна</a></li>
                <li><a href="/Course-work/html/search.html">Послуги</a></li>
                <li><a href="/Course-work/index.html#how-it-works">Як це працює</a></li>
                <li><a href="/Course-work/index.html#benefits">Про нас</a></li>
                <li><a href="/Course-work/index.html#contacts">Контакти</a></li>
              </ul>
            </nav>
            <div class="auth-buttons">
              <a href="/Course-work/html/login.html?form=login" class="btn btn-outline">Увійти</a>
              <a href="/Course-work/html/login.html?form=register" class="btn btn-primary">Зареєструватися</a>
            </div>
          </div>
        </div>
      </header>
    `;
  } else {
    let userMenuHtml = "";
    if (role === "admin") {
      userMenuHtml = `
        <div class="user-menu">
          <div class="user-avatar">${avatar}</div>
          <span>${name}</span>
          <div class="dropdown-menu">
            <a href="../html/analytics.html">Аналітика</a>
            <a href="#">Налаштування</a>
            <hr>
            <a href="#" id="logout">Вийти</a>
          </div>
        </div>
      `;
    } else {
      userMenuHtml = `
        <div class="user-menu">
          <div class="user-avatar">${avatar}</div>
          <span>${name}</span>
          <div class="dropdown-menu">
            <a href="/Course-work/html/profile.html">Мій профіль</a>
            <a href="/Course-work/html/edit-profile.html">Налаштування</a>
            <a href="/Course-work/html/chats.html">Мої повідомлення</a>
            <hr>
            <a href="#" id="logout">Вийти</a>
          </div>
        </div>
      `;
    }

    headerContainer.innerHTML = `
      <header>
        <div class="container">
          <div class="header-content">
            <a href="/Course-work/index.html" class="logo">Help<span>&</span>Home</a>
            <nav>
              <ul>
                <li><a href="/Course-work/index.html">Головна</a></li>
                <li><a href="/Course-work/html/search.html">Послуги</a></li>
                <li><a href="/Course-work/index.html#how-it-works">Як це працює</a></li>
                <li><a href="/Course-work/index.html#benefits">Про нас</a></li>
                <li><a href="/Course-work/index.html#contacts">Контакти</a></li>
              </ul>
            </nav>
            ${userMenuHtml}
          </div>
        </div>
      </header>
    `;

    const logoutButton = headerContainer.querySelector("#logout");
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "/Course-work/index.html";
    });
  }
}

async function loadFooter() {
  const response = await fetch(getComponentPath("footer.html"));
  const html = await response.text();
  document.getElementById("footer").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  loadHeader();
  loadFooter();
});

document.addEventListener("click", function (e) {
  checkAuth(e);
});
