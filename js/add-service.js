document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addServiceForm");
  const photoInput = document.getElementById("servicePhoto");
  const photoPreview = document.getElementById("photoPreview");
  const previewContainer = document.querySelector(".preview-container");

  photoInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.src = e.target.result;
        previewContainer.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const schedule = Array.from(document.querySelectorAll('input[type="checkbox"][value^="full_time"], input[type="checkbox"][value^="part_time"], input[type="checkbox"][value^="flexible"]'))
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const details = Array.from(document.querySelectorAll('input[type="checkbox"][value^="home_visits"], input[type="checkbox"][value^="own_transport"], input[type="checkbox"][value^="weekend"]'))
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const serviceData = {
      title: document.getElementById("serviceTitle").value,
      subtitle: document.getElementById("serviceSubtitle").value,
      experience: `${document.getElementById("experienceYears").value} років досвіду`,
      location: document.getElementById("location").value,
      schedule: schedule.join(", "),
      price: `${document.getElementById("servicePrice").value} грн/год`,
      details: details,
      image: photoPreview.src || "/api/placeholder/300/200",
      rating: {
        stars: "★★★★★",
        count: 0,
      },
    };

    console.log("Нова послуга:", serviceData);
    alert("Послугу успішно додано!");

    window.location.href = "/Course-work/html/profile.html";
  });
});
