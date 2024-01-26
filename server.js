const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());
const post = [
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

app.get('/', (req, res) => {
  res.json(post);
});

app.get('login', (req, res) => {
  // Authenticate User
  res.json('Logging in');
});

app.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
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
      res.send('Success');
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
