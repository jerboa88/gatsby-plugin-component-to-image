import { name } from '../package.json';

// Returns true if the value is undefined
export function isUndefined(value) {
	return value === undefined;
}

// Get the package name from package.json
export function getPackageName() {
	return name;
}

// Format an object as a human-readable string
export function prettify(json) {
	return JSON.stringify(json, null, 2);
}
