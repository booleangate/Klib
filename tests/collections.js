var K = require("../dist/K.js");
var test = require("tape");

test("concat", function(t) {
	var a1 = [1, 2], a2 = [3, 4],
		s1 = "as", s2 = "df";
	
	// Concat array	
	t.same(K.concat(a1), a1, "array + undefined");
	t.same(K.concat(null, a1), a1, "null + array");
	t.same(K.concat(a1, a2), a1.concat(a2), "array + array");
	
	// Concat string
	t.equal(K.concat(s1, s2), s1 + s2, "string + string");
	t.equal(K.concat(s1), s1, "string + undefined");
	t.equal(K.concat(null, s1), s1, "null + string");
	
	t.end();
});

test("repeat", function(t) {
	var a = [], s = "", n = 123;
	
	// Repeat array
	t.same(K.repeat(a, 2), [], "empty array");
	a.push(1);
	t.same(K.repeat(a, 2), [1, 1], "array with length == 1");
	a.push(2);
	t.same(K.repeat(a, 2), [1, 2, 1, 2], "array with length > 1");
	
	// Repeat string
	t.equal(K.repeat(s, 2), s + s, "empty string");
	s = "a";
	t.equal(K.repeat(s, 2), s + s, "string with length == 1");
	s = "abc";
	t.equal(K.repeat(s, 2), s + s, "string with length > 1");
	
	// Repeat number (ensure concatentation and not addition)
	t.equal(K.repeat(n, 2), "123123", "non-zero number");
	
	t.end();
});

test("padLeft", function(t) {
	// Pad array
	t.same(K.padLeft([], 0, 2), [0, 0], "Pad empty array with non-array");
	t.same(K.padLeft([], [1, 2], 2), [[1, 2], [1, 2]], "Pad empty array with array");
	t.same(K.padLeft([1], 0, 2), [0, 1], "Pad non-empty array with non-array");
	t.same(K.padLeft([1], [1, 2], 2), [[1, 2], 1], "Pad non-empty array with array");
	
	// Pad string
	t.equal(K.padLeft("", 0, 2), "00", "Pad empty string with number");
	t.equal(K.padLeft("a", 0, 2), "0a", "Pad non-empty string with number");
	
	t.end();
});

test("padRight", function(t) {
	// Pad array
	t.same(K.padRight([], 0, 2), [0, 0], "Pad empty array with non-array");
	t.same(K.padRight([], [1, 2], 2), [[1, 2], [1, 2]], "Pad empty array with array");
	t.same(K.padRight([1], 0, 2), [1, 0], "Pad non-empty array with non-array");
	t.same(K.padRight([1], [1, 2], 2), [1, [1, 2]], "Pad non-empty array with array");
	
	// Pad string
	t.equal(K.padRight("", 0, 2), "00", "Pad empty string with number");
	t.equal(K.padRight("a", 0, 2), "a0", "Pad non-empty string with number");
	
	t.end();
});

test("size", function(t) {
	var array = [1, 2, 3, 4, 5],
		object = {a: 1, b: 2, c: 3};
		
	t.equal(K.size(array), array.length, "array");
	t.equal(K.size(object), 3, "object (own properties)");
	
	t.end();
});

test("sort", function(t) {
	var numbers = [4, 1, 2, 3];
		numbersExpected = [1, 2, 3, 4],
		objects = [
			{a:4, b:1},
			{a:1, b:4},
			{a:2, b:3},
			{a:3, b:2}
		],
		objectsExpected = [
			{a:1, b:4},
			{a:2, b:3},
			{a:3, b:2},
			{a:4, b:1}
		];
		
	function reverseComparator(a, b) {
		if (a == b) {
			return 0;
		}
		
		return a < b ? 1 : -1;
	}
	
	// Default comparator sort
	t.same(K.sort(numbers), numbersExpected, "Default comparator");
	t.same(K.sort(numbers, reverseComparator), numbersExpected.reverse(), "Custom comparator (reverse)");
	t.same(K.sort(objects, "a"), objectsExpected, "Key comparator");
	t.same(K.sort(objects, "b"), objectsExpected.reverse(), "Key comparator (reverse)");
	
	t.end();
});

