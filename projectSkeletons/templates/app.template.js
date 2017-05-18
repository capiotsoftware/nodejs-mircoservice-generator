module.exports = function(config){
    var puttuRedis = config.puttuName?`const puttu = require("puttu-redis");
const redis = require("redis");
const client = redis.createClient();

client.on("error", function (err) {
    logger.error("Redis Disconnected, stopping service");
    process.exit(0);
});

puttu.init(client);
    `:"";
    var puttuRegister = config.puttuName?`puttu.register("${config.projectName}", {
            protocol: "http",
            port: port,
            api: "/${config.basePath}/"
        }).catch(err => logger.error(err));
`:"";
    var appJs = `
"use strict";
const SwaggerExpress = require("swagger-express-mw");
const app = require("express")();
const cuti = require("cuti");
const log4js = cuti.logger.getLogger;
const logger = log4js.getLogger("${config.projectName}");
const bluebird = require("bluebird");
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/${config.db}";
${puttuRedis}
global.Promise = bluebird;
global.logger = logger;

mongoose.connect(mongoUrl, err =>{
    if(err){
        logger.error(err);
    }
    else{
        logger.info("Connected to DB");
    }
});

var counter = 0;
var logMiddleware = (req, res, next) => {
    var reqId = counter++;
    if (reqId == Number.MAX_VALUE) {
        reqId = counter = 0;
    }

    logger.info(reqId + " " + req.ip + " " +  req.method + " " + req.originalUrl);
    next();
    logger.trace(reqId + " Sending Response");
};
app.use(logMiddleware);

var config = {
    appRoot: __dirname
};
module.exports = app; 



SwaggerExpress.create(config, function(err, swaggerExpress) {
    if (err) { throw err; }

    swaggerExpress.register(app);

    var port = process.env.PORT || ${config.port};
    app.listen(port, (err) => {
        if(!err){
            ${puttuRegister}
            logger.info("Server started on port "+port);
        }
        else
            logger.error(err);
    });

});
    `;
    return appJs;    
};