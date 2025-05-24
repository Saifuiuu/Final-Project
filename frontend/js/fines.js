const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/fines';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch fines data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#finetable");
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