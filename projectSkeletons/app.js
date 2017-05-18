"use strict";

const { writeFile } = require("../lib/fileIO.js");
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");
const appJsTemplate = require("./templates/app.template.js");

function createAppjsfile(config){
    var appJs = appJsTemplate(config);
    var path = config.path+config.projectName+"/app.js";
    writeFile(path,appJs)
    .then(() => logger.info("App.js created with the suggested configurations"));
}

module.exports.createAppjsfile = createAppjsfile;