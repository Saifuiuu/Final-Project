const reservationsUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/reservationsdetails';
const addReservationUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addreservation';

let reservationsData = []; // Store reservations data for the chart
let myChart; // Declare chart variable

// Fetch and display reservations
async function fetchReservations() {
    try {
        showLoader(true);
        const response = await fetch(reservationsUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        reservationsData = await response.json();
        updateReservationsTable(reservationsData);
        createChart(reservationsData);
    } catch (error) {
        showMessage(error.message, 'danger');
        console.error('Error:', error);
    } finally {
        showLoader(false);
    }
}

// Update the table with reservations data
function updateReservationsTable(data) {
    const tbody = document.querySelector("#reservationstable tbody");
    tbody.innerHTML = '';

    data.forEach(reservation => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${reservation.reservation_id}</td>
                <td>${reservation.book_id}</td>
                <td>${reservation.member_id}</td>
                <td>${reservation.reservation_date}</td>
            `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('reservationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const reservationData = {
        reservation_id: document.getElementById('reservation_id').value,
        book_id: document.getElementById('book_id').value,
        member_id: document.getElementById('member_id').value,
        reservation_date: document.getElementById('reservation_date').value
    };

    try {
        showLoader(true);
        const response = await fetch(addReservationUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });

        if (!response.ok) throw new Error('Failed to add reservation');

        const result = await response.text();
        showMessage(result, 'success');
        document.getElementById('reservationForm').reset();
        await fetchReservations(); // Refresh the table and chart
    } catch (error) {
        showMessage(error.message, 'danger');
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createChart(data) {
    const monthlyCounts = {};

    data.forEach(item => {
        const reservationDate = new Date(item.reservation_date);
        const monthYear = `${reservationDate.getFullYear()}-${reservationDate.getMonth() + 1}`; // Year-Month

        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    const labels = Object.keys(monthlyCounts).sort(); // Sort months
    const chartData = labels.map(month => monthlyCounts[month]);

    const ctx = document.getElementById('reservationsChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'line', // Changed to line chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Reservations',
                data: chartData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
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

// Show message function
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `alert alert-${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function showLoader(show) {
    const submitBtn = document.querySelector('#reservationForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Reservation';
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchReservations();
    } catch (error) {
        showMessage("Failed to load reservations. Please check the API endpoint.", 'danger');
        console.error("Error fetching reservations:", error);
    }
});
