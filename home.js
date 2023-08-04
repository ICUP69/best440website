document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#myForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    //defining my variables to get values
    var title = document.getElementById("title").value;
    var desc = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var price = document.getElementById("price").value;
    
    
    //checking for valid inputs
    if(title === "" || desc ==="" || category === ""  || price === ""){
      window.alert("Please fill in all values");
      return;
    }

    //getting response from server
    const form = event.target;
    const formData = new FormData(form);
    try {
      const response = await fetch('/submit-form', {
        method: 'POST',
        body: formData
      });

      const json = await response.json();
      console.log(json);

      // Display the status message as a pop-up window
      window.alert(json.status);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });
});
