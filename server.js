const express = require('express');
const path = require('path');
const open = require('open');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/', function(req, res) {
  
})

app.listen(8080);

// opens the url in the default browser 
open('http://localhost:8080')