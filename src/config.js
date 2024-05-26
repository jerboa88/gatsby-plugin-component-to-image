const { validateDefaultOptions } = require('./validator');

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

function getDefaultOptions() {
	return defaultOptions;
}

function setDefaultOptions(newDefaultOptions) {
	defaultOptions = validateDefaultOptions(newDefaultOptions, defaultOptions);

	return defaultOptions;
}

function addJob(job) {
	jobQueue.push(job);
}

function getAllJobs() {
	return jobQueue;
}

// Store the Gatsby createPage function to use later
function setGatsbyCreatePageFunction(newGatsbyCreatePageFunction) {
	gatsbyCreatePageFunction = newGatsbyCreatePageFunction;
}

// Call the Gatsby createPage function
function createPage(...args) {
	return gatsbyCreatePageFunction(...args);
}

module.exports = {
	getDefaultOptions,
	setDefaultOptions,
	addJob,
	getAllJobs,
	setGatsbyCreatePageFunction,
	createPage,
};
