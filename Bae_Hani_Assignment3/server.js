//server.js
//made by Hani Bae

//importing the Express.js framework 
const express = require('express');

//create an instance of the Express application called "app"
//app will be used to define routes, handle requests, etc
const app = express();

/*Used to keep track of different users' data as they go from page to page
  - secret: a string used to sign the session ID cookie
  - resave: forces session to be saved back to the session store
  - saveUninitialized: forces a session that is "uninitialized" to be saved to the store
  * uninitialized session is a new and not modified session */
const session = require('express-session');
app.use(session({secret: "myNotSoSecretKey", resave: true, saveUninitialized: true}));

/*GET COOKIE
//require the cookie-parser middleware
//parses the cookie header and populates req.cookies with an object keyed by cookie names*/
const cookieParser = require('cookie-parser');
const {request} = require('http');
app.use(cookieParser());

//monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);

  //make a session cart at any request because the user can add items before login
  //this is used to store the quantities information
  if (typeof request.session.cart == 'undefined') {
    request.session.cart = {};
  };
  
  //make a session users at any request to store the number of users that are online
  if (typeof request.session.users == 'undefined') {
    request.session.users = Object.keys(status).length;
  };

	next();

});

//route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

//start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

/*Import data from a JSON file containing information about products.
__dirname represents the directory of the current module (where server.js is located)
__dirname + "./products.json" specifies the location of products.json*/
const products = require(__dirname + "/products.json");

//define a route for handling a GET request to a path that matches "./products.js"
app.get('/products.js', function(request, response, next) {

	//send the response as JS
	response.type('.js');
	
	//create a JS string (products_str) that contains data loaded from the products.json file
	//convert the JS string into a JSON string and embed it within variable products
	const products_str = `let products = ${JSON.stringify(products)};`;
	
	//send the string in response to the GET request
	response.send(products_str);
});

//enable parsing of URL-encoded data with extended options
app.use(express.urlencoded({ extended: true }));

//file system, querystring, and crypto modules for handling data and encryption
const fs = require ('fs');
const qs = require('qs');
const crypto = require ('crypto');

//sets dummy variable filename for user_data.json
const filename = 'user_data.json';

//global variable to store user status data
let status = {};

//global variable to hold user data from user_data.json and anything added later
let user_data;

//if the file exists, populate user_data as a string so you can see it
if (fs.existsSync(filename)) {
  //read the file and store the information in variable data
  let data = fs.readFileSync(filename, 'utf-8');
  //parse the information into JSON format and store as user_data
  user_data = JSON.parse(data);
  console.log(user_data);
} else {
  //if not exists, create empty object so you can continue to register users
  console.log(`${filename} does not exist.`);
  user_data = {};
};

//handle POST request to the path /get_cart
app.post("/get_cart", function(request, response) {
  response.json(request.session.cart);
});

//handle POST request to the path /process_login
app.post("/process_login", function(request, response) {
  //get user's input from request body
  let POST = request.body;

  //get user's email address and shift to lowercase since email addresses are case-insensitive
  let entered_email = POST["email"].toLowerCase();

  //get the user's password input and hash the entered password for security
  let entered_password = hashPassword(POST["password"]);

  //if the email and password fields are both left empty, create loginError parameter
  if (entered_email.length == 0 && entered_password.length == 0) {
    request.query.loginError = `Email and Password are both required`;
  }

  //if the email matches with an existing user
  else if (user_data[entered_email]) {

    //if the stored encrypted password matches with the inputted password
    if (user_data[entered_email].password == entered_password) {

      //keep the track of login users
      if (user_data[entered_email].status == false) {
        user_data[entered_email].status == true;
        //add the user to the status object to keep track of logged in users
        status[entered_email] = true;
      };

      //store the user's email and name in the cookie
      let user_cookie = {"email": entered_email, "name": user_data[entered_email]["name"]};

      //response with the user's cookie as a JSON string and set expiration to 15 minutes
      response.cookie("user_cookie", JSON.stringify(user_cookie), {maxAge: 900 * 1000});
      console.log(user_cookie);

      //update the number of active users
      request.session.users = Object.keys(status).length;
      console.log(`Current users: ${Object.keys(status).length} - ${Object.keys(status)}`);

      //asynchronously write the updated user_data(change in status) and products to their respective files
      fs.writeFile(__dirname + filename, JSON.stringfity(user_data), 'utf-8', (err) => {
        if (err) throw err;
        console.log("User data has been updated!");
      });

      //redirect to "cart.html" page
      response.redirect('/cart.html?');
      return;
    }

    //if the password field was left empty, create loginError parameter
    else if (entered_password == "") {
      request.query.loginError = `Password is required`;
    }
    
    //if the stored encrypted password doesn't match with the inputted password, create loginError parameter
    else {
      request.query.loginError = `Incorrect Password`;
    };
  } 
  
  //if the email does not match any existing user, create loginError parameter
  else {
    request.query.loginError = `Invalid Email`;
  };

  //set the email parameter in the query for redirection
  request.query.email = entered_email;

  //create URLSearchParams for query parameters
  let params = new URLSearchParams(request.query);

  //redirect to "login.html" page with query parameters
  response.redirect(`login.html?${params.toString()}`);
});

//initialize an empty object to store registration errors
let registration_errors = {};

//handle POST request to the path /process_register
app.post("/process_register", function(request, response) {
  //get user's inputs from registration form
  let reg_name = request.body.name;
  let reg_email = request.body.email.toLowerCase();
  let reg_password = request.body.password;
  let reg_confirm_password = request.body.confirm_password;

  //validate user inputs using respective validation functions
  validationName(reg_name);
  validationEmail(reg_email);
  validationPassword(reg_password)
  validationConfirmPassword(reg_confirm_password, reg_password);

  //server response.. check to see if no errors..
  if (Object.keys(registration_errors).length == 0) {
    //update the user_data object by adding the info of new user
    user_data[reg_email] = {
      "name": reg_name,
      "password": hashPassword(reg_password),
      "status": true
    };

    //asynchronously write the updated user_data and products to their respective files
    fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (err) => {
      if (err) {
        console.error('Error updating using data:', err);
      } else {
        console.log('User data has been updated.');

        status[reg_email] = true;

        response.redirect(`/login.html`);
      };
    });
  } 
  
  //there are errors recorded from the validation and stored in registration errors
  else {
    //remove password and confirm_password from the request body to avoid exposing them
    delete request.body.password;
    delete request.body.confirm_password;

    //create URLSearchParams for redirection with original form inputs and registration errors
    let params = new URLSearchParams(request.body);

    //redirect to the "register.html" page with original form inputs and registration errors
    response.redirect(`/register.html?${params.toString()}&${qs.stringify(registration_errors)}`);
  }

});

//handle POST request to the path /add_to_cart
app.post("/add_to_cart", function(request, response) {
  //POST the content of the request route
  let POST = request.body;

  //get the products_key from the hidden input box
  let products_key = POST['products_key'];

  for (let i in products[products_key]) {
    //retrieve the user's quantity inputs
    let qty = POST[`quantity_textbox_${i}`];

    //if there are no errors
    if (validateForm(request) == true) {
      //if the session cart does not exist
      if (!request.session.cart) {
        //create one
        request.session.cart = {};
      }

      //if the session cart array for a product category does not exist
      if (typeof request.session.cart[products_key] == 'undefined') {
        //create one
        request.session.cart[products_key] = {};
      }

      //make an array to store the quantities the users input
      let user_qty = [];

      for (let i in products[products_key]) {
        //push the user's inputs into the array
        user_qty.push(Number(POST[`quantity_textbox_${i}`]));
      }

      //set the user_qty in the session
      request.session.cart[products_key] = user_qty;

      return response.redirect(`/products_display.html?products_key=${POST['products_key']}`);
    } 
    
    //if there is an error, redirect to the "products_display.html" page in order to let the user change their input
    else {
      return response.redirect('/products_display.html?error');
    }
  };
});

//handle POST request to the path /update_shopping_cart
app.post("/update_shopping_cart", function(request, response) {
  let POST = request.body;

  let products_key = POST['products_key'];

  for (products_key in request.session.cart) {
    for (let i in request.session.cart[products_key]) {
      request.session.cart[products_key][i] = Number(request.body[`cartInput_${products_key}${i}`]);
    }
  }

  response.redirect('/cart.html');
});

//handle POST request to the path /continue
app.post("/continue", function(request, response) {
  response.redirect(`/products_display.html?`);
});

//handle GET request to the path /checkout
app.post("/checkout", function(request, response) {
  if (typeof request.cookies['user_cookie'] == 'undefined') {
    response.redirect(`/login.html?`);
  } else {
    response.redirect(`/invoice.html?valid`);
  };
});

//handle POST request to the path /complete_purchase
app.post("/complete_purchase", function(request, response) {
  //get the user's cookie and parse it
  let cookie = JSON.parse(request.cookies['user_cookie']);

  //get the user's email
  let email = cookie['email'];

  let subtotal = 0;
  let total = 0;

  //create the start of the invoice table
  let invoice_str = `
  Thank you for your order!
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Extended Price</th>
      </tr>
    </thead>
    <tbody>
  `;
  let shopping_cart = request.session.cart;

  //calculate quantity sold and inventory
  for (let products_key in products) {
    for (let i in products[products_key]) {
      //if a product category has no quantities selected, skip it
      if (typeof shopping_cart[products_key] == 'undefined') continue;

      let qty = shopping_cart[products_key][i];

      products[products_key][i].qty_sold += Number(qty);
      products[products_key][i].qty_available -= Number(qty) || 0;
    }
  }

  //asynchronously write the updated proudcts to the products.json
  fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (err) => {
    if (err) {
      console.error('Error updating products data:', err);
    } else {
      console.log('Products data has been updated!');
    };
  });

  //print out invoice table in email
  for (let products_key in products) {
    for (let i in products[products_key]) {
      //if a product category has no quantities selected, skip it
      if (typeof shopping_cart[products_key] == 'undefined') continue;

      let qty = shopping_cart[products_key][i];
      if (qty > 0) {
        let extended_price = qty * products[products_key][i].price;
        subtotal += extended_price;
        invoice_str += `
        <tr>
          <td>${products[products_key][i].name}</td>
          <td>${qty}</td>
          <td>${products[products_key][i].price.toFixed(2)}</td>
          <td>${extended_price}</td>
        </tr>
        `;
      }
    }
  }

  //sales tax
  let tax_rate = 0.04712 ; //4.712%
  let tax_amt = subtotal * tax_rate;

  //shipping
  if (subtotal >= 50) {
    shippingCharge = 5;
    total = Number(tax_amt + subtotal + shippingCharge);
  } else {
    shippingCharge = 10;
    total = Number(tax_amt + subtotal + shippingCharge);
  };

  //add the remaining tax, subtotal, and total info to the invoice string
  invoice_str += `
  <tr>
    <td colspan="3">Sub-total</td>
    <td>${subtotal.toFixed(2)}</td>
  </tr>
  <tr>
    <td colspan="3">Tax @ 4.712%</td>
    <td>$${tax_amt.toFixed(2)}</td>
  </tr>
  <tr>
    <td colspan="3">Shipping</td>
    <td>$${shippingCharge.toFixed(2)}</td>
  </tr>
  <tr>
    <td colspan="3">Total</td>
    <td>$${total.toFixed(2)}</td>
  </tr>
  </tbody>
  </table>
  `;

  //clear cart
  request.session.destroy();

  request.send(invoice_str);
});

//handle POST request to the path /process_logout
app.post("/process_logout", function(request, response) {
  //get the user's cookie and parse it
  let cookie = JSON.parse(request.cookies['user_cookie']);

  let email = cookie["email"];

  if (user_data[email] && user_data[email].status == true) {
    //remove the user from status
    delete status[email];

    //change the user's status to false
    user_data[email].status = false;

    //clear the user's cookie
    response.clearCookie("user_cookie");

    //update the number of active users in the session
    request.session.users = Object.keys(status).length;

    //asynchronously write the updated user_data and products to their respective files
    fs.writeFile(filename, JSON.stringify(user_data), 'utf-8', (err) => {
      if (err) {
        console.error('Error updating user data:', err);
      } else {
        console.log('User data has been updated!');
        console.log(user_data);
        console.log(`User with email ${email} was successfully logged out`);
        response.redirect('/index.html?');
      }
    });
  } else {
    console.log(user_data);
    console.log(status);
    console.log(`User with email ${email} not found or is already logged out.`);
    response.redirect('/index.html?');
  };
});

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

If there are any errors, the function returns false.
If there are no errors, the function returns true.
*/
function validateForm(request) {

  //no errors in default
  let errorMessage = '';

  let products_key = request.body['products_key'];

  //iterate over each product using for loop
  for (let i in products[products_key]) {

  //get values from input fields
  let num = Number(request.body[`quantity_textbox_${i}`]);

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
        errorMessage += '\n'+ `you can't purchase a decimal quantity for ${products[products_key][i]["title"]}`;
        break;
      case num > (products[products_key][i]["qty_available"]):
        errorMessage += '\n'+ `you can't purchase beyond the available stock for ${products[products_key][i]["title"]}`;
        break;
    };
  };

  //if there is an error, do not allow the form to be submitted
  //if no errors, allow the form to submit
  if (errorMessage !== '') {
      return false;
  } else {
      return true;
  };
};

/*The function validationName(name) is responsible for validating the name input during user registration.
It checks the length and type of the name, and sets error messages accordingly.
If there are errors, it updates the registration_errors object.
*/
function validationName(name) {
  // Reset previous errors
  delete registration_errors['name_length'];
  delete registration_errors['name_type'];

  // Check the length
  if (name.length < 2 || name.length > 30) {
    registration_errors['name_length'] = 'Name must be 2 ~ 30 letters.';
  }

  // Check if it contains only letters
  else if (!/^[a-zA-Z]+$/.test(name)) {
    registration_errors['name_type'] = 'Name must contain only letters.';
  };
};

/*The function validationEmail(email) is responsible for validating the email input during user registration.
It checks the email type and existence in the user_data object, and sets error messages accordingly.
If there are errors, it updates the registration_errors object.
*/
function validationEmail(email) {
  //reset previous errors
  delete registration_errors['email_type'];
  delete registration_errors['email_exist'];

  //regular expression pattern for validating email format
  /*Explanation of the email regular expression:
  ^[a-zA-Z0-9_.]+   - The email must start with one or more alphanumeric characters, underscores, or dots.
  @                 - Followed by the '@' symbol.
  [a-zA-Z0-9.]+     - After '@', there must be one or more alphanumeric characters or dots.
  \.                - There must be a dot '.' before the top-level domain.
  [a-zA-Z]{2,3}$    - The top-level domain must consist of 2 or 3 alphabetic characters at the end of the email.
  */
  let emailRequirement = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,3}$/;

  //check if the entered email does not match the eamil regular expression
  if (!emailRequirement.test(email)) {
    registration_errors['email_type'] = 'Invalid email address.';
  }
  
  //check if the entered email already exists in the user_data object
  else if (user_data.hasOwnProperty(email)) {
    registration_errors['email_exist'] = 'This email address is already registered.'
  };

};

/*The function validationPassword(password) is responsible for validating the password input during user registration.
It checks the length, type, and specific requirements of the password, and sets error messages accordingly.
If there are errors, it updates the registration_errors object.
*/
function validationPassword(password) {
  //reset previous errors
  delete registration_errors['password_length'];
  delete registration_errors['password_type'];

  //check the length
  if (password.length < 10 || password.length > 16) {
    registration_errors['password_length'] = 'Password must be 10 ~ 16 characters.';
  }

  //check if it contains space characters and at least one number and one special character
  else if (password.includes(" ") || (!/\d+/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password))) {
    registration_errors['password_type'] = 'Password must include one special character and one number without any space characters.';
  }
};

/*The function validationConfirmPassword(confirm_password, password) is responsible for validating the confirm password input during user registration.
It checks if the confirm password matches the entered password, and sets an error message accordingly.
If there are errors, it updates the registration_errors object.
*/
function validationConfirmPassword(confirm_password, password) {
  //reset previous errors
  delete registration_errors['confirm_password_type'];

  //check if the confirm password does not match the entered password
  if (confirm_password !== password) {
    registration_errors['confirm_password_type'] = 'Passwords do not match.';
  };
};

/*The function hashPassword(password) is responsible for hashing the password using the SHA-256 algorithm.
It returns the hashed password for security.
*/
function hashPassword(password) {
  //create a new SHA-256 hash object using the crypto module
  let hash = crypto.createHash('sha256');

  //update the hash object with the provided password
  hash.update(password);

  //return the hexadecimal representation of the hashed password
  return hash.digest('hex');
};
