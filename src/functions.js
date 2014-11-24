var functions = {};


functions.countDownLatch = function(callback, n) {
	return function() {
		if (--n == 0) {
			return callback.apply(null, arguments);
		}
	};
};


module.exports = functions;