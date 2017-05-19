/**
 * This module will take care of all the IO operations 
 * 
 */

const fs = require("fs");
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");

function readFile(name,notJson){
    return new Promise((resolve,reject) =>{
        fs.stat(name,(err,stats) => {
            fs.open(name,"r",(err, fd) => {
                if(err){
                    reject(err);
                }
                else{
                    var buffer = new Buffer(stats.size);
                    fs.read(fd, buffer,0, buffer.length, null, function(error, bytesRead, buffer){
                        if(error){
                            reject(error);
                        }
                        else{
                            var data = buffer.toString();
                            try{
                                data = notJson?data:JSON.parse(data);
                                logger.info("Config file read complete");
                                resolve(data);
                            }
                            catch(err){
                                reject(err);
                            }
                        }
                    });
                }
            });
        });
    });
}


function writeFile(path, data){
    return new Promise((resolve,reject) => {
        fs.writeFile(path, data, { flag: "wx" }, err => {
            if(err)
                reject(err);
            else
                resolve();
        });
    });
}

function removeFile(path){
    return new Promise((resolve,reject)=>{
        fs.unlink(path,(err)=>{
            if(err)
                reject(err);
            else
                resolve();
        });
    });
}

function checkIffileExists(fileName){
    try{
        fs.statSync(fileName);
        return true;
    }
    catch(err){
        return false;
    }
}

module.exports.checkIffileExists = checkIffileExists;
module.exports.removeFile = removeFile;
module.exports.writeFile = writeFile;
module.exports.readFile = readFile;