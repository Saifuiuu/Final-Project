const bookCopiesUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/bookcopiesdetails';
const addBookCopyUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addbookcopy';

// Fetch and display book copies
async function fetchBookCopies() {
    try {
        showLoader(true);
        const response = await fetch(bookCopiesUrl);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        updateBookCopiesTable(data);
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
        await fetchBookCopies();
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