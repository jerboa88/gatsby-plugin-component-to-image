const { setReporter } = require('./src/logger');
const { setGatsbyCreatePageFunction } = require('./src/config');
const { generateImages } = require('./src/generator');
const { setJoi, getPluginOptionsSchema } = require('./src/validator');

// Save the reporter and createPage function for later use
exports.onPluginInit = async ({ reporter, actions: { createPage } }) => {
	setReporter(reporter);
	setGatsbyCreatePageFunction(createPage);
};

// Validate plugin options defined in gatsby-config.js
exports.pluginOptionsSchema = ({ Joi }) => {
	setJoi(Joi);

	// TODO: Add validation for plugin options
	return getPluginOptionsSchema();
};

// Generate images after pages have been built
exports.onPostBuild = async () => {
	await generateImages();
};
