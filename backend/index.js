const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', async (req, res) => {
  try {
    res.send('Welcome to HR API');  // Use .send() for plain text
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
});

app.get('/authorsdetails', async (req,res)=>{
  try {
    const result= await pool.query('select * from authors');
    res.json( result.rows);
    
  } catch (error) {
    res.status(500).json({ERROR : error.message});
  }
});

app.get('/bookdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from books ');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ERROR : error.message});
  }
}
  
);

app.get('/fines', async (req,res)=>{
  try{
    const result= await pool.query('select * from fines ;');
    res.json(result.rows);
  }
  catch(error){
res.status(500).json({error:error.message});
  }
}); 


app.get('/issuedbookdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from issuedbooks ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
app.get('/librariendetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from librarians ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
app.get('/categoriesdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from categories ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
app.get('/bookcopiesdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from bookcopies ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});

app.get('/membersdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from members ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
app.get('/reservationsdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from reservations ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
app.get('/returnbookdetails', async(req,res)=>{
  try {
    const result= await pool.query('select * from returnedbooks ;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});


app.listen(PORT, () => {
  console.log(`Connected successfully on PORT ${PORT}`);
});
app.post('/addbook', async (req, res) => {
    const { book_id, title, author_id, category_id } = req.body;

    try {
        const query = 'INSERT INTO books (book_id, title, author_id, category_id) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [book_id, title, author_id, category_id]);
        res.send('✅ Book added successfully!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('❌ Error inserting book.');
    }
});
app.post('/addcategory', async (req, res) => {
    const { category_id, name } = req.body;

    try {
        const query = 'INSERT INTO categories (category_id, name) VALUES ($1, $2)';
        await pool.query(query, [category_id, name]);
        res.send('✅ Category added successfully!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('❌ Error inserting category.');
    }
});
app.post('/addfine', async (req, res) => {
    const { fine_id, return_id, amount, paid } = req.body;

    try {
        const query = 'INSERT INTO fines (fine_id, return_id, amount, paid) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [fine_id, return_id, amount, paid]);
        res.send('✅ Fine added successfully!');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('❌ Error inserting fine.');
    }
});

app.post('/addmember', async (req, res) => {
  const { member_id, name, contact, membership_type } = req.body;

  try {
    const query = `
      INSERT INTO members (member_id, name, contact, membership_type)
      VALUES ($1, $2, $3, $4)
    `;
    await pool.query(query, [member_id, name, contact, membership_type]);
    res.send('✅ Member added successfully!');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('❌ Error inserting member.');
  }
});

app.post('/addlibrarian', async (req, res) => {
  const { librarian_id, name, email } = req.body;

  try {
    const query = `
      INSERT INTO librarians (librarian_id, name, email)
      VALUES ($1, $2, $3)
    `;
    await pool.query(query, [librarian_id, name, email]);
    res.send("✅ Librarian added successfully!");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("❌ Error inserting librarian.");
  }
});
