var K = require("../dist/K.min.js");
var test = require("tape");

test("countDownLatch", function(t) {
	var arg1 = 1;
	var arg2 = "asdf";
	var expectedResult = {
		arg1: arg1, 
		arg2: arg2, 
	};
	var foo = function(a1, a2) {
		return {
			arg1: a1, 
			arg2: a2, 
		};
	};
	var cdlFoo = K.countDownLatch(foo, 3);

	t.notOk(cdlFoo(arg1, arg2), "nothing executed");	
	t.notOk(cdlFoo(arg1, arg2), "nothing executed");	
	t.same(cdlFoo(arg1, arg2), expectedResult, "executed and expected args returned");
	
	t.end();
});
