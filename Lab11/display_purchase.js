let params = (new URL(document.location)).searchParams;

let quantity = params.get("qty_textbox");

let message = `Thank you for ordering ${quantity} things!`;

document.body.innerHTML = message;