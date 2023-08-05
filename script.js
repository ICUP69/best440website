//Variabless
const loginBtn = document.querySelector('.login_btn');
const accountBtn = document.querySelector('.account_btn');
const signOutBtn = document.querySelector('.signOut_btn');
const loginWindow = document.querySelector('.window--login');
const signupWindow = document.querySelector('.window--signup');
const backgroundWindow = document.querySelector('.window--background');
const welcomeUser = document.querySelector('.Welcome--nav');

const confirmSignUp = document.querySelector('.btn2');
const confirmLogin = document.querySelector('.btn1');
const search = document.querySelector('.search--Btn');


///All User Input --> call (variable).value to access it's data 
const usernameLogin = document.querySelector('.username');
const passwordLogin = document.querySelector('.password');
const newFirstname = document.querySelector('.new--firstname');
const newLastname = document.querySelector('.new--lastname');
const newEmail = document.querySelector('.new--email');
const newUsername = document.querySelector('.new--username');
const newPassword = document.querySelector('.new--password');
const confirmPassword = document.querySelector('.confirm--password');
const errorLoginMsg = document.querySelector('.errorLgn');
const userPage = document.querySelector('.user--page');

///User form inputs 
const searchTitle = document.querySelector('.title-input');
const searchDescription = document.querySelector('.desc-input');
const searchCategory = document.querySelector('.cate-input');
const searchPrice = document.querySelector('.price-input');

const table = document.querySelector('.table--display');



const signUp = [newFirstname, newLastname, newEmail, newUsername, newPassword, confirmPassword];
const logIn = [usernameLogin, passwordLogin];

//Functions
const openWindow = (l) => {
    l.classList.remove('hidden');
    backgroundWindow.classList.remove('hidden');
};

const loginError = (l) => {
    errorLoginMsg.textContent = l;
    errorLoginMsg.classList.remove('hidden');
};

const closeWindow = () => {
    if (!loginWindow.classList.contains('hidden')) loginWindow.classList.add('hidden');
    if (!signupWindow.classList.contains('hidden')) signupWindow.classList.add('hidden');
    if (!errorLoginMsg.classList.contains('hidden')) errorLoginMsg.classList.add('hidden');
    backgroundWindow.classList.add('hidden');
};

const displayForm = () => {

};

let currentUser;
const LoggedIn = (user) => {
    currentUser = user;
    closeWindow();
    signOutBtn.classList.remove('hidden');
    userPage.classList.remove('hidden');

    accountBtn.classList.add('hidden');
    loginBtn.classList.add('hidden');
    welcomeUser.textContent = `Welcome back ${user}`;

};

///Event Listeners

loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openWindow(loginWindow);
});

accountBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openWindow(signupWindow);
});

backgroundWindow.addEventListener('click', function (e) {
    e.preventDefault();
    closeWindow();
});


confirmSignUp.addEventListener('click', async function (e) {
    e.preventDefault();
    firstName = newFirstname.value;
    lastName = newLastname.value;
    email = newEmail.value;
    username = newUsername.value;
    password = newPassword.value;
    cpass = confirmPassword.value;
    //Check for Unmatching password can be done here without accessing DB --> if it fails return alert and delete entries 
    if (cpass.localeCompare(password) != 0) {
        console.log("dont match");

        window.alert("passwords dont match try again!");

        signUp.forEach(acc => {
            acc.value = '';
        });
        return;
    }

    console.log("match");
    //////Check for Duplicate username and email --> return alert and delete entries --> may need access to DB

    //If all passes, register account
    //////CODE TO SEND DATA TO SERVER 

    ///Refactored --> SQL WANTS TO USE SAME VARIABLE NAMES TO QUERY INTO DB

    const data = { username, password, firstName, lastName, email };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('/signup', options);
    const json = await response.json();
    console.log(json);
    console.log(json.status);
    alert(json.status);

    signUp.forEach(acc => {
        acc.value = '';
    });

});


confirmLogin.addEventListener('click', async function (e) {
    //Access DB using get 
    e.preventDefault();

    username = usernameLogin.value;
    password = passwordLogin.value;
    console.log(username, password);


    const data = { username, password };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('/login', options);
    const json = await response.json();
    console.log(json);

    ///RETURNS RESULTS
    if (json.status === "successful") {
        LoggedIn(json.userName);
        alert("Login successful!");
    } else if (json.status === "user_not_found") {
        loginError('Error: Username not found');
    } else if (json.status === "incorrect_password") {
        loginError('Error: Incorrect password');
    } else {
        alert("Login failed.");
    }


    logIn.forEach(acc => {
        acc.value = '';
    });

});


/////Search table function 
search.addEventListener('click', async function(e){
    e.preventDefault();

    itemName = searchTitle.value;
    itemDescription = searchDescription.value;
    itemPrice = searchPrice.value;
    category = searchCategory.value;

    console.log(category);
    

    ///Send data we used for search option to backend and it will return said tables? 
    // const data = { title, description, category, price };
    const data = {itemName, itemDescription, itemPrice, category};
    console.log(data);
    const options = {
        method: 'POST', 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };
    
    const response = await fetch('/search', options);
    const json = await response.json();
    console.log(json);

    dataCopy = json.data;

    dataCopy.forEach(data => {
        console.log(data.itemName);
        let html = 
        ` <div class="table--row">
        <div class="product--name">${data.itemName} </div>
        <div class="prodcut--description">
            <div class="product--price"> Price: $ ${data.itemPrice}  </div>
            <div class="product--ID"> ID: ${data.itemID}</div>
            <div class="product--I"> Seller: ${data.userID}</div>
            <div class="product--d"> Description: ${data.itemDescription}</div>
        </div>
        <button> view Reviews </button>
        </div>`;

        table.insertAdjacentHTML('afterbegin', html);
    })
   
    // for(i = 0; i < json.result.length; i++){
    //     let html = ` 
        
        
    //     `
    //     console.log(json.result[i]);
    // }

});





