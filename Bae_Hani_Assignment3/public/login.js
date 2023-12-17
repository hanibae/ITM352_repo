//login.js
//made by Hani Bae

//when the window loads, perform the following function:
window.onload = function() {
    let params = (new URL(document.location)).searchParams;
    //if the key 'loginError' is present, it means that there were no inputs or an invalid email/password
    if (params.has("loginError")) {
        //after the window loads, get the value from key 'loginError' and display it in errorMessage
        document.getElementById("errorMessage").innerHTML = params.get("loginError");
    };
    document.getElementById("email").value = params.get("email");
};