//register.js
//made by Hani Bae
let params = (new URL(document.location)).searchParams;

//when the window loads, perform the following function:
window.onload = function() {
    let register_form = document.forms["register_form"];

    //get the values previously inputted and place them back into the input boxes
    register_form.elements["name"].value = params.get("name");
    register_form.elements["email"].value = params.get("email");

};

function checkName(textbox) {
    let name = textbox.value

    //initialize variables for error message
    let lengthError = "";
    let typeError = "";

    // Check the length and if it only contains letters
    if (name.length < 2 || name.length > 30) {
        lengthError = 'Must be 2 ~ 30 letters<br>';
    }
    
    if (!/^[a-zA-Z]+$/.test(name)) {
        typeError = 'Must contain only letters<br>';
    }

    // Combine all error messages
    let errorMessage = lengthError + typeError;

    // Update HTML elements with error messages or valid messages and adjust button styling
    
    //if errors exist, set the inner HTML of the associated message element to display the error message
    if (errorMessage != 0) {
        document.getElementById("name_error").innerHTML = errorMessage;
  
        //indicate an error state by changing the button's color to red
        //due to bootstrap, change the button's class in order to change the button's color to red
        document.getElementById(textbox.name).className = "btn btn-outline-danger";
  
  
      //if no errors, set the inner HTML of the associated message element to display the valid message
      } else {
        document.getElementById("name_error").innerHTML = "";
  
        //indicate a valid state by changing the button's color back to normal
        //due to bootstrap, change the button's class in order to change the button's color back to normal
        document.getElementById(textbox.name).className = "btn btn-outline-secondary";
      };
};

function checkEmail(textbox) {
    let email = textbox.value

    //initialize variables for error message
    let errorMessage = "";

    let emailRequirement = /^[a-zA-Z0-9_.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,3}$/;

    //check if the entered email does not match the eamil regular expression
     if (!emailRequirement.test(email)) {
        errorMessage += 'Invalid email address';
    }

    // Update HTML elements with error messages or valid messages and adjust button styling
    
    //if errors exist, set the inner HTML of the associated message element to display the error message
    if (errorMessage != 0) {
        document.getElementById("email_error").innerHTML = errorMessage;
  
        //indicate an error state by changing the button's color to red
        //due to bootstrap, change the button's class in order to change the button's color to red
        document.getElementById(textbox.name).className = "btn btn-outline-danger";
  
  
      //if no errors, set the inner HTML of the associated message element to display the valid message
      } else {
        document.getElementById("email_error").innerHTML = "";
  
        //indicate a valid state by changing the button's color back to normal
        //due to bootstrap, change the button's class in order to change the button's color back to normal
        document.getElementById(textbox.name).className = "btn btn-outline-secondary";
      };
};

function checkPassword(textbox) {
    let password = textbox.value;

    // initialize variables for error messages
    let lengthError = "";
    let spaceError = "";
    let specialCharAndNumberError = "";

    // check the length
    if (password.length < 10 || password.length > 16) {
        lengthError = 'Must be 10 ~ 16 characters<br>';
    }

    // check if it contains space characters
    if (password.includes(" ")) {
        spaceError = 'Remove space characters<br>';
    }

    // check if it contains at least one special character and one number
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password) || !/\d+/.test(password)) {
        specialCharAndNumberError = 'Include one special character and one number<br>';
    }

    // Combine all error messages
    let errorMessage = lengthError + spaceError + specialCharAndNumberError;

    // Update HTML elements with error messages or valid messages and adjust button styling

    // if errors exist, set the inner HTML of the associated message element to display the error message
    if (errorMessage !== "") {
        document.getElementById("password_error").innerHTML = errorMessage;

        // indicate an error state by changing the button's color to red
        // due to bootstrap, change the button's class to change the button's color to red
        document.getElementById(textbox.name).className = "btn btn-outline-danger";

    // if no errors, set the inner HTML of the associated message element to display the valid message
    } else {
        document.getElementById("password_error").innerHTML = "";

        // indicate a valid state by changing the button's color back to normal
        // due to bootstrap, change the button's class to change the button's color back to normal
        document.getElementById(textbox.name).className = "btn btn-outline-secondary";
    }
};

function checkConfirmPassword() {
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm_password").value;

    // initialize variables for error message
    let errorMessage = "";

    // check if passwords match
    if (password !== confirm_password) {
        errorMessage = "Passwords do not match<br>";
    }

    // Update HTML elements with error messages or valid messages and adjust styling

    // if errors exist, set the inner HTML of the associated message element to display the error message
    if (errorMessage !== "") {
        document.getElementById("confirm_password_error").innerHTML = errorMessage;

        // indicate an error state by changing the confirm_password's class to red
        // due to bootstrap, change the confirm_password's class to change the button's color to red
        document.getElementById("confirm_password").className = "btn btn-outline-danger";

    // if no errors, set the inner HTML of the associated message element to display a valid message
    } else {
        document.getElementById("confirm_password_error").innerHTML = "";

        // indicate a valid state by changing the confirm_password's class back to normal
        // due to bootstrap, change the confirm_password's class to change the button's color back to normal
        document.getElementById("confirm_password").className = "btn btn-outline-secondary";
    }
}

function registerAlert() {
    let alertMessage ="";

    //get the error messages and display them accordingly
    for (let i=0; i<register_form.elements.length; i++) {
        let inputName = register_form.elements[i].name;

        if (params.has(`${inputName}_type`)) {
            alertMessage += params.get(`${inputName}_type`);
        }

        if (params.has(`${inputName}_length`)) {
            alertMessage += params.get(`${inputName}_length`);
        }

        if (params.has(`${inputName}_exist`)) {
           alertMessage += params.get(`${inputName}_exist`);
        }
    }
    alert(alertMessage);
}