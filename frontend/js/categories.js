const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/categoriesdetails';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch librarian  data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#categoriestable");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${element.category_id} </td>
    <td>${element.name} </td>  
    
    `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});