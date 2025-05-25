const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/librariendetails';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch reservations  data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#reservationstable");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${element.librarian_id} </td>
    <td>${element.name} </td>  
    <td>${element.email}</td>
    `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});