import { getDefaultOptions } from './config';
import { getPackageName } from './utilities';

const LOG_PREFIX = `${getPackageName()}: `;

let reporter;
let activity;

export function setReporter(newReporter) {
	reporter = newReporter;
}

export function info(message) {
	getDefaultOptions().verbose && reporter?.info(`${LOG_PREFIX}${message}`);
}

export function success(message) {
	reporter?.success(`${LOG_PREFIX}${message}`);
}

export function warn(message) {
	reporter?.warn(`${LOG_PREFIX}${message}`);
}

export function error(message) {
	reporter?.error(`${LOG_PREFIX}${message}`);
}

export function panic(message) {
	reporter?.panic(`${LOG_PREFIX}${message}`);
}

export function startActivity(timerText) {
	activity = reporter?.activityTimer(`${LOG_PREFIX}${timerText}`);
	activity?.start();
}

export function updateActivity(statusText) {
	activity?.setStatus(statusText);
}

export function endActivity() {
	activity?.setStatus('');
	activity?.end();
	activity = null;
}
