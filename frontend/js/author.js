const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/authorsdetails';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch fines data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#authorstable");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    
    <td>${element.author_id}</td>
    <td>${element.name} </td>  `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});