
const fs = require("fs");
const { writeFile } = require("../lib/fileIO");
const log4js = require("log4js");
const logger = log4js.getLogger("rawProject");
const tempFiles = require("./templates/tempfiles.js");
const gitIgnore = tempFiles.gitIgnore();
const _config = tempFiles.config();
const eslint = tempFiles.esLint();

function generateFolderStructure(config){
    var packageJson = tempFiles.packageJson(config);
    var path = config.path+config.projectName;
    fs.mkdirSync(path);
    fs.mkdirSync(path+"/api");
    fs.mkdirSync(path+"/config");
    fs.mkdirSync(path+"/test");
    fs.mkdirSync(path+"/api/controllers");
    fs.mkdirSync(path+"/api/helpers");
    fs.mkdirSync(path+"/api/mocks");
    fs.mkdirSync(path+"/api/swagger");
    return writeFile(path+"/.gitignore",gitIgnore)
    .then(() => writeFile(path+"/.eslintrc.yml",eslint))
    .then(() => writeFile(path+"/config/default.yaml",_config))
    .then(() => writeFile(path+"/package.json", packageJson))
    .then(() => logger.info("Project Structure Created"));
}


module.exports.generateFolderStructure = generateFolderStructure;