import { beforeAll, describe, expect, it } from '@jest/globals';
import type { PluginOptionsSchemaJoi } from 'gatsby-plugin-utils';
import Joi from 'joi';
import type { DefaultOptions } from './types';
import {
	getPluginOptionsSchema,
	setJoi,
	validateDefaultOptions,
} from './validator';

const DEFAULT_OPTIONS: DefaultOptions = {
	verbose: false,
	component: undefined,
	context: {},
	size: {
		width: 1200,
		height: 630,
	},
	type: 'png',
	quality: undefined,
	optimizeForSpeed: false,
};

// As per https://github.com/jestjs/jest/issues/7997#issuecomment-1455052585,
// the `beforeAll` hook needs to be outside of the `describe` block,
// otherwise it will not work as expected.
beforeAll(() => {
	// Set up the joi object
	// Gatsby's PluginOptionsSchemaJoi type has an additional `subPlugins` property that we don't need
	setJoi(Joi as unknown as PluginOptionsSchemaJoi);
});

describe('Validator', () => {
	describe('getPluginOptionsSchema', () => {
		it.concurrent('should return the plugin options schema', async () => {
			const schema = getPluginOptionsSchema();

			expect(schema).toBeDefined();
			expect(schema).toHaveProperty('type', 'object');
		});
	});

	describe('validateDefaultOptions', () => {
		it.concurrent(
			'should replace an empty object with default options',
			async () => {
				const inputDefaultOptions = {};
				const validatedOptions = validateDefaultOptions(
					inputDefaultOptions,
					DEFAULT_OPTIONS,
				);

				expect(validatedOptions).toBeDefined();
				expect(validatedOptions).toEqual(DEFAULT_OPTIONS);
			},
		);

		it.concurrent(
			'should replace undefined options with default options',
			async () => {
				const inputDefaultOptions = {
					verbose: undefined,
					component: undefined,
					context: undefined,
					size: undefined,
					type: undefined,
					quality: undefined,
					optimizeForSpeed: undefined,
				};
				const validatedOptions = validateDefaultOptions(
					inputDefaultOptions,
					DEFAULT_OPTIONS,
				);

				expect(validatedOptions).toBeDefined();
				expect(validatedOptions).toEqual(DEFAULT_OPTIONS);
			},
		);

		describe('verbose validation', () => {
			const PROPERTY_NAME = 'verbose';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'bruh',
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to boolean`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'true',
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							// @ts-expect-error: Testing invalid type
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(true);
					}).not.toThrowError();
				},
			);

			it.concurrent(
				`should not throw an error for boolean ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: true,
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});

		describe('component validation', () => {
			const PROPERTY_NAME = 'component';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 42,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for empty ${PROPERTY_NAME} string`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: '',
					};

					expect(() => {
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should not throw an error for non-empty ${PROPERTY_NAME} string`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'example-component',
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});

		describe('context validation', () => {
			const PROPERTY_NAME = 'context';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'invalid' as const,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should not throw an error for valid ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: {
							example: 'value',
						},
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});

		describe('size validation', () => {
			const PROPERTY_NAME = 'size';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'invalid' as const,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should not throw an error for valid ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: {
							width: 1200,
							height: 630,
						},
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);

			describe('width validation', () => {
				const PROPERTY_NAME = 'width';

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} of invalid type`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 'bruh',
								height: 630,
							},
						};

						expect(() => {
							// @ts-expect-error: Testing invalid type
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for non-integer ${PROPERTY_NAME}`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: Math.PI,
								height: 630,
							},
						};

						expect(() => {
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} below the minimum size`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 0,
								height: 630,
							},
						};

						expect(() => {
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} above the maximum size`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 20000,
								height: 630,
							},
						};

						expect(() => {
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should convert string ${PROPERTY_NAME} to number`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: '1337',
								height: 630,
							},
						};

						expect(() => {
							const validatedOptions = validateDefaultOptions(
								// @ts-expect-error: Testing invalid type
								inputDefaultOptions,
								DEFAULT_OPTIONS,
							);
							expect(validatedOptions.size[PROPERTY_NAME]).toEqual(1337);
						}).not.toThrowError();
					},
				);
			});

			describe('height validation', () => {
				const PROPERTY_NAME = 'height';

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} of invalid type`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 1200,
								height: 'bruh',
							},
						};

						expect(() => {
							// @ts-expect-error: Testing invalid type
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for non-integer ${PROPERTY_NAME}`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 1200,
								height: Math.PI,
							},
						};

						expect(() => {
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} below the minimum size`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 1200,
								height: 0,
							},
						};

						expect(() => {
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} above the maximum size`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 1200,
								height: 20000,
							},
						};

						expect(() => {
							validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should convert string ${PROPERTY_NAME} to number`,
					async () => {
						const inputDefaultOptions = {
							size: {
								width: 1200,
								height: '1337',
							},
						};

						expect(() => {
							const validatedOptions = validateDefaultOptions(
								// @ts-expect-error: Testing invalid type
								inputDefaultOptions,
								DEFAULT_OPTIONS,
							);
							expect(validatedOptions.size[PROPERTY_NAME]).toEqual(1337);
						}).not.toThrowError();
					},
				);
			});
		});

		describe('type validation', () => {
			const PROPERTY_NAME = 'type';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 42,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for invalid ${PROPERTY_NAME} option`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'invalid' as const,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to lowercase`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'PNG' as const,
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							// @ts-expect-error: Testing invalid type
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual('png');
					}).not.toThrowError();
				},
			);

			it.concurrent(
				`should not throw an error for valid ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'png' as const,
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});

		describe('quality validation', () => {
			const PROPERTY_NAME = 'quality';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'bruh',
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for non-integer ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: Math.PI,
					};

					expect(() => {
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} below the minimum quality`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: -1,
					};

					expect(() => {
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} above the maximum quality`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 101,
					};

					expect(() => {
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to number`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: '95',
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							// @ts-expect-error: Testing invalid type
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(95);
					}).not.toThrowError();
				},
			);

			it.concurrent(
				`should not throw an error for valid ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 50,
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});

		describe('optimizeForSpeed validation', () => {
			const PROPERTY_NAME = 'optimizeForSpeed';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'bruh',
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateDefaultOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to boolean`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: 'true',
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							// @ts-expect-error: Testing invalid type
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(true);
					}).not.toThrowError();
				},
			);

			it.concurrent(
				`should not throw an error for boolean ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						[PROPERTY_NAME]: true,
					};

					expect(() => {
						const validatedOptions = validateDefaultOptions(
							inputDefaultOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputDefaultOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});
	});
});
