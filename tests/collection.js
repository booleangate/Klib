var K = require("../dist/K.js");
var test = require("tape");

test("concat", function(t) {
	var a1 = [1, 2], a2 = [3, 4],
		s1 = "as", s2 = "df";
		
	t.same(K.concat(a1, a2), a1.concat(a2), "concat 2 arrays");
	t.equal(K.concat(s1, s2), s1 + s2, "concat 2 strings");
	t.end();
});
