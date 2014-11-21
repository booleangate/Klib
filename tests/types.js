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
	
	t.end();
});

test("isBoolean", function(t) {
	t.ok(K.isBoolean(new Boolean()), "constructor");
	t.ok(K.isBoolean(true), "literal");
	
	t.end();
});

test("isDate", function(t) {
	t.ok(K.isDate(new Date()), "constructor");

	t.end();
});

test("isError", function(t) {
	t.ok(K.isError(new Error()), "constructor");

	t.end();
});

test("isFunction", function(t) {
	function f() {	};
	
	t.ok(K.isFunction(new Function()), "constructor");
	t.ok(K.isFunction(function() {}), "anonymous");
	t.ok(K.isFunction(f), "declarative");

	t.end();
});

test("isNull", function(t) {
	t.ok(K.isNull(null), "literal");

	t.end();
});

test("isNumber", function(t) {
	t.ok(K.isNumber(new Number()), "constructor");
	t.ok(K.isNumber(1), "integer constant");
	t.ok(K.isNumber(1.1), "decimal constant");

	t.end();
});

test("isObject", function(t) {
	t.ok(K.isObject(new Object()), "constructor");
	t.ok(K.isObject({}), "literal");

	t.end();
});

test("isRegExp", function(t) {
	t.ok(K.isRegExp(new RegExp()), "constructor");
	t.ok(K.isRegExp(/./), "literal");

	t.end();
});

test("isString", function(t) {
	t.ok(K.isString(new String()), "constructor");
	t.ok(K.isString("ohai"), "constant");

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
