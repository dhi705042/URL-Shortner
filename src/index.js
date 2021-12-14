const express = require('express');
var bodyParser = require('body-parser');
const redis = require("redis");

const redisClient = redis.createClient(
    15827,
    "redis-15827.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
const { response } = require('express');


mongoose.connect("mongodb+srv://user-open-to-all:hiPassword123@cluster0.xgk0k.mongodb.net/group1PDAM-DB?retryWrites=true&w=majority")
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

redisClient.auth("B319nmG7lHoNE5u3sDgBsQGsnWLYPzOk", function (err) {
    if (err) throw err;
  });
  
redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });