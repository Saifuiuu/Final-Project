const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/librariendetails';
const addLibrarianUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addlibrarian';

let librariansData = []; // Store librarians data for the chart
let myChart; // Declare chart variable

// Fetch and show all librarians
async function fetchLibrarians() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch librarian data");
        librariansData = await response.json();
        updateLibrariansTable(librariansData);
        createChart(librariansData);
    } catch (err) {
        showMessage(err.message, 'danger');
        console.log(err.message);
    } finally {
        showLoader(false);
    }
}

// Update the table with librarians data
function updateLibrariansTable(data) {
    const tbody = document.querySelector("#librarianstable tbody");
    tbody.innerHTML = '';

    data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${element.librarian_id}</td>
        <td>${element.name}</td>
        <td>${element.email}</td>
      `;
        tbody.appendChild(row);
    });
}

// Add new librarian
document.getElementById("librarianForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const librarian = {
        librarian_id: document.getElementById("librarian_id").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value
    };

    try {
        showLoader(true);
        const response = await fetch(addLibrarianUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(librarian)
        });

        if (!response.ok) throw new Error("Failed to add librarian");

        showMessage("✅ Librarian added successfully!", 'success');
        document.getElementById("librarianForm").reset();
        await fetchLibrarians(); // Refresh data and chart
    } catch (error) {
        showMessage("❌ Error: " + error.message, 'danger');
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createChart(data) {
    const librarianCounts = {};
    data.forEach(librarian => {
        const librarianName = librarian.name;
        librarianCounts[librarianName] = (librarianCounts[librarianName] || 0) + 1;
    });

    const labels = Object.keys(librarianCounts);
    const chartData = Object.values(librarianCounts);

    const ctx = document.getElementById('librarianChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Librarians',
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
    const submitBtn = document.querySelector('#librarianForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Librarian';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchLibrarians);
