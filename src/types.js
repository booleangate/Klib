var types = {};

types.getType = function(input) {
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

types.is = function(input, type, typeName) {
	if (type === null) {
		return input === type;
	}
	
	if (type.toString().toLowerCase() === "email") {
		return types.isEmail(input);
	}
	
	return input instanceof type || types.getType(input) === typeName;
};

types.isArray = function(input) {
	return types.is(input, Array, "array");
};

types.isBoolean = function(input) {
	return types.is(input, Boolean, "boolean");
};

types.isDate = function(input) {
	return types.is(input, Date, "date");
};

types.isError = function(input) {
	return types.is(input, Error, "error");
};

types.isFunction = function(input) {
	return types.is(input, Function, "function");
};

types.isNull = function(input) {
	return input === null;
};

types.isNumber = function(input) {
	return types.is(input, Number, "number");
};

types.isObject = function(input) {
	return types.is(input, Object, "object");
};

types.isRegExp = function(input) {
	return types.is(input, RegExp, "regexp");
};

types.isString = function(input) {
	return types.is(input, String, "string");
};

types.isEmail = function(email) {
	return email.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i);
};

module.exports = types;
