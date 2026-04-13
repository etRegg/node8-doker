
services:
  maria_db:
    image: mariadb:latest
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: your_database_name
      MYSQL_USER: your_username
      MYSQL_PASSWORD: your_password
    ports:
      - "3306:3306"
    volumes:
      - maria_db_data:/var/lib/mysql

  web:
    build: .
    command: npm start
    ports:
      - "3000:3000"
    depends_on:
      - maria_db
volumes:
  maria_db_data:
  
TOOL_NAME: run_terminal_command
  BEGIN_ARG: command
     docker-compose down
     docker-compose up --build -d

const express = require('express');
const path = require('path');
var bodyParser     =        require("body-parser");
app.use(bodyParser.json());

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const prisma = new PrismaClient();

// Passport setup
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://oauth2.example.com/oauth/authorize',
    tokenURL: 'https://oauth2.example.com/oauth/token',
    clientID: '<client_id>',
    clientSecret: '<client_secret>'
  },
  async function(accessToken, refreshToken, scope) {
    // Aquí manejas el callback que OAuth te proporciona
    return await prisma.user.findFirst({ where: { id: user.id } });
  }
));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: 'your_jwt_secret'
};

passport.use(new JwtStrategy(opts, async (token, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: token.userId }});
      if (!user) return done(null, false);

      done(null, user);
    } catch(e) {
      done(e);
    }
  }
));

// Middleware de autenticación
app.use(passport.initialize());