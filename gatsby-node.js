const { setReporter, info } = require('./src/logger');
const {
	setGatsbyCreatePageFunction,
	setDefaultOptions,
} = require('./src/config');
const { generateImages } = require('./src/generator');
const { setJoi, getPluginOptionsSchema } = require('./src/validator');
const { prettify } = require('./src/utilities');

// Save the reporter and createPage function for later use
exports.onPluginInit = async ({ reporter, actions: { createPage } }) => {
	setReporter(reporter);
	setGatsbyCreatePageFunction(createPage);
};

// Save Joi for later and return the schema for plugin options validation by Gatsby
exports.pluginOptionsSchema = ({ Joi }) => {
	setJoi(Joi);

	return getPluginOptionsSchema();
};

// Get plugin options from gatsby-config.js and set default options
exports.onPreBootstrap = async (_, pluginOptions) => {
	const defaultOptions = setDefaultOptions(pluginOptions);

	info(`Default options set to:\n${prettify(defaultOptions)}`);
};

// Generate images after pages have been built
exports.onPostBuild = async () => {
	await generateImages();
};
