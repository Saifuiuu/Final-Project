const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/issuedbookdetails';
const addIssuedBookUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addissuedbook'; // Add this line

// Fetch and display issued books
async function fetchIssuedBooks() {
    try {
        showLoader(true);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("failed to fetch issued book data");
        }
        return response.json();
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
        fetchIssuedBooks(); // Refresh the table
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
    const data = await fetchIssuedBooks();
    updateIssuedBookTable(data);
});
