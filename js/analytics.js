document.addEventListener("DOMContentLoaded", function () {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    window.location.href = "/index.html";
    return;
  }

  const mockData = {
    week: {
      general: {
        users: 234,
        activeOrders: 156,
        completedOrders: 567,
      },
      financial: {
        monthlyRevenue: 54567,
        commission: 10678,
      },
      activity: {
        successRate: 87,
        averageRating: 4.6,
      },
    },
    month: {
      general: {
        users: 1234,
        activeOrders: 856,
        completedOrders: 2567,
      },
      financial: {
        monthlyRevenue: 234567,
        commission: 45678,
      },
      activity: {
        successRate: 89,
        averageRating: 4.8,
      },
    },
    quarter: {
      general: {
        users: 3456,
        activeOrders: 2156,
        completedOrders: 5678,
      },
      financial: {
        monthlyRevenue: 567890,
        commission: 98765,
      },
      activity: {
        successRate: 91,
        averageRating: 4.9,
      },
    },
    year: {
      general: {
        users: 12567,
        activeOrders: 8234,
        completedOrders: 24890,
      },
      financial: {
        monthlyRevenue: 2345678,
        commission: 456789,
      },
      activity: {
        successRate: 93,
        averageRating: 4.9,
      },
    },
  };

  function updateRevenueLabel(period) {
    const label = document.getElementById("revenue-label");
    if (!label) return;
    switch (period) {
      case "week":
        label.textContent = "Тижневий оборот";
        break;
      case "month":
        label.textContent = "Місячний оборот";
        break;
      case "quarter":
        label.textContent = "Квартальний оборот";
        break;
      case "year":
        label.textContent = "Річний оборот";
        break;
      default:
        label.textContent = "Оборот";
    }
  }

  function getRandomizedData(data) {
    const newData = JSON.parse(JSON.stringify(data));

    if (newData.general) {
      newData.general.users += Math.floor(Math.random() * 20 - 10);
      newData.general.activeOrders += Math.floor(Math.random() * 20 - 10);
      newData.general.completedOrders += Math.floor(Math.random() * 30);
      if (newData.general.users < 0) newData.general.users = 0;
      if (newData.general.activeOrders < 0) newData.general.activeOrders = 0;
    }

    if (newData.financial) {
      newData.financial.monthlyRevenue += Math.floor(Math.random() * 10000 - 5000);
      newData.financial.commission += Math.floor(Math.random() * 2000 - 1000);
      if (newData.financial.monthlyRevenue < 0) newData.financial.monthlyRevenue = 0;
      if (newData.financial.commission < 0) newData.financial.commission = 0;
    }

    if (newData.activity) {
      newData.activity.successRate += Math.floor(Math.random() * 3 - 1);
      newData.activity.averageRating += Math.random() * 0.2 - 0.1;
      if (newData.activity.successRate < 0) newData.activity.successRate = 0;
      if (newData.activity.successRate > 100) newData.activity.successRate = 100;
      if (newData.activity.averageRating < 1) newData.activity.averageRating = 1;
      if (newData.activity.averageRating > 5) newData.activity.averageRating = 5;
    }

    return newData;
  }

  function updateStatistics() {
    const period = document.getElementById("period-select").value;
    const dataType = document.getElementById("data-type-select").value;

    updateRevenueLabel(period);

    const data = getRandomizedData(mockData[period]);

    if (data) {
      if (dataType === "general" || dataType === "all") {
        document.querySelectorAll(".stats-section")[0].style.display = "block";
        updateGeneralStats(data.general);
      } else {
        document.querySelectorAll(".stats-section")[0].style.display = "none";
      }

      if (dataType === "financial" || dataType === "all") {
        document.querySelectorAll(".stats-section")[1].style.display = "block";
        updateFinancialStats(data.financial);
      } else {
        document.querySelectorAll(".stats-section")[1].style.display = "none";
      }

      if (dataType === "activity" || dataType === "all") {
        document.querySelectorAll(".stats-section")[2].style.display = "block";
        updateActivityStats(data.activity);
      } else {
        document.querySelectorAll(".stats-section")[2].style.display = "none";
      }
    }
  }

  function updateGeneralStats(data) {
    const statValues = document.querySelectorAll(".stats-section:nth-child(1) .stat-value");
    statValues[0].textContent = data.users.toLocaleString();
    statValues[1].textContent = data.activeOrders.toLocaleString();
    statValues[2].textContent = data.completedOrders.toLocaleString();
  }

  function updateFinancialStats(data) {
    const statValues = document.querySelectorAll(".stats-section:nth-child(2) .stat-value");
    statValues[0].textContent = `₴${data.monthlyRevenue.toLocaleString()}`;
    statValues[1].textContent = `₴${data.commission.toLocaleString()}`;
  }

  function updateActivityStats(data) {
    const statValues = document.querySelectorAll(".stats-section:nth-child(3) .stat-value");
    statValues[0].textContent = `${data.successRate}%`;
    statValues[1].textContent = data.averageRating.toFixed(1);
  }

  document.getElementById("update-stats").addEventListener("click", updateStatistics);
  document.getElementById("period-select").addEventListener("change", updateStatistics);
  document.getElementById("data-type-select").addEventListener("change", updateStatistics);

  updateStatistics();

  const exportBtn = document.getElementById("export-report");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      const analyticsBlock = document.querySelector(".stats-grid");
      const opt = {
        margin: 0.5,
        filename: "analytics-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 0.9 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(analyticsBlock).save();
    });
  }
});
