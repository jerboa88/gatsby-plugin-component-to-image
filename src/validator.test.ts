import { beforeAll, describe, expect, it } from '@jest/globals';
import type { PluginOptionsSchemaJoi } from 'gatsby-plugin-utils';
import Joi from 'joi';
import type { DefaultOptions } from './types';
import { getPluginOptionsSchema, setJoi } from './validator';

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
});
