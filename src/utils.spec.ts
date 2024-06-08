import { describe, expect, it } from '@jest/globals';
import { assertIsDefined, getPackageName, prettify } from './utils';

describe('assertIsDefined', () => {
	it.concurrent('should throw an error if value is undefined', async () => {
		expect(() => assertIsDefined(undefined)).toThrow(
			'Expected value to be defined, but it was not',
		);
	});

	it.concurrent('should not throw an error if value is defined', async () => {
		expect(() => assertIsDefined('defined value')).not.toThrow();
	});
});

describe('getPackageName', () => {
	it.concurrent(
		'should return the package name from package.json',
		async () => {
			expect(getPackageName()).toBe('gatsby-plugin-component-to-image');
		},
	);
});

describe('prettify', () => {
	it.concurrent(
		'should format an object as a human-readable string',
		async () => {
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
		},
	);
});
