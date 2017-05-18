const json = require("./ifsc-schema.json");
const jsyaml = require("js-yaml");


function processObject(json){
    var definition = {};
    json.fields.forEach(el => {
        if(typeof el["type"] == "string"){
            el["type"] = el["type"] == "largeString"?"String":el["type"];
            el["type"] = el["type"] == "string"?"String":el["type"];
            el["type"] = el["type"] == "number"?"Number":el["type"];
            el["type"] = el["type"] == "boolean"?"Boolean":el["type"];
            definition[el["name"]] = {
                type:el["type"]
            };
        }
        else if(el["type"].constructor == Array){
            if(typeof el["type"][0] == "string" )
                definition[el["name"]] = [{type:el["type"][0]}];
            else
                definition[el["name"]] = [processObject(el["type"][0])];
        }
        else{
            definition[el["name"]] = processObject(el["type"]);
        }
    });
    return definition;
}

function generateYaml(json){
    var definition = {properties:{}};
    json.fields.forEach(el => {
        if(typeof el["type"] == "string"){
            el["type"] = el["type"] == "largeString"?"string":el["type"];
            el["type"] = el["type"] == "string"?"string":el["type"];
            el["type"] = el["type"] == "number"?"number":el["type"];
            el["type"] = el["type"] == "boolean"?"boolean":el["type"];
            definition["properties"][el["name"]] = {
                type:el["type"]
            };
        }
        else if(el["type"].constructor == Array){
            if(typeof el["type"][0] == "string" )
                definition["properties"][el["name"]] = {type:"array", items:{type:el["type"][0]}};
            else{
                definition["properties"][el["name"]] = {type:"array", items: generateYaml(el["type"][0])};
            }
                //definition[el["name"]] = [];
        }
        else{
            definition["properties"][el["name"]] = generateYaml(el["type"]);
        }
    });
    return definition;
}

console.log(jsyaml.safeDump(generateYaml(json.list[0]),null,4));
// console.log(JSON.stringify(processObject(json.list[0]),null,4));