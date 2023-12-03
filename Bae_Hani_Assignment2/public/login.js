//login.js
//made by Hani Bae
let params = (new URL(document.location)).searchParams;

//when the window loads, perform the following function:
window.onload = function() {
    //if the key 'loginError' is present, it means that there were no inputs or an invalid email/password
    if (params.has("loginError")) {
        //after the window loads, get the value from key 'loginError' and display it in errorMessage
        document.getElementById("errorMessage").innerHTML = params.get("loginError");
    };
    document.getElementById("email").value = params.get("email");
};