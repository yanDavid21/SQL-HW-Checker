const express = require('express');
const path = require('path');
const open = require('open');

const app = express();

const portNumber = 8080;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/', function(req, res) {
  let file = req.body;
  if (req.get('content-type') === "text/plain") { //.sql files

  } else if (req.get('content-type') === "text/csv") { //.csv files

  }
})

app.listen(portNumber);

// opens the url in the default browser 
open('http://localhost:' + portNumber);