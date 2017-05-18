/**
 * This module will create a definition file from the configuration provided by the user
 */
/**
    addtional fields as 
    options:{
        default:"Supply the default value"
        enum:["EnumValue1", "EnumValue2"]
        unique:true,
        sparse:true,
        required:true,
        match:["regex"]
    }
*/

const fileIO = require("./fileIO.js");

function processObject(json){
    var definition = {};
    var backendProperties = ["default", "enum", "sparse", "unique", "required"];
    Object.keys(json)
    .forEach(el => {
        if(typeof json[el]["type"] == "string"){
            definition[el] = {type: json[el]["type"]};
            backendProperties.forEach(_el => {
                if(json[el][_el])
                    definition[el][_el] = json[el][_el];    
            });
        }
        else if(json[el].constructor == Array){
            if(typeof json[el][0]["type"] == "string"){
                definition[el] = [{type: json[el][0]["type"]}];
                backendProperties.forEach(_el => {
                    if(json[el][0][_el])
                        definition[el][0][_el] = json[el][0][_el];    
                });
            }    
            else{
                definition[el] = [processObject(json[el][0].definition)];
            }
        }
        else{
            definition[el] = processObject(json[el].definition);
        }
    });
    return definition;
}

function generateDefinition(path,data){
    var definition = processObject(data.definition);
    definition["_id"] = {
        type:"String",
        default:null
    };
    var name = data.name.split(" ")[0];
    data = "var definition = "+JSON.stringify(definition, null, 4)+";\nmodule.exports.definition=definition;";
    return fileIO.writeFile(path+"/api/helpers/"+name+".definition.js",data);
}

module.exports.generateDefinition = generateDefinition;