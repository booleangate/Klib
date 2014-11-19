(function() {
	"use strict";
	
	var K = {
		getType: function(input) {
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
		},
		
		is: function(input, type, typeName) {
			if (type === null) {
				return input === type;
			}
			
			if (type.toString().toLowerCase() === "email") {
				return K.isEmail(input);
			}
			
			return input instanceof type || K.getType(input) === typeName;
		},
		
		isArray: function(input) {
			return is(input, Array, "array");
		},
		
		isBoolean: function(input) {
			return is(input, Boolean, "boolean");
		},
		
		isDate: function(input) {
			return is(input, Date, "date");
		},

		isError: function(input) {
			return is(input, Error, "error");
		},
		
		isFunction: function(input) {
			return is(input, Function, "function");
		},
		
		isNull: function(input) {
			return input === null;
		},
		
		isNumber: function(input) {
			return is(input, Number, "number");
		},
		
		isObject: function(input) {
			return is(input, Object, "object");
		},

		isRegExp: function(input) {
			return is(input, RegExp, "regexp");
		},
		
		isString: function(input) {
			return is(input, String, "string");
		},

		isEmail: function(email) {
			return email.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i);
		}
	};
	
	module.exports = K;
}());