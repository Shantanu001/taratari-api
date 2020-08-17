const express = require("express");
var Request = require("request");
var Util = require("util");
const app = express();
const port = 8080;
let nodeGeocoder = require("node-geocoder");
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

let options = {
  provider: "openstreetmap",
};
let geoCoder = nodeGeocoder(options);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/getLocation", async (req, res) => {
  // let requestPromise = Util.promisify(Request);
  // let result = await requestPromise("https://api.ipdata.co/?api-key=test");
  //console.log("1234",result.body);
  let lat = req.query.lat;
  let lon = req.query.lon;
    geoCoder.reverse({ lat: lat, lon: lon },function(err,result){
      if(err){
        res.send(err);
      }else{
        res.send(result)
      }
    });

    /** A list of matching locations is returned */
    // console.log(JSON.stringify(location));
    // res.send(location);
});

app.get("/getProductList", async (req, res) => {
  MongoClient.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  },function(err, client) {
    if (err) throw err;
    var db = client.db("idhardekho");
    db.collection("Product").find().toArray(function(err, result) {
      console.log("here",err,result);
      if (err) throw err;
      res.send(result);
      client.close();
    });
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
