const express = require('express');
const path = require('path');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var bodyParser     =        require("body-parser");
var bodyParser     =        require('body-parser');
app.use(bodyParser.json());

  console.log('Time:', Date.now());

app.get('/texto', function(req, res,next) {
  res.status(200).json({ otherText: 'one text' });
  next();
});

app.post('/texto',function(req,res){
    const texto = req.body.text;
    console.log(JSON.stringify(req.body));

   res.status(200).json(req.body);
});

// Usar el router primero para las rutas API
//app.use(router);

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

app.use(async (req, res, next) => {
  // Verificar si el usuario está autenticado aquí.
  if (!res.isAuthenticated()) {
    return res.status(401).json({ message: 'Auth error' });
  }
  req.user = await prisma.user.findUnique({ where: { id: req.user.id } });
  next();
});

// Definir tus rutas aquí.
app.get('/test', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1+1 AS solution");
        console.log(rows);
        res.send('Database is working!');
    } catch (err) {
        res.status(500).send(err.message);
    }
  } )   

// Luego servir archivos estáticos del cliente
const buildPath = path.join(__dirname, '../cliente/build');
app.use(express.static(buildPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
app.get('/*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = 8080;

console.log("My http server listening on port " + PORT + "...");
