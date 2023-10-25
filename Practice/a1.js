function myDisplayer(display){
    console.log(display);
};

function myCalculator(num1, num2, myCallback) {
    let sum = num1 + num2;
    myCallback(sum);
};

myCalculator(1, 2, myDisplayer);