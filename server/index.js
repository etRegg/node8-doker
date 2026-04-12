const express = require('express');
const path = require('path');

var router = express.Router();
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.get('/texto', function(req, res,next) {
  res.status(200).json({ otherText: 'one text' });
  next();
});

router.post('/texto',function(req,res){
    const texto = req.body.text;
    console.log(  JSON.stringify(req.body));

   res.status(200).json(req.body);
});

// Usar el router primero para las rutas API
app.use(router);

// Luego servir archivos estáticos del cliente
const buildPath = path.join(__dirname, '../cliente/build');
app.use(express.static(buildPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});


const PORT =  8080;
app.listen(PORT, function(){
    console.log("My http server listening on port " + PORT + "...");
});
