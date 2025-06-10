const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/fines';
const addFineUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addfine';

let finesData = []; // Store fines data for the chart
let myChart; // Declare chart variable

// Fetch and display fines
async function fetchFines() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch fines data");
        finesData = await response.json();
        updateFinesTable(finesData);
        createChart(finesData);
    } catch (err) {
        showMessage(err.message, 'danger');
        console.log(err.message);
    } finally {
        showLoader(false);
    }
}

// Update the table with fines data
function updateFinesTable(data) {
    const tbody = document.querySelector("#finetable tbody");
    tbody.innerHTML = '';

    data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>${element.fine_id} </td>
    <td>${element.return_id} </td>  
    <td>${element.amount}</td>
    <td>${element.paid} </td>  `;
        tbody.appendChild(row);
    });
}

// POST new fine
document.getElementById("addFineForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fine = {
        fine_id: document.getElementById("fine_id").value,
        return_id: document.getElementById("return_id").value,
        amount: document.getElementById("amount").value,
        paid: document.getElementById("paid").value === "true" // Convert to boolean
    };

    try {
        showLoader(true);
        const response = await fetch(addFineUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fine)
        });

        if (!response.ok) throw new Error("Failed to add fine");

        showMessage("✅ Fine added successfully!", 'success');
        document.getElementById("addFineForm").reset();
        await fetchFines(); // Refresh data and chart
    } catch (err) {
        showMessage("❌ Error adding fine.", 'danger');
        console.error(err);
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createChart(data) {
    let paidAmount = 0;
    let unpaidAmount = 0;

    data.forEach(fine => {
        if (fine.paid) {
            paidAmount += fine.amount;
        } else {
            unpaidAmount += fine.amount;
        }
    });

    const ctx = document.getElementById('finesChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Paid', 'Unpaid'],
            datasets: [{
                label: 'Amount',
                data: [paidAmount, unpaidAmount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)', // blue
                    'rgba(255, 99, 132, 0.8)'  // red
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Total Fines: Paid vs. Unpaid'
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
    const submitBtn = document.querySelector('#addFineForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Fine';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchFines);
