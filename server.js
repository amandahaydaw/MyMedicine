let express = require("express");
let app = express();

const mongoose = require("mongoose");
const passport = require("passport");
//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);





var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get("/UserLogin", function(request, response) {
    // var user_name = request.query.user_name;
    // response.end("Hello " + user_name + "!");

    response.sendFile(__dirname + '/public/SignIn.html');
});


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://medicine:test123@sit737.jj6ox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


let collectionMessage;

client.connect(err => {
    collectionMessage = client.db("medicine").collection("users");
});
let Name, Email, user, Username, Password, DOB, gender, Phone

const insertMessage = (user) => {
    try {
        collectionMessage.insertOne({
            Name: user.Name,
            Email: user.Email,
            Username: user.Username,
            Password: user.Password,
            DOB: user.DOB,
            gender: user.gender,
            Phone: user.Phone
        });

    } catch (e) {
        console.log(e)
    }

}
app.get('/user', function(req, res) {

    let Name = req.query.Name
    let Email = req.query.Email
    let Username = req.query.Username
    let Password = req.query.Password
    let DOB = req.query.DOB
    let gender = req.query.gender
    let Phone = req.query.Phone

    insertMessage({
        Name: Name,
        Email: Email,
        Username: Username,
        Password: Password,
        DOB: DOB,
        gender: gender,
        Phone: Phone
    });

    res.send('user created')
});

//socket test
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);

});


// http.listen(port, () => {
//     console.log("Listening on port ", port);
// });
var server = app.listen(port, function() {
    var host = server.address().address;
    // log("app is listening at", "https://" + host, port);
    console.log(' Server listening on http://' + "localhost" + ':' + port)
});

//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();