
const { writeFile } = require("../lib/fileIO.js");
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");
const controllerTemplate = require("./templates/controller.main.template.js");

function createController(config){
    var name = config.configFileData.name.split(" ")[0];
    var controllerJs = controllerTemplate(name,config);
    let path = config.path+config.projectName+`/api/controllers/${name}.controller.js`;
    return writeFile(path,controllerJs)
    .then(() => logger.info(`${name}.controller.js created with the suggested configurations`));
}
module.exports.createController = createController;
