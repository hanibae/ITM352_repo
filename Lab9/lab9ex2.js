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

