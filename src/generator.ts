import { existsSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { dirname, join, resolve } from 'node:path';
import { URL } from 'node:url';
import express from 'express';
import type { Express } from 'express-serve-static-core';
import { type Browser, launch } from 'puppeteer';
import { getAllJobs } from './config';
import { endActivity, startActivity, success, updateActivity } from './logger';
import type { JobOptions } from './types';

// Types
type ExtendedJobOptions = JobOptions & {
	pageEndpoint: string;
};

// Constants
const ROOT_DIR = 'public';
const PAGE_FILE_NAME = 'index.html';
const URL_SCHEME = 'http';
const URL_HOSTNAME = '0.0.0.0';
const PUPPETEER_WAIT_CONDITION = 'networkidle2';

// Set up an endpoint for a page and add it to the job options
function registerRoute(app: Express, pagePath: JobOptions['pagePath']) {
	const pageEndpoint = `/${ROOT_DIR}${pagePath}`;
	const file = join(resolve('./'), ROOT_DIR, pagePath, PAGE_FILE_NAME);

	app.get(pageEndpoint, async (req, res) => {
		res.sendFile(file);
	});

	return pageEndpoint;
}

// Given job options, create directories for imagePath if they don't exist
function createDir(imagePath: JobOptions['imagePath']) {
	const directory = dirname(imagePath);

	if (!existsSync(directory)) {
		mkdirSync(directory, {
			recursive: true,
		});
	}
}

// Get all jobs, set up their page endpoints, and create directories for the output images
function setUpJobs(app: Express) {
	return getAllJobs().map((jobOptions): ExtendedJobOptions => {
		const newImagePath = join(ROOT_DIR, jobOptions.imagePath);

		createDir(newImagePath);

		return {
			...jobOptions,
			imagePath: newImagePath,
			pageEndpoint: registerRoute(app, jobOptions.pagePath),
		};
	});
}

// Take a screenshot of a page and save it to the file system
async function processJob(
	browser: Browser,
	host: string,
	extendedJobOptions: ExtendedJobOptions,
) {
	const { imagePath, size, pageEndpoint, type, quality, optimizeForSpeed } =
		extendedJobOptions;
	const url = new URL(pageEndpoint, host).toString();
	const page = await browser.newPage();

	await page.setViewport(size);
	await page.goto(url, {
		waitUntil: PUPPETEER_WAIT_CONDITION,
	});

	if (type === 'pdf') {
		await page.pdf({
			path: imagePath,
			width: size.width,
			height: size.height,
			printBackground: true,
		});
	} else {
		await page.screenshot({
			path: imagePath,
			clip: {
				...size,
				x: 0,
				y: 0,
			},
			type,
			quality: type === 'png' ? undefined : quality,
			optimizeForSpeed,
		});
	}

	updateActivity(imagePath);
}

// Start the server and browser
async function setup() {
	const app = express();
	const jobList = setUpJobs(app);
	const server = createServer(app);

	server.listen();

	// This shouldn't be a string because we're not listening on a pipe or Unix domain socket
	const serverAddress = server.address() as Exclude<
		ReturnType<typeof server.address>,
		string
	>;

	if (!serverAddress) {
		throw new Error('Server failed to start');
	}

	const host = `${URL_SCHEME}://${URL_HOSTNAME}:${serverAddress.port}`;
	const browser = await launch();

	return { server, browser, host, jobList };
}

// Close the browser and server
async function takedown(
	server: Server<typeof IncomingMessage, typeof ServerResponse>,
	browser: Browser,
) {
	await browser.close();

	server.close();
}

// Generate images for all jobs in the queue
export async function generateImages() {
	startActivity('Generating images');
	updateActivity('Setting up');

	const { server, browser, host, jobList } = await setup();

	await Promise.all(
		jobList.map((jobOptions) => processJob(browser, host, jobOptions)),
	);

	await takedown(server, browser);

	endActivity();
	success('Images generated successfully');
}
