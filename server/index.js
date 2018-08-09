const request = require('supertest');
const express = require('express');


var router = express.Router();
var app = express();


var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  //res.header('Access-Control-Allow-Credentials' ,'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT , HEAD, OPTIONS');
  res.header("Access-Control-Allow-Headers", "DNT,X-CustomHeader,Keep-Alive,User-Agent,Origin, X-Requested-With, Content-Type, Accept");
  next();
});


router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});



router.get('/texto', function(req, res,next) {
  res.status(200).json({ otherText: 'one text' });
  next();
});


router.post('/texto',function(req,res){
  var texto = req.body.text;
  console.log(  JSON.stringify(req.body));

   res.status(200).json(req.body).then(response => JSON.(response.jsonData));
});




app.use('/',router);

const PORT =  8080;
app.listen(PORT, function(){
    console.log("My http server listening on port " + PORT + "...");
});

chai = require('chai'),


ex = chai.expect;
  request(app)
        .get('/texto')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '24')
        .expect(200)
        .end(function(err, res) {
          if (err) throw err;
          console.log('exito');
        });





var task= {text:'integration test'};

      request(app) .post('/texto') .send(task) .end(function(err, res) {

        ex(String(res.body.text)).to.equal('integration test');
        task = res.body;
        console.log('exito');
      });
