require("dotenv").config()
const envs = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    baseURL: process.env.BASE_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    clientUrl: process.env.APP_UI_URL,
    secret: process.env.SECRET,
    redisPassword: process.env.REDISPASSWORD,
    redisHost: process.env.REDISHOST,
    redisPort: process.env.REDISPORT,
    cacheTime: process.env.CACHETIME,
    mailAddress: process.env.MAIL_ADDRESS,
    mailPort: process.env.MAIL_PORT,
    mailAddress: process.env.MAIL_ADDRESS,
    mailService: process.env.MAIL_SERVICE,
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailHost: process.env.MAIL_HOST,
    paystackBaseUrl: process.env.PAYSTACK_BASE_URL,
    paystackSecret: process.env.PAYSTACK_SECRET
}

module.exports = envs