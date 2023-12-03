//server.js
//made by Hani Bae

//importing the Express.js framework 
const express = require('express');

//create an instance of the Express application called "app"
//app will be used to define routes, handle requests, etc
const app = express();

//monitor all requests regardless of their method (GET, POST, PUT, etc) and their path (URL)
app.all('*', function (request, response, next) {
	console.log(request.method + ' to ' + request.path);
	next();
});

//route all other GET requests to serve static files from a directory named "public"
app.use(express.static(__dirname + '/public'));

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

//start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));

//import necessary modules
let user_data;

//file system, querystring, and crypto modules for handling data and encryption
const fs = require ('fs');
const qs = require ('qs');
const crypto = require ('crypto');

//file path for storing user data
const filename = 'user_data.json';

//check if the user_data.json file exists
if (fs.existsSync(filename)) {

  //if exists, read the file and parse the JSON data
  let data = fs.readFileSync(filename, 'utf-8');
  user_data = JSON.parse(data);
  console.log(user_data);
} else {

  //if not exists, initialize an empty object
  console.log(`${filename} does not exist.`);
  user_data = {};
};

//temporary storage for user inputs to be passed along
let temp_user = {};

//an array of names of users who are currently logged in
let login_user = [];

//handle POST request to the path /purchase
app.post("/purchase", function (request, response) {
  //extract the content of the request's body
  let POST = request.body;

  //if there are no validation errors in user quantity inputs
  if (validateForm(request) == true) {

    //store the user quantity inputs in temp_user
    for (i in products) {
      temp_user[`qty_${i}`] = POST[`quantity_textbox_${i}`];
    };
    let params = new URLSearchParams(temp_user);

    //if user is already logged in, redirect to the "invoice.html" page
    if (temp_user["email"] && temp_user["name"]) {
      response.redirect(`/invoice.html?valid&${params.toString()}`);
    } 
    
    //if user is not logged in, redirect to the "login.html" page so the user can log in
    else {
      response.redirect(`login.html?${params.toString()}`);
    };
  }

  //if there are validation errors, redirect to the "products_display.html" page in order to let the user change their input
  else {
    response.redirect(`products_display.html?error`);
  };
});

//handle POST request to the path /process_login
app.post("/process_login", function(request, response) {
  //extract the content of the request's body
  let POST = request.body;

  //since email addresses are case-insensitive, convert entered email to lowercase
  let entered_email = POST["email"].toLowerCase();

  //hash the entered password for security
  let entered_password = hashPassword(POST["password"]);

  //if the email and password fields are both left empty, create loginError parameter
  if (entered_email.length == 0 && entered_password.length == 0) {
    request.query.loginError = `Email and Password are both required`;
  }

  //if the email matches with an existing user
  else if (user_data[entered_email]) {

    //if the stored encrypted password matches with the inputted password
    if (user_data[entered_email].password == entered_password) {

      //store user's entered email and entered name in temp_user
      temp_user["email"] = entered_email;
      temp_user["name"] = user_data[entered_email].name;

      //redirect to the "invoice.html" page and append the user's temp info
      //temp info should have the stored quantities, user's email & name
      let params = new URLSearchParams(temp_user);
      login_user.push(temp_user["name"]);
      response.redirect(`/invoice.html?valid&${params.toString()}`);
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

//handle POST request to the path /continue_shopping
app.post("/continue_shopping", function(request, response) {
  //create URLSearchParams using temp_user
  let params = new URLSearchParams(temp_user);

  //redirect to the "products_display.html" page with temp_user
  response.redirect(`/products_display.html?${params.toString()}`);
});

//handle POST request to the path /purchase_logout
app.post("/purchase_logout", function(request, response) {
  //update products qty_sold and qty_available based on user's purchased quantities
  for (i in products) {
    products[i]["qty_sold"] += Number(temp_user[`qty_${i}`]);
    products[i]["qty_available"] -= Number(temp_user[`qty_${i}`]);
  };
  
  //write the updated product data to the products.json file
  fs.writeFile(__dirname + '/products.json', JSON.stringify(products), 'utf-8', (err) => {
    if (err) {
      console.error("Error updating proudcts data", err);
    } else {
      console.log("Products data has been updated");
    };
  });

  //remove user info from temp_user
  delete temp_user["email"];
  delete temp_user["name"];

  //remove user from login_user
  login_user = login_user.filter(user => user !== temp_user["name"]);

  //redirect to the "products_display.page" after user logout
  response.redirect("products_display.html");
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
    user_data[reg_email] = {};
    user_data[reg_email].name = reg_name;
    user_data[reg_email].password = hashPassword(reg_password);

    //asynchronously write the updated user_data and products to their respective files
    fs.writeFile(__dirname + '/user_data.json', JSON.stringify(user_data), 'utf-8', (err) => {
      if (err) {
        console.error('Error updating using data:', err);
      } else {
        console.log('User data has been updated.');

        //add the user's info to temp_user
        temp_user["name"] = reg_name;
        temp_user["email"] = reg_email;

        //create URLSearchParams for user's temp info
        let params = new URLSearchParams(temp_user);

        login_user.push(temp_user["name"]);

        //redirect to the "invoice.html" page with success and valid parameters
        response.redirect(`/invoice.html?regSuccess&valid&${params.toString()}`);
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

  //quantity inputs are 0 in default
  let allZero = true;

  //iterate over each product using for loop
  for (let i in products) {

    //get values from input fields
  let num = Number(request.body[`quantity_textbox_${i}`]);

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
    registration_errors['name_length'] = 'Name must be between 2 and 30 letters';
  }

  // Check if it contains only letters
  else if (!/^[a-zA-Z]+$/.test(name)) {
    registration_errors['name_type'] = 'Name should only contain letters';
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
    registration_errors['email_type'] = 'Invalid email address';
  }
  
  //check if the entered email already exists in the user_data object
  else if (user_data.hasOwnProperty(email)) {
    registration_errors['email_exist'] = 'This email address is already registered'
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
  delete registration_errors['password_requirement'];

  //check the length
  if (password.length < 10 || password.length > 16) {
    registration_errors['password_length'] = 'Password must be between 10 and 16 characters';
  }

  //check if it contains space characters
  else if (password.includes(" ")) {
    registration_errors['password_type'] = 'Password cannot include space characters';
  }

  // check if it contains at least one number and one special character
  else if (!/\d+/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    registration_errors['password_type'] = 'Password must include at least one number and one special character';
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
    registration_errors['confirm_password_type'] = 'Passwords do not match';
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
