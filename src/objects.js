var types = require("./types");
var objects = {};

/**
 * Add keys from later objects to the first object if they don't already exist. Returns either an object or null.
 */
objects.mixin = function(/*[overwriteNulls, ]a, b, c, ...*/) {
	var len = arguments.length, 
		overwriteNulls = false, 
		result, i, j;
	
	if (len < 1) {
		return null;
	}
	else if (len === 1) {
		if (!types.isObject(arguments[0])) {
			return null;
		}
		
		return arguments[0];
	}
	
	if (types.isBoolean(arguments[0])) {
		overwriteNulls = arguments[0];
		i = 2;
	}
	else {
		i = 1;
	}
	
	result = arguments[i - 1];
	
	while (i < len) {
		if (!types.isObject(arguments[i])) {
			throw "K.mixin: encountered non-object at argument index " + i;
		}
		
		for (j in arguments[i]) {
			if (arguments[i].hasOwnProperty(j)) {
				if (typeof result[j] === "undefined" || (overwriteNulls && result[j] === null)) {
					result[j] = arguments[i][j];
				}
			}
		}
		
		++i;
	}
	
	return result;
};

/**
 * Same as dojo.setObject
 */
objects.setObject = function(name, value, rootContext) {
	var context = rootContext || window,
		parts   = name.split("."),
		l       = parts.length - 1,
		i       = 0;

	
	while (i < l) {
		if (typeof context[parts[i]] === "undefined") {
			context[parts[i]] = {};
		}

		context = context[parts[i]];
		++i;
	}

	context[parts[i]] = value; 
};

module.exports = objects;
