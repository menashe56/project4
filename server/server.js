const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const cors = require('cors');
const winston = require('winston');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);

// Configure Winston logger
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server_logs.log' }),
  ],
});

// Enable CORS for all routes
const corsOptions = {
  origin: '*',  // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

// MySQL configuration
const pool = mysql.createPool({
  host: '172.31.31.235',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get('/check-auth', async (req, res) => {
  try {
    // Check if the user has a valid session
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.json({ success: false });
    }

    const [sessionRows] = await sessionsPool.execute('SELECT * FROM sessions WHERE id = ?', [sessionId]);

    if (sessionRows.length === 0) {
      return res.json({ success: false });
    }

    // Assuming you have a users table
    const [userRows] = await pool.execute('SELECT * FROM users WHERE id = ?', [sessionRows[0].user_id]);

    if (userRows.length === 0) {
      return res.json({ success: false });
    }

    // User is authenticated
    return res.json({ success: true });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Fetch user from database based on email
    const [userRows] = await pool.execute('SELECT * FROM UserProfile WHERE email = ?', [email]);

    if (userRows.length === 0) {
      return res.json({ success: false, error: 'Invalid email or password' });
    }

    const user = userRows[0];

    // Check password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid email or password' });
    }

    // User is authenticated
    return res.json({
      success: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        age: user.age,
        picture_url: user.picture_url,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password, age, picture_url } = req.body;

    // Validate name, email, and password
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    // Check if the email is already in use
    const [existingUserRows] = await pool.execute('SELECT * FROM UserProfile WHERE email = ?', [email]);

    if (existingUserRows.length > 0) {
      return res.json({ success: false, error: 'Email is already in use' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [insertUserResult] = await pool.execute(
      'INSERT INTO UserProfile (email, password_hash, name, age, picture_url) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, age || null, picture_url || null]
    );

    // Check if the user was inserted successfully
    if (insertUserResult.affectedRows === 1) {
      // Registration successful
      return res.json({ success: true });
    } else {
      return res.json({ success: false, error: 'Registration failed' });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// HTTP endpoint for your app to send messages
app.post('/api/send-message', (req, res) => {
  const { message } = req.body;

  // Process the message, e.g., store it in a database or send it via Socket.IO
  // Send a response if needed

  logger.info(`Message sent successfully: ${message}`);
  res.json({ success: true, message: 'Message sent successfully' });
});

// Existing HTTP endpoints
app.get('/api/fetch', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM messages');
    res.status(200).json(rows);
  } catch (error) {
    logger.error('Error fetching data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/insert', async (req, res) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');  // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  try {
    const { content } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!content) {
      logger.error('Content is required');
      return res.status(400).json({ error: 'Content is required' });
    }

    const query = 'INSERT INTO messages (content) VALUES (?)';
    const values = [content];

    await pool.execute(query, values);

    logger.info('Data inserted successfully');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    logger.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

server.listen(3000, '0.0.0.0', (error) => {
  if (error) {
    console.error('Error starting server:', error);
    logger.error('Error starting server:', error);
  } else {
    console.log('Server is running on port 3000');
    logger.info('Server is running on port 3000');
  }
});
