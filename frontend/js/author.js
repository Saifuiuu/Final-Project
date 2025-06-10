const authorsUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/authorsdetails';
const addAuthorUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addauthor';

// Fetch and display authors
async function fetchAuthors() {
    try {
        showLoader(true);
        const response = await fetch(authorsUrl);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        updateAuthorsTable(data);
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
    tbody.innerHTML = '';
    
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
    e.preventDefault();
    
    const authorData = {
        author_id: document.getElementById('author_id').value.trim(),
        name: document.getElementById('author_name').value.trim()
    };
    
    try {
        showLoader(true);
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
        await fetchAuthors();
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
