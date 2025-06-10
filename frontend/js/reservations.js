const reservationsUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/reservationsdetails';
const addReservationUrl = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addreservation';

// Fetch and display reservations
async function fetchReservations() {
    try {
        const response = await fetch(reservationsUrl);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
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
    } catch (error) {
        console.error('Error:', error);
    }
}

// Handle form submission
document.getElementById('reservationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const reservationData = {
        reservation_id: document.getElementById('reservation_id').value,
        book_id: document.getElementById('book_id').value,
        member_id: document.getElementById('member_id').value,
        reservation_date: document.getElementById('reservation_date').value
    };
    
    try {
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
        fetchReservations();
    } catch (error) {
        showMessage(error.message, 'danger');
    }
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

// Initial load
fetchReservations();