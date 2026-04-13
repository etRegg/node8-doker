
const express = require('express');
const path = require('path');


var app = new  express();
var bodyParser     =        require("body-parser");
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//import { PrismaClient } from '@prisma/client';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');
const passport = require('passport');


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



//Login route
app.post('/api/login', (req, res) => {
  passport.authenticate('basic-client-password', { session: false }, async (error, user, info) => {
    if(!user) throw new Error(error);

    const token = jwt.sign({ userId: user.id, email: user.email }, 'your_jwt_secret');

    // Generamos Refresh Token
    const refreshToken = await prisma.refreshToken.create({
      data: {
        token: jwt.sign({ userId: user.id, email: user.email }, 'your_refresh_jwt_secret', { expiresIn: 604800 }), // Expires in 604800 seconds (7 days)
        expiresAt: new Date(Date.now() + 86400 * 7* 1000), // Expire at current time + 7 days
        user: { connect: { id: user.id } }
      }
    });

    res.json({ 
      access_token: token,
      refresh_token: refreshToken.token,
      token_type: "Bearer",
      expires_in: 604800 // segundos (7 días)
    });
  })(req, res);
});


app.post('/api/refreshAccessToken', async (req, res) => {
  const { refreshToken } = req.body;

  if(!refreshToken) return res.status(403).json({ message: 'Missing refresh token' });

  // Buscamos el refresh token
  const foundRefreshToken = await prisma.refreshToken.findFirst({ where: { token: refreshToken } });
  
  if(!foundRefreshToken) return res.status(401).json({ message: 'Invalid refresh token' });

  if (new Date() > new Date(foundRefreshToken.expiresAt)) {
    const deletedExpiredRefreshToken = await prisma.refreshToken.delete({ where: { id: foundRefreshToken.id } });
    return res.status(401).json({ message: 'Refresh token has expired, please log in again' });
  }

  // Generamos un nuevo JWT
  const token = jwt.sign({ userId: foundRefreshToken.userId }, 'your_jwt_secret');

  // Actualizamos el expira timestamp del refreshtoken para evitar más refrescos a menos que lo cambie el usuario.
  await prisma.refreshToken.update({
    where: { id: foundRefreshToken.id },
    data: {
      expiresAt: new Date(new Date() + 86400 * 7* 1000) // Expire at current time + 7 days
    }
  });

  res.json({ 
    access_token: token,
    refresh_token: refreshToken,
    token_type: "Bearer",
    expires_in: 604800 // segundos (7 días)
  });
});