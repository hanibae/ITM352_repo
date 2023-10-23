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

//Part 4
function isNonNegInt(q) {
    let errors = []; // assume no errors at first
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return errors.length == 0; // Return true if there are no errors, false otherwise
}

for (let i=0; i<pieces.length; i++) {
    let result = isNonNegInt(pieces[i]);
    console.log(`Part ${pieces[i]} is a non negative integer: ${result}`);
};
