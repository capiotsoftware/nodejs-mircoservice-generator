/**
 * This file will make sure that the installed package structure has all the necessary
 * packages already installed
 *
 */
const exec = require("child_process").exec;
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");

function install(name, path){
    logger.info("Installing required Packages");
    return new Promise((resolve, reject) => {
        exec("npm install express swagger-express-mw@0.1.0 log4js bluebird sequelize pg mongoose https://github.com/capiotsoftware/cuti.git https://github.com/capiotsoftware/puttu-redis.git https://github.com/capiotsoftware/swagger-mongoose-crud.git https://bitbucket.org/capiot/swagger-sequelize-crud.git --save",
        {cwd: path+name}, (error,stdout,stderr) => {
            if(error)
                reject(error);
            else if(stdout){
                logger.info("Required packages have been installed");
                resolve(stdout);
            }
            else
                reject(stderr);
        });
    });
}

module.exports.install = install;
