document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("documentForm");
  const fileInput = document.getElementById("documentFile");
  const previewImage = document.getElementById("previewImage");
  const fileName = document.getElementById("fileName");

  fileInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    fileName.textContent = file.name;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Завантаження...";

    setTimeout(() => {
      const documentData = {
        type: document.getElementById("documentType").value,
        name: document.getElementById("documentName").value,
        expiryDate: document.getElementById("expiryDate").value,
        description: document.getElementById("description").value,
        fileName: fileName.textContent,
      };

      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      documents.push(documentData);
      localStorage.setItem("documents", JSON.stringify(documents));

      alert("Документ успішно завантажено!");

      window.location.href = "/Course-work/html/profile.html";
    }, 2000);
  });
});
