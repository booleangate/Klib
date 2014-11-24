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
