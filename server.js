const express = require('express');
const path = require('path');
const open = require('open');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const portNumber = 8080; 

//create a connection to the sqlite database, read only 
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

//converts arrays of objects to arrays of objects with all values being a String
function toStrings(rows) {
  rows.forEach(row => {
    for(const key in row) {
      row[key] = String(row[key]);
    }
  })
}

//handles post requests to /chinook, given a sql string and runs it in the database
//returns json response of rows of objects representing the rows of the query result, if any
//otherwise return a json response with an error message
app.post('/chinook', function(req, res) {
  let sqlStatement = req.body.queryString;
  sqlStatement = sqlStatement.replace( /[\r\n]+/gm, " " ); //this removes any newline characters or returns
  db.all(sqlStatement, (err, rows) => {
    if(err) {
      res.json({
        status: 'failure',
        response: "Error! Invalid query. Please modify and try again."
      });
    } else {
      toStrings(rows);
      res.json({
        status: 'success',
        response: rows
      })
    }
  })
})

app.listen(process.env.PORT || portNumber);
console.log("Server currently running off " + portNumber + "...");

// opens the url in the default browser 
if (!process.env.PORT) {
  open('http://localhost:' + portNumber);
} 

//ensures proper database cleanup on exits
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

//on exit print to console that server is terminating 
process.on('exit', (code) => {
  console.log("Terminating server on code " + code);
})