/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts', '!src/**/types.ts', '!src/**/*.spec.ts'],
	coverageProvider: 'v8',
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				diagnostics: {
					warnOnly: true,
				},
			},
		],
	},
};
