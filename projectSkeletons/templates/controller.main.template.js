module.exports = function(name, config){
    var configFile = config.configFileData
    var collectionName = configFile.collectionName;
    var modelName = configFile.modelName;
    var controllerJs = `"use strict";

const definition = require("../helpers/${name}.definition.js").definition;
const SSCrud = require("swagger-sequelize-crud");
const cuti = require("cuti");
const Sequelize = require("sequelize");
const logger = global.logger;
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
