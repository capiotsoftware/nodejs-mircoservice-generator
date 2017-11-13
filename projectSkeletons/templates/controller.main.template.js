module.exports = function (name, config) {
    var configFile = config.configFileData;
    var om = config.om;
    console.log("om is ", om);
    var collectionName = configFile.collectionName;
    var modelName = configFile.modelName;

    var omCode = om === 'ODM' ? `const mongoose = require("mongoose");
    const SMCrud = require("swagger-mongoose-crud");
    const schema = new mongoose.Schema(definition);
    	
var options = {
    logger:logger,
    collectionName:"${collectionName}"
};
schema.pre("save", cuti.counter.getIdGenerator("${name}", "${configFile.idPrefix}"));
var crudder = new SMCrud(schema,"${modelName}", options);`
     :
        `const Sequelize = require("sequelize");
        const SSCrud = require("swagger-sequelize-crud");
        var dbName="${config.db}";
dbName=dbName.toLowerCase();
var options = {
    logger:logger,
    collectionName:"${collectionName}"
};
//database wide options
var opts = {
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
}
var sequelize = new Sequelize("postgres://postgres:welcome@localhost:5432/"+dbName,opts);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
var hooks = [];
var crudder = new SSCrud(sequelize, definition ,"${modelName}", options, hooks);
`
    
    var controllerJs = `"use strict";
const definition = require("../helpers/${name}.definition.js").definition;
const cuti = require("cuti");
const logger = global.logger;
${omCode}
module.exports = {
    create:crudder.create,
    index:crudder.index,
    show:crudder.show,
    destroy:crudder.markAsDeleted,
    update:crudder.update
};
    `;
    console.log("OM code is ", omCode);
    return controllerJs;
};
