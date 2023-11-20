const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const cors = require('cors');
const winston = require('winston');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // Added for generating unique session ID
const cookieParser = require('cookie-parser'); // Add this line

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
  origin: 'http://localhost:19006',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

// Function to parse JSON string safely
function parseParticipants(participants) {
  try {
    return JSON.parse(participants);
  } catch (error) {
    console.error('Error parsing participants:', error);
    return [];
  }
}

// Generate a unique session ID
const generateSessionId = () => {
  return uuidv4();
};

app.get('/api/check-auth', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  try {
    // Check if the user has a valid session
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      console.log('sessionId is undified - ', sessionId);
      return res.json({ success: false });
    }

    const [sessionRows] = await pool.execute('SELECT * FROM sessions WHERE id = ?', [sessionId]);

    if (sessionRows.length === 0) {
      console.log('this is the first login');
      return res.json({ success: false });
    }

    // Assuming you have a users table
    const [userRows] = await pool.execute('SELECT * FROM UserProfile WHERE user_id = ?', [sessionRows[0].user_id]);

    if (userRows.length === 0) {
      console.log('no found');
      return res.json({ success: false });
    }
    // User is authenticated
    return res.json({
     success: true,
     user: {
      user_id: userRows[0].user_id,
      email: userRows[0].email,
      name: userRows[0].name,
      age: userRows[0].age,
      picture_url: userRows[0].picture_url,
      },
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials

  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Fetch user from the database based on email
    const [userRows] = await pool.execute('SELECT * FROM UserProfile WHERE email = ?', [email]);

    if (userRows.length === 0) {
      return res.json({ success: false, error: 'Invalid email or password' });
    }

    const user = userRows[0];

    // Check the password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.json({ success: false, error: 'Invalid email or password' });
    }

    // Generate a unique session ID
    const sessionId = generateSessionId();

    // Store the session ID in the sessions table
    await pool.execute('INSERT INTO sessions (id, user_id) VALUES (?, ?)', [sessionId, user.user_id]);

    // Set the session ID as a cookie in the response
    res.cookie('sessionId', sessionId, { httpOnly: true });

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

app.post('/api/register', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  try {
    const { name, email, password, age, picture_url } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!name || !email || !password) {
      logger.error('Name, email, and password are required');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if the email is already in use
    const [existingUserRows] = await pool.execute('SELECT * FROM UserProfile WHERE email = ?', [email]);

    if (existingUserRows.length > 0) {
      logger.error('Email is already in use');
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [insertResult] = await pool.execute(
      'INSERT INTO UserProfile (email, password_hash, name, age, picture_url) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, age || '', picture_url || '']
    );

    // Generate a unique session ID
    const sessionId = generateSessionId();

    // Store the session ID in the sessions table
    await pool.execute('INSERT INTO sessions (id, user_id) VALUES (?, ?)', [sessionId, insertResult.insertId]);

    // Set the session ID as a cookie in the response
    res.cookie('sessionId', sessionId, { httpOnly: true });

    logger.info('Data inserted successfully');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    logger.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chats', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Fetch the list of chats from your database
    const [chatsRows] = await pool.execute('SELECT * FROM Chat');
    const chats = chatsRows.map((chat) => ({
      id: chat.id,
      data: {
        chatName: chat.chat_name, // Adjust this based on your database structure
        // Add other chat data as needed
      },
    }));

    res.status(200).json(chats);
  } catch (error) {
    logger.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route for creating a new chat
app.post('/api/create-chat', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  try {
    const { chatName } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!chatName) {
      logger.error('Chat name is required');
      return res.status(400).json({ error: 'Chat name is required' });
    }

    // Insert the new chat into the database
    const [insertResult] = await pool.execute(
      'INSERT INTO Chat (chat_name) VALUES (?)',
      [chatName]
    );

    logger.info('Chat created successfully');
    res.status(200).json({ success: true, message: 'Chat created successfully' });
  } catch (error) {
    logger.error('Error creating chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Fetch messages for the specified chat from the database
    const [messages] = await pool.execute('SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp DESC', [chatId]);

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chats/:chatId/send-message', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId, message } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!userId || !message) {
      logger.error('User ID and message are required');
      return res.status(400).json({ error: 'User ID and message are required' });
    }

    // Insert the new message into the database
    await pool.execute(
      'INSERT INTO messages (chat_id, user_id, message) VALUES (?, ?, ?)',
      [chatId, userId, message]
    );

    logger.info('Message sent successfully');
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sign-out', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials

  try {
    // Clear the session by removing the session ID from the sessions table
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      await pool.execute('DELETE FROM sessions WHERE id = ?', [sessionId]);
    }

    // Clear the session ID cookie in the response
    res.clearCookie('sessionId');

    res.json({ success: true });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
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
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
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
