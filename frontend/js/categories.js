const url = 'https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/categoriesdetails';

// GET categories
fetch(url)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch category data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#categoriestable tbody");
        data.forEach(category => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${category.category_id}</td>
                <td>${category.name}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));

// POST category
document.getElementById("addCategoryForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const category = {
        category_id: document.getElementById("category_id").value,
        name: document.getElementById("category_name").value
    };

    fetch('https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addcategory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    })
        .then(res => res.text())
        .then(msg => {
            alert(msg);
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert("Error adding category.");
        });
});
