import { describe, expect, it } from '@jest/globals';
import { assertIsDefined, getPackageName, prettify } from './utils';

describe('assertIsDefined', () => {
	it('should throw an error if value is undefined', () => {
		expect(() => assertIsDefined(undefined)).toThrow(
			'Expected value to be defined, but it was not',
		);
	});

	it('should not throw an error if value is defined', () => {
		expect(() => assertIsDefined('defined value')).not.toThrow();
	});
});

describe('getPackageName', () => {
	it('should return the package name from package.json', () => {
		expect(getPackageName()).toBe('gatsby-plugin-component-to-image');
	});
});

describe('prettify', () => {
	it('should format an object as a human-readable string', () => {
		const obj = {
			name: 'Timmy',
			size: 'chonky',
			color: 'orange',
		};
		const expectedOutput = `{
  "name": "Timmy",
  "size": "chonky",
  "color": "orange"
}`;
		expect(prettify(obj)).toBe(expectedOutput);
	});
});
