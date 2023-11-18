const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const cors = require('cors');
const winston = require('winston');

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
app.use(cors());
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
