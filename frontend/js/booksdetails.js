const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/bookdetails';
const addBookUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addbook';

let bookData = []; // Store book data for the chart

// Fetch and display existing books
async function fetchBooks() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch book data");
        }
        bookData = await response.json(); // Store the data
        updateBookTable(bookData);
        createChart(bookData); // Create chart after fetching data
    } catch (err) {
        showMessage(err.message, 'danger');
        console.log(err.message);
    } finally {
        showLoader(false);
    }
}

// Update the table with book data
function updateBookTable(data) {
    const tbody = document.querySelector("#booktable tbody");
    tbody.innerHTML = '';

    data.forEach(element => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${element.book_id}</td>
            <td>${element.title}</td>
            <td>${element.author_id}</td>
            <td>${element.category_id}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('addBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const book = {
        book_id: document.getElementById("book_id").value,
        title: document.getElementById("title").value,
        author_id: document.getElementById("author_id").value,
        category_id: document.getElementById("category_id").value
    };

    try {
        showLoader(true);
        const response = await fetch(addBookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || "Failed to add book");
        }

        showMessage(result, 'success');
        document.getElementById("addBookForm").reset();
        await fetchBooks(); // Refresh the table and chart
    } catch (err) {
        showMessage("❌ Error adding book.", 'danger');
        console.error(err);
    } finally {
        showLoader(false);
    }
});

// Chart functionality
let myChart; // Declare chart variable

function createChart(data) {
    const categoryCounts = {};
    data.forEach(book => {
        const categoryId = book.category_id;
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const chartData = Object.values(categoryCounts);

    const ctx = document.getElementById('bookChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Books',
                data: chartData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
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
    const submitBtn = document.querySelector('#addBookForm button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Book';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchBooks);
