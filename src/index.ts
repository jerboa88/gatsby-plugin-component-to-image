import {
	addJob,
	setDefaultOptions as configSetDefaultOptions,
	createPage,
	getDefaultOptions,
} from './config';
import { info } from './logger';
import type { DefaultOptions, JobOptions } from './types';
import { prettify } from './utils';
import { validateJobOptions } from './validator';

// Public function for setting default options
export function setDefaultOptions(options: Partial<DefaultOptions>) {
	const defaultOptions = configSetDefaultOptions(options);

	info(`Default options set to:\n${prettify(defaultOptions)}`);
}

// Public function for creating a single image
export function createImage(options: Partial<JobOptions>) {
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
