import { name } from '../package.json';

// Throw an error if a value is undefined
export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
	if (val === undefined) {
		throw new Error('Expected value to be defined, but it was not');
	}
}

// Get the package name from package.json
export function getPackageName() {
	return name;
}

// Format an object as a human-readable string
export function prettify(json: object) {
	return JSON.stringify(json, null, 2);
}
