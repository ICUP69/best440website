///Terminal --> 
//npm init 
//npm install --save mysql express  --> generate node_modules and package-lock.json

//I used express cause it was easier to render the html doc 

const mysql = require('mysql');
const express = require('express');
const app = express();

///RENDER HTML DOC TO SERVER 
app.use(express.static('.'));
app.get('/', function (req, res) {
  res.sendFile('index.html', { root: '.' });
});
////


app.use(express.json({ limit: '2 mb' }));

app.listen(3000, () => {
  console.log(`The server is now running`);
});

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "1234",
  database: "projectdb",
});

connection.connect(function (err) {
  // if (err) throw err; 
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log("Connected to mysql!");
});


app.post('/signup', (request, response) => {
  console.log('I got a new login request');
  //console.log(request);
  console.log('---------');
  console.log(request.body);
  const data = request.body;
  console.log(data.firstName);
  console.log(data.lastName);

  //////insert into sql 
  let sql = `INSERT INTO account SET ? `;
  let insertInto = connection.query(sql, data, (req, res) => {
    if (req) {
      return console.error('error: ' + req.message);
    }
    console.log("INSERTED INTO DB account ");
  });

  ///////conditions



  /////////
  response.json({
    status: 'successful',
    firstN: data.newFirst,
    lastN: data.newLast
  })

});


app.post('/login', (request, response) => { //use post to login 
  console.log('I got a login request');
  //console.log(request);
  console.log('---------');
  console.log(request.body);
  const data = request.body;
  /////



  /////
  // ${data.newUser, data.newAddress, data.newPas, data.newFirst, data.data.newLast}
  response.json({
    status: 'successful',
    firstN: data.newFirst,
    lastN: data.newLast
  });

  //unstringify request.body. -->> use this module to check conditions and if somethings wrong, send a message back ==> 
});



