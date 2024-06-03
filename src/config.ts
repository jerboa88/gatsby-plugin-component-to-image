import type { Actions } from 'gatsby';
import type { DefaultOptions, JobOptions } from './types';
import { validateDefaultOptions } from './validator';

const jobQueue: JobOptions[] = [];

let gatsbyCreatePageFunction: Actions['createPage'];
let defaultOptions: DefaultOptions = {
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

export function getDefaultOptions() {
	return defaultOptions;
}

export function setDefaultOptions(
	newDefaultOptions: Partial<DefaultOptions>,
): DefaultOptions {
	defaultOptions = validateDefaultOptions(newDefaultOptions, defaultOptions);

	return defaultOptions;
}

export function addJob(job: JobOptions) {
	jobQueue.push(job);
}

export function getAllJobs() {
	return jobQueue;
}

// Store the Gatsby createPage function to use later
export function setGatsbyCreatePageFunction(
	newGatsbyCreatePageFunction: Actions['createPage'],
) {
	gatsbyCreatePageFunction = newGatsbyCreatePageFunction;
}

// Call the Gatsby createPage function
export function createPage(...args: Parameters<Actions['createPage']>) {
	return gatsbyCreatePageFunction(...args);
}
