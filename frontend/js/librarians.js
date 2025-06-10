const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/librariendetails';
const tbody = document.querySelector("#librarianstable tbody");

// Fetch and show all librarians
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch librarian data");
    return response.json();
  })
  .then(data => {
    data.forEach(element => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${element.librarian_id}</td>
        <td>${element.name}</td>
        <td>${element.email}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.log(err.message));

// Add new librarian
document.getElementById("librarianForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const librarian = {
    librarian_id: document.getElementById("librarian_id").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value
  };

  try {
    const response = await fetch("https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addlibrarian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(librarian)
    });

    if (!response.ok) throw new Error("Failed to add librarian");

    alert("✅ Librarian added successfully!");
    location.reload(); // Refresh the table
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
});
