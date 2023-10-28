function taxCalculator (monthly_sales, tax_rate) {
    let tax_owing=[];
    
    for (i=0; i<monthly_sales.length; i++) {
        let taxAmount = monthly_sales[i] * tax_rate;
        tax_owing.push(taxAmount);
    } 

    return tax_owing;
};

let monthlySales = [1000, 2000, 3000, 4000];
let taxRate = 0.1; //10%

taxCalculator(monthlySales, taxRate);