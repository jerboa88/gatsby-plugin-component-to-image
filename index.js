const { info } = require('./src/logger');
const {
	getDefaultOptions,
	setDefaultOptions: configSetDefaultOptions,
	addJob,
	createPage,
} = require('./src/config');
const { validateJobOptions } = require('./src/validator');
const { prettify } = require('./src/utilities');

// Public function for setting default options
function setDefaultOptions(options) {
	const defaultOptions = configSetDefaultOptions(options);

	info(`Default options set to:\n${prettify(defaultOptions)}`);
}

// Public function for creating a single image
function createImage(options) {
	const jobOptions = validateJobOptions(options, getDefaultOptions());

	createPage({
		path: jobOptions.pagePath,
		component: jobOptions.component,
		context: {
			...jobOptions.context,
			imageMetadata: jobOptions,
		},
	});

	addJob(jobOptions);

	info(`Added ${jobOptions.imagePath} to job queue`);

	return jobOptions;
}

module.exports = {
	setDefaultOptions,
	createImage,
};
