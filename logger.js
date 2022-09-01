require("dotenv").config()
const winston = require("winston")

const logger = winston.createLogger({
    transports:[
        new winston.transports.File({filename:"mylogs.log"}),
]
})
if(process.env.NODE_ENV !== "production"){
    logger.add(new winston.transports.Console())
}

module.exports =(level, message) => logger.log({
    level:level,
    message:message
})