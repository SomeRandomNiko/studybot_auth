import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 8081,
    mongodbURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/studybot',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    digregClientId: process.env.DIGREG_CLIENT_ID || '',
    digregClientSecret: process.env.DIGREG_CLIENT_SECRET || '',
    digregRedirectUri: process.env.DIGREG_REDIRECT_URI || '',
    discordClientId: process.env.DISCORD_CLIENT_ID || '',
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    discordRedirectUri: process.env.DISCORD_REDIRECT_URI || '',
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',
    frontendServerUri: process.env.FRONTEND_SERVER_URI || 'http://localhost:4200',
    apiServerUri: process.env.API_SERVER_URI || 'http://localhost:8080',
}