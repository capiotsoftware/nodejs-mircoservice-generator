module.exports = function(name){
    var controller = `"use strict";
//controllers
const ${name}Controller = require("./${name}.controller.js");

//exports
var exports = {};
exports.v1_${name}Create = ${name}Controller.create;
exports.v1_${name}List = ${name}Controller.index;
exports.v1_${name}Show = ${name}Controller.show;
exports.v1_${name}Destroy = ${name}Controller.destroy;
exports.v1_${name}Update = ${name}Controller.update;

module.exports = exports;
    `;
    return controller;
};