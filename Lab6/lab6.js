let monthname = document.getElementById("month");
let calculatebutton = document.getElementById("calculate");
let finalresult = document.getElementById("result");

calculatebutton.addEventListener("click", function() {
    let whatmonth=monthname.value.trim().toLowerCase();
    let num_days;
    switch(whatmonth) {
        case "january":
            num_days = 31;
            break;
        case "february":
            num_days = 28;
            break;
        case "march":
            num_days = 31;
            break;
        case "april":
            num_days = 30;
            break;
        case "may":
            num_days = 31;
            break;
        case "june":
            num_days = 30;
            break;
        case "july":
            num_days = 31;
            break;
        case "august":
            num_days = 31;
            break;
        case "september":
            num_days = 30;
            break;
        case "october":
            num_days = 31;
            break;
        case "november":
            num_days = 30;
            break;
        case "december":
            num_days = 31;
            break;
        default:
            num_days = -1;
            break;
    }

    if (num_days == -1) {
        finalresult.textContent = "There is an error. Please try again.";
    } else {
        finalresult.textContent = `There are ${num_days} days in ${whatmonth.charAt(0).toUpperCase()+whatmonth.slice(1)}.`;
    }

});
