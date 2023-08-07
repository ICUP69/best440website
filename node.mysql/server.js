//const mysql = require('mysql');
const mysql = require('mysql2');
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

app.use(express.json({ limit: '2 mb' }));
app.listen(3000, () => {
  console.log(`The server is now running`);
});

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: 'Computer123',
  database: "projectdb",
});

connection.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log("Connected to mysql!");
});


//REQUESTS AND GETS 

//SIGN IN FEATURE
app.post('/signup', (request, response) => {
  console.log('I got a new login request');
  console.log('---------');
  console.log(request.body);
  const data = request.body;
  console.log(data.firstName);
  console.log(data.lastName);
  let status1 = 'successful';

  //insert into sql 
  let sql = `INSERT INTO account SET ? `;
  let insertInto = connection.query(sql, data, (req, res) => {

    if (req) {
      status1 = 'Invalid username or used email';
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
});


////LOGIN FEATURE  
app.post('/login', (request, response) => {
  console.log('I got a login request');
  const data = request.body;
  console.log(data.username);

  let status1;

  //GRABS PASSWORD FROM USERNAME ACCOUNT 
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


//                                                                                      Add items to the database
// POST route to handle form submission
app.post('/submit-form', (req, res) => {
  // Access form data using req.body
  const newitemData = req.body;
  
  const userID = "Mysto"; // Replace this with the actual user ID (if you have a login system)

  // Prepare the SQL statement
  const sql = `INSERT INTO items (itemName, itemDescription, itemPrice, userID)
              VALUES (?, ?, ?, ?)`;

  // Execute the SQL statement with parameters
  connection.query(sql, [newitemData.itemName, newitemData.itemDescription, newitemData.itemPrice, userID], (err, result) => {
    if (err) {
      console.error('Error inserting item: ' + err.message);
      res.send('Error inserting item');
    } else {
      const itemID = result.insertId; // Get the auto-incremented itemID after the insert
      console.log('Form successfully submitted');
      console.log("ID Number: " + itemID + " Title: " + newitemData.itemName + " Description: " +newitemData.itemDescription + " Price: " + newitemData.itemPrice);
      res.json({
        status: "Form Successfully submitted"
      });
    }
  });
});

///////////////Search/ Table function 

app.post('/search', (request, response) => {
  const data = request.body;
  console.log(data);

  const search = data.itemName;
  const category = data.category;
  const price = data.itemPrice;
  let e = ` `;

  //turn category into a array of string 
  test = data.category.split(' ');
  console.log(test);

  test.forEach(value => {
    e = ` or (categories = '${value}')` + e;
  });

  // console.log(e);


  // let sql_1 = `SELECT DISTINCT itemName
  //           FROM items AS i
  //           WHERE EXISTS (SELECT categories
  //           FROM categories AS c
  //           WHERE (c.ID = i.itemID) AND ((i.itemName = '${search}') or (i.itemPrice >= '${price}') ${e} ) ); `;



  ///RETRIEVE SEARCH FOR NAME, PRICE AND CATEGORY AND RETURNS REMAINING NOT LISTED 
  let sql_1 = `SELECT DISTINCT *
  FROM items AS i 
  WHERE NOT EXISTS (SELECT categories 
  FROM categories AS c 
  WHERE (c.ID = i.itemID) 
  AND ( (i.itemName = '${search}') ${e} ) )
  union all 
  SELECT DISTINCT * 
  FROM items AS i 
  WHERE EXISTS (SELECT categories 
  FROM categories AS c 
  WHERE (c.ID = i.itemID) 
  AND ( (i.itemName = '${search}') ${e} ) );`;

  let insertInto = connection.query(sql_1, (error, results, fields) => {
    if (error) {
      status1 = 'error';
      response.json({
        status: status1,
      });
      return console.error('error: ' + error.message);
    }

    console.log('OUTPUT');
    console.log(results);   
    let passField = JSON.parse(JSON.stringify(results));
    console.log(passField);

    response.json({
      data: passField,
    });

  });

});


  

  

  //turn category into a array of string 
  // test = data.category.split(' ');
  // console.log(test);


  //let sql = `SELECT * FROM account`;

  //QUERIES USER INPUT INTO SQL 
  // let insertInto = connection.query(sql, data.username, (error, results, fields) => {
  //   if (error) {
  //     status1 = 'error';
  //     response.json({
  //       status: status1,
  //     });
  //     return console.error('error: ' + error.message);
  //   }


  //   let passField = JSON.parse(JSON.stringify(results));
  //   console.log(passField);
  //   pass = passField[0];
  //   pass1 = passField[1];
  //   pass2 = passField[2];
  //   pass3 = passField[3];

  //   console.log(pass);


  //   response.json({
  //     result: results,
  //   });
  // });



//connection.end();