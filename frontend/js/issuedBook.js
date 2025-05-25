const url='https://zany-disco-jjj9pqw575gp2pvx7-6006.app.github.dev/issuedbookdetails';
fetch(url).then(
    response=>{
        if(!response.ok)
            throw new Error("failed to fetch issued book  data");
            return response.json();
        
    }
).then(data=>{
    const tbody=document.querySelector("#issuedBooktable");
data.forEach(element => {
    const row=document.createElement("tr");
    row.innerHTML=`
    <td>${element.issue_id} </td>
    <td>${element.book_id} </td>  
    <td>${element.member_id}</td>
    <td>${element.issue_date} </td>  `           
    
    ;
    tbody.appendChild(row);
});
}).catch(err=>{
    console.log(err.message);
});