let express = require("express");

let app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const appID = require("ibmcloud-appid");
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const user = require('./DB/models/user.js');
// const jwt = require('jsonwebtoken');
const uri = require('./configurations/env.js');
const JWT_SECRET = require('./configurations/env.js');
// const CALLBACK_URL = "/signin.html";
const CALLBACK_URL = "/ibm/cloud/appid/callback";
var port = process.env.PORT || 8080;
const WebAppStrategy = appID.WebAppStrategy;
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true,
    proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());






let webAppStrategy = new WebAppStrategy(getAppId());
passport.use(webAppStrategy);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, { failureRedirect: '/error' }));
app.use("/protected", passport.authenticate(WebAppStrategy.STRATEGY_NAME));
app.use('/protected', express.static("protected"));

app.get("/logout", (req, res) => {
    WebAppStrategy.logout(req);
    res.redirect("/home.html");
});

app.use(bodyParser.json()) //converting to json payload

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})


//Serves the identity token payload
app.get("/protected/api/idPayload", async(req, res) => {
    res.send(req.session[WebAppStrategy.AUTH_CONTEXT].identityTokenPayload);
    let email = res.req.user.email
    let name = res.req.user.name
    req.body = { email, name }
        // const password = await bcrypt.hash(plainTextPassword, 10) //fix length of password
    try {
        const response = await user.create({
                email,
                name //,
                // password
            })
            // console.log('User created successfully: ', response)
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }


})



app.get('/error', (req, res) => {
    res.send('Authentication Error');
});

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

// app.get("/UserLogin", function(request, response) {
//     // var user_name = request.query.user_name;
//     // response.end("Hello " + user_name + "!");

//     response.sendFile(__dirname + '/public/SignIn.html');
// });



// app.post('/api/login', async(req, res) => {
//     const { email, password } = req.body
//     const users = await user.findOne({ email }).lean()

//     if (!users) {
//         return res.json({ status: 'error', error: 'Invalid username/password' })
//     }

//     if (await bcrypt.compare(password, users.password)) {
//         // the username, password combination is successful

//         const token = jwt.sign({
//                 id: users._id,
//                 email: users.email
//             },
//             JWT_SECRET
//         )
//         return res.json({ status: 'ok', data: token })

//     } else {

//         res.json({ status: 'error', error: 'Invalid Email/password' })
//     }
// })
// app.post('/api/register', async(req, res) => {

//     const { email, password: plainTextPassword, username, PhoneNumber } = req.body
//     if (!email || typeof email !== 'string') {
//         return res.json({ status: 'error', error: 'Invalid Email' })
//     }

//     if (!plainTextPassword || typeof plainTextPassword !== 'string') {
//         return res.json({ status: 'error', error: 'Invalid password' })
//     }

//     if (plainTextPassword.length < 5) {
//         return res.json({
//             status: 'error',
//             error: 'Password too small. Should be atleast 6 characters'
//         })
//     }
//     const password = await bcrypt.hash(plainTextPassword, 10) //fix length of password



//     try {
//         const response = await user.create({
//             email,
//             password,
//             username,
//             PhoneNumber
//         })
//         console.log('User created successfully: ', response)
//     } catch (error) {
//         if (error.code === 11000) {
//             // duplicate key
//             return res.json({ status: 'error', error: 'Username already in use' })
//         }
//         throw error
//     }
//     res.json({ status: 'ok' })



// })


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

function getAppId() {
    let config;

    try {
        // if running locally we'll have the local config file
        config = require('./configurations/APPID.json');
    } catch (e) {
        if (process.env.APPID_SERVICE_BINDING) { // if running on Kubernetes this env variable would be defined
            config = JSON.parse(process.env.APPID_SERVICE_BINDING);
            config.redirectUri = process.env.redirectUri;
        } else { // running on CF
            let vcapApplication = JSON.parse(process.env["VCAP_APPLICATION"]);
            return { "redirectUri": "https://" + vcapApplication["application_uris"][0] + CALLBACK_URL };
        }
    }
    return config;
}



var server = app.listen(port, function() {
    console.log(' Server listening on http://' + "localhost" + ':' + port + "/home.html")
});



//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();