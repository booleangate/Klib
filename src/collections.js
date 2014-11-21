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
