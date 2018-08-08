const request = require('supertest');
const express = require('express');



var router = express.Router();
var app = express();


var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

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
    JSON.stringify(res.body);

  res.end(JSON.stringify({text: texto}));
});




app.use('/',router);

const PORT =  80;
app.listen(PORT, function(){
    console.log("My http server listening on port " + PORT + "...");
});


 
request(app)
  .get('/texto')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '24')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    console.log('Exito');
  });
request(app)
   .post('/texto')
   .send({ text: 'One Dog!!' })
   .set('Accept', 'application/json')
   .expect(200)
   .end(function(err, res){
     if (err || !res.text) {
      console.log('error');
     } else {
       console.log( res.text);
     }
   });
