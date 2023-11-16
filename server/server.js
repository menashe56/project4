const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mysql = require('mysql2/promise');
const cors = require('cors');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server_logs.log' }),
  ],
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const pool = mysql.createPool({
  host: '172.31.31.235',
  user: 'myuser',
  password: 'mypassword',
  database: 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Allow requests from any origin
app.use(cors({ origin: '*' }));
app.use(express.json());

// WebSocket communication
wss.on('connection', (ws, req) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  logger.info(`WebSocket connection established from ${clientIP}`);

  // Enable WebSocket debugging
  ws.on('ping', () => logger.debug('Received WebSocket PING'));
  ws.on('pong', () => logger.debug('Received WebSocket PONG'));
  ws.on('close', () => logger.info('WebSocket connection closed'));

  ws.on('message', (message) => {
    logger.info(`Received message: ${message}`);

    // Process the message and send a response if needed
    // You can broadcast the message to all connected clients if required
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Server: ${message}`);
      }
    });
  });
});

// HTTP endpoint for your Expo app to send messages
app.post('/expo-app/api/send-message', (req, res) => {
  const { message } = req.body;

  // Process the message, e.g., store it in a database or send it via WebSocket
  // Send a response if needed

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ message: `Server: ${message}` }));
    }
  });

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

server.listen(3000, '0.0.0.0', () => {
  logger.info('Server is running on port 3000');
});
