document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("addOrderForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const orderData = {
      title: document.getElementById("orderTitle").value,
      category: document.getElementById("orderCategory").value,
      description: document.getElementById("orderDescription").value,
      schedule: document.getElementById("orderSchedule").value,
      budget: document.getElementById("orderBudget").value,
      urgency: document.querySelector('input[name="urgency"]:checked').value,
    };

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Створення...";

    setTimeout(() => {
      alert("Замовлення успішно створено!");
      window.location.href = "/Course-work/html/profile.html";
    }, 1500);
  });
});
