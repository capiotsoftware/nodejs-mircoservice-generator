#! /usr/bin/env node
/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

const readLine = require("../lib/input.js");
const installPackages = require("../lib/installPackages.js");
const { generateDefinition } = require("../lib/createDefinition.js");
const fileIO = require("../lib/fileIO.js");
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();
const questions = require("../lib/questions").questions;
const { createAppjsfile } = require("../projectSkeletons/app.js");
const { createController } = require("../projectSkeletons/controller.js");
const { centralController } = require("../projectSkeletons/centralController.js");
const { generateYaml } = require("../projectSkeletons/generateYaml.js");
const { generateFolderStructure } = require("../projectSkeletons/createProjectStructure");

global.logger = logger;
var config = {};
function init(){
    prompt(questions)
    .then(result => {
        config = result;
        return startProcessing();
    }).then(() =>{
        logger.info("Your project structure is ready");
        readLine.closeIO();
    }).catch(err => {
        logger.error(err);
        readLine.closeIO();
    });
}

function startProcessing(){

    var promise = config.newProject?generateFolderStructure(config):
        Promise.resolve();
    return promise
    .then(() => config.npmInstall?installPackages.install(config.projectName, config.path):Promise.resolve())
    .then(() => fileIO.readFile(config.configFile))
    .then(data => {config.configFileData = data; return generateDefinition(config.path+config.projectName,data);})
    .then(() => config.newProject?createAppjsfile(config):Promise.resolve())
    .then(() => createController(config))
    .then(() => centralController(config))
    .then(() => generateYaml(config));
}


init();