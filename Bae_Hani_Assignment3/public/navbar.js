//navbar.js
//made by Hani Bae
//copied sample code from Port & Sal
/*
The purpose of this file is to store code relating to the nav bar and other codes that should be loaded first (before the rest of the elements are defined).

Along with the retrieval of the products_key, the file also includes code for retrieval of the user's cookie, the opening and closing of the cart, and params.

The code in this file is used across all pages except invoice.
*/

let params = (new URL(document.location)).searchParams;

///DIRECT USER TO APPROPRIATE PRODUCT PAGE///
//reference from Port's A3 example code
let products_key = "hiphop";
if (params.has('products_key')) {
    products_key = params.get('products_key');
}


///LOAD SHOPPING CART///
//reference from Port's A3 example code
let shopping_cart;

//initialize the total number of items in the cart
let totalItemsInCart = 0;

//load the cart data from a JSON endpoint
loadJSON('/get_cart', function(response) {

    //parse the JSON response into a shopping cart object
    shopping_cart = JSON.parse(response);

    //iterate through each product in the shopping cart
    for (let productKey in shopping_cart) {
        //calculate the total quantity for the current product and add it to the total

        //retrieves the value associated with the current product key, which is an array of quantities
        let productQuantities = shopping_cart[productKey];

        /*In this line of code: We declare a new variable named productTotalQuantity. We use the reduce method on the productQuantities array to calculate the total quantity of the current product. The reduce method is a higher-order function that iterates through each element of the array (currentQuantity in this case) and accumulates a result (accumulator in this case) based on a provided function. Here, the provided function (accumulator, currentQuantity) => accumulator + currentQuantity adds the current quantity to the accumulator in each iteration. As a result, productTotalQuantity will store the total quantity of the current product by summing up all the quantities in the productQuantities array.*/
        let productTotalQuantity = productQuantities.reduce((accumulator, currentQuantity) => accumulator + currentQuantity);

        totalItemsInCart += productTotalQuantity;
    }
})

/*
///ACTIVE USERS///
let users = 0;
loadJSON('/get_users', function(response) {
    users = response
})
*/

//switched from window.onload because of issues with loading resources taking too long and not trigeering the window.onload event
document.addEventListener('DOMContentLoaded', function() {
    //if the user's cookie exists
    if (getCookie('user_cookie') != false) {
        //turn the string of key value pairs into an object to be parsed
        let user_cookie = getCookie('user_cookie');

        if (document.getElementById('login_logout_button')) {
            //make the "login" button into a button with the user's name leading to the cart page
            document.getElementById('login_logout_button').innerHTML = `
            <a class="nav-link fw-bold py-1 px-0" href="logout.html"><i class="fa-solid fa-user"></i> ${user_cookie["name"]}</a>
            `;
        }

        //personalization on the index NEEDEDDDDDDD
    } else {
        document.getElementById('login_logout_button').innerHTML = `
        <a class="nav-link fw-bold py-1 px-0" href="login.html"><i class="fa-solid fa-user"></i> login</a>
        `;
    }
})

///GET USER'S COOKIE///
//code referenced from: https://www.w3schools.com/js/js_cookies.asp
//decode the cookie string to only get the key value pairs from the cookie object
function getCookie(cookiename) {
    //prepare the cookie name to search for
    let name = cookiename + "=";

    //get and decode the entire cookie string
    let decodedCookie = decodeURIComponent(document.cookie);

    //split the cookie string into an array of individual cookie entries
    let cookieEntries = decodedCookie.split(';');

    //iterate through each cookie entry
    for (let i=0; i<cookieEntries.length; i++) {
        let cookieEntry = cookieEntries[i];

        //remove leading spaces, if any
        while (cookieEntry.charAt(0) == ' ') {
            cookieEntry = cookieEntry.substring(1);
        }

        //check if the current cookie entry starts with the desired name
        if (cookieEntry.indexOf(name) == 0) {
            //extract and parse the value part of the cookie
            let cookieValueString = cookieEntry.substring(name.length, cookieEntry.length);
            return JSON.parse(cookieValueString);
        }
    }

    //return an empty string if the cookie with the specified name is not found
    return "";
}


/*function updateCartTotal() {
    //assuming shopping_cart is an array of items, each with a 'quantity' property
    let newTotal = 0;

    //loop through each item in the shopping_cart and sum up the quantities
    for (let item of shopping_cart) {
        newTotal += item.quantity;
    }

    //update the totalItemsInCart variable with the new total
    totalItemsInCart = newTotal;

    //update the display element in the navbar
    document.getElementById('cart_total').innerHTML = totalItemsInCart;
}*/

function updateCartTotal() {
    // assuming shopping_cart is an object with product keys
    let newTotal = 0;

    // loop through each product key in the shopping_cart
    for (let productKey in shopping_cart) {
        // get the quantities array for the current product key
        let productQuantities = shopping_cart[productKey];

        // calculate the total quantity for the current product and add it to the total
        let productTotalQuantity = 0;
        for (let i = 0; i < productQuantities.length; i++) {
            productTotalQuantity += productQuantities[i];
        }

        newTotal += productTotalQuantity;
    }

    // update the totalItemsInCart variable with the new total
    totalItemsInCart = newTotal;

    // update the display element in the navbar
    document.getElementById('cart_total').innerHTML = totalItemsInCart;
}