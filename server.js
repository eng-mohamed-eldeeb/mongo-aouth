const express = require('express');
require('dotenv').config();
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());
const posts = [
  {
    username: 'Kyle',
    title: 'Post 1',
  },
  {
    username: 'Jim',
    title: 'Post 2',
  },
];

const users = [];

app.get('/', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.get('login', (req, res) => {
  // Authenticate User
  res.json('Logging in');
});

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post('/login', async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send('Cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ access_token: access_token });
    } else {
      console.log('Not Allowed');
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000, () => console.log('Server running on port 3000'));
