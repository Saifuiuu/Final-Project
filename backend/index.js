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


app.post('/addreservation', async (req, res) => {
    const { reservation_id, book_id, member_id, reservation_date } = req.body;

    try {
        const query = `
            INSERT INTO reservations (reservation_id, book_id, member_id, reserve_date)
            VALUES ($1, $2, $3, $4)
        `;
        await pool.query(query, [reservation_id, book_id, member_id, reservation_date]);
        res.send("✅ Reservation added successfully!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("❌ Error inserting reservation.");
    }
});
// Add this to your Express server (app.js)
app.post('/addbookcopy', async (req, res) => {
    const { copy_id, book_id, condition } = req.body;

    try {
        // Validate required fields
        if (!copy_id || !book_id || !condition) {
            return res.status(400).send("❌ All fields are required");
        }

        const query = `
            INSERT INTO bookcopies (copy_id, book_id, condition)
            VALUES ($1, $2, $3)
            RETURNING *`;
        
        const result = await pool.query(query, [copy_id, book_id, condition]);
        
        res.status(201).send("✅ Book copy added successfully!");
    } catch (err) {
        console.error('Database error:', err.message);
        
        // Handle duplicate key error specifically
        if (err.code === '23505') {
            return res.status(400).send("❌ Copy ID already exists");
        }
        
        res.status(500).send("❌ Error adding book copy: " + err.message);
    }
});
// Add this to your Express server (app.js)
app.post('/addauthor', async (req, res) => {
    const { author_id, name } = req.body;

    try {
        // Validate required fields
        if (!author_id || !name) {
            return res.status(400).send("❌ All fields are required");
        }

        const query = `
            INSERT INTO authors (author_id, name)
            VALUES ($1, $2)
            RETURNING *`;
        
        const result = await pool.query(query, [author_id, name]);
        
        res.status(201).send("✅ Author added successfully!");
    } catch (err) {
        console.error('Database error:', err.message);
        
        // Handle duplicate key error specifically
        if (err.code === '23505') {
            return res.status(400).send("❌ Author ID already exists");
        }
        
        res.status(500).send("❌ Error adding author: " + err.message);
    }
});
app.post('/addissuedbook', async (req, res) => {
    const { issue_id, book_id, member_id, issue_date } = req.body;

    try {
        // Validate required fields
        if (!issue_id || !book_id || !member_id || !issue_date) {
            return res.status(400).send("❌ All fields are required");
        }

        const query = `
            INSERT INTO issuedbooks (issue_id, book_id, member_id, issue_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *`;

        const result = await pool.query(query, [issue_id, book_id, member_id, issue_date]);

        res.status(201).send("✅ Issued book added successfully!");
    } catch (err) {
        console.error('Database error:', err.message);

        // Handle duplicate key error specifically
        if (err.code === '23505') {
            return res.status(400).send("❌ Issue ID already exists");
        }

        res.status(500).send("❌ Error adding issued book: " + err.message);
    }
});
app.post('/addreturnedbook', async (req, res) => {
    const { return_id, issue_id, return_date } = req.body;

    try {
        // Validate required fields
        if (!return_id || !issue_id || !return_date) {
            return res.status(400).send("❌ All fields are required");
        }

        const query = `
            INSERT INTO returnedbooks (return_id, issue_id, return_date)
            VALUES ($1, $2, $3)
            RETURNING *`;

        const result = await pool.query(query, [return_id, issue_id, return_date]);

        res.status(201).send("✅ Returned book added successfully!");
    } catch (err) {
        console.error('Database error:', err.message);

        // Handle duplicate key error specifically
        if (err.code === '23505') {
            return res.status(400).send("❌ Return ID already exists");
        }

        res.status(500).send("❌ Error adding returned book: " + err.message);
    }
});

