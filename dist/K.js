!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.K=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/K.js":[function(require,module,exports){
var components = [
	require("./types"),
	require("./collections"),
	require("./objects")
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

},{"./collections":"/Users/johnsonj/Development/web/Klib/src/collections.js","./objects":"/Users/johnsonj/Development/web/Klib/src/objects.js","./types":"/Users/johnsonj/Development/web/Klib/src/types.js"}],"/Users/johnsonj/Development/web/Klib/src/collections.js":[function(require,module,exports){
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

},{"./types":"/Users/johnsonj/Development/web/Klib/src/types.js"}],"/Users/johnsonj/Development/web/Klib/src/objects.js":[function(require,module,exports){
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

},{"./types":"/Users/johnsonj/Development/web/Klib/src/types.js"}],"/Users/johnsonj/Development/web/Klib/src/types.js":[function(require,module,exports){
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

},{}]},{},["./src/K.js"])("./src/K.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvSy5qcyIsInNyYy9jb2xsZWN0aW9ucy5qcyIsInNyYy9vYmplY3RzLmpzIiwic3JjL3R5cGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY29tcG9uZW50cyA9IFtcblx0cmVxdWlyZShcIi4vdHlwZXNcIiksXG5cdHJlcXVpcmUoXCIuL2NvbGxlY3Rpb25zXCIpLFxuXHRyZXF1aXJlKFwiLi9vYmplY3RzXCIpXG5dO1xuXG52YXIgSyA9IHt9LCBpLCBqO1xuXG5mb3IgKGkgPSAwOyBpPGNvbXBvbmVudHMubGVuZ3RoOyArK2kpIHtcblx0Zm9yIChqIGluIGNvbXBvbmVudHNbaV0pIHtcblx0XHRpZiAoY29tcG9uZW50c1tpXS5oYXNPd25Qcm9wZXJ0eShqKSkge1xuXHRcdFx0S1tqXSA9IGNvbXBvbmVudHNbaV1bal07XG5cdFx0fVxuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSztcbiIsInZhciB0eXBlcyA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xudmFyIGNvbGxlY3Rpb25zID0ge307XG5cbi8qKlxuICogQ29uY2F0ZW5hdGUgYSBzdHJpbmcgb3IgYW4gYXJyYXkgdG8gYW5vdGhlciBvZiB0aGUgc2FtZSB0eXBlLlxuICogXG4gKiBAcGFyYW0ge3N0cmluZ3xhcnJheX0gYVxuICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGJcbiAqL1xuY29sbGVjdGlvbnMuY29uY2F0ID0gZnVuY3Rpb24oYSwgYikge1xuXHQvLyBTdHJpY3QgZXF1ZWFsaXR5IHdpdGggbnVsbCBpcyBpbnRlbnRpb25hbGx5IG5vdCB1c2VkIGhlcmUuXG5cdGlmIChhID09IG51bGwpIHtcblx0XHRyZXR1cm4gYjtcblx0fVxuXHRlbHNlIGlmIChiID09IG51bGwpIHtcblx0XHRyZXR1cm4gYTtcblx0fVxuXHRlbHNlIGlmICh0eXBlcy5pc0FycmF5KGEpKSB7XG5cdFx0cmV0dXJuIGEuY29uY2F0KGIpO1xuXHR9XG5cdFxuXHRyZXR1cm4gIFwiXCIgKyBhICsgYjtcbn07XG5cbi8qKlxuICogUHJlcGVuZCBhIHZhbHVlIHRvIGEgc3RyaW5nIG9yIGFuIGFycmF5IHVudGlsIGl0cyBsZW5ndGggaXMgdG90YWxMZW5ndGguIFxuICogIFxuICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGlucHV0XG4gKiBAcGFyYW0ge21peGVkfSB2YWx1ZVxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsTGVuZ3RoXG4gKi9cbmNvbGxlY3Rpb25zLnBhZExlZnQgPSBmdW5jdGlvbihpbnB1dCwgdmFsdWUsIHRvdGFsTGVuZ3RoKSB7XG5cdHJldHVybiBjb2xsZWN0aW9ucy5jb25jYXQoXG5cdFx0Y3JlYXRlUGFkKGlucHV0LCB2YWx1ZSwgdG90YWxMZW5ndGgpLFxuXHRcdGlucHV0XG5cdCk7XG59O1xuXG4vKipcbiAqIEFwcGVuZCBhIHZhbHVlIHRvIGEgc3RyaW5nIG9yIGFuIGFycmF5IHVudGlsIGl0cyBsZW5ndGggaXMgdG90YWxMZW5ndGguIFxuICogIFxuICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGlucHV0XG4gKiBAcGFyYW0ge21peGVkfSB2YWx1ZVxuICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsTGVuZ3RoXG4gKi9cbmNvbGxlY3Rpb25zLnBhZFJpZ2h0ID0gZnVuY3Rpb24oaW5wdXQsIHZhbHVlLCB0b3RhbExlbmd0aCkge1xuXHRyZXR1cm4gY29sbGVjdGlvbnMuY29uY2F0KFxuXHRcdGlucHV0LFxuXHRcdGNyZWF0ZVBhZChpbnB1dCwgdmFsdWUsIHRvdGFsTGVuZ3RoKVxuXHQpO1xufTtcblxuLyoqXG4gKiBDb25jYXRlbmF0ZSBhIHN0cmluZyBvciBhcnJheSBuIHRpbWVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfGFycmF5fSBpbnB1dFxuICogQHBhcmFtIHtudW1iZXJ9IG5cbiAqL1xuY29sbGVjdGlvbnMucmVwZWF0ID0gZnVuY3Rpb24oaW5wdXQsIG4pIHtcblx0dmFyIGlzQXJyYXkgPSB0eXBlcy5pc0FycmF5KGlucHV0KSxcblx0XHRyZXN1bHQgPSBpc0FycmF5ID8gW10gOiBcIlwiLFxuXHRcdGkgPSAwO1xuXHRcblx0d2hpbGUgKGkrKyA8IG4pIHtcblx0XHRyZXN1bHQgPSByZXN1bHQuY29uY2F0KGlucHV0KTtcblx0fVxuXG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIENvdW50cyB0aGUgc2l6ZSBvZiBhbiBhcnJheSBvciBvYmplY3QuXG4gKiBcbiAqIEBwYXJhbSB7YXJyYXl8b2JqZWN0fSBpbnB1dFxuICogQHBhcmFtIHtib29sZWFufSBpbmNsdWRlT3RoZXJQcm9wZXJ0aWVzIElmIGZhbHNlIChkZWZhdWx0KSwgb25seSBjb3VudHMgb3duIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdC5cbiAqL1xuY29sbGVjdGlvbnMuc2l6ZSA9IGZ1bmN0aW9uKGlucHV0LCBpbmNsdWRlT3RoZXJQcm9wZXJ0aWVzKSB7XG5cdHZhciBpLCBrZXlzID0gMDtcblx0XG5cdGlmICh0eXBlcy5pc0FycmF5KGlucHV0KSkge1xuXHRcdHJldHVybiBpbnB1dC5sZW5ndGg7XG5cdH1cblx0XG5cdGZvciAoaSBpbiBpbnB1dCkge1xuXHRcdGlmIChpbmNsdWRlT3RoZXJQcm9wZXJ0aWVzIHx8IGlucHV0Lmhhc093blByb3BlcnR5KGkpKSB7XG5cdFx0XHQrK2tleXM7XG5cdFx0fVxuXHR9XG5cdFxuXHRyZXR1cm4ga2V5cztcbn07XG5cbi8qKlxuICogTWVyZ2Ugc29ydCBhbiBhcnJheSB1c2luZyBhIGN1c3RvbSBjb21wYXJhdG9yIG9yLCBpZiB0aGUgYXJyYXkgY29udGFpbnMgYWxsIGxpa2Ugb2JqZWN0cywgYSBwcm9wZXJ0eSBvZiB0aG9zZSBvYmplY3RzLlxuICogIFxuICogQHBhcmFtIHthcnJheX0gaW5wdXRcbiAqIEBwYXJhbSB7c3RyaW5nfGZ1bmN0aW9ufSBjb21wYXJhdG9yIEVpdGhlciBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gb3IgYSBwcm9wZXJ0eSBuYW1lIG9mIHRoZSBvYmplY3RzIGluIHRoaXMgYXJyYXkuIFxuICovXG5jb2xsZWN0aW9ucy5zb3J0ID0gZnVuY3Rpb24oaW5wdXQsIGNvbXBhcmF0b3IpIHtcblx0Ly8gTm8gY29tcGFyYXRvciwgdXNlIHRoZSBkZWZhdWx0LlxuXHRpZiAoIWNvbXBhcmF0b3IpIHtcblx0XHRjb21wYXJhdG9yID0gZGVmYXVsdENvbXBhcmF0b3I7XG5cdH1cblx0Ly8gQ29tcGFyYXRvciBpcyBhIGtleSAobm90IGEgZnVuY3Rpb24pLCBjcmVhdGUgYSBmdW5jdGlvbi5cblx0ZWxzZSBpZiAoIXR5cGVzLmlzRnVuY3Rpb24oY29tcGFyYXRvcikpIHtcblx0XHRjb21wYXJhdG9yID0gY3JlYXRlS2V5Q29tcGFyYXRvcihjb21wYXJhdG9yKTtcblx0fVxuXG5cdHJldHVybiBtZXJnZVNvcnQoaW5wdXQsIGNvbXBhcmF0b3IpO1xufTtcblxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmF0b3IoYSwgYikge1xuXHRpZiAoYSA9PSBiKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0XG5cdHJldHVybiBhIDwgYiA/IC0xIDogMTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlS2V5Q29tcGFyYXRvcihrZXkpIHtcblx0cmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAoYVtrZXldID09PSBiW2tleV0pIHtcblx0XHRcdHJldHVybiAwO1xuXHRcdH1cblx0XHRcblx0XHRyZXR1cm4gYVtrZXldIDwgYltrZXldID8gLTEgOiAxO1xuXHR9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVQYWQoaW5wdXQsIHZhbHVlLCB0b3RhbExlbmd0aCkge1xuXHRpZiAodHlwZXMuaXNBcnJheShpbnB1dCkpIHsgXG5cdFx0cmV0dXJuIGNvbGxlY3Rpb25zLnJlcGVhdChbdmFsdWVdLCB0b3RhbExlbmd0aCAtIGlucHV0Lmxlbmd0aCk7XG5cdH1cblx0XG5cdHJldHVybiBjb2xsZWN0aW9ucy5yZXBlYXQodmFsdWUsIHRvdGFsTGVuZ3RoIC0gKGlucHV0ICsgXCJcIikubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VTb3J0KGlucHV0LCBjb21wYXJhdG9yKSB7XG5cdHZhciBsZW5ndGggPSBpbnB1dC5sZW5ndGgsIFxuXHRcdG1pZGRsZSA9IE1hdGguZmxvb3IobGVuZ3RoIC8gMik7XG5cblx0aWYgKGxlbmd0aCA8IDIpIHtcblx0XHRyZXR1cm4gaW5wdXQ7XG5cdH1cblxuXHRyZXR1cm4gbWVyZ2UoXG5cdFx0bWVyZ2VTb3J0KGlucHV0LnNsaWNlKDAsIG1pZGRsZSksIGNvbXBhcmF0b3IpLFxuXHRcdG1lcmdlU29ydChpbnB1dC5zbGljZShtaWRkbGUsIGxlbmd0aCksIGNvbXBhcmF0b3IpLFxuXHRcdGNvbXBhcmF0b3Jcblx0KTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UobGVmdCwgcmlnaHQsIGNvbXBhcmF0b3IpIHtcblx0dmFyIHJlc3VsdCA9IFtdO1xuXG5cdHdoaWxlIChsZWZ0Lmxlbmd0aCB8fCByaWdodC5sZW5ndGgpIHtcblx0XHQvLyBJdGVtcyBpbiBib3RoIGFycmF5cy5cblx0XHRpZiAobGVmdC5sZW5ndGggJiYgcmlnaHQubGVuZ3RoKSB7XG5cdFx0XHRpZiAoY29tcGFyYXRvcihsZWZ0WzBdLCByaWdodFswXSkgPD0gMCApIHtcblx0XHRcdFx0cmVzdWx0LnB1c2gobGVmdC5zaGlmdCgpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlc3VsdC5wdXNoKHJpZ2h0LnNoaWZ0KCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBPbmx5IGl0ZW1zIGxlZnQgaW4gdGhlIGxlZnQgYXJyYXkuXG5cdFx0ZWxzZSBpZiAobGVmdC5sZW5ndGgpIHtcblx0XHRcdHJlc3VsdCA9IHJlc3VsdC5jb25jYXQobGVmdCk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdFx0Ly8gT25seSBpdGVtIGxlZnQgaW4gdGhlIHJpZ2h0IGFycmF5LlxuXHRcdGVsc2Uge1xuXHRcdFx0cmVzdWx0ID0gcmVzdWx0LmNvbmNhdChyaWdodCk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0XG5cdHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29sbGVjdGlvbnM7XG4iLCJ2YXIgdHlwZXMgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbnZhciBvYmplY3RzID0ge307XG5cbi8qKlxuICogQWRkIGtleXMgZnJvbSBsYXRlciBvYmplY3RzIHRvIHRoZSBmaXJzdCBvYmplY3QgaWYgdGhleSBkb24ndCBhbHJlYWR5IGV4aXN0LiBSZXR1cm5zIGVpdGhlciBhbiBvYmplY3Qgb3IgbnVsbC5cbiAqL1xub2JqZWN0cy5taXhpbiA9IGZ1bmN0aW9uKC8qW292ZXJ3cml0ZU51bGxzLCBdYSwgYiwgYywgLi4uKi8pIHtcblx0dmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIFxuXHRcdG92ZXJ3cml0ZU51bGxzID0gZmFsc2UsIFxuXHRcdHJlc3VsdCwgaSwgajtcblx0XG5cdGlmIChsZW4gPCAxKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0ZWxzZSBpZiAobGVuID09PSAxKSB7XG5cdFx0aWYgKCF0eXBlcy5pc09iamVjdChhcmd1bWVudHNbMF0pKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0XG5cdFx0cmV0dXJuIGFyZ3VtZW50c1swXTtcblx0fVxuXHRcblx0aWYgKHR5cGVzLmlzQm9vbGVhbihhcmd1bWVudHNbMF0pKSB7XG5cdFx0b3ZlcndyaXRlTnVsbHMgPSBhcmd1bWVudHNbMF07XG5cdFx0aSA9IDI7XG5cdH1cblx0ZWxzZSB7XG5cdFx0aSA9IDE7XG5cdH1cblx0XG5cdHJlc3VsdCA9IGFyZ3VtZW50c1tpIC0gMV07XG5cdFxuXHR3aGlsZSAoaSA8IGxlbikge1xuXHRcdGlmICghdHlwZXMuaXNPYmplY3QoYXJndW1lbnRzW2ldKSkge1xuXHRcdFx0dGhyb3cgXCJLLm1peGluOiBlbmNvdW50ZXJlZCBub24tb2JqZWN0IGF0IGFyZ3VtZW50IGluZGV4IFwiICsgaTtcblx0XHR9XG5cdFx0XG5cdFx0Zm9yIChqIGluIGFyZ3VtZW50c1tpXSkge1xuXHRcdFx0aWYgKGFyZ3VtZW50c1tpXS5oYXNPd25Qcm9wZXJ0eShqKSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIHJlc3VsdFtqXSA9PT0gXCJ1bmRlZmluZWRcIiB8fCAob3ZlcndyaXRlTnVsbHMgJiYgcmVzdWx0W2pdID09PSBudWxsKSkge1xuXHRcdFx0XHRcdHJlc3VsdFtqXSA9IGFyZ3VtZW50c1tpXVtqXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRcblx0XHQrK2k7XG5cdH1cblx0XG5cdHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIFNhbWUgYXMgZG9qby5zZXRPYmplY3RcbiAqL1xub2JqZWN0cy5zZXRPYmplY3QgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgcm9vdENvbnRleHQpIHtcblx0dmFyIGNvbnRleHQgPSByb290Q29udGV4dCB8fCB3aW5kb3csXG5cdFx0cGFydHMgICA9IG5hbWUuc3BsaXQoXCIuXCIpLFxuXHRcdGwgICAgICAgPSBwYXJ0cy5sZW5ndGggLSAxLFxuXHRcdGkgICAgICAgPSAwO1xuXG5cdFxuXHR3aGlsZSAoaSA8IGwpIHtcblx0XHRpZiAodHlwZW9mIGNvbnRleHRbcGFydHNbaV1dID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRjb250ZXh0W3BhcnRzW2ldXSA9IHt9O1xuXHRcdH1cblxuXHRcdGNvbnRleHQgPSBjb250ZXh0W3BhcnRzW2ldXTtcblx0XHQrK2k7XG5cdH1cblxuXHRjb250ZXh0W3BhcnRzW2ldXSA9IHZhbHVlOyBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0cztcbiIsInZhciB0eXBlcyA9IHt9O1xuXG50eXBlcy5nZXRUeXBlID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0dmFyIHR5cGVOYW1lO1xuXHRcblx0aWYgKGlucHV0ID09PSBudWxsKSB7XG5cdFx0cmV0dXJuIFwibnVsbFwiO1xuXHR9XG5cdFxuXHR0eXBlTmFtZSA9IHR5cGVvZiBpbnB1dDtcblx0XG5cdGlmICh0eXBlTmFtZSAhPT0gXCJvYmplY3RcIikge1xuXHRcdHJldHVybiB0eXBlTmFtZTtcblx0fVxuXHRcblx0Ly8gR2V0IHRoZSB0eXBlIG5hbWUgZnJvbSB0aGUgY29uc3RydWN0b3Jcblx0dHlwZU5hbWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpLm1hdGNoKC9cXFtvYmplY3RcXHMoXFx3KylcXF0vKVsxXTtcblx0XG5cdHJldHVybiB0eXBlTmFtZS50b0xvd2VyQ2FzZSgpO1xufTtcblxudHlwZXMuaXMgPSBmdW5jdGlvbihpbnB1dCwgdHlwZSwgdHlwZU5hbWUpIHtcblx0aWYgKHR5cGUgPT09IG51bGwpIHtcblx0XHRyZXR1cm4gaW5wdXQgPT09IHR5cGU7XG5cdH1cblx0XG5cdGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PT0gXCJlbWFpbFwiKSB7XG5cdFx0cmV0dXJuIHR5cGVzLmlzRW1haWwoaW5wdXQpO1xuXHR9XG5cdFxuXHRyZXR1cm4gaW5wdXQgaW5zdGFuY2VvZiB0eXBlIHx8IHR5cGVzLmdldFR5cGUoaW5wdXQpID09PSB0eXBlTmFtZTtcbn07XG5cbnR5cGVzLmlzQXJyYXkgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gdHlwZXMuaXMoaW5wdXQsIEFycmF5LCBcImFycmF5XCIpO1xufTtcblxudHlwZXMuaXNCb29sZWFuID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIHR5cGVzLmlzKGlucHV0LCBCb29sZWFuLCBcImJvb2xlYW5cIik7XG59O1xuXG50eXBlcy5pc0RhdGUgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gdHlwZXMuaXMoaW5wdXQsIERhdGUsIFwiZGF0ZVwiKTtcbn07XG5cbnR5cGVzLmlzRXJyb3IgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gdHlwZXMuaXMoaW5wdXQsIEVycm9yLCBcImVycm9yXCIpO1xufTtcblxudHlwZXMuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgRnVuY3Rpb24sIFwiZnVuY3Rpb25cIik7XG59O1xuXG50eXBlcy5pc051bGwgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gaW5wdXQgPT09IG51bGw7XG59O1xuXG50eXBlcy5pc051bWJlciA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgTnVtYmVyLCBcIm51bWJlclwiKTtcbn07XG5cbnR5cGVzLmlzT2JqZWN0ID0gZnVuY3Rpb24oaW5wdXQpIHtcblx0cmV0dXJuIHR5cGVzLmlzKGlucHV0LCBPYmplY3QsIFwib2JqZWN0XCIpO1xufTtcblxudHlwZXMuaXNSZWdFeHAgPSBmdW5jdGlvbihpbnB1dCkge1xuXHRyZXR1cm4gdHlwZXMuaXMoaW5wdXQsIFJlZ0V4cCwgXCJyZWdleHBcIik7XG59O1xuXG50eXBlcy5pc1N0cmluZyA9IGZ1bmN0aW9uKGlucHV0KSB7XG5cdHJldHVybiB0eXBlcy5pcyhpbnB1dCwgU3RyaW5nLCBcInN0cmluZ1wiKTtcbn07XG5cbnR5cGVzLmlzRW1haWwgPSBmdW5jdGlvbihlbWFpbCkge1xuXHRyZXR1cm4gZW1haWwubWF0Y2goL14oW1xcd1xcIVxcIyRcXCVcXCZcXCdcXCpcXCtcXC1cXC9cXD1cXD9cXF5cXGB7XFx8XFx9XFx+XStcXC4pKltcXHdcXCFcXCMkXFwlXFwmXFwnXFwqXFwrXFwtXFwvXFw9XFw/XFxeXFxge1xcfFxcfVxcfl0rQCgoKCgoW2EtejAtOV17MX1bYS16MC05XFwtXXswLDYyfVthLXowLTldezF9KXxbYS16XSlcXC4pK1thLXpdezIsNn0pfChcXGR7MSwzfVxcLil7M31cXGR7MSwzfShcXDpcXGR7MSw1fSk/KSQvaSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVzO1xuIl19
