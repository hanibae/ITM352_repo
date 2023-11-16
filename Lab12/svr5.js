//create an express application
let express = require('express');
//name that application 'app'
let app = express();

//if there are static files to present, go to public
app.use(express.static(__dirname + '/public'));


//add a route to match with a GET request
app.get('/test', function (req, res) {
    res.send('app.get for test was executed');
    console.log('app.get for test was executed');
});

//creating a variable called products and going in a file called 'products.json'
let products = require(__dirname + '/products.json');

//adding the total_sold attribute to each items in the products array
products.forEach( (prod,i) => {prod.total_sold = 0});

//any time you get a GET request for products.js, what you are going to actually use is the products array that was defined already before the GET request
app.get("/products.js", function (request, response, next) {
   response.type('.js');
   let products_str = `let products = ${JSON.stringify(products)};`;
   response.send(products_str);
});

app.use(express.urlencoded({ extended: true }));

//server receives this post request and send the request to the body of the page
app.post("/process_form", function (request, response) {
    let brand = products[0]['brand'];
    let brand_price = products[0]['price'];

    //response.send(request.body);
    let q = Number(request.body['qty_textbox']); //take the value of textbox
    console.log("the input value is.."+q);

    //increments the number of items sold for the first item in products
    products[0].total_sold += q;

    let validationMessage = validateQuantity(q);

    if (validationMessage === "") {
        response.redirect('receipt.html?quantity='+q);
        //response.send(`<h2>Thank you for purchasing ${q} ${brand}. Your total is \$${q * brand_price}!</h2>`);
    } else {
        response.redirect(`order.html?error=${validationMessage}&qty_textbox=${q}`)
        //response.send(validationMessage + '<br>' + `Error: ${q} is not a quantity. Hit the back button to fix.`);
    };
});

app.all('*', function (request, response, next) {
    //response.send(request.method + ' to path ' + request.path);
    console.log(request.method + ' to path ' + request.path);
});

app.listen(8080, () => console.log(`listening on port 8080`)); //note the use of an anonymous function here to do a callback

function validateQuantity(quantity) {
    let errorMessage = "";

    switch (true) {
        case isNaN(quantity):
            errorMessage = "Not a number. Please enter a non-negative quantity to order.";
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errorMessage = "Negative inventory and not an integer. Please enter a non-negative quantity to order.";
            break;
        case quantity < 0:
            errorMessage = "Negative inventory. Please enter a non-negative quantity to order.";
            break;
        case !Number.isInteger(quantity):
            errorMessage = "Not an integer. Please enter a non-negative quantity to order.";
            break;
        default:
            errorMessage = ""; //No errors
            break;
    }

    return errorMessage;
};