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

app.use(express.urlencoded({ extended: true }));

//server receives this post request and send the request to the body of the page
app.post("/process_form", function (request, response) {
    //response.send(request.body);
    let q = Number(request.body['qty_textbox']); //take the value of textbox
    console.log("the input value is.."+q);
    let validationMessage = validateQuantity(q);

    if (validationMessage === "") {
        response.send(`Thank you for purchasing ${q} things.`);
    } else {
        response.send(validationMessage + '<br>' + `Error: ${q} is not a quantity. Hit the back button to fix.`);
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