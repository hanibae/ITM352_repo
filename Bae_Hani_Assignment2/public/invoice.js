//invoice.js
//made by Hani Bae

//initialize variables for subtotal, tax, shippping charge, and total
let subtotal=0;
let taxRate = 0.04712 ; //4.712%
let taxAmount = 0;
let total = 0;
let shippingCharge = 0;


//generate item rows for the purchased items dynamically
generateItemRows();


//shipping charge changes according to the amount of the sub-total
//standard shipping charge is $10.00
//but if sub-total is over $50.00, shipping charge is $5.00
if (subtotal >= 50) {
    shippingCharge = 5;
} else {
    shippingCharge = 10;
};


//calculate total including tax and shipping
taxAmount = subtotal * taxRate;
total = subtotal + taxAmount + shippingCharge ;


//set the total cell in bold
document.getElementById('total_cell').innerHTML = `$${total.toFixed(2)}`;


//set the subtotal, tax, and total cells
document.getElementById('subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
document.getElementById('tax_cell').innerHTML = '$' + taxAmount.toFixed(2);
document.getElementById('shipping_cell').innerHTML = '$' + shippingCharge.toFixed(2);


//function to generate item rows for the purchased items
function generateItemRows() {

    //get the table element to populate
    let table = document.getElementById('invoiceTable');

    //clear the table content
    table.innerHTML = '';

    //loop through the products arrays
    for (i in products) {
        let itemName = products[i]["title"];
        let itemArtist = products[i]["artist"];
        let itemPrice = products[i]["price"];
        let itemIcon = products[i]["image"];
        let itemQuantity = products[i]["qty_desired"];

        //calculate the extended price and subtotal
        let extendedPrice = itemPrice * itemQuantity;
        subtotal += extendedPrice;

        //generate the row only if the user enters a positive quantity, NOT "0"
        if (itemQuantity != 0) {
            let row = table.insertRow();


            //display the small icon of the item, and the item title
            /*When the user hovers over the icon, the popup window appears with a product description.
            A product description is about the artist who made the album.
            Popup window is initially set to "display: none" by default, and becomes visible when the mouse is hovered over by the function showPopup().*/
            /*Conversely, when the mouse is moved away, the popup window disappears.
            Popup window becomes invisible when the mouse is moved away by the function showPopup()*/
            row.insertCell(0).innerHTML = `
            <img src="${itemIcon}" id="itemIcon${i}" width="12.5" height="12.5" onmouseover="showPopup(${i})" onmouseout="hidePopup(${i})">
            ${itemName}
            <div id="popup${i}" style="display: none; position: absolute; background-color: rgba(75, 75, 75, 0.5); padding: 5px; border: none;">by ${itemArtist}</div>
            `;


            //display the item purchase quantity
            row.insertCell(1).innerHTML = itemQuantity;

            //display the item price
            row.insertCell(2).innerHTML = '$' + itemPrice.toFixed(2);

            //display the item with the calculated extended price
            row.insertCell(3).innerHTML = '$' + extendedPrice.toFixed(2);
        };

    };

    //display the total price
    document.getElementById('total_cell').innerHTML = '$' + total.toFixed(2);
};


/*The function showPopup(index) is responsible for displaying the popup window
The index parameter allows the function to identify and target the specific popup element to be shown.
It retrieves the corresponding popup element and sets its display style to 'block', making the popup window visible.*/
function showPopup(index) {
    let popup = document.getElementById(`popup${index}`);
    popup.style.display = 'block';
};


/*The function hidePopup(index) is designed to hide the popup window.
The index parameter allows the function to identify and target the specific popup element to be hidden.
It retrieves the corresponding popup element and sets its display style to 'none', making the popup window invisible.*/
function hidePopup(index) { 
    let popup = document.getElementById(`popup${index}`);
    popup.style.display = 'none';
};
