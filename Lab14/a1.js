let filename = __dirname+'/user_data.json';

let user_reg_data = require(filename);

console.log(user_reg_data['kazman'].password);

console.log(user_reg_data['kazman'].email);