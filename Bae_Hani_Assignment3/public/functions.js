//function.js
//made by Hani Bae
//copied sample code from Port & Sal

/*This function asks the server for a "service" and converts the response to text.*/
function loadJSON(service, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', service, false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            //required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

/*This function makes a nav bar from a products_data object*/
function nav_bar(products_key, products) {
    //this makes a nav bar to other product pages
    for (let key in products) {
        //if (products_key == this_product_key) continue;
        document.write(`<a class="nav-link fw-bold py-1 px-0" href='/products_display.html?products_key=${key}'><i class="fa-solid fa-music"></i> ${key}</a>`);
    };
};