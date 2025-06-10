// Fetch and display existing members (already done)
const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/membersdetails';
fetch(url)
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch member data");
    return response.json();
  })
  .then(data => {
    const tbody = document.querySelector("#memberstable tbody");
    data.forEach(element => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${element.member_id}</td>
        <td>${element.name}</td>
        <td>${element.contact}</td>
        <td>${element.membership_type}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.log(err.message));


// Function to post new member
document.querySelector("#memberForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const member = {
    member_id: document.querySelector("#member_id").value,
    name: document.querySelector("#name").value,
    contact: document.querySelector("#contact").value,
    membership_type: document.querySelector("#membership_type").value,
  };

  try {
    const res = await fetch('https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addmember', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(member)
    });

    const message = await res.text();
    alert(message);
    location.reload(); // Optional: reload to see new entry
  } catch (err) {
    console.error("Error adding member:", err);
    alert("Failed to add member.");
  }
});
