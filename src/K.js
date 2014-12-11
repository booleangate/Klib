var components = [
	require("./types"),
	require("./collections"),
	require("./objects"),
	require("./functions")
];

var K = {}, i, j;

// Combine all components into one flat namespace, K.
for (i = 0; i<components.length; ++i) {
	for (j in components[i]) {
		if (components[i].hasOwnProperty(j)) {
			K[j] = components[i][j];
		}
	}
}

module.exports = K;
