var K = require("../dist/K.min.js");
var test = require("tape");

test("getType", function(t) {
	// Arrays
	t.equal(K.getType(new Array()), "array", "array constructor");
	t.equal(K.getType([]), "array", "array literal");
	
	// Boolean
	t.equal(K.getType(new Boolean()), "boolean", "boolean constructor");
	t.equal(K.getType(true), "boolean", "boolean constant");
	t.equal(K.getType(!!0), "boolean", "boolean conversion");
	
	// Date
	t.equal(K.getType(new Date()), "date", "date constructor");
	
	// Error
	t.equal(K.getType(new Error()), "error", "error constructor");
	
	// Function
	function f() {	};
	
	t.equal(K.getType(new Function()), "function", "function constructor");
	t.equal(K.getType(function() {}), "function", "function anonymous");
	t.equal(K.getType(f), "function", "function declarative");
	
	// Null
	t.equal(K.getType(null), "null", "null constant");
	
	// Number
	t.equal(K.getType(new Number()), "number", "number constructor");
	t.equal(K.getType(1), "number", "number integer constant");
	t.equal(K.getType(1.1), "number", "number decimal constant");
	
	// Object
	t.equal(K.getType(new Object()), "object", "object constructor");
	t.equal(K.getType({}), "object", "object literal");
	
	// RegExp
	t.equal(K.getType(new RegExp()), "regexp", "regexp constructor");
	t.equal(K.getType(/./), "regexp", "regexp literal");
	
	// String
	t.equal(K.getType(new String()), "string", "string constructor");
	t.equal(K.getType("ohai"), "string", "string constant");
	
	t.end();
});

test("isArray", function(t) {
	t.ok(K.isArray(new Array()), "constructor");
	t.ok(K.isArray([]), "literal");

	checkFalsePositives(t, "isArray");
	
	t.end();
});

test("isBoolean", function(t) {
	t.ok(K.isBoolean(new Boolean()), "constructor");
	t.ok(K.isBoolean(true), "literal");
	
	// Ensure no false positives
	t.notOk(K.isBoolean({}), "object");
	t.notOk(K.isBoolean("asdf"), "string");
	t.notOk(K.isBoolean(123), "number");
	
	checkFalsePositives(t, "isBoolean");
	
	t.end();
});

test("isDate", function(t) {
	t.ok(K.isDate(new Date()), "constructor");
	
	checkFalsePositives(t, "isDate");

	t.end();
});

test("isError", function(t) {
	t.ok(K.isError(new Error()), "constructor");
	
	checkFalsePositives(t, "isError");

	t.end();
});

test("isFunction", function(t) {
	function f() {	};
	
	t.ok(K.isFunction(new Function()), "constructor");
	t.ok(K.isFunction(function() {}), "anonymous");
	t.ok(K.isFunction(f), "declarative");
	
	checkFalsePositives(t, "isFunction");

	t.end();
});

test("isNull", function(t) {
	t.ok(K.isNull(null), "literal");
	
	checkFalsePositives(t, "isNull");

	t.end();
});

test("isNumber", function(t) {
	t.ok(K.isNumber(new Number()), "constructor");
	t.ok(K.isNumber(1), "integer constant");
	t.ok(K.isNumber(1.1), "decimal constant");
	
	checkFalsePositives(t, "isNumber");

	t.end();
});

test("isObject", function(t) {
	t.ok(K.isObject(new Object()), "constructor");
	t.ok(K.isObject({}), "literal");
	
	// checkFalsePositives(t, "isObject");

	t.end();
});

test("isRegExp", function(t) {
	t.ok(K.isRegExp(new RegExp()), "constructor");
	t.ok(K.isRegExp(/./), "literal");
	
	checkFalsePositives(t, "isRegExp");

	t.end();
});

test("isString", function(t) {
	t.ok(K.isString(new String()), "constructor");
	t.ok(K.isString("ohai"), "constant");
	
	checkFalsePositives(t, "isString");

	t.end();
});

test("isEmail", function(t) {
	t.ok(K.isEmail("user@domain.tld"), "basic format");
	t.ok(K.isEmail("user+tag@domain.tld"), "tagged");
	t.ok(K.isEmail("user@1.1.1.1"), "ip domain");
	t.notOk(K.isEmail("user@"), "no domain");
	t.notOk(K.isEmail("user@domain"), "no domain tld");
	t.notOk(K.isEmail("@domain.tld"), "no user");

	t.end();
});

function checkFalsePositives(t, method) {
	var exclude = method.substr(2).toLowerCase();
	
	if (exclude != "array") t.notOk(K[method]([]), "array is not " + exclude);
	if (exclude != "boolean") t.notOk(K[method](true), "boolean is not " + exclude);
	if (exclude != "date" && exclude != "object") t.notOk(K[method](new Date()), "date is not " + exclude);
	if (exclude != "error" && exclude != "object") t.notOk(K[method](new Error()), "error is not " + exclude);
	if (exclude != "function") t.notOk(K[method](new Function()), "function is not " + exclude);
	if (exclude != "null") t.notOk(K[method](null), "null is not " + exclude);
	if (exclude != "number") t.notOk(K[method](123.123), "number is not " + exclude);
	if (exclude != "object") t.notOk(K[method]({}), "object is not " + exclude);
	if (exclude != "regexp") t.notOk(K[method](/./), "regexp is not " + exclude);
	if (exclude != "string") t.notOk(K[method]("asdf"), "string is not " + exclude);
}
