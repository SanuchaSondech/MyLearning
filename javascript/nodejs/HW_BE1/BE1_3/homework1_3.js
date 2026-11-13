// สร้างโมดูลการจัดการไฟล์
const fs = require('fs');
// สร้างเซิร์ฟเวอร์
const express = require('express');
const app = express();

app.get('/read-users', (req, res) => {
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Cannot read file' });
    }
    res.json(JSON.parse(data));
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});