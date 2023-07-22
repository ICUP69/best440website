
//Variables

const loginBtn = document.querySelector('.login_btn');
const accountBtn = document.querySelector('.account_btn');
const loginWindow = document.querySelector('.window--login');
const signupWindow = document.querySelector('.window--signup');
const backgroundWindow = document.querySelector('.window--background');



class accounts {
    #accounts = []; //private field might not need it tho cause sql :/

    constructor(firstName,lastName,email,username,pin) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username; 
        this.pin = pin;
    }

}

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









