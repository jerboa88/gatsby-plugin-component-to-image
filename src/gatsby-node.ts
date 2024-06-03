import { setReporter, info } from './logger';
import { setGatsbyCreatePageFunction, setDefaultOptions } from './config';
import { generateImages } from './generator';
import { setJoi, getPluginOptionsSchema } from './validator';
import { prettify } from './utilities';
import type { GatsbyNode } from 'gatsby';

// Save the reporter and createPage function for later use
export const onPluginInit: GatsbyNode['onPluginInit'] = async ({
	reporter,
	actions: { createPage },
}) => {
	setReporter(reporter);
	setGatsbyCreatePageFunction(createPage);
};

// Save Joi for later and return the schema for plugin options validation by Gatsby
export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
	Joi,
}) => {
	setJoi(Joi);

	return getPluginOptionsSchema();
};

// Get plugin options from gatsby-config.js and set default options
export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = async (
	_,
	pluginOptions,
) => {
	const defaultOptions = setDefaultOptions(pluginOptions);

	info(`Default options set to:\n${prettify(defaultOptions)}`);
};

// Generate images after pages have been built
export const onPostBuild: GatsbyNode['onPostBuild'] = async () => {
	await generateImages();
};
