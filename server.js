let express = require("express");

let app = express();
const mongoose = require("mongoose");
// const passport = require("passport");
// const app = require('express')();
// const session = require('express-session');
// const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const user = require('./model/user.js')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'xChzKjT!!0V&VfmxdnhJo2W+XR4*z*!rF68aNMS@66k3yg!MQty!ScObj8fKUt'

// app.use(session({
//     secret: '123456',
//     resave: true,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.serializeUser((user, cb) => cb(null, user));
// passport.deserializeUser((user, cb) => cb(null, user));

// passport.use(new WebAppStrategy({
//     clientId: "e6ccd665-ddc6-40e0-887d-cbc51025bae5",
//     tenantId: "a05e4069-b9c8-4286-b9e3-d6c79451561d",
//     secret: "NDM5M2Q2ZjEtODEzOC00ZDZlLWI3NjMtMGMzYmFjOThlNjQy",
//     name: "MyMedicine",
//     oAuthServerUrl: "https://au-syd.appid.cloud.ibm.com/oauth/v4/a05e4069-b9c8-4286-b9e3-d6c79451561d",
//     redirectUri: "https://localhost:8080/home.html"
// }));
//this to block my wedsite
// app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME))
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));



// const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://medicine:test123@sit737.jj6ox.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const uri = "mongodb://medicine:test123@sit737-shard-00-00.jj6ox.mongodb.net:27017,sit737-shard-00-01.jj6ox.mongodb.net:27017,sit737-shard-00-02.jj6ox.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-erp3hd-shard-0&authSource=admin&retryWrites=true&w=majority"
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


// let collectionMessage;

// client.connect(err => {
//     collectionMessage = client.db("medicine").collection("user");
// });

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

// let Name, Email, user, Username, Password, DOB, gender, Phone

// const insertMessage = (user) => {
//     try {
//         collectionMessage.insertOne({
//             Name: user.Name,
//             Email: user.Email,
//             Username: user.Username,
//             Password: user.Password,
//             DOB: user.DOB,
//             gender: user.gender,
//             Phone: user.Phone
//         });

//     } catch (e) {
//         console.log(e)
//     }

// }
// app.get('/user', function(req, res) {

//     let Name = req.query.Name
//     let Email = req.query.Email
//     let Username = req.query.Username
//     let Password = req.query.Password
//     let DOB = req.query.DOB
//     let gender = req.query.gender
//     let Phone = req.query.Phone

//     insertMessage({
//         Name: Name,
//         Email: Email,
//         Username: Username,
//         Password: Password,
//         DOB: DOB,
//         gender: gender,
//         Phone: Phone
//     });

//     res.send('user created')
// });
// app.get("/UserLogin", function(request, response) {
//     // var user_name = request.query.user_name;
//     // response.end("Hello " + user_name + "!");

//     response.sendFile(__dirname + '/public/SignIn.html');
// });
app.use(bodyParser.json()) //converting to json payload


app.post('/api/login', async(req, res) => {
    const { email, password } = req.body
    const users = await user.findOne({ email }).lean()

    if (!users) {
        return res.json({ status: 'error', error: 'Invalid username/password' })
    }

    if (await bcrypt.compare(password, users.password)) {
        // the username, password combination is successful

        const token = jwt.sign({
                id: users._id,
                email: users.email
            },
            JWT_SECRET
        )
        return res.json({ status: 'ok', data: token })

    } else {

        res.json({ status: 'error', error: 'Invalid Email/password' })
    }
})
app.post('/api/register', async(req, res) => {

    const { email, password: plainTextPassword, username, PhoneNumber } = req.body
    if (!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Email' })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }

    if (plainTextPassword.length < 5) {
        return res.json({
            status: 'error',
            error: 'Password too small. Should be atleast 6 characters'
        })
    }
    const password = await bcrypt.hash(plainTextPassword, 10) //fix length of password



    try {
        const response = await user.create({
            email,
            password,
            username,
            PhoneNumber
        })
        console.log('User created successfully: ', response)
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }
    res.json({ status: 'ok' })



})


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