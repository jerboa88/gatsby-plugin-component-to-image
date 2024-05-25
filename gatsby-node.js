const { setReporter } = require('./src/logger');
const { setGatsbyCreatePageFunction } = require('./src/config');
const { generateImages } = require('./src/generator');

// Save the reporter and createPage function for later use
exports.onPluginInit = async ({ reporter, actions: { createPage } }) => {
	setReporter(reporter);
	setGatsbyCreatePageFunction(createPage);
};

// Generate images after pages have been built
exports.onPostBuild = async () => {
	await generateImages();
};
