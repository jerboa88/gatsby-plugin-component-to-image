import { validateDefaultOptions } from './validator';

const jobQueue = [];

let gatsbyCreatePageFunction;
let defaultOptions = {
	verbose: false,
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

export function setDefaultOptions(newDefaultOptions) {
	defaultOptions = validateDefaultOptions(newDefaultOptions, defaultOptions);

	return defaultOptions;
}

export function addJob(job) {
	jobQueue.push(job);
}

export function getAllJobs() {
	return jobQueue;
}

// Store the Gatsby createPage function to use later
export function setGatsbyCreatePageFunction(newGatsbyCreatePageFunction) {
	gatsbyCreatePageFunction = newGatsbyCreatePageFunction;
}

// Call the Gatsby createPage function
export function createPage(...args) {
	return gatsbyCreatePageFunction(...args);
}
