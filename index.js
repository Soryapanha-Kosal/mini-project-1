const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.json());

const DATA_FILE = path.join(__dirname, 'users.json');

// Helper functions
function readUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Register
app.post('/register', (req, res) => {
  const users = readUsers();
  const user = req.body;
  if (users.find(u => u.email === user.email)) {
    return res.status(400).json({ error: "User already exists" });
  }
  users.push(user);
  writeUsers(users);
  res.json({ message: "User registered", user });
});

// Login
app.post('/login', (req, res) => {
  const users = readUsers();
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) res.json({ message: "Login successful" });
  else res.status(401).json({ error: "Invalid credentials" });
});

// Search
app.get('/search', (req, res) => {
  const users = readUsers();
  const { email } = req.query;
  const user = users.find(u => u.email === email);
  if (user) res.json(user);
  else res.status(404).json({ error: "User not found" });
});

// Update
app.put('/update', (req, res) => {
  const users = readUsers();
  const { email, ...updates } = req.body;
  const index = users.findIndex(u => u.email === email);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    writeUsers(users);
    res.json({ message: "User updated", user: users[index] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Delete
app.delete('/delete', (req, res) => {
  let users = readUsers();
  const { email } = req.body;
  const newUsers = users.filter(u => u.email !== email);
  if (newUsers.length === users.length) {
    return res.status(404).json({ error: "User not found" });
  }
  writeUsers(newUsers);
  res.json({ message: "User deleted" });
});

app.listen(3000, () => console.log('Server running on port 3000'));
