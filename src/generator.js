const { existsSync, mkdirSync } = require('node:fs');
const { join, resolve, dirname } = require('node:path');
const { createServer } = require('node:http');
const { launch } = require('puppeteer');
const express = require('express');
const { getAllJobs } = require('./config');
const {
	success,
	startActivity,
	updateActivity,
	endActivity,
} = require('./logger');

// Constants
const ROOT_DIR = 'public';
const PAGE_FILE_NAME = 'index.html';
const URL_SCHEME = 'http';
const URL_HOSTNAME = '0.0.0.0';
const PUPPETEER_WAIT_CONDITION = 'networkidle2';

// Set up an endpoint for a page and add it to the job options
function registerRoute(app, pagePath) {
	const pageEndpoint = `/${ROOT_DIR}${pagePath}`;
	const file = join(resolve('./'), ROOT_DIR, pagePath, PAGE_FILE_NAME);

	app.get(pageEndpoint, async (req, res) => {
		res.sendFile(file);
	});

	return pageEndpoint;
}

// Given job options, create directories for imagePath if they don't exist
function createDir(imagePath) {
	const directory = dirname(imagePath);

	if (!existsSync(directory)) {
		mkdirSync(directory, {
			recursive: true,
		});
	}
}

// Get all jobs, set up their page endpoints, and create directories for the output images
function setUpJobs(app) {
	return getAllJobs().map((jobOptions) => {
		jobOptions.pageEndpoint = registerRoute(app, jobOptions.pagePath);
		jobOptions.imagePath = join(ROOT_DIR, jobOptions.imagePath);

		createDir(jobOptions.imagePath);

		return jobOptions;
	});
}

// Take a screenshot of a page and save it to the file system
async function processJob(browser, host, jobOptions) {
	const { imagePath, size, pageEndpoint, type, quality, optimizeForSpeed } =
		jobOptions;
	const url = new URL(pageEndpoint, host);
	const page = await browser.newPage();

	await page.setViewport(size);
	await page.goto(url, {
		waitUntil: PUPPETEER_WAIT_CONDITION,
	});
	await page.screenshot({
		path: imagePath,
		clip: {
			...size,
			x: 0,
			y: 0,
		},
		type,
		quality,
		optimizeForSpeed,
	});

	updateActivity(imagePath);
}

// Start the server and browser
async function setup() {
	const app = express();
	const jobList = setUpJobs(app);
	const server = createServer(app);

	server.listen();

	const host = `${URL_SCHEME}://${URL_HOSTNAME}:${server.address().port}`;
	const browser = await launch();

	return { server, browser, host, jobList };
}

// Close the browser and server
async function takedown(server, browser) {
	await browser.close();

	server.close();
}

// Generate social images for all jobs in the queue
async function generateSocialImages() {
	startActivity('Generating social images');
	updateActivity('Setting up');

	const { server, browser, host, jobList } = await setup();

	await Promise.all(
		jobList.map((jobOptions) => processJob(browser, host, jobOptions)),
	);

	await takedown(server, browser);

	endActivity();
	success('Social images generated');
}

module.exports = {
	generateSocialImages,
};
