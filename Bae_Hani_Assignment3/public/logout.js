//if no user_cookie is detected, send the user to the login page
if (getCookie("user_cookie") != false) {
    user_cookie = getCookie("user_cookie");

    //add an event listener for the logout button
    document.getElementById("logout").addEventListener('click', function() {
        //clear the user_cookie
        document.cookie = 'user_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        //redirect to login page
        location.href = './login.html';
    });
} else {
    location.href = './login.html';
    window.stop;
}