const {
	isUndefined,
	assertIsOfType,
	assertIsOneOf,
	assertIsInRange,
} = require('./utilities');

const DEFAULTS = {
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
const currentConfig = {};

function setDefaultConfig(newDefaultConfig) {
	currentConfig.size = validateSize(newDefaultConfig?.size);
	currentConfig.type = validateType(newDefaultConfig?.type);
	currentConfig.quality = validateQuality(newDefaultConfig?.quality);
	currentConfig.optimizeForSpeed = validateOptimizeForSpeed(
		newDefaultConfig?.optimizeForSpeed,
	);
}

function validateVerbose(newVerbose) {
	if (isUndefined(newVerbose)) {
		return DEFAULTS.verbose;
	}

	assertIsOfType('verbose', newVerbose, 'boolean');

	return newVerbose;
}

function validatePagePath(newPagePath) {
	if (isUndefined(newPagePath)) {
		throw new Error("Missing required option 'pagePath'");
	}

	assertIsOfType('pagePath', newPagePath, 'string');

	return newPagePath;
}

function validateImagePath(newImagePath) {
	if (isUndefined(newImagePath)) {
		throw new Error("Missing required option 'image'");
	}

	assertIsOfType('imagePath', newImagePath, 'string');

	return newImagePath;
}

function validateComponent(newComponent) {
	if (isUndefined(newComponent)) {
		throw new Error("Missing required option 'component'");
	}

	assertIsOfType('component', newComponent, 'string');

	return newComponent;
}

function validateContext(newContext) {
	if (isUndefined(newContext)) {
		return DEFAULTS.context;
	}

	assertIsOfType('context', newContext, 'object');

	return newContext;
}

function validateSize(newSize) {
	const newWidth =
		newSize?.width ?? (currentConfig.size.width || DEFAULTS.size.width);
	const newHeight =
		newSize?.height ?? (currentConfig.size.height || DEFAULTS.size.height);

	assertIsOfType('width', newWidth, 'number');
	assertIsOfType('height', newHeight, 'number');
	assertIsInRange('width', newWidth, 1, 16383);
	assertIsInRange('height', newHeight, 1, 16383);

	return {
		width: newWidth,
		height: newHeight,
	};
}

function validateType(newType) {
	if (isUndefined(newType)) {
		return currentConfig?.type || DEFAULTS.type;
	}

	assertIsOfType('type', newType, 'string');
	assertIsOneOf('type', newType, ['png', 'jpeg', 'webp', 'pdf']);

	return newType;
}

function validateQuality(newQuality, newType) {
	// Quality is only relevant for JPEG and WebP images
	// If quality and the type is PNG, Puppetter will complain
	if (['png', 'pdf'].includes(newType)) {
		return undefined;
	}

	if (isUndefined(newQuality)) {
		return currentConfig?.quality || DEFAULTS.quality;
	}

	assertIsOfType('quality', newQuality, 'number');
	assertIsInRange('quality', newQuality, 0, 100);

	return newQuality;
}

function validateOptimizeForSpeed(newOptimizeForSpeed) {
	if (isUndefined(newOptimizeForSpeed)) {
		return currentConfig?.optimizeForSpeed || DEFAULTS.optimizeForSpeed;
	}

	assertIsOfType('optimizeForSpeed', newOptimizeForSpeed, 'boolean');

	return newOptimizeForSpeed;
}

function validateJobOptions(newJobOptions) {
	const pagePath = validatePagePath(newJobOptions?.pagePath);
	const imagePath = validateImagePath(newJobOptions?.imagePath);
	const component = validateComponent(newJobOptions?.component);
	const context = validateContext(newJobOptions?.context);
	const size = validateSize(newJobOptions?.size);
	const type = validateType(newJobOptions?.type);
	const quality = validateQuality(newJobOptions?.quality, newJobOptions?.type);
	const optimizeForSpeed = validateOptimizeForSpeed(
		newJobOptions?.optimizeForSpeed,
	);

	return {
		pagePath,
		imagePath,
		component,
		context,
		size,
		type,
		quality,
		optimizeForSpeed,
	};
}

module.exports = {
	setDefaultConfig,
	validateJobOptions,
	validateVerbose,
};
