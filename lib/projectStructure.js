/**
 * 
 * 
 * This file will ensure that a raw project structure is created for the codeGenerator.
 */


// const spawn = require("child_process").spawn;
// const cd = spawn("cd",["../.."]);
const exec = require("child_process").exec;
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");

function create(name, framework, path){
    logger.info("Creating project structure");
    return new Promise((resolve,reject) => {
        exec("swagger project create -f "+framework+" "+name,{cwd: path},(error,stdout, stderr) => {
            if(error)
                reject(error);
            else{
                logger.info("Project Structure Created");
                resolve(stdout);
            }
        });
    });
}

function open(){

}

module.exports.create = create;
module.exports.open = open;