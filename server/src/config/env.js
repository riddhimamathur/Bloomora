require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  prisma,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'bloomora_super_secret_jwt_key_2026',
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID || '',
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET || ''
};
