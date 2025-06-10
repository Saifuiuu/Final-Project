const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/fines';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch fines data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#finetable tbody");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${element.fine_id} </td>
    <td>${element.return_id} </td>  
    <td>${element.amount}</td>
    <td>${element.paid} </td>  `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});
// POST new fine
document.getElementById("addFineForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const fine = {
        fine_id: document.getElementById("fine_id").value,
        return_id: document.getElementById("return_id").value,
        amount: document.getElementById("amount").value,
        paid: document.getElementById("paid").value === "true" // Convert to boolean
    };

    fetch('https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/addfine', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fine)
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        location.reload(); // Reload table after insert
    })
    .catch(err => {
        console.error(err);
        alert("❌ Error adding fine.");
    });
});
