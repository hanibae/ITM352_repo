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

}

