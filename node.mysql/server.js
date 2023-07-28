///Terminal --> 
//npm init 
//npm install --save mysql express  --> generate node_modules and package-lock.json

//I used express cause it was easier to render the html doc 


////////////////////////////////SETUP server and connection to SQL 
const mysql = require('mysql');
// const mysql = require('mysql2');
const express = require('express');
const app = express();

///RENDER HTML DOC TO SERVER 
const path = require('path');

//create path to find the index.html file to run 
// Serve static files from the "best440website" directory
app.use(express.static(path.join(__dirname, '..')));

// Root route to serve index.html
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
/////////////

app.use(express.json({ limit: '2 mb' }));

app.listen(3000, () => {
  console.log(`The server is now running`);
});

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: '1234',
  database: "projectdb",
});

connection.connect(function (err) {
  // if (err) throw err; 
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log("Connected to mysql!");
});





////////////////////////////////REQUESTS AND GETS 



/////SIGN IN FEATURE
app.post('/signup', (request, response) => {
  console.log('I got a new login request');
  //console.log(request);
  console.log('---------');
  console.log(request.body);
  const data = request.body;
  console.log(data.firstName);
  console.log(data.lastName);
  let status1 = 'successful';


  ///DO conditions befor inserting to sql. Call sql and request for email and username to check if there are no duplicates

  //insert into sql 
  let sql = `INSERT INTO account SET ? `;
  let insertInto = connection.query(sql, data, (req, res) => {
    if (req) {
      status1 = 'Invalid username or ';
      response.json({
        status: status1,
        firstN: data.firstName,
        lastN: data.lastName
      })    
      return console.error('error: ' + req.message);
    }
    console.log("INSERTED INTO DB account ");

    response.json({
      status: status1,
      firstN: data.firstName,
      lastN: data.lastName
    })   
  });


  /////////

});

////LOGIN FEATURE  
app.post('/login', (request, response) => {
  console.log('I got a login request');
  //console.log(request);
  // console.log('---------');
  // console.log(request.body);
  // console.log('--------- bodt');

  const data = request.body;
  console.log(data.username);

  let status1;

  /////GRABS PASSWORD FROM USERNAME ACCOUNT 
  let sql = `SELECT password FROM account WHERE username = ? `;

  //QUERIES USER INPUT INTO SQL 
  let insertInto = connection.query(sql, data.username, (error, results, fields) => {
    if (error) {
      status1 = 'error';
      response.json({
        status: status1,
      });
      return console.error('error: ' + error.message);
    }

    console.log(results);

    //CHECK IF THE USERNAME EXISTS
    if (results.length === 0) {
      status1 = 'user_not_found';
      response.json({
        status: status1,
      });
    } else {
      //CONVERTS SQL PASSWORD RESULTS FROM OBJECT TO JSON INTO A STRING
      let passField = JSON.parse(JSON.stringify(results));
      pass = passField[0].password;
      console.log(`pass = ${pass}`);
      console.log(`data.password = ${data.password}`);
      ////

      ////CHECK IF THE PASSWORD MATCHES THE USER INPUT RETURN STATUS
      if (pass === data.password) {
        status1 = 'successful';
        console.log(`${status1} ${pass}`);

        response.json({
          status: status1,
          userName: data.username,
        });

      } else {
        status1 = 'incorrect_password';
        response.json({
          status: status1,
        });
      }
    }
  });
});



//connection.end();

