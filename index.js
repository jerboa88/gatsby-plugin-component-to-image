const { addJob, createPage } = require('./src/config');
const { validateJobOptions } = require('./src/validator');
const { success } = require('./src/logger');

// Exported function to create an image
exports.createImage = (options) => {
	const jobOptions = validateJobOptions(options);

	createPage({
		path: jobOptions.pagePath,
		component: jobOptions.component,
		context: {
			...jobOptions.context,
			imageMetadata: jobOptions,
		},
	});

	addJob(jobOptions);

	success(`Added ${jobOptions.imagePath} to job queue`);

	return jobOptions;
};
