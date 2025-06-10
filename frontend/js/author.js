const authorsUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/authorsdetails';
const addAuthorUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addauthor';

let authorData = []; // Store author data for the chart
let myChart; // Declare chart variable

// Fetch and display authors
async function fetchAuthors() {
    try {
        showLoader(true);// to show loading
        const response = await fetch(authorsUrl);//getting data form url ans saving to respnse in the form of object

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        authorData = await response.json();
        updateAuthorsTable(authorData);
        createChart(authorData);
    } catch (error) {
        showMessage(`Failed to load authors: ${error.message}`, 'danger');
        console.error('Fetch error:', error);
    } finally {
        showLoader(false);
    }
}

// Update the table with authors data
function updateAuthorsTable(authors) {
    const tbody = document.querySelector("#authorstable tbody");
    tbody.innerHTML = '';// remving old rows

    authors.forEach(author => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${author.author_id}</td>
            <td>${author.name}</td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission
document.getElementById('addAuthorForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // remove default submission of form


    //getting user input values and saving to object name author data
    const authorData = {
        author_id: document.getElementById('author_id').value.trim(),
        name: document.getElementById('author_name').value.trim()
    };

    try {
        showLoader(true); //show loading
        //post request to backend
        const response = await fetch(addAuthorUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authorData)
        });

        const result = await response.text();

        if (!response.ok) {
            throw new Error(result || 'Failed to add author');
        }

        showMessage(result, 'success');
        document.getElementById('addAuthorForm').reset();
        await fetchAuthors(); // Refresh data and chart
    } catch (error) {
        showMessage(error.message, 'danger');
        console.error('Submission error:', error);
    } finally {
        showLoader(false);
    }
});

// Chart functionality
function createChart(data) {
    const authorCounts = {};
    data.forEach(author => {
        const authorName = author.name;
        authorCounts[authorName] = (authorCounts[authorName] || 0) + 1;
    });

    const labels = Object.keys(authorCounts);
    const chartData = Object.values(authorCounts);

    const ctx = document.getElementById('authorChart').getContext('2d');

    if (myChart) {
        myChart.destroy(); // Destroy existing chart
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Authors',
                data: chartData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
    const loader = document.getElementById('loader');
    const submitBtn = document.querySelector('#addAuthorForm button[type="submit"]');
    if (show) {
        loader.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
    } else {
        loader.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Author';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchAuthors);
