//Variabless

const loginBtn = document.querySelector('.login_btn');
const accountBtn = document.querySelector('.account_btn');
const loginWindow = document.querySelector('.window--login');
const signupWindow = document.querySelector('.window--signup');
const backgroundWindow = document.querySelector('.window--background');

const confirmSignUp = document.querySelector('.btn2');
const confirmLogin = document.querySelector('.btn1');


///All User Input --> call (variable).value to access it's data 
const username = document.querySelector('.username');
const password = document.querySelector('.password');
const newFirstname = document.querySelector('.new--firstname');
const newLastname = document.querySelector('.new--lastname');
const newEmail = document.querySelector('.new--email');
const newUsername = document.querySelector('.new--username');
const newPassword = document.querySelector('.new--password'); 
const confirmPassword = document.querySelector('.confirm--password'); 
////User Input entries 

class accounts {
    #accounts = []; //private field might not need it tho cause sql :/
    
    constructor(firstName, lastName, email, username, pin) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.pin = pin;
    }
};

//Functions
const openWindow = (l) => {
    l.classList.remove('hidden');
    backgroundWindow.classList.remove('hidden');
};

const closeWindow = () => {
    if (!loginWindow.classList.contains('hidden')) loginWindow.classList.add('hidden');
    if (!signupWindow.classList.contains('hidden')) signupWindow.classList.add('hidden');
    backgroundWindow.classList.add('hidden');
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



confirmSignUp.addEventListener('click', function (e) {
    e.preventDefault();
    //Check for Unmatching password can be done here without accessing DB --> if it fails return alert and delete entries 


    //////Check for Duplicate username and email --> return alert and delete entries --> may need access to DB



    //If all passes, register account
    //////CODE TO SEND DATA TO SERVER 

    ///Might refactor this later, was just testing it
    newFirst = newFirstname.value; 
    newLast = newLastname.value;
    newAddress = newEmail.value; 
    newUser = newUsername.value; 
    newPas = newPassword.value;

    console.log(newFirst, newLast);
    // console.log(typeof newFirst, typeof newLast);
    // console.log('this is working');

    const data = { newFirst, newLast , newAddress , newUser , newPas};
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(data)
    };

    fetch('/newlogin', options);

    ///////

});



confirmLogin.addEventListener('click', function (e) {
    //Access DB using get 

});












