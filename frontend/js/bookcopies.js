const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/bookcopiesdetails';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch librarian  data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#bookcopiestable");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${element.copy_id} </td>
    <td>${element.book_id} </td>  
    <td>${element.condition}</td>
    `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});