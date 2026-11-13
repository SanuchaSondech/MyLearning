//node index.js

const express = require('express')
const app = express()

let fs = require('fs');

/*fs.writeFile('demofile1.txt', 'test content', 'utf8', (err) => {
if (!err) console.log('write complete!!');
else console.log('write NOT complete!!');
});
fs.readFile('demofile1.txt', 'utf8', (err) => {
if (!err) console.log('read complete!!');
else console.log('read NOT complete!!');
});*/

/*fs.writeFile('demofile2.txt', 'file2 content', 'utf8', function (err) {
    console.log("write file 2 success")
    fs.readFile('demofile2.txt', 'utf8', function (err, data) {
        console.log("read file 2", data);
    });
});*/

fs.readFile('demofile1.txt', 'utf8')
 .then(data1 => {
   console.log("demo file 1: " + data1);
   return fs.readFile('demofile2.txt', 'utf8');
 })
 .then(data2 => {
   console.log("demo file 2: " + data2);
 })
 .catch(err => console.error(err));

app.get('/', function (req, res) { // Home Route
 res.send('Hello World')
})
app.get('/aboutme', function (req, res) { // Home Route
   res.send('About me')
})

app.get('/myname', function (req, res) { // Home Route
   res.send('Sanucha Sondech')
})

app.listen(3000, () => {
   console.log("Server started on port 3000 !")
})
