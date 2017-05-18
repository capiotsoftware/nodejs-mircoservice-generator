/**
 * 
 * This file will take care of all the IO operations.
 */


const readLine = require("readline");
const rl = readLine.createInterface({input:process.stdin,output:process.stdout});

function userInput(line){
    return new Promise(resolve => {
        rl.question(line, output => resolve(output));
    });  
}

function closeIO(){
    rl.close();
}
module.exports.closeIO = closeIO;
module.exports.userInput = userInput;