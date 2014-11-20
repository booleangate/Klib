var K = require("./K");

(function() {
	"use strict";
	
	K.getType = function(input) {
		var typeName;
		
		if (input === null) {
			return "null";
		}
		
		typeName = typeof input;
		
		if (typeName !== "object") {
			return typeName;
		}
		
		// Get the type name from the constructor
		typeName = Object.prototype.toString.call(input).match(/\[object\s(\w+)\]/)[1];
		
		return typeName.toLowerCase();
	};
	
	K.is = function(input, type, typeName) {
		if (type === null) {
			return input === type;
		}
		
		if (type.toString().toLowerCase() === "email") {
			return K.isEmail(input);
		}
		
		return input instanceof type || K.getType(input) === typeName;
	};
	
	K.isArray = function(input) {
		return K.is(input, Array, "array");
	};
	
	K.isBoolean = function(input) {
		return K.is(input, Boolean, "boolean");
	};
	
	K.isDate = function(input) {
		return K.is(input, Date, "date");
	};

	K.isError = function(input) {
		return K.is(input, Error, "error");
	};
	
	K.isFunction = function(input) {
		return K.is(input, Function, "function");
	};
	
	K.isNull = function(input) {
		return input === null;
	};
	
	K.isNumber = function(input) {
		return K.is(input, Number, "number");
	};
	
	K.isObject = function(input) {
		return K.is(input, Object, "object");
	};

	K.isRegExp = function(input) {
		return K.is(input, RegExp, "regexp");
	};
	
	K.isString = function(input) {
		return K.is(input, String, "string");
	};

	K.isEmail = function(email) {
		return email.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i);
	};
	
	module.exports = K;
}());