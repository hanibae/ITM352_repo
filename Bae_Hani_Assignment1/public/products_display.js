//products_display.js
//made by Hani Bae

window.onload = function () {

    //define a variable that points to the form on the DOM in order to dynamically populate the form
    const form = document.getElementById('productForm');

    //blank content of the form to add to
    let formHTML = '';

    //write a loop to print the product information AND then add a quantity text input box for every element of the product array
    //sorry about the complex class names.. it is all due to Bootstrap
    for (let i in products) {

        formHTML += `
        <hr class="featurette-divider">

        <div class="row featurette">

          <div class="col-md-7">

            <h2 class="featurette-heading fw-normal lh-1">${products[i]["title"]}</h2>
            <p class="lead">${products[i]["artist"]}<br>$${(products[i]["price"]).toFixed(2)}<br></p>
            <p style="font-family: 'Open Sans', serif; font-size: 12.5px;"><br>Available: ${products[i]["qty_available"]}<br>Sold: ${products[i]["total_sold"]}</p>

            <div class="col-auto">
              <label class="visually-hidden" for="quantity_textbox_${i}">Quantity Desired</label>
              <input type="text" class="btn btn-outline-secondary" name="quantity_textbox_${i}" id="quantity_textbox_${i}" placeholder="Quantity Desired" onkeyup="checkQuantityTextbox(this);"><br>
              <span id="quantity_textbox_${i}_message" style="font-family: 'Open Sans', serif; font-size: 12px;"></span><br>
            </div>

          </div>
          
          <div class="col-md-5">
            <img src="${products[i]["image"]}" width="235" height="235"/>
          </div>

        </div>`;
    };

    //put some decorative end line after all the products are displayed
    formHTML += `<hr class="featurette-divider">`;

    //ensure the submit button is part of the form
    formHTML += `<br><br><input type="submit" class="btn btn-secondary" value="Purchase"><br><br><br>`;

    //push the form content to the DOM
    form.innerHTML = formHTML;
};





/*The function checkQuantityTextbox(textbox) is designed to validate the quantity entered in a textbox.
It takes textbox as a parameter and performs various checks on the input value.

Conditions Checked:
  - If the input is not a numeric value.
  - If the input is a negative non-integer.
  - If the input is a negative value.
  - If the input is not an integer.
  - If the input exceeds the available stock for the corresponding product.

If any errors are detected during the checks, the appropriate error message is constructed.
If no errors are found, a validMessage is created indicating the desired quantity for the product.

The function then updates the HTML elements with error messages or valid messages accordingly.
It also adjusts the styling of the associated button based on the validation results.*/
function checkQuantityTextbox(textbox) {

    //convert the input value to a number
    let input = Number(textbox.value)

    //extract the index from the name attribute of the textbox
    let index = textbox.name[textbox.name.length - 1]

    //initialize variables for error message and valid message
    let errorMessage = "";
    let validMessage = "";

    //check if the input is not a numeric value
    if (isNaN(input)) {
      errorMessage += `Quantity must be numeric`;
    } 
    
    //check if the input is a negative non-integer
    else if (input < 0 && input % 1 !== 0) {
      errorMessage += `Quantity must be a non-negative integer`;
    } 
    
    //check if the input is a negative value
    else if (input < 0) {
      errorMessage += `Quantity must be non-negative`;
    } 
    
    //check if the input is not an integer
    else if (input % 1 !== 0) {
      errorMessage += `Quantity must be an integer`;
    } 
    
    //check if the input exceeds the available stock for the corresponding product
    else if (input > products[index]["qty_available"]) {
      errorMessage += `We don't have ${input} available<br>Quantity must not exceed the available stock`;
    } 
    
    //when nothing is entered, or "0" is entered, no message will be displayed
    else if (input == 0) {
      errorMessage = "";
      validMessage = "";
    } 
    
    //if no errors, create a valid message indicating the desired quantity for the product
    else {
      errorMessage = "";
      validMessage += `You want ${input} of ${products[index]["title"]}`
    };



  // Update HTML elements with error messages or valid messages and adjust button styling
    
    //if errors exist, set the inner HTML of the associated message element to display the error message
    if (errorMessage != 0) {
      document.getElementById(textbox.name + '_message').innerHTML = errorMessage;

      //indicate an error state by changing the button's color to red
      //due to bootstrap, change the button's class in order to change the button's color to red
      document.getElementById(textbox.name).className = "btn btn-outline-danger";


    //if no errors, set the inner HTML of the associated message element to display the valid message
    } else {
      document.getElementById(textbox.name + '_message').innerHTML = validMessage;

      //indicate a valid state by changing the button's color back to normal
      //due to bootstrap, change the button's class in order to change the button's color back to normal
      document.getElementById(textbox.name).className = "btn btn-outline-secondary";
    };
};





/*The function validateForm() is responsible for validating quantity inputs before form submission.

Variables:
- errorMessage: Holds any error messages detected during validation.
- allZero: Indicates whether all quantity inputs are zero.

The function iterates over each product, checks various conditions for quantity inputs, and constructs error messages accordingly.
Conditions are checked for each quantity input to ensure they meet the following criteria:
  - Must be a numeric value.
  - Must not be a negative decimal.
  - Must not be a negative integer.
  - Must be an integer.
  - Must not exceed the available stock for the corresponding product.
If all quantity inputs are zero, an additional error message is added.

If there are any errors, an alert is displayed with the accumulated error messages, and the form submission is prevented.
If there are no errors, the function allows the form to submit.

The onsubmit attribute of the form in HTML calls this function, and if validateForm() returns false, the form submission is prevented.*/
function validateForm() {

    //no errors in default
    let errorMessage = '';

    //quantity inputs are 0 in default
    let allZero = true;

    //iterate over each product using for loop
    for (let i in products) {

      //get values from input fields
      let num = Number(document.getElementById(`quantity_textbox_${i}`).value);
 
      //check conditions
      switch (true) {
        case isNaN(num):
          errorMessage += '\n'+ `you can't purchase a non-numeric quantity for ${products[i]["title"]}`;
          break;
        case num < 0 && num % 1 !== 0:
          errorMessage = '\n'+ `you can't purchase a negative decimal quantity for ${products[i]["title"]}`;
          break;
        case num < 0:
          errorMessage += '\n'+ `you can't purchase a negative quantity for ${products[i]["title"]}`;
          break;
        case num % 1 !== 0:
          errorMessage += '\n'+ `you can't purchase a decimal quantity for ${products[i]["title"]}`;
          break;
        case num > (products[i]["qty_available"]):
          errorMessage += '\n'+ `you can't purchase beyond the available stock for ${products[i]["title"]}`;
          break;
      };

      //if any input is not zero, set allZero to false
      if (num !== 0) {
        allZero = false;
      };

    };

    //if all inputs are 0, make an error message
    if (allZero) {
        errorMessage += '\n'+ `you cannot purchase nothing.`;
    }
  
    //if there are errors, display the accumulated error messages in an alert
    if (errorMessage !== '') {
        alert('Kiki,'+errorMessage);
        return false; //if there is an error, do not allow the form to be submitted
    } else {
        return true; //if no errors, allow the form to submit
    };
};