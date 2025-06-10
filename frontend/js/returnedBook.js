const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/returnbookdetails';
const addReturnedBookUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addreturnedbook';

// Fetch and display returned books
async function fetchReturnedBooks() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch returned book data");
        }
        return response.json();
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
        fetchReturnedBooks(); // Refresh the table
    } catch (error) {
        showMessage(error.message, 'danger');
        console.error('Submission error:', error);
    } finally {
        showLoader(false);
    }
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
        const data = await fetchReturnedBooks();
        updateReturnedBookTable(data);
    } catch (error) {
        console.error("Error initializing:", error);
    }
});
