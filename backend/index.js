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




app.listen(PORT, () => {
  console.log(`Connected successfully on PORT ${PORT}`);
});
