document.addEventListener('DOMContentLoaded', function() {
    //displaying the cart total
    document.getElementById('cart_total').innerHTML = totalItemsInCart;


    //initialize variables for subtotal, tax, shippping charge, and total
    let subtotal=0;

    let cartTable = document.getElementById('cartTable')

    if (cartTable) {
        //loop through the products arrays
        for (let products_key in shopping_cart) {
            for (let i in shopping_cart[products_key]) {
                let itemName = products[products_key][i]["title"];
                let itemPrice = products[products_key][i]["price"];
                let itemIcon = products[products_key][i]["image"];
                let itemQuantity = Number(shopping_cart[products_key][i]);

                //calculate the extended price and subtotal
                let extended_price = itemQuantity * itemPrice;
                subtotal += extended_price;

                //generate the row only if there is a desired quantity, NOT "0"
                if (itemQuantity > 0) {
                    document.querySelector('#cartTable').innerHTML += `
                    <tr>
                        <td>
                            <img src="${itemIcon}" id="itemIcon${i}" width="12.5" height="12.5"> ${itemName}
                        </td>
                        <td>
                            <div class="btn-group me-2" role="group" aria-label="Second group">
                                <button class="btn btn-secondary" 
                                onclick="
                                    if (document.getElementById('cartInput_${products_key}${i}').value == 0) { return;}
                                    document.getElementById('cartUpdate').style.display = 'inline-block';
                                    document.getElementById('cartSubmit').style.display = 'none';
                                    event.preventDefault();
                                    update_qty('cartInput_${products_key}${i}', -1, ${products[products_key][i].price})">
                                -
                                </button>

                                <input style="outline: none; box-shadow: none; width:65px;" type="text" class="btn btn-outline-secondary" name="cartInput_${products_key}${i}" id="cartInput_${products_key}${i}" value="${itemQuantity}" readonly onchange="inventory_amt(this)">

                                <button class="btn btn-secondary" 
                                onclick="
                                    if (document.getElementById('cartInput_${products_key}${i}').value == ${products[products_key][i].qty_available}) return
                                    document.getElementById('cartUpdate').style.display = 'inline-block';
                                    document.getElementById('cartSubmit').style.display = 'none';
                                    event.preventDefault();
                                    update_qty('cartInput_${products_key}${i}', 1, ${products[products_key][i].price});">
                                +
                                </button>
                            </div>
                        </td>
                        <td>
                            $${itemPrice.toFixed(2)}
                        </td>
                        <td>
                            $<span id= "ep_cartInput_${products_key}${i}">${extended_price.toFixed(2)}</span>
                        </td>
                        <td>
                            <i class="fas fa-trash" onclick="
                            removeItem('${products_key}', ${i});
                            document.getElementById('cartUpdate').style.display = 'inline-block';
                            document.getElementById('cartSubmit').style.display = 'none'">
                            </i>
                        </td>
                    </tr>
                    `
                };         
            };
        };

        //initial calculation of tax, shipping, and total
        update_totals();

        //if nothing has been added to the cart, hide the submit buttons and display 'empty cart'
        if (subtotal === 0) {
            document.getElementById('cart_container').innerHTML = `<p class="lead">Your cart is empty</p>`;
        } else {
            document.getElementById('cartUpdate').style.display = 'none';
        }
    };
    
});

//if no user_cookie is detected, send the user to the login page
if (getCookie("user_cookie") != false) {
    user_cookie = getCookie("user_cookie");
}

if (typeof user_cookie !== 'undefined') {
    document.getElementById('shippingUsername').innerHTML = user_cookie["name"];
}

function inventory_amt(input) {
    for (let i in products[products_key]) {
        //check if the value is greater than the quantity available
        if (input.value > products[products_key][i].qty_available) {
            input.value = products[products_key][i].qty_available;
            break;
        }
    }
}

function removeItem(productKey, index) {
    //set the quantity in the shopping cart to 0
    shopping_cart[productKey][index] = 0;

    //update the input value to 0
    let inputElement = document.getElementById(`cartInput_${productKey}${index}`);
    if (inputElement) {
        inputElement.value = 0;
        //call update_qty to recalculate extended price
        update_qty(`cartInput_${productKey}${index}`, 0, products[productKey][index].price);
    }

    //update extended prices and totals
    update_totals();

    //updateCartTotal();
}

function update_qty(input, change, price) {
    //use the id of the input box to get and store the element in input_element
    let input_element = document.getElementById(input);

    //parse the input box's value as integer, defalut to 0 if NaN
    let input_value = parseInt(input_element.value, 10) || 0;

    if (input_element) {
        //the new quantity is the og input value plus the change
        let new_qty = input_value + change;
        if (new_qty < 0) {
            new_qty = 0;
        };

        //the quantity in the input box becomes the new qty
        //input_element.value = Number(new_qty);
        input_element.setAttribute('value', new_qty);

        //update extended price
        let extended_price_element = document.getElementById(`ep_${input}`);
        if (extended_price_element) {
            extended_price_element.innerHTML = (new_qty * price).toFixed(2);
        }

        //recalculate tax, subtotal, shipping, and total
        update_totals();

        //updateCartTotal();
    }
}

function update_totals() {
    //reset values
    subtotal = 0;
    let total = 0;
    let taxRate = 0.04712 ; //4.712%
    let taxAmount = 0;
    let shippingCharge = 0;

    //iterate through products and quantities in the shopping cart
    for (let products_key in shopping_cart) {
        for (let i in shopping_cart[products_key]) {
            let input_element = document.getElementById(`cartInput_${products_key}${i}`);

            //get the user input quantity or use the cart quantity if the input is not present
            let user_qty = input_element ? parseInt(input_element.value, 10) || 0 : 0;

            //calculate subtotal, excluding items with a quantity of 0
            if (user_qty > 0) {
                subtotal += user_qty * products[products_key][i].price;
            }
        }
    }

    //shipping charge changes according to the amount of the sub-total
    //standard shipping charge is $10.00
    //but if sub-total is over $50.00, shipping charge is $5.00
    if (subtotal >= 50) {
        shippingCharge = 5;
    } else if (subtotal == 0) {
        shippingCharge = 0;
    }
    else {
        shippingCharge = 10;
    };

    //calculate total including tax and shipping
    taxAmount = subtotal * taxRate;
    total = subtotal + taxAmount + shippingCharge ;

    ///UPDATE the HTML content to display the calculated values
    //set the total cell in bold
    document.querySelector('#total_cell').innerHTML = `$${total.toFixed(2)}`;


    //set the subtotal, tax, and total cells
    document.querySelector('#subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
    document.querySelector('#tax_cell').innerHTML = '$' + taxAmount.toFixed(2);
    document.querySelector('#shipping_cell').innerHTML = '$' + shippingCharge.toFixed(2);
};

