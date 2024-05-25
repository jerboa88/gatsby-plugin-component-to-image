const jobQueue = [];

let gatsbyCreatePageFunction;

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
	addJob,
	getAllJobs,
	setGatsbyCreatePageFunction,
	createPage,
};
