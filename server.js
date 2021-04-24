let express = require("express");

let app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const appID = require("ibmcloud-appid");

var port = process.env.PORT || 3030;

app.use(express.static(__dirname + '/public'));





var server = app.listen(port, function() {
    console.log(' Server listening on http://' + "localhost" + ':' + port + "/home.html")
});



//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();