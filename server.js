const express = require('express');
const path = require('path');
const open = require('open');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const portNumber = 8080; 

const db = new sqlite3.Database(path.join(__dirname, '/Chinook_Sqlite_AutoIncrementPKs.sqlite'), sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error("Failed to connect to database.");
  } else {
    console.log("Connected to database.");
  }
});

//directory hosting the static files to be served
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json())

//get request at / serves home page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//post request here compares responds with json result from querying database
app.post('/chinook', function(req, res) {
  let sqlStatement = req.body;
  db.all("SELECT * FROM Genre;", (err, rows) => {
    if(err) {
      res.json({
        status: 'failure',
        response: "Error! Invalid query. Please modify and try again."
      });
    } else {
      res.json({
        status: 'success',
        response: rows
      })
    }
  })
})

app.listen(portNumber);
console.log("Server currently running off " + portNumber + "...");

// opens the url in the default browser 
open('http://localhost:' + portNumber);

//ensures proper database cleanup
[`SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, () => {
    console.log("Terminating connection to database...");
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
    process.exit();
  });
})

process.on('exit', (code) => {
  console.log("Terminating server on code " + code);
})