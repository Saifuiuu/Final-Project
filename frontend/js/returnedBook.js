const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/returnbookdetails';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch librarian  data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#returnedbooktable");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${element.return_id} </td>
    <td>${element.issue_id} </td>  
    <td>${element.return_date}</td>
    `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});