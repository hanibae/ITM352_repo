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
products.forEach( (product,i) => {product.total_sold = 0});

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

//handle POST requests to the "/purchase" endpoint
app.post("/purchase", function (request, response) {

  //if there are no validation errors
	if (validateForm(request) == true) {
		//iterate over each product in the 'products' array
		for (i in products) {

			//retrieve the quantity value from the request body for the current product
			let qty = Number(request.body[`quantity_textbox_${i}`]);

			//update products data:
			products[i]["total_sold"] += qty; //increment the total sold quantity
			products[i]["qty_desired"] = qty; //set the desired quantity to the input quantity
			products[i]["qty_available"] -= qty; //decrease the available quantity by the input quantity
		};

		//redirect the response to the "invoice.html" page
		response.redirect('invoice.html');

	} else {
    //if there are validation errors, redirect to the "products_display.html" page in order to let the user change their input
		response.redirect('products_display.html');
	};

});


//start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));


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