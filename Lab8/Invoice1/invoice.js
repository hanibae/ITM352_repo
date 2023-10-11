//Lab 8 Part 2.1
let product_quantities=[2,1,1,1,1];

//Lab 8 Part 2.3
product_quantities.push(3); //Adding a quantity of 3 for the new product
//alert("The size of the products array is: "+product_quantities.length);
product_quantities.pop(); //Removing the last element from the array

//Lab 8 Part 2.2
//alert("The size of the products array is: "+product_quantities.length);

//Lab 8 Part 1.1
let product1 = {
    itemName: 'Caffe Americano',
    quantity: product_quantities[0],
    price: 4.65,
};

//Lab 8 Part 1.4
product1["SKU#"] = 1234;
delete product1["SKU#"];

//Lab 8 Part 1.3
//product1.quantity = 0;

//Lab 8 Part 1.2
let extended_price1 = product1.quantity * product1.price;

// Product Data and Calculating extended-prices
let item2 = 'Caffe Latte';
let quantity2 = product_quantities[1];
let price2 = 5.25;
let extended_price2 = quantity2 * price2 ; 

let item3 = 'Iced Matcha Tea Latte';
let quantity3 = product_quantities[2];
let price3 = 5.65;
let extended_price3 = quantity3 * price3 ; 

let item4 = 'Impossible Breakfast Sandwich';
let quantity4 = product_quantities[3];
let price4 = 5.45;
let extended_price4 = quantity4 * price4 ;

let item5 = 'Acai Bowl';
let quantity5 = product_quantities[4];
let price5 = 14.25;
let extended_price5 = quantity5 * price5 ;

// Calculate subtotal
let subtotal = extended_price1 + extended_price2 + extended_price3 + extended_price4 + extended_price5 ;

// Calculate sales tax
let taxRate = 0.0575 ; //5.75%
let taxAmount = taxRate * subtotal ; 

// Calculate total
let total = subtotal + taxAmount ;

//Populate the table rows using DOM manipulation
let table = document.getElementById('invoiceTable');

//Create a new row for each item
let row = table.insertRow();
row.insertCell(0).innerHTML = `${product1.itemName}`;
row.insertCell(1).innerHTML = `${product1.quantity}`;
row.insertCell(2).innerHTML = `$`+`${product1.price}`;
row.insertCell(3).innerHTML = `$`+`${extended_price1}`;

//Create a new row for each item
row = table.insertRow();
row.insertCell(0).innerHTML = `${item2}`;
row.insertCell(1).innerHTML = `${quantity2}`;
row.insertCell(2).innerHTML = `$`+`${price2}`;
row.insertCell(3).innerHTML = `$`+`${extended_price2}`;

//Create a new row for each item
row = table.insertRow();
row.insertCell(0).innerHTML = `${item3}`;
row.insertCell(1).innerHTML = `${quantity3}`;
row.insertCell(2).innerHTML = `$`+`${price3}`;
row.insertCell(3).innerHTML = `$`+`${extended_price3}`;

//Create a new row for each item
row = table.insertRow();
row.insertCell(0).innerHTML = `${item4}`;
row.insertCell(1).innerHTML = `${quantity4}`;
row.insertCell(2).innerHTML = `$`+`${price4}`;
row.insertCell(3).innerHTML = `$`+`${extended_price4}`;

//Create a new row for each item
row = table.insertRow();
row.insertCell(0).innerHTML = `${item5}`;
row.insertCell(1).innerHTML = `${quantity5}`;
row.insertCell(2).innerHTML = `$`+`${price5}`;
row.insertCell(3).innerHTML = `$`+`${extended_price5}`;

//Set the subtotal, tax, and total cells
document.getElementById('subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
document.getElementById('tax_cell').innerHTML = '$' + taxAmount.toFixed(2);
document.getElementById('total_cell').innerHTML = '$' + total.toFixed(2);
