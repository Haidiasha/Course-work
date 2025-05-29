document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");
  if (role === "worker") {
    document.querySelector(".role-employer").style.display = "none";
    document.querySelector(".role-worker").style.display = "block";
  } else {
    document.querySelector(".role-employer").style.display = "block";
    document.querySelector(".role-worker").style.display = "none";
  }

  const currentUser = localStorage.getItem("name") || "Ви";
  const chatId = "demo-chat";

  const messagesContainer = document.querySelector(".messages-container");
  const input = document.getElementById("chat-message");
  const sendBtn = document.getElementById("send-message");
  const attachInput = document.getElementById("chat-attach");

  function loadMessages() {
    const messages = JSON.parse(localStorage.getItem("chat_" + chatId) || "[]");
    messagesContainer.innerHTML = "";
    messages.forEach((msg) => {
      const div = document.createElement("div");
      div.className = "message " + (msg.sender === currentUser ? "sent" : "received");
      let contentHtml = "";
      if (msg.type === "image") {
        contentHtml = `<img src="${msg.content}" style="max-width:150px;max-height:150px;border-radius:10px;">`;
      } else if (msg.type === "video") {
        contentHtml = `<video controls style="max-width:180px;max-height:150px;border-radius:10px;"><source src="${msg.content}"></video>`;
      } else if (msg.type === "file") {
        contentHtml = `<a href="${msg.content}" download="${msg.fileName}" target="_blank" style="color:#007bff;text-decoration:underline;">📄 ${msg.fileName}</a>`;
      } else {
        contentHtml = `<p>${msg.content}</p>`;
      }
      div.innerHTML = `
        <div class="message-content">
          ${contentHtml}
        </div>
        <span class="message-time">${msg.time}</span>
      `;
      messagesContainer.appendChild(div);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function updateChatListPreview() {
    const activeChat = document.querySelector(".chat-item.active");
    if (!activeChat) return;

    const messages = JSON.parse(localStorage.getItem("chat_" + chatId) || "[]");
    if (messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    const lastMsgText = lastMsg.type === "text" ? lastMsg.content : lastMsg.type === "image" ? "📷 Фото" : lastMsg.type === "video" ? "🎬 Відео" : `📄 ${lastMsg.fileName || "Файл"}`;

    activeChat.querySelector(".chat-last-message").textContent = lastMsgText;
    activeChat.querySelector(".chat-time").textContent = lastMsg.time;
  }

  function saveMessage(msg) {
    const messages = JSON.parse(localStorage.getItem("chat_" + chatId) || "[]");
    messages.push(msg);
    localStorage.setItem("chat_" + chatId, JSON.stringify(messages));
    loadMessages();
    updateChatListPreview();
  }

  sendBtn.addEventListener("click", function () {
    const text = input.value.trim();
    if (!text) return;
    saveMessage({
      sender: currentUser,
      type: "text",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    input.value = "";
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") sendBtn.click();
  });

  attachInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type.startsWith("image/")) {
      reader.onload = function (e) {
        saveMessage({
          sender: currentUser,
          type: "image",
          content: e.target.result,
          fileName: file.name,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      reader.onload = function (e) {
        saveMessage({
          sender: currentUser,
          type: "video",
          content: e.target.result,
          fileName: file.name,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = function (e) {
        saveMessage({
          sender: currentUser,
          type: "file",
          content: e.target.result,
          fileName: file.name,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      };
      reader.readAsDataURL(file);
    }
    this.value = "";
  });

  function fakeReply() {
    setTimeout(() => {
      saveMessage({
        sender: "Олена Іванова",
        type: "text",
        content: "Дякую за повідомлення! Я відповім найближчим часом.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    }, 2000);
  }

  sendBtn.addEventListener("click", fakeReply);

  loadMessages();
});

document.addEventListener("DOMContentLoaded", function () {
  const isDemo = localStorage.getItem("isDemo") === "true";
  if (!isDemo) {
    document.querySelectorAll(".verification-status").forEach((block) => {
      const statusTitle = block.querySelector("strong");
      const statusDate = block.querySelector("div[style]");
      const icon = block.querySelector(".status-icon");
      if (statusTitle) statusTitle.textContent = "Проходить верифікація працівника...";
      if (statusDate) statusDate.textContent = "";
      if (icon) {
        icon.classList.remove("status-verified");
        icon.classList.add("status-pending");
      }
    });
    document.querySelectorAll(".rating-overview").forEach((block) => {
      const avg = block.querySelector(".rating-avg");
      const stars = block.querySelector(".rating-stars");
      const count = block.querySelector(".rating-count");
      if (avg) avg.textContent = "0.0";
      if (count) count.textContent = "0 відгуків";
      if (stars) {
        stars.innerHTML = "★★★★★";
        stars.style.color = "#ccc";
      }
    });
  }
});
