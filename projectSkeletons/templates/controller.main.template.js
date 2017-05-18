module.exports = function(name, configFile){
    var collectionName = configFile.collectionName;
    var modelName = configFile.modelName;
    var controllerJs = `"use strict";

const mongoose = require("mongoose");
const definition = require("../helpers/${name}.definition.js").definition;
const SMCrud = require("swagger-mongoose-crud");
const cuti = require("cuti");
const schema = new mongoose.Schema(definition);
const logger = global.logger;

var options = {
    logger:logger,
    collectionName:"${collectionName}"
};
schema.pre("save", cuti.counter.getIdGenerator("${name}", "${configFile.idPrefix}"));
var crudder = new SMCrud(schema,"${modelName}", options);
module.exports = {
    create:crudder.create,
    index:crudder.index,
    show:crudder.show,
    destroy:crudder.markAsDeleted,
    update:crudder.update
};
    `;
    return controllerJs;
};