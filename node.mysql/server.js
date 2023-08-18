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
      status1 = 'Invalid username or used email';
      response.json({
        status: status1,
        firstN: data.firstName,
        lastN: data.lastName
      });
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
  //console.log(request);
  // console.log('---------');
  // console.log(request.body);
  // console.log('--------- bodt');

  const data = request.body;
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
      // console.log(`pass = ${pass}`);
      // console.log(`data.password = ${data.password}`);
      ////

      ////CHECK IF THE PASSWORD MATCHES THE USER INPUT RETURN STATUS
      if (pass === data.password) {
        status1 = 'successful';
        // console.log(`${status1} ${pass}`);

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


///////////////Search/ Table function 
app.post('/search', (request, response) => {
  const data = request.body;
  // console.log(data);

  const search = data.itemName;
  const category = data.category;
  const price = data.itemPrice;
  const description = data.itemDescription;
  const radioOption = data.radioOption;
  const searchUser = data.userSearch;
  const edate = data.seldate;
  const cat1 = data.cate1;
  const cat2 = data.cate2;


  console.log(cat1);
  console.log(cat2);

  let sql = '';
  let e = ` `;
  let searchThis = '';
  let filter_max = ' ';

  categoryTest = category.split(' ');
  e = `(c.categories LIKE '%${categoryTest[0]}%')`;

  for (i = 1; i < categoryTest.length; i++) {
    if (categoryTest[i] !== '') {
      e = e + ` or (c.categories LIKE '%${categoryTest[i]}%') `;
    }
  }

  if (description !== '') {
    e = e + ` or (i.itemDescription LIKE '%${description}%')`;
  }

  if (price !== '') {
    e = e + ` and (i.itemPrice >= '${price}')`;
  }

  if (search !== '') {
    searchThis = `(CASE WHEN (itemName LIKE '%${search}%') THEN 0 END) asc,`;
  }


  if (radioOption === 'Max of Category') {
    filter_max = `, cast(itemPrice as unsigned) asc`;
  }

  switch (radioOption) {
    case 'Poor Reviews':
      sql = `SELECT r.idreview, r.username, r.review, r.date,
    i.itemName, i.itemPrice, i.itemID, i.userID,
    GROUP_CONCAT(c.categories) as Category, i.itemDescription
    FROM projectdb.review AS r
    JOIN items AS i ON r.idreview = i.itemID
    JOIN categories AS c ON c.ID = i.itemID
    WHERE r.rating = 'poor'
    GROUP BY r.idreview, r.username, r.review, r.date,
    i.itemName, i.itemPrice, i.itemID, i.userID, i.itemDescription;`;
      break;

    case 'mostItemsOn7/26':
      sql = `WITH UserItemCount AS (
        SELECT userID, COUNT(*) AS item_count
        FROM projectdb.items
        WHERE DATE(date) = '${edate}'
        GROUP BY userID
      )
      SELECT userID, item_count
      FROM UserItemCount
      WHERE item_count = (SELECT MAX(item_count) FROM UserItemCount);`;
      break;

    case 'User-wth-excellent/good-ratings':
      sql = `SELECT distinct i.itemName,i.itemDescription, i.itemPrice, i.userID, i.itemID, i.category as Category
      FROM projectdb.review AS r
          JOIN items AS i ON r.idreview = i.itemID
          where (i.userID = '${searchUser}')
          group by i.itemName, i.itemDescription, i.itemPrice, i.userID , i.itemID, Category
          having (GROUP_CONCAT(r.rating) not like '%poor%') and (GROUP_CONCAT(r.rating) not like '%fair%'); `;
      break;

    case 'never-had-PoorReviews':
      sql = `Select distinct userID
      from items
      where userID not in 
       (SELECT i.userID
      FROM projectdb.items as i join review as r on r.idreview = i.itemID
      WHERE r.rating = 'poor'); `;
      break;

    case 'uList':
      sql = `SELECT userID, COUNT(distinct category) AS item_count
      FROM items
      WHERE (category LIKE '%${cat1}%' or category LIKE '%${cat2}%')
     AND DATE = '${edate}'
    GROUP BY userID
      HAVING COUNT(category) > 1;`;
      break; 

    default:
      sql = `SELECT i.itemID, i.itemName, i.itemDescription, itemPrice, i.userID, GROUP_CONCAT( c.categories ) as Category 
    FROM items as i JOIN categories as c ON c.ID = i.itemID 
    WHERE ${e}
    group by i.itemID,i.itemID, i.itemName, i.itemDescription, itemPrice , i.userID
    order by ${searchThis} Category ${filter_max} ;`;

  }

  console.log(sql);

  connection.query(sql, (error, result) => {
    if (error) {
      console.error('Error gcategory: ' + error.message);
      response.json({
        status: status1,
      });
      throw error;
    }
    // console.log(result);
    let passField = JSON.parse(JSON.stringify(result));
    //console.log(passField);
    response.json({
      data: passField,
    });

  });


});


// POST route to handle form submission
app.post('/submit-form', (req, res) => {
  // Access form data using req.body
  const itemName = req.body.itemName;
  const itemDescription = req.body.itemDescription;
  const itemCategory = req.body.category;
  const itemPrice = req.body.itemPrice;
  //const userID = req.body.currentUser; // Replace this with the actual user ID (if you have a login system)
  const userID = req.body.user;
  const curdate = new Date().toJSON().slice(0, 10);
  console.log(`this is the ${userID}`);

  let e = ` `;
  test = itemCategory.split(' ');
  e = `(LAST_INSERT_ID(),'${test[0]}');`;

  for (i = 1; i < test.length; i++) {
    e = `(LAST_INSERT_ID(),'${test[i]}'), ` + e;
  }
  console.log(curdate);

  const itmCount = `SELECT COUNT(*) FROM projectdb.items WHERE projectdb.items.date = ${curdate} AND userID = '${userID}';`;

  connection.query(itmCount, (error, result) => {
    if (error) {
      console.error('Error grabbing count ' + error.message);

    } else {

      const count = result[0]['COUNT(*)'];
      console.log(count);

      if (count > 3) {
        res.json({
          status: "item not submitted"
        });
      }
      else {

        const sql = `
        INSERT INTO items (itemName, itemDescription, itemPrice, userID, category, date)
                   VALUES (?, ?, ?, ?, ?, ? );`;

        const sql_1 = `
        INSERT INTO categories
                   VALUES ${e};`;

        connection.beginTransaction(function (err) {
          if (err) {
            console.error('Error inserting item: ' + err.message);
            res.send('Error inserting item');
            connection.rollback(function () {
              throw err;
            });
          }

          connection.query(sql, [itemName, itemDescription, itemPrice, userID, itemCategory, curdate], (err, result) => {
            if (err) {
              console.error('Error inserting item: ' + err.message);
              res.send('Error inserting item');
              connection.rollback(function () {
                throw err;
              });
            }

            connection.query(sql_1, (err, result) => {
              if (err) {
                console.error('Error inserting item: ' + err.message);
                res.send('Error inserting item');
                connection.rollback(function () {
                  throw err;
                });
              }

              connection.commit(function (err) {
                if (err) {
                  console.error('Error inserting item: ' + err.message);
                  res.send('Error inserting item');
                  connection.rollback(function () {
                    throw err;
                  });
                }
                console.log(result);
                //const itemID = result.insertId; // Get the auto-incremented itemID after the insert
                console.log('Form successfully submitted');
                res.json({
                  status: "Form Successfully submitted"
                });
              });
            });
          });

        });

      }
    }
  });
  // Prepare the SQL statement
});



app.post('/submit-review', (req, res) => {
  // Access form data using req.body
  // const itemID = req.body.selectedItem;
  const itemID = req.body.item;
  const user = req.body.user;
  const Rate = req.body.Rating;
  const Review = req.body.Review;
  // const user = req.body.currentUser;
  const curdate = new Date().toJSON().slice(0, 10);

  const revCount = `SELECT COUNT(*) FROM projectdb.review WHERE projectdb.review.date = ${curdate} AND username ='${user}';`;

  connection.query(revCount, (error, result) => {
    if (error) {
      console.error('Error grabbing count ' + error.message);
    } else {
      const count = result[0]['COUNT(*)'];
      console.log(count);
      if (count > 3) {
        res.json({
          status: "Review not submitted"
        });
      }
      else {  // Prepare the SQL statement
        const sql = ` INSERT INTO review (idreview, username, review, date, rating) VALUES (?,?,?,?,?) `;

        // Execute the SQL statement with parameters
        connection.query(sql, [itemID, user, Review, curdate, Rate], (err, result) => {
          if (err) {
            console.error('Error inserting item: ' + err.message);
            res.send('Error inserting item');
          } else {
            console.log(result);
            console.log('REVIEW successfully submitted');
            res.json({
              status: "Review Successfully submitted"
            });
          }
        });
      }
    }
  });
});



/*
sql =  `SELECT userID, 
      CASE 
          WHEN category LIKE '%${cat1}%' THEN '${cat1}'
          WHEN category LIKE '%${cat2}%'THEN '${cat2}'
          ELSE category 
      END AS Category, 
      COUNT(*) AS item_count
      FROM items
      WHERE (category LIKE '%${cat1}%' OR category LIKE '%${cat2}%')
     AND DATE = '${edate}'
    GROUP BY userID, Category
      HAVING COUNT(*) > 1;` ;      

*/