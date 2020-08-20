const express = require("express");
var Request = require("request");
var Util = require("util");
const app = express();
const port = 8080;
let nodeGeocoder = require("node-geocoder");
var mongo = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017";
// const ngrok  = require("ngrok");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Shantanu:bb0pD4SFebUd72gd@cluster0-fzxvj.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
var ObjectId = require('mongodb').ObjectId; 

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


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
        res.send(result);
      }
    });

    /** A list of matching locations is returned */
    // console.log(JSON.stringify(location));
    // res.send(location);
});

app.get("/getProductList", async (req, res) => {
  MongoClient.connect(uri,{
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

app.get("/getProductListById", async (req, res) => {
  //console.log(req);
  //res.send({"data":req.query._id});
  let _id = new ObjectId(req.query._id);
  MongoClient.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  },function(err, client) {
    if (err) throw err;
    var db = client.db("idhardekho");
    
    db.collection("Product").findOne({_id:_id},(function(err, result) {
      //console.log("here",err,result);
      if (err) throw err;
      console.log("123",result);
      res.send(result);
      client.close();
    }));
  });
});

app.get("/getCategoryList", async (req, res) => {
  let categoryList = ["Cars","Bikes","Furniture","Jobs","Electronics&Appliances","Fashion","Mobiles","Services","Properties&Rent","Pets","Books,Sports&Hobbies","Others"];
  res.send({"data":categoryList,"status":200});
});

app.listen(port, () =>{
  console.log(`Example app listening at http://localhost:${port}`);
  // (async function(){
  //   const publicEndPoint = await ngrok.connect(8080);
  //   console.log(`public url for port 8080 is available at ${publicEndPoint}`);
  // })()
});
