(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require("./validation");
require("./collection");
require("./object");

module.exports = {};

},{"./collection":2,"./object":3,"./validation":4}],2:[function(require,module,exports){
var K = require("./K");

(function() {
	"use strict";
	
	/**
	 * Concatenate a string or an array to another of the same type.
	 * 
	 * @param {string|array} a
	 * @param {string|array} b
	 */
	K.concat = function(a, b) {
		// Strict equeality with null is intentionally not used here.
		if (a == null) {
			return b;
		}
		else if (b == null) {
			return a;
		}
		else if (K.isArray(a)) {
			return a.concat(b);
		}
		
		return  "" + a + b;
	};
	
	/**
	 * Prepend a value to a string or an array until its length is totalLength. 
	 *  
	 * @param {string|array} input
	 * @param {mixed} value
	 * @param {number} totalLength
	 */
	K.padLeft = function(input, value, totalLength) {
		return K.concat(
			createPad(input, value, totalLength),
			input
		);
	};

	/**
	 * Append a value to a string or an array until its length is totalLength. 
	 *  
	 * @param {string|array} input
	 * @param {mixed} value
	 * @param {number} totalLength
	 */
	K.padRight = function(input, value, totalLength) {
		return K.concat(
			input,
			createPad(input, value, totalLength)
		);
	};

	/**
	 * Concatenate a string or array n times.
	 *
	 * @param {string|array} input
	 * @param {number} n
	 */
	K.repeat = function(input, n) {
		var isArray = K.isArray(input),
			result = isArray ? [] : "",
			i = 0;
		
		while (i++ < n) {
			result = result.concat(input);
		}

		return result;
	};

	/**
	 * Merge sort an array using a custom comparator or, if the array contains all like objects, a property of those objects.
	 *  
	 * @param {array} input
	 * @param {string|function} comparator Either a comparator function or a property name of the objects in this array. 
	 */
	K.sort = function(input, comparator) {
		// No comparator, use the default.
		if (!comparator) {
			comparator = defaultComparator;
		}
		// Comparator is a key (not a function), create a function.
		else if (!K.isFunction(comparator)) {
			comparator = createKeyComparator(comparator);
		}

		return mergeSort(input, comparator);
	};
	
	function defaultComparator(a, b) {
		if (a == b) {
			return 0;
		}
		
		return a < b ? -1 : 1;
	}
	
	function createKeyComparator(key) {
		return function(a, b) {
			if (a[key] === b[key]) {
				return 0;
			}
			
			return a[key] < b[key] ? -1 : 1;
		};
	}
	
	function createPad(input, value, totalLength) {
		if (K.isArray(input)) { 
			return K.repeat([value], totalLength - input.length);
		}
		
		return K.repeat(value, totalLength - (input + "").length);
	}
	
	function mergeSort(input, comparator) {
		var length = input.length, 
			middle = Math.floor(length / 2);

		if (length < 2) {
			return input;
		}

		return merge(
			mergeSort(input.slice(0, middle), comparator),
			mergeSort(input.slice(middle, length), comparator),
			comparator
		);
	}

	function merge(left, right, comparator) {
		var result = [];

		while (left.length || right.length) {
			// Items in both arrays.
			if (left.length && right.length) {
				if (comparator(left[0], right[0]) <= 0 ) {
					result.push(left.shift());
				} else {
					result.push(right.shift());
				}
			}
			// Only items left in the left array.
			else if (left.length) {
				result = result.concat(left);
				break;
			}
			// Only item left in the right array.
			else {
				result = result.concat(right);
				break;
			}
		}
		
		return result;
	}
	
	module.exports = K;
}());
},{"./K":undefined}],3:[function(require,module,exports){
var K = require("./K");

(function() {
	"use strict";

	/**
	 * Same as dojo.setObject
	 */
	K.setObject = function(name, value, rootContext) {
		var context = rootContext || window,
			parts   = name.split("."),
			l       = parts.length - 1,
			i       = 0;

		
		while (i < l) {
			if (typeof context[parts[i]] === "undefined") {
				context[parts[i]] = {};
			}

			context = context[parts[i]];
			++i;
		}

		context[parts[i]] = value; 
	};
	
	/**
	 * Add keys from later objects to the first object if they don't already exist. Returns either an object or null.
	 */
	K.mixin = function(/*[overwriteNulls, ]a, b, c, ...*/) {
		var len = arguments.length, 
			overwriteNulls = true, 
			result, i, j;
		
		if (len < 1) {
			return null;
		}
		else if (len === 1) {
			if (!K.isObject(arguments[0])) {
				return null;
			}
			
			return arguments[0];
		}
		
		if (K.isBoolean(arguments[0])) {
			overwriteNulls = arguments[0];
			i = 2;
		}
		else {
			i = 1;
		}
		
		result = arguments[i - 1];
		
		while (i < len) {
			if (!K.isObject(arguments[i])) {
				throw "K.mixin: encountered non-object at argument index " + i;
			}
			
			for (j in arguments[i]) {
				if (arguments[i].hasOwnProperty(j)) {
					if (typeof result[j] === "undefined" || (overwriteNulls && result[j] === null)) {
						result[j] = arguments[i][j];
					}
				}
			}
			
			++i;
		}
		
		return result;
	};
	
	module.exports = K;
}());
},{"./K":undefined}],4:[function(require,module,exports){
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
},{"./K":undefined}]},{},[1]);
