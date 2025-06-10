const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/returnbookdetails';
const addReturnedBookUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addreturnedbook';

let returnedBooksData = []; // Store returned books data for the chart
let myChart; // Declare chart variable

// Fetch and display returned books
async function fetchReturnedBooks() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch returned book data");
        }
        returnedBooksData = await response.json();
        updateReturnedBookTable(returnedBooksData);
        createChart(returnedBooksData);
    } catch (err) {
        showMessage(err.message, 'danger');
        console.log(err.message);
    } finally {
        showLoader(false);
    }
}

function updateReturnedBookTable(data) {
    const tbody = document.querySelector("#returnedbooktable tbody");
    tbody.innerHTML = '';

    data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${element.return_id}</td>
            <td>${element.issue_id}</td>
            <td>${element.return_date}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('addReturnedBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const returnedBookData = {
        return_id: document.getElementById('return_id').value.trim(),
        issue_id: document.getElementById('issue_id').value.trim(),
        return_date: document.getElementById('return_date').value.trim()
    };

    try {
        showLoader(true);
        const response = await fetch(addReturnedBookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(returnedBookData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || 'Failed to add returned book');
        }

        showMessage(result, 'success');
        document.getElementById('addReturnedBookForm').reset();
        await fetchReturnedBooks(); // Refresh the table and chart
    } catch (error) {
        showMessage(error.message, 'danger');
        console.error('Submission error:', error);
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createChart(data) {
    const monthlyCounts = {};

    data.forEach(item => {
        const returnDate = new Date(item.return_date);
        const monthYear = `${returnDate.getFullYear()}-${returnDate.getMonth() + 1}`; // Year-Month

        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    const labels = Object.keys(monthlyCounts).sort(); // Sort months
    const chartData = labels.map(month => monthlyCounts[month]);

    const ctx = document.getElementById('returnedBookChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'line', // Changed to line chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Returned Books',
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
    const submitBtn = document.querySelector('#addReturnedBookForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Returned Book';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchReturnedBooks();
    } catch (error) {
        console.error("Error initializing:", error);
    }
});
