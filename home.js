document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById("add--Btn");
  const searchBtn = document.getElementById("search--Btn");


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


    displayList = (data) => {
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
                <div class="product--d"> Description: ${data.itemDescription}</div>
            </div>
    
            <button class="review_btn"> view Reviews </button>
                `;

            table.insertAdjacentHTML('afterbegin', html);
        });
    };

    async _search(e) {
        e.preventDefault();

        let itemName = searchTitle.value;
        let itemDescription = searchDescription.value;
        let itemPrice = searchPrice.value;
        let category = searchCategory.value;

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

        this.displayList(json.data);
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

        console.log(currentUser);
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
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    async _review(e) {
        e.preventDefault();
        let Rating = reviewRate.value;
        let Review = userReview.value;
        let item  = this.selectedItem; 
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

//

async function searchTable() {
  var itemName = document.getElementById("title").value;
  var itemDescription = document.getElementById("description").value;
  var category = document.getElementById("category").value;
  var itemPrice = document.getElementById("price").value;

  console.log(category);

  // Send data we used for the search option to the backend and it will return the matching data
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
  console.log(json);

  dataCopy = json.data;
  const table = document.querySelector('.dynamictable'); // Get the table element based on its class name
  table.innerHTML = ""; // Clear the previous search results

  dataCopy.forEach(data => {
    console.log(data.itemID,data.itemName, data.itemPrice,data.itemDescription ,data.userID);
    let html =
    `<tr>
    <td>${data.itemID}</td>
    <td>${data.itemName}</td>
    <td>$ ${data.itemPrice}</td>
    <td>${data.itemDescription}</td>
    <td>${data.userID}</td>
    <button>Review</button>
  </tr>`;
    table.insertAdjacentHTML('beforeend', html);
  });
}


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



});