const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/bookdetails';

// Fetch and display existing books
fetch(url)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch book data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#booktable tbody");
        data.forEach(element => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${element.book_id}</td>
                <td>${element.title}</td>  
                <td>${element.author_id}</td>
                <td>${element.category_id}</td>`;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
document.getElementById("addBookForm").addEventListener("submit", function (e) {
    e.preventDefault(); // ✅ This stops the form from submitting normally!

    const book = {
        book_id: document.getElementById("book_id").value,
        title: document.getElementById("title").value,
        author_id: document.getElementById("author_id").value,
        category_id: document.getElementById("category_id").value
    };

    fetch('https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addbook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    })
        .then(res => res.text())
        .then(msg => {
            alert(msg); // Show confirmation
            // Add the new book row to the table dynamically (optional)
            const tbody = document.querySelector("#booktable tbody");
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.book_id}</td>
                <td>${book.title}</td>
                <td>${book.author_id}</td>
                <td>${book.category_id}</td>`;
            tbody.appendChild(row);

            // Optionally clear form
            document.getElementById("addBookForm").reset();
        })
        .catch(err => {
            console.error(err);
            alert("❌ Error adding book.");
        });
});

