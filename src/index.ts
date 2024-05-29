import { info } from './logger';
import { getDefaultOptions, setDefaultOptions as configSetDefaultOptions, addJob, createPage } from './config';
import { validateJobOptions } from './validator';
import { prettify } from './utilities';

// Public function for setting default options
export function setDefaultOptions(options) {
	const defaultOptions = configSetDefaultOptions(options);

	info(`Default options set to:\n${prettify(defaultOptions)}`);
}

// Public function for creating a single image
export function createImage(options) {
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
