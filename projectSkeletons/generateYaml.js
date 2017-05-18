const jsyaml = require("js-yaml");
const { removeFile, writeFile } = require("../lib/fileIO.js");
const fs = require("fs");
const log4js = require("log4js");
const logger = log4js.getLogger("CodeGen");

const getParameters =  [ 
    { name: "page",
       in: "query",
       type: "integer",
       description: "Page number of the request" },
     { name: "count",
       in: "query",
       type: "integer",
       description: "Number of categories per page" },
     { name: "filter",
       in: "query",
       type: "string",
       description: "Filter categories based on certain fields" },
     { name: "select",
       in: "query",
       type: "string",
       description: "Comma seperated fields to be displayed" },
     { name: "sort",
       in: "query",
       type: "string",
       description: "sort parameter" } 
];
const showParameters = [
    { name: "filter",
       in: "query",
       type: "string",
       description: "Filter categories based on certain fields" },
     { name: "select",
       in: "query",
       type: "string",
       description: "Comma seperated fields to be displayed" 
    },{
        name:"id",
        in:"path",
        type:"string",
        required:true,
        description: "Id of the object to be updated",
    }];

function getType(type){
    type = type == "largeString"?"String":type;
    type = type == "String"?"string":type;
    type = type == "Number"?"number":type;
    type = type == "Boolean"?"boolean":type;
    type = type == "Date"?"string":type;
    return type;
}

function getDefinition(json){
    var definition = {properties:{}};
    Object.keys(json).forEach(el => {
        if(el == "_id"){
            json[el]["type"] = "string";
        }
        if(typeof json[el]["type"] == "string"){
            definition["properties"][el] = {
                type:getType(json[el]["type"])
            };
        }
        else if(json[el].constructor == Array){
            if(typeof json[el][0]["type"] == "string" ){
                definition["properties"][el] = {type:"array", items:{type:getType( json[el][0]["type"])}};
            }
            else{
                definition["properties"][el] = {type:"array", items: getDefinition(json[el][0].definition)};
            }
        }
        else{
            definition["properties"][el] = getDefinition(json[el].definition);
        }
    });
    return definition;
}

function getMethodNames(config){
    var name = config.configFileData.name.split(" ")[0];
    if(config.singleController){
        var obj = {};
        obj.create = `v1_${name}Create`;
        obj.list = `v1_${name}List`;
        obj.show = `v1_${name}Show`;
        obj.update = `v1_${name}Update`;
        obj.destroy = `v1_${name}Destroy`;
        obj.controller = "controller";
    }
    else{
        obj = {};
        obj.create = "create";
        obj.update = "update";
        obj.list = "index";
        obj.show = "show";
        obj.destroy = "destroy";
        obj.controller = `${name}.controller`;
    }
    return obj;
}

function generateYaml(config){
    var methodName = getMethodNames(config);
    var path = config.path+config.projectName+"/api/swagger/swagger.yaml";
    var definition = getDefinition(config.configFileData.definition);
    var basePath = config.basePath?config.basePath:config.projectName;
    if(config.newProject){
        var swagger ={
            swagger: "2.0",
            info: {
                version:"0.0.1",
                title:config.projectName+" API"
            },
            host: "localhost:"+config.port,
            basePath: "/"+basePath,
            schemes: [ "http" ],
            consumes: [ "multipart/form-data", "application/json" ],
            produces: [ "application/json", "text/plain" ],
            paths:{},
            definitions:{}
        };
    }
    else{
        swagger = jsyaml.safeLoad(fs.readFileSync(path,"utf8"));
    }
    var name = config.api?config.api:config.configFileData.name.split(" ")[0];
    swagger.definitions[`${name}_create`] = definition;
    swagger.paths["/v1/"+name] = {
        "x-swagger-router-controller":`${methodName.controller}`,
        "get":{
            description:`Retrieve a list of ${name}`,
            operationId:`${methodName.list}`,
            parameters:getParameters,
            responses:{ 
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters"},
                "404": { description: "No categories to list with the given parameter set."},
                "500": { description: "Internal server error"} 
            }
        },
        "post":{
            description:`Create a new ${name}`,
            operationId:`${methodName.create}`,
            parameters:[{
                name: "data",
                in: "body",
                description: `Payload to create a ${name}`,
                schema:{
                    $ref:`#/definitions/${name}_create`
                }
            }],
            responses:{ 
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters"},
                "404": { description: "No categories to list with the given parameter set."},
                "500": { description: "Internal server error"} 
            }
        }
    };
    swagger.paths["/v1/"+name+"/{id}"] = {
        "x-swagger-router-controller":`${methodName.controller}`,
        "get":{
            description:`Retrieve a list of ${name}`,
            operationId:`${methodName.show}`,
            parameters:showParameters,
            responses:{ 
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters"},
                "404": { description: "No categories to list with the given parameter set."},
                "500": { description: "Internal server error"} 
            }
        },
        "put":{
            description:`Create a new ${name}`,
            operationId:`${methodName.update}`,
            parameters:[{
                name: "data",
                in: "body",
                description: `Payload to update a ${name}`,
                schema:{
                    $ref:`#/definitions/${name}_create`
                }
            },{
                name:"id",
                in:"path",
                type:"string",
                required:true,
                description: `Id of the ${name} to be updated`,
            }],
            responses:{ 
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters"},
                "404": { description: "No categories to list with the given parameter set."},
                "500": { description: "Internal server error"} 
            }
        },
        "delete":{
            description:`Create a new ${name}`,
            operationId:`${methodName.destroy}`,
            parameters:[{
                name:"id",
                in:"path",
                type:"string",
                required:true,
                description: `Id of the ${name} to be updated`,
            }],
            responses:{ 
                "200": { description: "List of the entites" },
                "400": { description: "Bad parameters"},
                "404": { description: "No categories to list with the given parameter set."},
                "500": { description: "Internal server error"} 
            }
        }
    };
    var promise = !config.newProject?removeFile(path):Promise.resolve();
    promise
    .then(() => writeFile(path,jsyaml.safeDump(swagger)))
    .then(() => logger.info("swagger.Yaml created with the suggested configurations")); 
}

module.exports.generateYaml = generateYaml;