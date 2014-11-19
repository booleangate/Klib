var collection = require("./collection");
var validation = require("./validation");
var object = require("./object");

module.exports = object.mixin(collection, validation, object);
