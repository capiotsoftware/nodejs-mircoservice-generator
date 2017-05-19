const { checkIffileExists } = require("./fileIO.js");

var questions = [];
questions.push({
    type:"list",
    name:"framework",
    message:"Choose the framework you wish to use?",
    default:"express",
    choices:["express", "koa", "sails", "hapi"]
});
questions.push({
    type:"input",
    name:"projectName",
    message:"Enter the name of the project",
    default:"rawProject"
});
questions.push({
    type:"input",
    name:"path",
    message:"Enter project path",
    default: "./"
});
questions.push({
    type:"confirm",
    name:"singleController",
    message:"Use a single controller? ",
    default:true
});
questions.push({
    type:"confirm",
    name:"newProject",
    message:"Is it a new project? ",
    default:true
});
questions.push({
    type:"input",
    name:"port",
    message:"Enter the port number to start the service",
    default:"10010",
    when:config => config.newProject
});
questions.push({
    type:"input",
    name:"configFile",
    message:"Enter the name of the config file",
    default:"sampleSchema.json",
    validate: checkIffileExists
});
questions.push({
    type:"input",
    name:"db",
    message:"Enter the database name for the service?",
    default:"db",
    when:config => config.newProject
});
questions.push({
    type:"input",
    name:"basePath",
    message:"Enter the basePath for the application",
    default:null,
    when:config => config.newProject
});
questions.push({
    type:"confirm",
    name:"puttuName",
    message:"Require RedisBased Discovery service?",
    default:true,
    when:config => config.newProject
});
questions.push({
    type:"confirm",
    name:"npmInstall",
    message:"Do you want me to perform an NPM install?",
    default:false,
    when:config => config.newProject
});
module.exports.questions = questions;