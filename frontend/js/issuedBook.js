const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/issuedbookdetails';
const addIssuedBookUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addissuedbook';

let issuedBooksData = []; // Store issued books data for the chart
let myChart; // Declare chart variable

// Fetch and display issued books
async function fetchIssuedBooks() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch issued book data");
        }

        issuedBooksData = await response.json();
        updateIssuedBookTable(issuedBooksData);
        createChart(issuedBooksData);
    } catch (err) {
        showMessage(err.message, 'danger');
        console.log(err.message);
    } finally {
        showLoader(false);
    }
}

function updateIssuedBookTable(data) {
    const tbody = document.querySelector("#issuedBooktable tbody");
    tbody.innerHTML = '';

    data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${element.issue_id}</td>
            <td>${element.book_id}</td>
            <td>${element.member_id}</td>
            <td>${element.issue_date}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('addIssuedBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const issuedBookData = {
        issue_id: document.getElementById('issue_id').value.trim(),
        book_id: document.getElementById('book_id').value.trim(),
        member_id: document.getElementById('member_id').value.trim(),
        issue_date: document.getElementById('issue_date').value.trim()
    };

    try {
        showLoader(true);
        const response = await fetch(addIssuedBookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issuedBookData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || 'Failed to add issued book');
        }

        showMessage(result, 'success');
        document.getElementById('addIssuedBookForm').reset();
        await fetchIssuedBooks(); // Refresh the table and chart
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
        const issueDate = new Date(item.issue_date);
        const monthYear = `${issueDate.getFullYear()}-${issueDate.getMonth() + 1}`; // Year-Month

        monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    const labels = Object.keys(monthlyCounts).sort(); // Sort months
    const chartData = labels.map(month => monthlyCounts[month]);

    const ctx = document.getElementById('issuedBookChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'line', // Changed to line chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Issued Books',
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
    const submitBtn = document.querySelector('#addIssuedBookForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Issued Book';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchIssuedBooks();
        updateIssuedBookTable(data);
    } catch (error) {
        showMessage("Failed to load issued books. Please check the API endpoint.", 'danger');
        console.error("Error fetching issued books:", error);
    }
});
