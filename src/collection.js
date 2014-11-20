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