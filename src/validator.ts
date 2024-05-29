import { isUndefined } from './utilities';

let Joi;
let schema;

function getSchemaWithDefaultValue(schema, defaultValue) {
	if (isUndefined(defaultValue)) {
		return schema;
	}

	return schema.default(defaultValue);
}

export function setJoi(newJoi) {
	Joi = newJoi;

	schema = {
		verbose: Joi.boolean().label('verbose'),
		pagePath: Joi.string().required().label('pagePath'),
		imagePath: Joi.string().required().label('imagePath'),
		component: Joi.string().label('component'),
		context: Joi.object().label('context'),
		size: Joi.object({
			width: Joi.number().integer().min(1).max(16383).label('width'),
			height: Joi.number().integer().min(1).max(16383).label('height'),
		}),
		type: Joi.string().valid('png', 'jpeg', 'webp', 'pdf').label('type'),
		quality: Joi.number().integer().min(0).max(100).label('quality'),
		optimizeForSpeed: Joi.boolean().label('optimizeForSpeed'),
	};
}

export function getPluginOptionsSchema() {
	return Joi.object({
		verbose: schema.verbose,
		component: schema.component,
		context: schema.context,
		size: schema.size,
		type: schema.type,
		quality: schema.quality,
		optimizeForSpeed: schema.optimizeForSpeed,
	});
}

export function validateDefaultOptions(newDefaultOptions, defaultOptions) {
	// Build Joi schemas
	const newSchema = {
		verbose: undefined,
		component: undefined,
		context: undefined,
		size: undefined,
		type: undefined,
		quality: undefined,
		optimizeForSpeed: undefined,
	};

	for (const key in schema) {
		newSchema[key] = getSchemaWithDefaultValue(
			schema[key],
			defaultOptions?.[key],
		);
	}

	// Validate and return plugin options
	return {
		verbose: Joi.attempt(newDefaultOptions?.verbose, newSchema.verbose),
		component: Joi.attempt(newDefaultOptions?.component, newSchema.component),
		context: Joi.attempt(newDefaultOptions?.context, newSchema.context),
		size: Joi.attempt(newDefaultOptions?.size, newSchema.size),
		type: Joi.attempt(newDefaultOptions?.type, newSchema.type),
		quality: Joi.attempt(newDefaultOptions?.quality, newSchema.quality),
		optimizeForSpeed: Joi.attempt(
			newDefaultOptions?.optimizeForSpeed,
			newSchema.optimizeForSpeed,
		),
	};
}

export function validateJobOptions(newJobOptions, defaultOptions) {
	// Build Joi schemas
	const newSchema = {
		pagePath: undefined,
		imagePath: undefined,
		component: undefined,
		context: undefined,
		size: undefined,
		type: undefined,
		quality: undefined,
		optimizeForSpeed: undefined,
	};

	for (const key in schema) {
		newSchema[key] = getSchemaWithDefaultValue(
			schema[key],
			defaultOptions?.[key],
		);
	}

	// Validate and return job options
	return {
		pagePath: Joi.attempt(newJobOptions?.pagePath, newSchema.pagePath),
		imagePath: Joi.attempt(newJobOptions?.imagePath, newSchema.imagePath),
		component: Joi.attempt(
			newJobOptions?.component,
			schema.component.required(),
		),
		context: Joi.attempt(newJobOptions?.context, newSchema.context),
		size: Joi.attempt(newJobOptions?.size, newSchema.size),
		type: Joi.attempt(newJobOptions?.type, newSchema.type),
		quality: Joi.attempt(newJobOptions?.quality, newSchema.quality),
		optimizeForSpeed: Joi.attempt(
			newJobOptions?.optimizeForSpeed,
			newSchema.optimizeForSpeed,
		),
	};
}
