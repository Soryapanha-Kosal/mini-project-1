const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

let users = []; // In-memory user list
// 1. Registration
app.post('/register', (req, res) => {
  const user = req.body;
  users.push(user);
  res.json({ message: "User registered", user });
});

// 2. Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) res.json({ message: "Login successful" });
  else res.status(401).json({ error: "Invalid credentials" });
});

// 3. Search
app.get('/search', (req, res) => {
  const { email } = req.query;
  const user = users.find(u => u.email === email);
  if (user) res.json(user);
  else res.status(404).json({ error: "User not found" });
});

// 4. Update profile
app.put('/update', (req, res) => {
  const { email, ...updates } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    Object.assign(user, updates);
    res.json({ message: "User updated", user });
  } else res.status(404).json({ error: "User not found" });
});

// 5. Delete user
app.delete('/delete', (req, res) => {
  const { email } = req.body;
  const index = users.findIndex(u => u.email === email);
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ message: "User deleted" });
  } else res.status(404).json({ error: "User not found" });
});

app.listen(3000, () => console.log('Server running on port 3000'));
