//order.js (Lab12 part 6)

//check the URL for any error parameters and quantity and display them
let params = (new URL(document.location)).searchParams;
let q = Number(params.get('quantity'));

let error = params.get('error');

//if there is an error, alert the user
if (error) {
    alert(error);
};

//select the div where product details should be displayed
let productDetailsDiv = document.getElementById('productDetails');

//display the first product's details
productDetailsDiv.innerHTML = `<h3>${products[0]["brand"]} at \$${products[0]["price"]}</h3>`

//select div where the product ilst will be displayed
let productListDiv = document.getElementById('productList');

//iterate through the products and display their sold counts
for (let i in products) {
    productListDiv.innerHTML += `<h4>${products[i]["total_sold"]} ${products[i]["brand"]} have been sold!</h4>`
} 