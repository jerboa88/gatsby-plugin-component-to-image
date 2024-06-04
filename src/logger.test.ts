import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Reporter } from 'gatsby';
import Joi from 'joi';
import { setDefaultOptions } from './config';
import { error, info, panic, setReporter, success, warn } from './logger';
import { setJoi } from './validator';

describe('info', () => {
	let reporter: Reporter;

	beforeEach(() => {
		// @ts-expect-error: Reporter is intentially not fully mocked
		reporter = {
			info: jest.fn(),
		};
		// @ts-expect-error: Gatsby's PluginOptionsSchemaJoi type has an additional `subPlugins` property that we don't need
		setJoi(Joi);
		setDefaultOptions({ verbose: false });
		setReporter(reporter);
	});

	it('should log an info message when verbose is true', () => {
		setDefaultOptions({ verbose: true });
		info('This is an info message');
		expect(reporter.info).toHaveBeenCalledWith(
			'gatsby-plugin-component-to-image: This is an info message',
		);
	});

	it('should not log an info message when verbose is false', () => {
		setDefaultOptions({ verbose: false });
		info('This is an info message');
		expect(reporter.info).not.toHaveBeenCalled();
	});
});

describe('success', () => {
	it('should log a success message', () => {
		const reporter = {
			success: jest.fn(),
		};

		// @ts-expect-error: Reporter is intentially not fully mocked
		setReporter(reporter);
		success('This is a success message');
		expect(reporter.success).toHaveBeenCalledWith(
			'gatsby-plugin-component-to-image: This is a success message',
		);
	});
});

describe('warn', () => {
	it('should log a warning message', () => {
		const reporter = {
			warn: jest.fn(),
		};

		// @ts-expect-error: Reporter is intentially not fully mocked
		setReporter(reporter);
		warn('This is a warning message');
		expect(reporter.warn).toHaveBeenCalledWith(
			'gatsby-plugin-component-to-image: This is a warning message',
		);
	});
});

describe('error', () => {
	it('should log an error message', () => {
		const reporter = {
			error: jest.fn(),
		};

		// @ts-expect-error: Reporter is intentially not fully mocked
		setReporter(reporter);
		error('This is an error message');
		expect(reporter.error).toHaveBeenCalledWith(
			'gatsby-plugin-component-to-image: This is an error message',
		);
	});
});

describe('panic', () => {
	it('should log a panic message', () => {
		const reporter = {
			panic: jest.fn(),
		};

		// @ts-expect-error: Reporter is intentially not fully mocked
		setReporter(reporter);
		panic('This is a panic message');
		expect(reporter.panic).toHaveBeenCalledWith(
			'gatsby-plugin-component-to-image: This is a panic message',
		);
	});
});
