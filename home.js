document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById("add--Btn");
  const searchBtn = document.getElementById("search--Btn");

  addBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    //Prevent default form submission behavior
    //defining my variables to get values
    var title = document.getElementById("title").value;
    var desc = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var price = document.getElementById("price").value;

    //checking for valid inputs
    if (title === "" || desc === "" || category === "" || price === "") {
      window.alert("Please fill in all values");
      return;
    }

    //getting response from server
    const formData = {
      itemName: title,
      itemDescription: desc,
      itemCategory: category,
      itemPrice: price
    };
    const jsonString = JSON.stringify(formData);
    try {
      const response = await fetch('/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonString
      });

      const json = await response.json();
      console.log(json);

      // Display the status message as a pop-up window
      window.alert(json.status);
      event.target.reset(); // Instead of form.reset(), use event.target.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

  // Add click event listener for the "Search" button
  searchBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    // Your code to handle searching for items goes here
    // For example, call the searchTable() function you previously defined
    searchTable();
  });
});

async function searchTable() {
  var title = document.getElementById("title").value;
  var desc = document.getElementById("description").value;
  var category = document.getElementById("category").value;
  var price = document.getElementById("price").value;

  console.log(category);

  // Send data we used for the search option to the backend and it will return the matching data
  const data = { title, desc, price, category };
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
  </tr>`;
    table.insertAdjacentHTML('beforeend', html);
  });
}
