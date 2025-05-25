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
