//if no user_cookie is detected, send the user to the login page
let userCookieValue = getCookie("user_cookie");
if (userCookieValue) {
    user_cookie = userCookieValue;

    // add an event listener for the logout button
    document.getElementById("logoutAction").addEventListener('click', function() {
        // clear the user_cookie
        //document.cookie = 'user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        // redirect to the login page
        location.href = './login.html';
    });
} else {
    location.href = './login.html';
    // Consider using "return;" instead of "window.stop;" to exit the function
    window.stop;
}