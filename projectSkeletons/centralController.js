const { readFile, writeFile, removeFile } = require("../lib/fileIO.js");
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");
const controllerTemplate = require("./templates/controller.template.js");

function centralController(config){
    var name = config.configFileData.name.split(" ")[0];
    var controller = controllerTemplate(name);
    var path = config.path+config.projectName+"/api/controllers/controller.js";
    if(config.newProject){
        return config.singleController?writeFile(path,controller)
        .then(() => logger.info("controller.js created with the suggested configurations")):
        Promise.resolve();
    }
    else{
        return config.singleController?existingProject(config,name):
        Promise.resolve();
    }
}

function existingProject(config,name){
    var path = config.path+config.projectName+"/api/controllers/controller.js";
    return readFile(path,true)
    .then(data => getModuleExports(data,name))
    .then(file => removeFile(path).then(() => writeFile(path,file)));
}

function getModuleExports(data,name){
    var newModules = `exports.v1_${name}Create = ${name}Controller.create;
exports.v1_${name}List = ${name}Controller.index;
exports.v1_${name}Show = ${name}Controller.show;
exports.v1_${name}Destroy = ${name}Controller.destroy;
exports.v1_${name}Update = ${name}Controller.update;

`;
    var insertPoint = data.indexOf("module.exports");
    var newFile = data.substr(0,insertPoint)+newModules+data.substr(insertPoint);
    insertPoint = data.indexOf("const");
    var newController = `const ${name}Controller = require("./${name}.controller.js");
`;
    newFile = newFile.substr(0,insertPoint)+newController+newFile.substr(insertPoint);
    return newFile;

}
module.exports.centralController = centralController;