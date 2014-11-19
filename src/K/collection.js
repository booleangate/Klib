(function() {
	"use strict";
	
	var K = {
		concat: function(a, b) {
			if (K.isArray(a)) {
				return a.concat(b);
			}
			
			return  a + b;
		},
	
		repeat: function(input, times) {
			var result = K.isArray(input) ? [] : "",
				i = 0;
			
			while (i++ < times) {
				result = K.concat(result, input);
			}
	
			return result;
		},
	
		padLeft: function(input, padCharacter, totalLength) {
			return K.concat(K.repeat(padCharacter, totalLength - (input + "").length), input);
		},
	
		padRight: function(input, padCharacter, totalLength) {
			return K.concat(input, K.repeat(padCharacter, totalLength - (input + "").length));
		},

		sort: function(input, comparator) {
			// No comparator, use the default.
			if (!comparator) {
				comparator = defaultComparator;
			}
			// Comparator is a key (not a function), create a function.
			else if (!K.isFunction(comparator)) {
				comparator = createKeyComparator(comparator);
			}
	
			return mergeSort(input, comparator);
		}
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