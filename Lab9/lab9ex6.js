/*
//Part 2
let attributes = "<name>;<age>;<major>";
let myArray = attributes.split(";");
let name = myArray[0].slice(1,-1);
let age = myArray[1].slice(1,-1);
let major = myArray[2].slice(1,-1);
console.log(name);
console.log(age);
console.log(major); 
*/

//Part 3 a
let attributes = "<name>;<age>;<age + 0.5>;<0.5 - age>";
let pieces = attributes.split(";");
for (let i=0; i<pieces.length; i++) {
    console.log("Part: ",pieces[i]);
    console.log("Data Type: ", typeof(pieces[i]))
};

//Part 3 b
let invertedString = pieces.join(",");
console.log("Inverted String: ", invertedString);

/*
//Part 4 b
function isNonNegInt(q, returnErrors=false) {
    let errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
};

for (let i=0; i<pieces.length; i++) {
    let result = isNonNegInt(pieces[i], true);
    console.log(`Errors for ${pieces[i]} is: ${result}`);
};
*/

//Part 4 c
//validateNonNegInt() function validates wheter a string represents a non negative integer.
//parameter input : the input string to validate
//parameter returnErrors : (Optional) When true, returns an array of errors; When false, returns a boolean
//returns true if the input is a non negative integer, or an array of errors if not.
function validateNonNegInt(input, returnErrors = false) {
    let errors = []; // assume no errors at first
    if (Number(input) != input) errors.push('Not a number!'); // Check if string is a number value
    if (input < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(input) != input) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
};

//Part 6 a
/*function checkIt(item, index) {
    console.log(`Part ${index} is ${(validateNonNegInt(item) ? 'a' : 'not a')} quantity.`)
}

pieces.forEach(checkIt) */

//Part 6 b
pieces.forEach((item, index) => {
    item = item.replace(/<|>/g, '');
    console.log(`Part ${index} is ${(validateNonNegInt(item) ? 'a' : 'not a')} quantity.`);
});

//Part 6 c
/*
function download(url) {
    setTimeout(() => {
        // script to download the picture here
        console.log(`Downloading ${url} ...`);
        picture_data = "image data:XOXOXO";
        return picture_data;
    }, 3* 1000);
    
}

function process(picture) {
    console.log(`Processing ${picture}`);
}

let url = 'https://www.example.com/big_pic.jpg';
process( download(url) );
*/

function download(url, callback) {
    setTimeout(() => {
        // Simulate downloading the picture
        console.log(`Downloading ${url} ...`);
        const picture_data = "image data:XOXOXO";
        callback(picture_data); // Call the callback with the downloaded data
    }, 3 * 1000);
};

function process(picture) {
    console.log(`Processing ${picture}`);
}

let url = 'https://www.example.com/big_pic.jpg';

//Use download with a callback to process the picture
download(url, process);