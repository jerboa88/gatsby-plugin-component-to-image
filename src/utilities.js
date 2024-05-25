// Returns true if the value is undefined
function isUndefined(value) {
	return value === undefined;
}

// Throw an error if the value is not of the expected type
function assertIsOfType(name, value, type) {
	if (typeof value !== type) {
		throw new TypeError(
			`Expected ${name} to be of type ${type}, but got ${typeof value}`,
		);
	}
}

// Throw an error if the value is not one of the expected values
function assertIsOneOf(name, value, validValues) {
	if (!validValues.includes(value)) {
		throw new TypeError(
			`Expected ${name} to be one of ${validValues.join(
				', ',
			)}, but got ${value}`,
		);
	}
}

// Throw an error if the value is not in the expected range
function assertIsInRange(name, value, min, max) {
	if (value < min || value > max) {
		throw new RangeError(
			`Expected ${name} to be in range ${min}-${max}, but got ${value}`,
		);
	}
}

// Get the package name from package.json
function getPackageName() {
	const { name } = require('../package.json');

	return name;
}

module.exports = {
	isUndefined,
	assertIsOfType,
	assertIsOneOf,
	assertIsInRange,
	getPackageName,
};
