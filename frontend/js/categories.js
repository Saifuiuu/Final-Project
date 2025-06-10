const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/categoriesdetails';
const addCategoryUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addcategory';

let categoriesData = []; // Store categories data for the chart
let myChart; // Declare chart variable

// GET categories
async function fetchCategories() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch category data");

        categoriesData = await response.json();
        updateCategoriesTable(categoriesData);
        createChart(categoriesData);
    } catch (err) {
        showMessage(err.message, 'danger');
        console.log(err.message);
    } finally {
        showLoader(false);
    }
}

// Update the table with categories data
function updateCategoriesTable(categories) {
    const tbody = document.querySelector("#categoriestable tbody");
    tbody.innerHTML = '';

    categories.forEach(category => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${category.category_id}</td>
                <td>${category.name}</td>
            `;
        tbody.appendChild(row);
    });
}

// POST category
document.getElementById("addCategoryForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const category = {
        category_id: document.getElementById("category_id").value,
        name: document.getElementById("category_name").value
    };

    try {
        showLoader(true);
        const response = await fetch(addCategoryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        });

        const msg = await response.text();

        if (!response.ok) {
            throw new Error(msg || "Error adding category");
        }

        showMessage(msg, 'success');
        document.getElementById("addCategoryForm").reset();
        await fetchCategories(); // Refresh data and chart
    } catch (err) {
        showMessage("Error adding category.", 'danger');
        console.error(err);
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createChart(data) {
    const categoryCounts = {};
    data.forEach(category => {
        const categoryName = category.name;
        categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const chartData = Object.values(categoryCounts);

    const ctx = document.getElementById('categoryChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Categories',
                data: chartData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

document.getElementById('chartButton').addEventListener('click', () => {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.style.display = chartContainer.style.display === 'none' ? 'block' : 'none';
});

// Helper functions
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `alert alert-${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function showLoader(show) {
    const submitBtn = document.querySelector('#addCategoryForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Category';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchCategories);
