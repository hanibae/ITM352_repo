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
    let receipt = '';
    let qtys = request.body[`quantity_textbox`];
    console.log(qtys);

    for (let i in qtys) {
        let q = Number(qtys[i]);
        console.log("the quantity value is "+q);

        let validationMessage = validateQuantity(q);
        let brand = products[i]["brand"];
        let brand_price = products[i]["price"];
        if (validateQuantity(q) === "") {
            products[i]["total_sold"] += Number(q) ;
            receipt += `<h3>Thank you for purchasing: ${q} ${brand}. Your total is \$${q * brand_price}!</h3>`; //render template string
        } else {
            receipt += `<h3><font color="red">${q} is not a valid quantity for ${brand}!<br>${validationMessage}</font></h3>`;
        };
    };

    response.send(receipt);
    response.end();

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