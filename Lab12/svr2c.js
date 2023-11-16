//create an express application
let express = require('express');
//name that application 'app'
let app = express();

//if there are static files to present, go to public
app.use(express.static(__dirname + '/public'));


//add a route to match with a GET request
app.get('/test', function (req, res) {
    res.send('app.get for test was executed');
    console.log('app.get for test was executed');
});

app.all('*', function (request, response, next) {
    //response.send(request.method + ' to path ' + request.path);
    console.log(request.method + ' to path ' + request.path);
});

app.listen(8080, () => console.log(`listening on port 8080`)); //note the use of an anonymous function here to do a callback