///Terminal --> 
//npm init 
//npm install --save mysql express

const mysql = require('mysql');  
const express = require('express'); 
const app = express();

const connection = mysql.createConnection({  
  host: "localhost",  
  port: "3306",
  user: "root",  
  password: "1234", 
  database: "world",
});  

connection.connect(function(err) {  
  // if (err) throw err; 
  if (err) {
    return console.error('error: ' + err.message);
  } 

  console.log("Connected!");  
});  

// app.listen('3000',() => {
//   console.log('Server started on port 3000');
// });


connection.end();
//When page opens, open server
//when page closes close server