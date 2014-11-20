var K = require("../dist/K.js");
var test = require("tape");

test("setObject", function(t) {
	var context = {}, 
		objectValue = {
			a: 1,
			b: 2
		},
		numberValue = 123;

	K.setObject("foo.bar.baz", objectValue, context);
	K.setObject("foo.buzz", numberValue, context);
		
	t.same(context.foo.bar.baz, objectValue, "set object value");
	t.same(context.foo.buzz, numberValue, "set number value");

	t.end();
});

test("mixin", function(t) {
	var object1 = { a: 1, b: 1, d: null },
		object2 = { a: 2, c: 2, d: 2 },
		object3 = { d: 3, e: 3 },
		expectedResult = { a: 1, b: 1, c: 2, d: null, e: 3 },
		expectedResultOverwriteNulls = { a: 1, b: 1, c: 2, d: 2, e: 3 },
		result;
	
	result = K.mixin(object1, object2, object3);
	t.same(result, expectedResult, "not overwriting nulls");
	
	result = K.mixin(true, object1, object2, object3);
	t.same(result, expectedResultOverwriteNulls, "overwriting nulls");
	
	t.end();
});

