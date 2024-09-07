const winston = require("winston")
const config = require("./config/config")

const logger = winston.createLogger({
    transports:[
        new winston.transports.File({filename:"mylogs.log"}),
]
})
if(config.env !== "production"){
    logger.add(new winston.transports.Console())
}

module.exports =(level, message) => logger.log({
    level:level,
    message:message
})