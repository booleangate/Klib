!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.K=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var components = [
	require("./types"),
	require("./collections"),
	require("./objects"),
	require("./functions")
];

var K = {}, i, j;

for (i = 0; i<components.length; ++i) {
	for (j in components[i]) {
		if (components[i].hasOwnProperty(j)) {
			K[j] = components[i][j];
		}
	}
}

module.exports = K;

},{"./collections":2,"./functions":3,"./objects":4,"./types":5}],2:[function(require,module,exports){
var types = require("./types");
var collections = {};

/**
 * Concatenate a string or an array to another of the same type.
 * 
 * @param {string|array} a
 * @param {string|array} b
 */
collections.concat = function(a, b) {
	// Strict equeality with null is intentionally not used here.
	if (a == null) {
		return b;
	}
	else if (b == null) {
		return a;
	}
	else if (types.isArray(a)) {
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
collections.padLeft = function(input, value, totalLength) {
	return collections.concat(
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
collections.padRight = function(input, value, totalLength) {
	return collections.concat(
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
collections.repeat = function(input, n) {
	var isArray = types.isArray(input),
		result = isArray ? [] : "",
		i = 0;
	
	while (i++ < n) {
		result = result.concat(input);
	}

	return result;
};

/**
 * Counts the size of an array or object.
 * 
 * @param {array|object} input
 * @param {boolean} includeOtherProperties If false (default), only counts own properties of the object.
 */
collections.size = function(input, includeOtherProperties) {
	var i, keys = 0;
	
	if (types.isArray(input)) {
		return input.length;
	}
	
	for (i in input) {
		if (includeOtherProperties || input.hasOwnProperty(i)) {
			++keys;
		}
	}
	
	return keys;
};

/**
 * Merge sort an array using a custom comparator or, if the array contains all like objects, a property of those objects.
 *  
 * @param {array} input
 * @param {string|function} comparator Either a comparator function or a property name of the objects in this array. 
 */
collections.sort = function(input, comparator) {
	// No comparator, use the default.
	if (!comparator) {
		comparator = defaultComparator;
	}
	// Comparator is a key (not a function), create a function.
	else if (!types.isFunction(comparator)) {
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
	if (types.isArray(input)) { 
		return collections.repeat([value], totalLength - input.length);
	}
	
	return collections.repeat(value, totalLength - (input + "").length);
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

module.exports = collections;

},{"./types":5}],3:[function(require,module,exports){
var functions = {};


functions.countDownLatch = function(callback, n) {
	return function() {
		if (--n == 0) {
			return callback.apply(null, arguments);
		}
	};
};


module.exports = functions;
},{}],4:[function(require,module,exports){
var types = require("./types");
var objects = {};

/**
 * Add keys from later objects to the first object if they don't already exist. Returns either an object or null.
 */
objects.mixin = function(/*[overwriteNulls, ]a, b, c, ...*/) {
	var len = arguments.length, 
		overwriteNulls = false, 
		result, i, j;
	
	if (len < 1) {
		return null;
	}
	else if (len === 1) {
		if (!types.isObject(arguments[0])) {
			return null;
		}
		
		return arguments[0];
	}
	
	if (types.isBoolean(arguments[0])) {
		overwriteNulls = arguments[0];
		i = 2;
	}
	else {
		i = 1;
	}
	
	result = arguments[i - 1];
	
	while (i < len) {
		if (!types.isObject(arguments[i])) {
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

/**
 * Same as dojo.setObject
 */
objects.setObject = function(name, value, rootContext) {
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

module.exports = objects;

},{"./types":5}],5:[function(require,module,exports){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvSy5qcyIsInNyYy9jb2xsZWN0aW9ucy5qcyIsInNyYy9mdW5jdGlvbnMuanMiLCJzcmMvb2JqZWN0cy5qcyIsInNyYy90eXBlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29tcG9uZW50cyA9IFtcblx0cmVxdWlyZShcIi4vdHlwZXNcIiksXG5cdHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zXCIpLFxuXHRyZXF1aXJlKFwiLi9vYmplY3RzXCIpLFxuXHRyZXF1aXJlKFwiLi9mdW5jdGlvbnNcIilcbl07XG5cbnZhciBLID0ge30sIGksIGo7XG5cbmZvciAoaSA9IDA7IGk8Y29tcG9uZW50cy5sZW5ndGg7ICsraSkge1xuXHRmb3IgKGogaW4gY29tcG9uZW50c1tpXSkge1xuXHRcdGlmIChjb21wb25lbnRzW2ldLmhhc093blByb3BlcnR5KGopKSB7XG5cdFx0XHRLW2pdID0gY29tcG9uZW50c1tpXVtqXTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLO1xuIiwidmFyIHR5cGVzID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG52YXIgY29sbGVjdGlvbnMgPSB7fTtcblxuLyoqXG4gKiBDb25jYXRlbmF0ZSBhIHN0cmluZyBvciBhbiBhcnJheSB0byBhbm90aGVyIG9mIHRoZSBzYW1lIHR5cGUuXG4gKiBcbiAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSBhXG4gKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gYlxuICovXG5jb2xsZWN0aW9ucy5jb25jYXQgPSBmdW5jdGlvbihhLCBiKSB7XG5cdC8vIFN0cmljdCBlcXVlYWxpdHkgd2l0aCBudWxsIGlzIGludGVudGlvbmFsbHkgbm90IHVzZWQgaGVyZS5cblx0aWYgKGEgPT0gbnVsbCkge1xuXHRcdHJldHVybiBiO1xuXHR9XG5cdGVsc2UgaWYgKGIgPT0gbnVsbCkge1xuXHRcdHJldHVybiBhO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVzLmlzQXJyYXkoYSkpIHtcblx0XHRyZXR1cm4gYS5jb25jYXQoYik7XG5cdH1cblx0XG5cdHJldHVybiAgXCJcIiArIGEgKyBiO1xufTtcblxuLyoqXG4gKiBQcmVwZW5kIGEgdmFsdWUgdG8gYSBzdHJpbmcgb3IgYW4gYXJyYXkgdW50aWwgaXRzIGxlbmd0aCBpcyB0b3RhbExlbmd0aC4gXG4gKiAgXG4gKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gaW5wdXRcbiAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxMZW5ndGhcbiAqL1xuY29sbGVjdGlvbnMucGFkTGVmdCA9IGZ1bmN0aW9uKGlucHV0LCB2YWx1ZSwgdG90YWxMZW5ndGgpIHtcblx0cmV0dXJuIGNvbGxlY3Rpb25zLmNvbmNhdChcblx0XHRjcmVhdGVQYWQoaW5wdXQsIHZhbHVlLCB0b3RhbExlbmd0aCksXG5cdFx0aW5wdXRcblx0KTtcbn07XG5cbi8qKlxuICogQXBwZW5kIGEgdmFsdWUgdG8gYSBzdHJpbmcgb3IgYW4gYXJyYXkgdW50aWwgaXRzIGxlbmd0aCBpcyB0b3RhbExlbmd0aC4gXG4gKiAgXG4gKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gaW5wdXRcbiAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlXG4gKiBAcGFyYW0ge251bWJlcn0gdG90YWxMZW5ndGhcbiAqL1xuY29sbGVjdGlvbnMucGFkUmlnaHQgPSBmdW5jdGlvbihpbnB1dCwgdmFsdWUsIHRvdGFsTGVuZ3RoKSB7XG5cdHJldHVybiBjb2xsZWN0aW9ucy5jb25jYXQoXG5cdFx0aW5wdXQsXG5cdFx0Y3JlYXRlUGFkKGlucHV0LCB2YWx1ZSwgdG90YWxMZW5ndGgpXG5cdCk7XG59O1xuXG4vKipcbiAqIENvbmNhdGVuYXRlIGEgc3RyaW5nIG9yIGFycmF5IG4gdGltZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGlucHV0XG4gKiBAcGFyYW0ge251bWJlcn0gblxuICovXG5jb2xsZWN0aW9ucy5yZXBlYXQgPSBmdW5jdGlvbihpbnB1dCwgbikge1xuXHR2YXIgaXNBcnJheSA9IHR5cGVzLmlzQXJyYXkoaW5wdXQpLFxuXHRcdHJlc3VsdCA9IGlzQXJyYXkgPyBbXSA6IFwiXCIsXG5cdFx0aSA9IDA7XG5cdFxuXHR3aGlsZSAoaSsrIDwgbikge1xuXHRcdHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoaW5wdXQpO1xuXHR9XG5cblx0cmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogQ291bnRzIHRoZSBzaXplIG9mIGFuIGFycmF5IG9yIG9iamVjdC5cbiAqIFxuICogQHBhcmFtIHthcnJheXxvYmplY3R9IGlucHV0XG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluY2x1ZGVPdGhlclByb3BlcnRpZXMgSWYgZmFsc2UgKGRlZmF1bHQpLCBvbmx5IGNvdW50cyBvd24gcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0LlxuICovXG5jb2xsZWN0aW9ucy5zaXplID0gZnVuY3Rpb24oaW5wdXQsIGluY2x1ZGVPdGhlclByb3BlcnRpZXMpIHtcblx0dmFyIGksIGtleXMgPSAwO1xuXHRcblx0aWYgKHR5cGVzLmlzQXJyYXkoaW5wdXQpKSB7XG5cdFx0cmV0dXJuIGlucHV0Lmxlbmd0aDtcblx0fVxuXHRcblx0Zm9yIChpIGluIGlucHV0KSB7XG5cdFx0aWYgKGluY2x1ZGVPdGhlclByb3BlcnRpZXMgfHwgaW5wdXQuaGFzT3duUHJvcGVydHkoaSkpIHtcblx0XHRcdCsra2V5cztcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiBrZXlzO1xufTtcblxuLyoqXG4gKiBNZXJnZSBzb3J0IGFuIGFycmF5IHVzaW5nIGEgY3VzdG9tIGNvbXBhcmF0b3Igb3IsIGlmIHRoZSBhcnJheSBjb250YWlucyBhbGwgbGlrZSBvYmplY3RzLCBhIHByb3BlcnR5IG9mIHRob3NlIG9iamVjdHMuXG4gKiAgXG4gKiBAcGFyYW0ge2FycmF5fSBpbnB1dFxuICogQHBhcmFtIHtzdHJpbmd8ZnVuY3Rpb259IGNvbXBhcmF0b3IgRWl0aGVyIGEgY29tcGFyYXRvciBmdW5jdGlvbiBvciBhIHByb3BlcnR5IG5hbWUgb2YgdGhlIG9iamVjdHMgaW4gdGhpcyBhcnJheS4gXG4gKi9cbmNvbGxlY3Rpb25zLnNvcnQgPSBmdW5jdGlvbihpbnB1dCwgY29tcGFyYXRvcikge1xuXHQvLyBObyBjb21wYXJhdG9yLCB1c2UgdGhlIGRlZmF1bHQuXG5cdGlmICghY29tcGFyYXRvcikge1xuXHRcdGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcblx0fVxuXHQvLyBDb21wYXJhdG9yIGlzIGEga2V5IChub3QgYSBmdW5jdGlvbiksIGNyZWF0ZSBhIGZ1bmN0aW9uLlxuXHRlbHNlIGlmICghdHlwZXMuaXNGdW5jdGlvbihjb21wYXJhdG9yKSkge1xuXHRcdGNvbXBhcmF0b3IgPSBjcmVhdGVLZXlDb21wYXJhdG9yKGNvbXBhcmF0b3IpO1xuXHR9XG5cblx0cmV0dXJuIG1lcmdlU29ydChpbnB1dCwgY29tcGFyYXRvcik7XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyYXRvcihhLCBiKSB7XG5cdGlmIChhID09IGIpIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXHRcblx0cmV0dXJuIGEgPCBiID8gLTEgOiAxO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVLZXlDb21wYXJhdG9yKGtleSkge1xuXHRyZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuXHRcdGlmIChhW2tleV0gPT09IGJba2V5XSkge1xuXHRcdFx0cmV0dXJuIDA7XG5cdFx0fVxuXHRcdFxuXHRcdHJldHVybiBhW2tleV0gPCBiW2tleV0gPyAtMSA6IDE7XG5cdH07XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhZChpbnB1dCwgdmFsdWUsIHRvdGFsTGVuZ3RoKSB7XG5cdGlmICh0eXBlcy5pc0FycmF5KGlucHV0KSkgeyBcblx0XHRyZXR1cm4gY29sbGVjdGlvbnMucmVwZWF0KFt2YWx1ZV0sIHRvdGFsTGVuZ3RoIC0gaW5wdXQubGVuZ3RoKTtcblx0fVxuXHRcblx0cmV0dXJuIGNvbGxlY3Rpb25zLnJlcGVhdCh2YWx1ZSwgdG90YWxMZW5ndGggLSAoaW5wdXQgKyBcIlwiKS5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVNvcnQoaW5wdXQsIGNvbXBhcmF0b3IpIHtcblx0dmFyIGxlbmd0aCA9IGlucHV0Lmxlbmd0aCwgXG5cdFx0bWlkZGxlID0gTWF0aC5mbG9vcihsZW5ndGggLyAyKTtcblxuXHRpZiAobGVuZ3RoIDwgMikge1xuXHRcdHJldHVybiBpbnB1dDtcblx0fVxuXG5cdHJldHVybiBtZXJnZShcblx0XHRtZXJnZVNvcnQoaW5wdXQuc2xpY2UoMCwgbWlkZGxlKSwgY29tcGFyYXRvciksXG5cdFx0bWVyZ2VTb3J0KGlucHV0LnNsaWNlKG1pZGRsZSwgbGVuZ3RoKSwgY29tcGFyYXRvciksXG5cdFx0Y29tcGFyYXRvclxuXHQpO1xufVxuXG5mdW5jdGlvbiBtZXJnZShsZWZ0LCByaWdodCwgY29tcGFyYXRvcikge1xuXHR2YXIgcmVzdWx0ID0gW107XG5cblx0d2hpbGUgKGxlZnQubGVuZ3RoIHx8IHJpZ2h0Lmxlbmd0aCkge1xuXHRcdC8vIEl0ZW1zIGluIGJvdGggYXJyYXlzLlxuXHRcdGlmIChsZWZ0Lmxlbmd0aCAmJiByaWdodC5sZW5ndGgpIHtcblx0XHRcdGlmIChjb21wYXJhdG9yKGxlZnRbMF0sIHJpZ2h0WzBdKSA8PSAwICkge1xuXHRcdFx0XHRyZXN1bHQucHVzaChsZWZ0LnNoaWZ0KCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0LnB1c2gocmlnaHQuc2hpZnQoKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIE9ubHkgaXRlbXMgbGVmdCBpbiB0aGUgbGVmdCBhcnJheS5cblx0XHRlbHNlIGlmIChsZWZ0Lmxlbmd0aCkge1xuXHRcdFx0cmVzdWx0ID0gcmVzdWx0LmNvbmNhdChsZWZ0KTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHQvLyBPbmx5IGl0ZW0gbGVmdCBpbiB0aGUgcmlnaHQgYXJyYXkuXG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXN1bHQgPSByZXN1bHQuY29uY2F0KHJpZ2h0KTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRcblx0cmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb2xsZWN0aW9ucztcbiIsInZhciBmdW5jdGlvbnMgPSB7fTtcblxuXG5mdW5jdGlvbnMuY291bnREb3duTGF0Y2ggPSBmdW5jdGlvbihjYWxsYmFjaywgbikge1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKC0tbiA9PSAwKSB7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2suYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcblx0XHR9XG5cdH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb25zOyIsInZhciB0eXBlcyA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xudmFyIG9iamVjdHMgPSB7fTtcblxuLyoqXG4gKiBBZGQga2V5cyBmcm9tIGxhdGVyIG9iamVjdHMgdG8gdGhlIGZpcnN0IG9iamVjdCBpZiB0aGV5IGRvbid0IGFscmVhZHkgZXhpc3QuIFJldHVybnMgZWl0aGVyIGFuIG9iamVjdCBvciBudWxsLlxuICovXG5vYmplY3RzLm1peGluID0gZnVuY3Rpb24oLypbb3ZlcndyaXRlTnVsbHMsIF1hLCBiLCBjLCAuLi4qLykge1xuXHR2YXIgbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgXG5cdFx0b3ZlcndyaXRlTnVsbHMgPSBmYWxzZSwgXG5cdFx0cmVzdWx0LCBpLCBqO1xuXHRcblx0aWYgKGxlbiA8IDEpIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRlbHNlIGlmIChsZW4gPT09IDEpIHtcblx0XHRpZiAoIXR5cGVzLmlzT2JqZWN0KGFyZ3VtZW50c1swXSkpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gYXJndW1lbnRzWzBdO1xuXHR9XG5cdFxuXHRpZiAodHlwZXMuaXNCb29sZWFuKGFyZ3VtZW50c1swXSkpIHtcblx0XHRvdmVyd3JpdGVOdWxscyA9IGFyZ3VtZW50c1swXTtcblx0XHRpID0gMjtcblx0fVxuXHRlbHNlIHtcblx0XHRpID0gMTtcblx0fVxuXHRcblx0cmVzdWx0ID0gYXJndW1lbnRzW2kgLSAxXTtcblx0XG5cdHdoaWxlIChpIDwgbGVuKSB7XG5cdFx0aWYgKCF0eXBlcy5pc09iamVjdChhcmd1bWVudHNbaV0pKSB7XG5cdFx0XHR0aHJvdyBcIksubWl4aW46IGVuY291bnRlcmVkIG5vbi1vYmplY3QgYXQgYXJndW1lbnQgaW5kZXggXCIgKyBpO1xuXHRcdH1cblx0XHRcblx0XHRmb3IgKGogaW4gYXJndW1lbnRzW2ldKSB7XG5cdFx0XHRpZiAoYXJndW1lbnRzW2ldLmhhc093blByb3BlcnR5KGopKSB7XG5cdFx0XHRcdGlmICh0eXBlb2YgcmVzdWx0W2pdID09PSBcInVuZGVmaW5lZFwiIHx8IChvdmVyd3JpdGVOdWxscyAmJiByZXN1bHRbal0gPT09IG51bGwpKSB7XG5cdFx0XHRcdFx0cmVzdWx0W2pdID0gYXJndW1lbnRzW2ldW2pdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdFxuXHRcdCsraTtcblx0fVxuXHRcblx0cmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogU2FtZSBhcyBkb2pvLnNldE9iamVjdFxuICovXG5vYmplY3RzLnNldE9iamVjdCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCByb290Q29udGV4dCkge1xuXHR2YXIgY29udGV4dCA9IHJvb3RDb250ZXh0IHx8IHdpbmRvdyxcblx0XHRwYXJ0cyAgID0gbmFtZS5zcGxpdChcIi5cIiksXG5cdFx0bCAgICAgICA9IHBhcnRzLmxlbmd0aCAtIDEsXG5cdFx0aSAgICAgICA9IDA7XG5cblx0XG5cdHdoaWxlIChpIDwgbCkge1xuXHRcdGlmICh0eXBlb2YgY29udGV4dFtwYXJ0c1tpXV0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdGNvbnRleHRbcGFydHNbaV1dID0ge307XG5cdFx0fVxuXG5cdFx0Y29udGV4dCA9IGNvbnRleHRbcGFydHNbaV1dO1xuXHRcdCsraTtcblx0fVxuXG5cdGNvbnRleHRbcGFydHNbaV1dID0gdmFsdWU7IFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RzO1xuIiwidmFyIHR5cGVzID0ge307XG5cbnR5cGVzLmdldFR5cGUgPSBmdW5jdGlvbihpbnB1dCkge1xuXHR2YXIgdHlwZU5hbWU7XG5cdFxuXHRpZiAoaW5wdXQgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gXCJudWxsXCI7XG5cdH1cblx0XG5cdHR5cGVOYW1lID0gdHlwZW9mIGlucHV0O1xuXHRcblx0aWYgKHR5cGVOYW1lICE9PSBcIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuIHR5cGVOYW1lO1xuXHR9XG5cdFxuXHQvLyBHZXQgdGhlIHR5cGUgbmFtZSBmcm9tIHRoZSBjb25zdHJ1Y3RvclxuXHR0eXBlTmFtZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkubWF0Y2goL1xcW29iamVjdFxccyhcXHcrKVxcXS8pWzFdO1xuXHRcblx0cmV0dXJuIHR5cGVOYW1lLnRvTG93ZXJDYXNlKCk7XG59O1xuXG50eXBlcy5pcyA9IGZ1bmN0aW9uKGlucHV0LCB0eXBlLCB0eXBlTmFtZSkge1xuXHRpZiAodHlwZSA9PT0gbnVsbCkge1xuXHRcdHJldHVybiBpbnB1dCA9PT0gdHlwZTtcblx0fVxuXHRcblx0aWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09PSBcImVtYWlsXCIpIHtcblx0XHRyZXR1cm4gdHlwZXMuaXNFbWFpbChpbnB1dCk7XG5cdH1cblx0XG5cdHJldHVybiBpbnB1dCBpbnN0YW5jZW9mIHR5cGUgfHwgdHlwZXMuZ2V0VHlwZShpbnB1dCkgPT09IHR5cGVOYW1lO1xufTtcblxudHlwZXMuaXNBcnJheSA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgQXJyYXksIFwiYXJyYXlcIik7XG59O1xuXG50eXBlcy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gdHlwZXMuaXMoaW5wdXQsIEJvb2xlYW4sIFwiYm9vbGVhblwiKTtcbn07XG5cbnR5cGVzLmlzRGF0ZSA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgRGF0ZSwgXCJkYXRlXCIpO1xufTtcblxudHlwZXMuaXNFcnJvciA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgRXJyb3IsIFwiZXJyb3JcIik7XG59O1xuXG50eXBlcy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIHR5cGVzLmlzKGlucHV0LCBGdW5jdGlvbiwgXCJmdW5jdGlvblwiKTtcbn07XG5cbnR5cGVzLmlzTnVsbCA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiBpbnB1dCA9PT0gbnVsbDtcbn07XG5cbnR5cGVzLmlzTnVtYmVyID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIHR5cGVzLmlzKGlucHV0LCBOdW1iZXIsIFwibnVtYmVyXCIpO1xufTtcblxudHlwZXMuaXNPYmplY3QgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gdHlwZXMuaXMoaW5wdXQsIE9iamVjdCwgXCJvYmplY3RcIik7XG59O1xuXG50eXBlcy5pc1JlZ0V4cCA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgUmVnRXhwLCBcInJlZ2V4cFwiKTtcbn07XG5cbnR5cGVzLmlzU3RyaW5nID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIHR5cGVzLmlzKGlucHV0LCBTdHJpbmcsIFwic3RyaW5nXCIpO1xufTtcblxudHlwZXMuaXNFbWFpbCA9IGZ1bmN0aW9uKGVtYWlsKSB7XG5cdHJldHVybiBlbWFpbC5tYXRjaCgvXihbXFx3XFwhXFwjJFxcJVxcJlxcJ1xcKlxcK1xcLVxcL1xcPVxcP1xcXlxcYHtcXHxcXH1cXH5dK1xcLikqW1xcd1xcIVxcIyRcXCVcXCZcXCdcXCpcXCtcXC1cXC9cXD1cXD9cXF5cXGB7XFx8XFx9XFx+XStAKCgoKChbYS16MC05XXsxfVthLXowLTlcXC1dezAsNjJ9W2EtejAtOV17MX0pfFthLXpdKVxcLikrW2Etel17Miw2fSl8KFxcZHsxLDN9XFwuKXszfVxcZHsxLDN9KFxcOlxcZHsxLDV9KT8pJC9pKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZXM7XG4iXX0=
