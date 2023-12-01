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
});


//start the server; listen on port 8080 for incoming HTTP requests
app.listen(8080, () => console.log(`listening on port 8080`));