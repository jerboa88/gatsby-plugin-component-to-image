import { beforeAll, describe, expect, it } from '@jest/globals';
import type { PluginOptionsSchemaJoi } from 'gatsby-plugin-utils';
import Joi from 'joi';
import type { DefaultOptions } from './types';
import {
	getPluginOptionsSchema,
	setJoi,
	validateDefaultOptions,
	validateJobOptions,
} from './validator';

const VALID_PAGE_PATH = 'example-page';
const VALID_IMAGE_PATH = 'example-image.png';
const VALID_COMPONENT = 'example-component';
const VALID_CONTEXT = {
	title: 'Blog Post 1',
	description: 'This is a blog post',
	postDate: '2022-01-01',
};
const VALID_SIZE = {
	width: 1200,
	height: 630,
};
const VALID_TYPE = 'png';
const VALID_QUALITY = 95;
const VALID_OPTIMIZE_FOR_SPEED = false;
const VALID_REQUIRED_JOB_OPTIONS = {
	pagePath: VALID_PAGE_PATH,
	imagePath: VALID_IMAGE_PATH,
	component: VALID_COMPONENT,
};
const DEFAULT_OPTIONS: DefaultOptions = {
	verbose: false,
	component: undefined,
	context: {},
	size: VALID_SIZE,
	type: VALID_TYPE,
	quality: undefined,
	optimizeForSpeed: VALID_OPTIMIZE_FOR_SPEED,
};

// As per https://github.com/jestjs/jest/issues/7997#issuecomment-1455052585,
// the `beforeAll` hook needs to be outside of the `describe` block,
// otherwise it will not work as expected.
beforeAll(() => {
	// Set up the joi object
	// @ts-expect-error: Gatsby's PluginOptionsSchemaJoi type has an additional `subPlugins` property that we don't need
	setJoi(Joi);
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
						[PROPERTY_NAME]: VALID_COMPONENT,
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
						[PROPERTY_NAME]: 'invalid',
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
						[PROPERTY_NAME]: VALID_CONTEXT,
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

	describe('validateJobOptions', () => {
		it.concurrent(
			'should not throw an error for valid job options',
			async () => {
				expect(() => {
					const validatedOptions = validateJobOptions(
						VALID_REQUIRED_JOB_OPTIONS,
						DEFAULT_OPTIONS,
					);
					expect(validatedOptions.pagePath).toEqual(
						VALID_REQUIRED_JOB_OPTIONS.pagePath,
					);
					expect(validatedOptions.imagePath).toEqual(
						VALID_REQUIRED_JOB_OPTIONS.imagePath,
					);
					expect(validatedOptions.component).toEqual(
						VALID_REQUIRED_JOB_OPTIONS.component,
					);
				}).not.toThrowError();
			},
		);

		describe('pagePath validation', () => {
			const PROPERTY_NAME = 'pagePath';

			it.concurrent(
				`should throw an error for missing ${PROPERTY_NAME}`,
				async () => {
					const inputJobOptions = {
						imagePath: VALID_IMAGE_PATH,
						component: VALID_COMPONENT,
					};

					expect(() => {
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputJobOptions = {
						pagePath: 42,
						imagePath: VALID_IMAGE_PATH,
						component: VALID_COMPONENT,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for empty ${PROPERTY_NAME} string`,
				async () => {
					const inputJobOptions = {
						pagePath: '',
						imagePath: VALID_IMAGE_PATH,
						component: VALID_COMPONENT,
					};

					expect(() => {
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);
		});

		describe('imagePath validation', () => {
			const PROPERTY_NAME = 'imagePath';

			it.concurrent(
				`should throw an error for missing ${PROPERTY_NAME}`,
				async () => {
					const inputJobOptions = {
						pagePath: VALID_PAGE_PATH,
						component: VALID_COMPONENT,
					};

					expect(() => {
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputJobOptions = {
						pagePath: VALID_PAGE_PATH,
						imagePath: 42,
						component: VALID_COMPONENT,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for empty ${PROPERTY_NAME} string`,
				async () => {
					const inputJobOptions = {
						pagePath: VALID_PAGE_PATH,
						imagePath: '',
						component: VALID_COMPONENT,
					};

					expect(() => {
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);
		});

		describe('component validation', () => {
			const PROPERTY_NAME = 'component';

			it.concurrent(
				`should throw an error for missing ${PROPERTY_NAME}`,
				async () => {
					const inputJobOptions = {
						pagePath: VALID_PAGE_PATH,
						imagePath: VALID_IMAGE_PATH,
					};

					expect(() => {
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputJobOptions = {
						pagePath: VALID_PAGE_PATH,
						imagePath: VALID_IMAGE_PATH,
						component: 42,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for empty ${PROPERTY_NAME} string`,
				async () => {
					const inputJobOptions = {
						pagePath: VALID_PAGE_PATH,
						imagePath: VALID_IMAGE_PATH,
						component: '',
					};

					expect(() => {
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);
		});

		describe('context validation', () => {
			const PROPERTY_NAME = 'context';

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputJobOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						context: 'invalid',
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputJobOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should not throw an error for valid ${PROPERTY_NAME}`,
				async () => {
					const inputJobOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						context: VALID_CONTEXT,
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
							inputJobOptions,
							DEFAULT_OPTIONS,
						);
						expect(validatedOptions[PROPERTY_NAME]).toEqual(
							inputJobOptions[PROPERTY_NAME],
						);
					}).not.toThrowError();
				},
			);
		});

		describe('size validation', () => {
			const PROPERTY_NAME = 'size';

			it.concurrent(
				`should throw an error for missing ${PROPERTY_NAME}`,
				async () => {
					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(VALID_REQUIRED_JOB_OPTIONS, {
							...VALID_REQUIRED_JOB_OPTIONS,
							type: VALID_TYPE,
							quality: VALID_QUALITY,
							optimizeForSpeed: VALID_OPTIMIZE_FOR_SPEED,
						});
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'invalid' as const,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should not throw an error for valid ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: {
							width: 1200,
							height: 630,
						},
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 'bruh',
								height: 630,
							},
						};

						expect(() => {
							// @ts-expect-error: Testing invalid type
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for non-integer ${PROPERTY_NAME}`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: Math.PI,
								height: 630,
							},
						};

						expect(() => {
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} below the minimum size`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 0,
								height: 630,
							},
						};

						expect(() => {
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} above the maximum size`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 20000,
								height: 630,
							},
						};

						expect(() => {
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should convert string ${PROPERTY_NAME} to number`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: '1337',
								height: 630,
							},
						};

						expect(() => {
							const validatedOptions = validateJobOptions(
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
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 1200,
								height: 'bruh',
							},
						};

						expect(() => {
							// @ts-expect-error: Testing invalid type
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for non-integer ${PROPERTY_NAME}`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 1200,
								height: Math.PI,
							},
						};

						expect(() => {
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} below the minimum size`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 1200,
								height: 0,
							},
						};

						expect(() => {
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should throw an error for ${PROPERTY_NAME} above the maximum size`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 1200,
								height: 20000,
							},
						};

						expect(() => {
							validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
						}).toThrowError(PROPERTY_NAME);
					},
				);

				it.concurrent(
					`should convert string ${PROPERTY_NAME} to number`,
					async () => {
						const inputDefaultOptions = {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: {
								width: 1200,
								height: '1337',
							},
						};

						expect(() => {
							const validatedOptions = validateJobOptions(
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
				`should throw an error for missing ${PROPERTY_NAME}`,
				async () => {
					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(VALID_REQUIRED_JOB_OPTIONS, {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: VALID_SIZE,
							quality: VALID_QUALITY,
							optimizeForSpeed: VALID_OPTIMIZE_FOR_SPEED,
						});
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 42,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for invalid ${PROPERTY_NAME} option`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'invalid' as const,
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to lowercase`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'PNG' as const,
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'png' as const,
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'bruh',
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for non-integer ${PROPERTY_NAME}`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: Math.PI,
					};

					expect(() => {
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} below the minimum quality`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: -1,
					};

					expect(() => {
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} above the maximum quality`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 101,
					};

					expect(() => {
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to number`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: '95',
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 50,
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
				`should throw an error for missing ${PROPERTY_NAME}`,
				async () => {
					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(VALID_REQUIRED_JOB_OPTIONS, {
							...VALID_REQUIRED_JOB_OPTIONS,
							size: VALID_SIZE,
							type: VALID_TYPE,
							quality: VALID_QUALITY,
						});
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should throw an error for ${PROPERTY_NAME} of invalid type`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'bruh',
					};

					expect(() => {
						// @ts-expect-error: Testing invalid type
						validateJobOptions(inputDefaultOptions, DEFAULT_OPTIONS);
					}).toThrowError(PROPERTY_NAME);
				},
			);

			it.concurrent(
				`should convert string ${PROPERTY_NAME} to boolean`,
				async () => {
					const inputDefaultOptions = {
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: 'true',
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
						...VALID_REQUIRED_JOB_OPTIONS,
						[PROPERTY_NAME]: true,
					};

					expect(() => {
						const validatedOptions = validateJobOptions(
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
