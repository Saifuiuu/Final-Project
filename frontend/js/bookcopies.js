const bookCopiesUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/bookcopiesdetails';
const addBookCopyUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addbookcopy';

let bookCopiesData = []; // Store book copies data for the chart
let myChart; // Declare chart variable

// Fetch and display book copies
async function fetchBookCopies() {
    try {
        showLoader(true);
        const response = await fetch(bookCopiesUrl);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        bookCopiesData = await response.json();
        updateBookCopiesTable(bookCopiesData);
        createConditionChart(bookCopiesData);
    } catch (error) {
        showMessage(`Failed to load book copies: ${error.message}`, 'danger');
        console.error('Fetch error:', error);
    } finally {
        showLoader(false);
    }
}

// Update the table with book copies data
function updateBookCopiesTable(bookCopies) {
    const tbody = document.querySelector("#bookcopiestable tbody");
    tbody.innerHTML = '';

    bookCopies.forEach(copy => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${copy.copy_id}</td>
            <td>${copy.book_id}</td>
            <td>${copy.condition}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('addBookCopyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookCopyData = {
        copy_id: document.getElementById('copy_id').value.trim(),
        book_id: document.getElementById('book_id').value.trim(),
        condition: document.getElementById('condition').value.trim()
    };

    try {
        showLoader(true);
        const response = await fetch(addBookCopyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookCopyData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || 'Failed to add book copy');
        }

        showMessage(result, 'success');
        document.getElementById('addBookCopyForm').reset();
        await fetchBookCopies(); // Refresh data and chart
    } catch (error) {
        showMessage(error.message, 'danger');
        console.error('Submission error:', error);
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createConditionChart(data) {
    const conditionCounts = {};
    data.forEach(copy => {
        const condition = copy.condition;
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });

    const labels = Object.keys(conditionCounts);
    const chartData = Object.values(conditionCounts);

    const ctx = document.getElementById('conditionChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'pie', // Changed to pie chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Copies',
                data: chartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
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
                    text: 'Book Copy Conditions'
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
    const submitBtn = document.querySelector('#addBookCopyForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Book Copy';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchBookCopies);
