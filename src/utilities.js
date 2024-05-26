// Returns true if the value is undefined
function isUndefined(value) {
	return value === undefined;
}

// Get the package name from package.json
function getPackageName() {
	const { name } = require('../package.json');

	return name;
}

// Format an object as a human-readable string
function prettify(json) {
	return JSON.stringify(json, null, 2);
}

module.exports = {
	isUndefined,
	getPackageName,
	prettify,
};
