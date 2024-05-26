// Returns true if the value is undefined
function isUndefined(value) {
	return value === undefined;
}

// Get the package name from package.json
function getPackageName() {
	const { name } = require('../package.json');

	return name;
}

module.exports = {
	isUndefined,
	getPackageName,
};
