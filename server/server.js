const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const cors = require('cors');
const winston = require('winston');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid'); // generating unique session ID
const cookieParser = require('cookie-parser'); 
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
const corsOptions = {
  origin: 'http://localhost:19006',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use('/uploads', express.static('/root/app/project4-main/server/uploads/'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './uploads');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Configure Winston logger
const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server_logs.log' }),
  ],
});

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

app.post('/api/upload', upload.single('photo'), (req, res) => {
  console.log('file', req.file); // Use req.file to access the uploaded file
  console.log('body', req.body);

  // If you want to send the file path in the response:
  const imagePath = req.file ? req.file.path : null;

  res.status(200).json({
    message: 'success!',
    imagePath: imagePath,
  });
});

app.get('/api/getImage/:chat_image', (req, res) => {

  const { chat_image } = req.params;
  const imagePath = `/root/app/project4-main/server/uploads/${chat_image}`;
  
  console.log('Attempting to send image:', imagePath);
  
  // Check if the file exists before attempting to send it
  if (fs.existsSync(imagePath)) {
    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);
  
    // Convert the buffer to Base64
    const base64Image = Buffer.from(imageBuffer).toString('base64');
  
    // Send the Base64-encoded image in the response
    res.json({ status: 1, data: { base64Image }, msg: 'Image sent successfully' });
  } else {
    console.error('Image not found:', imagePath);
    res.status(404).json({ status: 0, data: {}, msg: 'Image not found' });
  }
});

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

    const [sessionRows] = await pool.execute('SELECT * FROM Sessions WHERE id = ?', [sessionId]);

    if (sessionRows.length === 0) {
      console.log('this is the first login');
      return res.json({ success: false });
    }

    // Assuming you have a users table
    const [userRows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [sessionRows[0].email]);

    if (userRows.length === 0) {
      console.log('no found');
      return res.json({ success: false });
    }
    // User is authenticated
    return res.json({
     success: true,
     user: {
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
    const [userRows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);

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
    await pool.execute('INSERT INTO Sessions (id, email) VALUES (?, ?)', [sessionId, user.email]);

    // Set the session ID as a cookie in the response
    res.cookie('sessionId', sessionId, { httpOnly: true });

    // User is authenticated
    return res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        age: user.age,
        picture: user.picture,
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
    const { name, email, password, age, picture } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!name || !email || !password || !age) {
      logger.error('age, Name, email, and password are required');
      return res.status(400).json({ error: 'age, Name, email, and password are required' });
    }

    // Check if the email is already in use
    const [existingUserRows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);

    if (existingUserRows.length > 0) {
      logger.error('Email is already in use');
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [insertResult] = await pool.execute(
      'INSERT INTO Users (email, password_hash, name, age, picture) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, age, picture]
    );

    // Generate a unique session ID
    const sessionId = generateSessionId();

    // Store the session ID in the sessions table
    //await pool.execute('INSERT INTO Sessions (id, email) VALUES (?, ?)', [sessionId, insertResult.id]);

    // Set the session ID as a cookie in the response
    res.cookie('sessionId', sessionId, { httpOnly: true });

    logger.info('Data inserted successfully');
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (error) {
    logger.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/:email/user', async (req, res) => {
  try {
    const { email } = req.params;

    const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
    res.status(200).json(rows);
  } catch (error) {
    logger.error('Error fetching data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/chatTypes', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Fetch the list of chats from your database
    const [chatTypes] = await pool.execute('SELECT * FROM chat_types');

    res.status(200).json(chatTypes);
  } catch (error) {
    logger.error('Error fetching chat Types:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/chats', async (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:19006');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Fetch the list of chats from your database
    const [chats] = await pool.execute('SELECT * FROM Chats');

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
    const { chat_name, chat_image } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!chat_name) {
      logger.error('Chat name is required');
      return res.status(400).json({ error: 'Chat name is required' });
    }

    // Insert the new chat into the database
    let insertQuery = 'INSERT INTO Chats (chat_name';
    let values = [chat_name];

    if (chat_image) {
      // Parse the base64 data URI and extract the actual base64-encoded string
      insertQuery += ', chat_image';
      values.push(chat_image);
    }

    insertQuery += ') VALUES (' + values.map(() => '?').join(',') + ')';

    const [insertResult] = await pool.execute(insertQuery, values);

    logger.info('Chat created successfully: ', insertResult);
    res.status(200).json({ success: true, message: `Chat created successfully: ${insertResult}` });
  } catch (error) {
    logger.error('Error creating chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/chats/:chat_name/questions', async (req, res) => {
  try {
    const { chat_name } = req.params;

    // Fetch questions for the specified chat from the database
    const query = `
    SELECT
      Questions.*,
      Users.name AS sender_name,
      Users.age AS sender_age,
      Users.picture AS sender_picture
    FROM
      Questions
    LEFT JOIN
      Messages ON Questions.question_id = Messages.question_id
    LEFT JOIN
      Users ON Messages.sender_email = Users.email
    WHERE
      Questions.chat_name = ?
    ORDER BY
      Questions.timestamp DESC;
    `;

   const [questions] = await pool.execute(query, [chat_name]);

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching chat questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chats/:chat_name/send-question', async (req, res) => {
  try {
    const { chat_name } = req.params;
    const { sender_email, question, question_title } = req.body;

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!question) {
      logger.error('question is empty');
      return res.status(400).json({ error: 'question is empty' });
    }

    if (!question_title) {
      logger.error('question title is empty');
      return res.status(400).json({ error: 'question title is empty' });
    }

    // Insert the new message into the database
    await pool.execute(
      'INSERT INTO Questions (chat_name, sender_email, question_content, question_title) VALUES (?, ?, ?, ?)',
      [chat_name, sender_email, question, question_title]
    );

    logger.info('question sent successfully');
    res.status(200).json({ success: true, message: 'question sent successfully' });
  } catch (error) {
    logger.error('Error sending question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/chats/:chat_name/questions/:question_id/messages', async (req, res) => {
  try {
    const { chat_name, question_id } = req.params;

    // Fetch messages for the specified chat from the database
    const query = `
    SELECT
      Messages.*,
      Users.name AS message_sender_name,
      Users.age AS message_sender_age,
      Users.picture AS message_sender_picture
    FROM
      Messages
    LEFT JOIN
      Users ON Messages.sender_email = Users.email
    WHERE
      Messages.chat_name = ? AND Messages.question_id = ?
    ORDER BY
      Messages.timestamp DESC;
  `;
  
  const [messages] = await pool.execute(query, [chat_name, question_id]);
  
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/chats/:chat_name/questions/:question_id/send-message', async (req, res) => {
  try {
    const { chat_name, question_id } = req.params;
    const { sender_email, message_content } = req.body;

    if (!sender_email) {
      logger.error('User is not Logged in');
      return res.status(400).json({ error: 'User is not Logged in' });
    }

    // Validate the content before inserting (check if it's not empty, etc.)
    if (!message_content) {
      logger.error('message is empty');
      return res.status(400).json({ error: 'message is empty' });
    }

    // Insert the new message into the database
    await pool.execute(
      'INSERT INTO Messages (chat_name, question_id, sender_email, message_content) VALUES (?, ?, ?, ?)',
      [chat_name, question_id, sender_email, message_content]
    );

    logger.info('Message sent successfully');
    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/messages/:message_id/user/:user_email/islike', async (req, res) => {
  try {
    const { message_id, user_email } = req.params;
    const islike = await pool.execute('SELECT * FROM likes WHERE user_email = ? AND message_id = ?',[user_email, message_id],);

    if (islike.length > 0) {
      // User has already liked the message
      return res.status(200).json({ success: true, islike: true, isdislike: false });
    }

    const isdislike = await pool.execute('SELECT * FROM dislikes WHERE user_email = ? AND message_id = ?',[user_email, message_id],);

    if (isdislike.length > 0) {
      // User has disliked the message
      return res.status(200).json({ success: true, islike: false, isdislike: true });
    }

    return res.status(200).json({ success: true, islike: false, isdislike: false });
  } catch (error) {
    logger.error('Error updating likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/messages/:message_id/user/:user_email/likes', async (req, res) => {
  try {
    const { message_id, user_email } = req.params;
    const islike = await pool.execute('SELECT * FROM likes WHERE user_email = ? AND message_id = ?',[user_email, message_id],);

    if (islike.length > 0) {
      // User has already liked the message
      return res.status(400).json({ success: false, error: 'User has already liked this message'});
    }

    const isdislike = await pool.execute('SELECT * FROM dislikes WHERE user_email = ? AND message_id = ?',[user_email, message_id],);
    if (isdislike.length > 0) {
      // User has disliked the message
      await pool.execute('DELETE FROM dislikes WHERE user_email = ? AND message_id = ?', [user_email, message_id]);
      await pool.execute('UPDATE Messages SET dislikes = likes - 1 WHERE message_id = ?', [message_id]);
    }
    // Increment the likes count by 1
    const UpdateMessages = await pool.execute('UPDATE Messages SET likes = likes + 1 WHERE message_id = ?', [message_id]);
    const response = await pool.execute('INSERT INTO likes (user_email, message_id) VALUES (?, ?)', [user_email, message_id]);

    logger.info('Likes updated successfully');
    res.status(200).json({ success: true, message: 'Likes updated successfully', response: response, UpdateMessages: UpdateMessages });
  } catch (error) {
    logger.error('Error updating likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/messages/:message_id/user/:user_email/dislikes', async (req, res) => {
  try {
    const { message_id, user_email } = req.params;
    const isdislike = await pool.execute('SELECT * FROM dislikes WHERE user_email = ? AND message_id = ?',[user_email, message_id],);

    if (isdislike.length > 0) {
      // User has already disliked the message
      return res.status(400).json({ success: false, error: 'User has already disliked this message' });
    }

    const islike = await pool.execute('SELECT * FROM likes WHERE user_email = ? AND message_id = ?',[user_email, message_id],);
    if (isdislike.length > 0) {
      // User has liked the message
      await pool.execute('DELETE FROM likes WHERE user_email = ? AND message_id = ?', [user_email, message_id]);
      await pool.execute('UPDATE Messages SET likes = likes - 1 WHERE message_id = ?', [message_id]);
    }
    // Increment the dislikes count by 1
    const UpdateMessages = await pool.execute('UPDATE Messages SET dislikes = likes + 1 WHERE message_id = ?', [message_id]);
    const response = await pool.execute('INSERT INTO dislikes (user_email, message_id) VALUES (?, ?)', [user_email, message_id]);

    logger.info('disLikes updated successfully');
    res.status(200).json({ success: true, message: 'Likes updated successfully', response: response, UpdateMessages: UpdateMessages });
  } catch (error) {
    logger.error('Error updating dislikes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/messages/:message_id/dislikes', async (req, res) => {
  try {
    const { message_id } = req.params;

    // Increment the dislikes count by 1
    const response = await pool.execute('UPDATE Messages SET dislikes = dislikes + 1 WHERE message_id = ?', [message_id]);

    logger.info('disLikes updated successfully');
    res.status(200).json({ success: true, message: 'disLikes updated successfully', response: response });
  } catch (error) {
    logger.error('Error updating dislikes:', error);
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
      await pool.execute('DELETE FROM Sessions WHERE id = ?', [sessionId]);
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
