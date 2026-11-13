const express = require('express');
const app = express();

// /about
app.get('/about', (req, res) => {
  res.send(`
    <body>
      <h1 style="display: inline-block; background-color:blue; color:white; padding: 10px;">This is about page.</h1>
    </body>
  `);
});

// /my-json-api3
app.get('/my-json-api3', (req, res) => {
  res.json({
    University: "PIM"
  });
});

// /users2
app.get('/users2', (req, res) => {
  res.json([
    { id: 1, firstname: "Somchai", lastname: "Jaidee" },
    { id: 2, firstname: "Tony", lastname: "Stark" }
  ]);
});

// pot 3000
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});