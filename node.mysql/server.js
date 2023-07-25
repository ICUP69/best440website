///Terminal --> 
//npm init 
//npm install --save mysql express

//I used express cause it was easier to render the html doc 

const mysql = require('mysql');
const express = require('express');
const app = express();
app.use(express.static('.'));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: '.' });
});

app.use(express.json({ limit: '2 mb' }));

// title: 'Hey Express',
// message: 'hellothere',
// expressjs: 'express js framework'

app.listen(3000, () => {
  console.log(`this server has worked`);
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


app.post('/newlogin', (request, response) => {
  console.log('I got a request');
  //console.log(request);
  console.log('---------');
  console.log(request.body);
  const data = request.body; 
  console.log(data.newFirst);
  console.log(data.newLast);

  //unstringify request.body. -->> use this module to check conditions and if somethings wrong, send a message back ==> 
});


connection.end();

