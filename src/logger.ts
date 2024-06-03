import type { Reporter } from 'gatsby';
import { getDefaultOptions } from './config';
import { getPackageName } from './utilities';

const LOG_PREFIX = `${getPackageName()}: ` as const;

let reporter: Reporter | undefined;
let activity: ReturnType<Reporter['activityTimer']> | undefined;

export function setReporter(newReporter: Reporter) {
	reporter = newReporter;
}

export function info(message: string) {
	getDefaultOptions().verbose && reporter?.info(`${LOG_PREFIX}${message}`);
}

export function success(message: string) {
	reporter?.success(`${LOG_PREFIX}${message}`);
}

export function warn(message: string) {
	reporter?.warn(`${LOG_PREFIX}${message}`);
}

export function error(message: string) {
	reporter?.error(`${LOG_PREFIX}${message}`);
}

export function panic(message: string) {
	reporter?.panic(`${LOG_PREFIX}${message}`);
}

export function startActivity(timerText: string) {
	activity = reporter?.activityTimer(`${LOG_PREFIX}${timerText}`);
	activity?.start();
}

export function updateActivity(statusText: string) {
	activity?.setStatus(statusText);
}

export function endActivity() {
	activity?.setStatus('');
	activity?.end();
	activity = undefined;
}
