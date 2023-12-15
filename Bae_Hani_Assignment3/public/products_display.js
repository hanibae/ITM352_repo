//products_display.js
//made by Hani Bae

//print product cards
for (let i in products[products_key]) {
  document.querySelector('.row').innerHTML += `
  <hr class="featurette-divider"><br>

  <div class="row featurette">

    <div class="col-md-7">

      <h2 class="featurette-heading fw-normal lh-1">${products[products_key][i]["title"]}</h2>

      <p class="lead">
        ${products[products_key][i]["artist"]}<br>
        $${(products[products_key][i]["price"]).toFixed(2)}<br><br>
      </p>

      <p style="font-family: 'Open Sans', serif; font-size: 12.5px;">
        Available: ${products[products_key][i]["qty_available"]}<br>
        Sold: ${products[products_key][i]["qty_sold"]}
      </p>

      <div class="col-auto">
        <div class="btn-group me-2" role="group" aria-label="Second group">
          <button class="btn btn-secondary" onclick="decreaseQuantity('quantity_textbox_${i}')">-</button>
          <label class="visually-hidden" for="quantity_textbox_${i}">Quantity Desired</label>
          <input style="outline: none; box-shadow: none;" type="text" class="btn btn-outline-secondary" name="quantity_textbox_${i}" id="quantity_textbox_${i}" placeholder="Quantity Desired" onkeyup="checkQuantityTextbox(this);">
          <button class="btn btn-secondary" onclick="increaseQuantity('quantity_textbox_${i}')">+</button>
        </div>
        <br>
        <span id="quantity_textbox_${i}_message" style="font-family: 'Open Sans', serif; font-size: 12px;"></span><br>
      </div>

    </div>
    
    <div class="col-md-5">
      <img src="${products[products_key][i]["image"]}" alt="${products[products_key][i]["alt"]}" width="255" height="255"/><br><br>
    </div>

  </div>
  `;
}

window.onload = function () {
  //get the URL
  let params = (new URL(document.location)).searchParams;

  //STICKY PART
  //make input boxes sticky (for valid quantities) after returning from the cart
  if ((typeof shopping_cart[products_key] != 'undefined') && (params.has('error') != true)) {
    for (let i in shopping_cart[products_key]) {
      if (shopping_cart[products_key][i] == 0) {
        document.getElementById(`quantity_textbox_${i}`).value = '';
      } else {
        document.getElementById(`quantity_textbox_${i}`).value = shopping_cart[products_key][i];
      };
    };
  };
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
    else if (input > products[products_key][index]["qty_available"]) {
      errorMessage += `We don't have ${input} available<br>Quantity must not exceed the available stock`;
      textbox.value = Number(products[products_key][index]["qty_available"]); //if the input exceeds the available stock, the value of the input is reverted back to the inventory amount, instead of whatever number the user put in
    } 
    
    //when nothing is entered, or "0" is entered, no message will be displayed
    else if (input == 0) {
      errorMessage = "";
      validMessage = "";
    } 
    
    //if no errors, create a valid message indicating the desired quantity for the product
    else {
      errorMessage = "";
      validMessage += `You want ${input} of ${products[products_key][index]["title"]}`
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

/*The function showAlert() is responsible for checking quantity inputs before form submission and displaying error messages.

Variables:
  - errorMessage: Holds any error messages detected during validation.
  - allZero: Indicates whether all quantity inputs are zero.

Conditions Checked:
  - Must be a numeric value.
  - Must not be a negative decimal.
  - Must not be a negative integer.
  - Must be an integer.
  - Must not exceed the available stock for the corresponding product.

If all quantity inputs are zero, an additional error message is added.
If there are any errors, an alert is displayed with the accumulated error messages.*/
function showAlert() {
  //no errors in default
  let errorMessage = '';

  //iterate over each product using for loop
  for (let i in products[products_key]) {

    //get values from input fields
    let num = Number(document.getElementById(`quantity_textbox_${i}`).value);

    //check conditions
    switch (true) {
      case isNaN(num):
        errorMessage += '\n'+ `you can't purchase a non-numeric quantity for ${products[products_key][i]["title"]}`;
        break;
      case num < 0 && num % 1 !== 0:
        errorMessage = '\n'+ `you can't purchase a negative decimal quantity for ${products[products_key][i]["title"]}`;
        break;
      case num < 0:
        errorMessage += '\n'+ `you can't purchase a negative quantity for ${products[products_key][i]["title"]}`;
        break;
      case num % 1 !== 0:
        errorMessage += '\n'+ `you can't purchase a decimal quantity for ${products[products_key]["title"]}`;
        break;
      case num > (products[products_key][i]["qty_available"]):
        errorMessage += '\n'+ `you can't purchase beyond the available stock for ${products[products_key]["title"]}`;
        break;
    };
  };

  //if there are errors, display the accumulated error messages in an alert
  if (errorMessage !== '') {
      alert('Kiki,'+errorMessage);
  }
};

function decreaseQuantity(textboxId) {
  let textbox = document.getElementById(textboxId);
  let currentQuantity = Number(textbox.value);
  if (currentQuantity > 0) {
    textbox.value = currentQuantity - 1;
  }
}

function increaseQuantity(textboxId) {
  let textbox = document.getElementById(textboxId);
  let currentQuantity = Number(textbox.value);
  textbox.value = currentQuantity + 1;
}