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
const add = document.querySelector('.add--Btn');


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
const reviewBtn = document.querySelectorAll('.review_btn');


///REVIEW FORM INTERACTIONS
const reviewTab = document.querySelector('.review');
const reviewRate = document.querySelector('.rate');
const reviewSubmit = document.querySelector('.submit_rev');
const userReview = document.getElementById('review_desc');
const revCancel = document.querySelector('.cancel_rev');


////ALL FILTER INPUTS 
const max_Category = document.querySelector('.Max--category');



const signUp = [newFirstname, newLastname, newEmail, newUsername, newPassword, confirmPassword];
const logIn = [usernameLogin, passwordLogin];


class userSession {

    #currentUser;
    #selectedItem;
    #selectedItemUser;

    constructor(currentUser) {
        this.currentUser = currentUser;
        /////Search table function 
        search.addEventListener('click', this._search.bind(this));

        add.addEventListener('click', this._add.bind(this));

        reviewSubmit.addEventListener('click', this._review.bind(this));

        document.addEventListener("click", this.openReview.bind(this));
    }


    displayItemList = (data) => {
        table.innerHTML = ' ';

        let dataCopy = data;

        dataCopy.forEach(data => {
            let html =
                ` <div class="table--row">
            <div class="product--name">${data.itemName} </div>
            <div class="prodcut--description">
                <div class="product--price"> Price: $ ${data.itemPrice}  </div>
                <div class="product--ID"> ID: ${data.itemID}</div>
                <div class="product--I"> Seller: ${data.userID}</div>
                <div class="product--A"> Category: ${data.Category}</div>
                <div class="product--d"> Description: ${data.itemDescription}</div>

            </div>
    
            <button class="review_btn"> view Reviews </button>
                `;

            table.insertAdjacentHTML('afterbegin', html);
        });
    };

    displayUserList = (data) => {
        table.innerHTML = ' ';

        let dataCopy = data;

        dataCopy.forEach(data => {
            let html =
                ` <div class="table--row">
            <div class="product--name"> User: ${data.userID} </div>
            <div class="prodcut--description">
                <div class="product--price"> Item: ${data.itemName}  </div>
                <div class="product--ID"> ID: ${data.itemID}</div>
                <div class="product--I"> Review by: ${data.username}</div>
                <div class="product--A"> Review posted on ${data.date}: ${data.review}</div>
                <div class="product--d"> Category: ${data.Category}</div>

            </div>
    
            <button class="review_btn"> view Reviews </button>
                `;

            table.insertAdjacentHTML('afterbegin', html);
        });
    }

    async _search(e) {
        e.preventDefault();
        let itemName = searchTitle.value;
        let itemDescription = searchDescription.value;
        let itemPrice = searchPrice.value;
        let category = searchCategory.value;
        let radioOption = document.querySelector('input[name="option"]:checked').value;
        // let maxCateg = max_Category.checked;

        ///Send data we used for search option to backend and it will return said tables? 
        // const data = { title, description, category, price };
        const data = { itemName, itemDescription, itemPrice, category, radioOption };
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
        // console.log(json);


        if (radioOption === 'Poor Reviews') {
            this.displayUserList(json.data);
        } else {
            this.displayItemList(json.data);

        }
    }

    async _add(event) {
        event.preventDefault(); // Prevent default form submission behavior
        //defining my variables to get values
        let itemName = searchTitle.value;
        let itemDescription = searchDescription.value;
        let itemPrice = searchPrice.value;
        let category = searchCategory.value;
        let user = this.currentUser;


        //checking for valid inputs
        if (itemName === "" || itemDescription === "" || itemPrice === "" || category === "") {
            window.alert("Please fill in all values");
            return;
        }

        const data = { itemName, itemDescription, itemPrice, category, user };

        // //getting response from server
        // const form = event.target;
        // const formData = new FormData(form);
        try {
            const options = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            };

            const response = await fetch('/submit-form', options);
            const json = await response.json();

            alert(json.status);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    async _review(e) {
        e.preventDefault();
        let Rating = reviewRate.value;
        let Review = userReview.value;
        let item = this.selectedItem;
        let user = this.currentUser;
        console.log(reviewRate.value);

        if (this.selectedItemUser === this.currentUser) {
            alert('Cannot review own items');
            return;
        }

        const data = { Rating, Review, item, user };
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };

        const response = await fetch('/submit-review', options);
        const json = await response.json();
        console.log(json);

        reviewTab.classList.add('hidden');
    }

    openReview(e) {
        const target = e.target.closest('.review_btn');
        if (target) {

            if (!reviewTab.classList.contains('hidden')) return;
            reviewTab.classList.remove('hidden');

            //grab user ID FROM Selected review tab
            const grabParent = target.parentNode.childNodes[3];
            const getID = grabParent.childNodes[3];
            const getUser = grabParent.childNodes[5];
            this.selectedItemUser = getUser.textContent.slice(9);
            this.selectedItem = getID.textContent.slice(5);
        }
    }

    _setCurrentUser(input) {
        this.currentUser = input;
    }

    _getCurrentUser() {
        return this.currentUser;
    }

};


let app = new userSession();

/////////Functions FOR 
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

const LoggedIn = (user) => {
    currentUser = user;
    closeWindow();
    signOutBtn.classList.remove('hidden');
    userPage.classList.remove('hidden');
    accountBtn.classList.add('hidden');
    loginBtn.classList.add('hidden');
    welcomeUser.textContent = `Welcome back ${user}`;
    app._setCurrentUser(user);
    console.log(app._getCurrentUser());
};


//////////////////////////////////////////////////
//////////////////////////////////////////////Event Listeners
signOutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    signOutBtn.classList.add('hidden');
    welcomeUser.textContent = '';
    accountBtn.classList.remove('hidden');
    loginBtn.classList.remove('hidden');
    userPage.classList.add('hidden');
    currentUser = '';
    app._setCurrentUser();
    console.log(app._getCurrentUser());
});

loginBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openWindow(loginWindow);
    console.log(app._getCurrentUser());
});

accountBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openWindow(signupWindow);
});

backgroundWindow.addEventListener('click', function (e) {
    e.preventDefault();
    closeWindow();
});

revCancel.addEventListener('click', async function (e) {
    e.preventDefault();
    userReview.value = '';
    reviewTab.classList.add('hidden');
});



//////////////////////////////SQL ACTIONS 

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

    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        alert('missing fields');
        return;
    }

    console.log("match");

    //////Check for Duplicate username and email --> return alert and delete entries --> may need access to DB

    //If all passes, register account
    //////CODE TO SEND DATA TO SERVER 

    ///Refactored --> SQL WANTS TO USE SAME VARIABLE NAMES TO QUERY INTO DB


    console.log(firstName, lastName);
    // console.log(typeof newFirst, typeof newLast);
    // console.log('this is working');

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



/*
search.addEventListener('click', async function (e) {
    e.preventDefault();

    itemName = searchTitle.value;
    itemDescription = searchDescription.value;
    itemPrice = searchPrice.value;
    category = searchCategory.value;


    ///Send data we used for search option to backend and it will return said tables?
    // const data = { title, description, category, price };
    const data = { itemName, itemDescription, itemPrice, category };
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
    // console.log(json);

    displayList(json.data);
});

add.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    //defining my variables to get values
    itemName = searchTitle.value;
    itemDescription = searchDescription.value;
    itemPrice = searchPrice.value;
    category = searchCategory.value;


    //checking for valid inputs
    if (itemName === "" || itemDescription === "" || itemPrice === "" || category === "") {
        window.alert("Please fill in all values");
        return;
    }

    console.log(currentUser);
    const data = { itemName, itemDescription, itemPrice, category, currentUser };

    // //getting response from server
    // const form = event.target;
    // const formData = new FormData(form);
    try {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        };

        const response = await fetch('/submit-form', options);
        const json = await response.json();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

reviewSubmit.addEventListener('click', async function (e) {
    e.preventDefault();
    const Rating = reviewRate.value;
    const Review = userReview.value;
    console.log(reviewRate.value);

    if (selectedItemUser === currentUser) {
        alert('Cannot review own items');
        return;
    }

    const data = { Rating, Review, selectedItem, currentUser };
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };

    const response = await fetch('/submit-review', options);
    const json = await response.json();
    console.log(json);

    reviewTab.classList.add('hidden');
    closeWindow();

});

*/



