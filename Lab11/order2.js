function validateNonNegInt(quantity) {
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

function updateMessage(textbox) {
    let quantityMessage = document.getElementById("qty_textbox_message");

    let validationResult = validateNonNegInt(Number(textbox.value));

    if (validationResult != "") {
        quantityMessage.innerHTML = validationResult
    } else {
        quantityMessage.innerHTML = textbox.value
    }

};

function displayPurchase() {
    let quantity = Number(document.getElementById("qty_textbox").value);

    let validationResult = validateNonNegInt(quantity);

    if (validationResult != "") {
        alert(validationResult);
        document.getElementById("qty_textbox").value = "";
    } else {
        let displayMessage = `Thank you for ordering ${quantity} things!`;
        document.body.innerHTML = displayMessage;
    };
};