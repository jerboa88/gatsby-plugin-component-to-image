const { getDefaultOptions } = require('./config');
const { getPackageName } = require('./utilities');

const LOG_PREFIX = `${getPackageName()}: `;

let reporter;
let activity;

function setReporter(newReporter) {
	reporter = newReporter;
}

function info(message) {
	getDefaultOptions().verbose && reporter?.info(`${LOG_PREFIX}${message}`);
}

function success(message) {
	reporter?.success(`${LOG_PREFIX}${message}`);
}

function warn(message) {
	reporter?.warn(`${LOG_PREFIX}${message}`);
}

function error(message) {
	reporter?.error(`${LOG_PREFIX}${message}`);
}

function panic(message) {
	reporter?.panic(`${LOG_PREFIX}${message}`);
}

function startActivity(timerText) {
	activity = reporter?.activityTimer(`${LOG_PREFIX}${timerText}`);

	activity?.start();
}

function updateActivity(statusText) {
	activity?.setStatus(statusText);
}

function endActivity() {
	activity?.setStatus('');
	activity?.end();

	activity = null;
}

module.exports = {
	setReporter,
	success,
	info,
	warn,
	error,
	panic,
	startActivity,
	updateActivity,
	endActivity,
};