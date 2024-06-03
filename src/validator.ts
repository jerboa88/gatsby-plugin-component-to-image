import type { PluginOptionsSchemaJoi } from 'gatsby-plugin-utils';
import type { DefaultOptions, JobOptions } from './types';
import { assertIsDefined } from './utils';

// Types
type BooleanSchema = ReturnType<PluginOptionsSchemaJoi['boolean']>;
type NumberSchema = ReturnType<PluginOptionsSchemaJoi['number']>;
type ObjectSchema = ReturnType<PluginOptionsSchemaJoi['object']>;
type StringSchema = ReturnType<PluginOptionsSchemaJoi['string']>;
type Schemas = {
	verbose: BooleanSchema;
	pagePath: StringSchema;
	imagePath: StringSchema;
	component: StringSchema;
	context: ObjectSchema;
	size: ObjectSchema;
	type: StringSchema;
	quality: NumberSchema;
	optimizeForSpeed: BooleanSchema;
};
type SchemaTransformFunc<T> = (schema: T) => T;
type SchemaTransformFuncs = {
	[K in keyof Schemas]?: SchemaTransformFunc<Schemas[K]>;
};

// Constants

const FILE_TYPES = ['png', 'jpeg', 'webp', 'pdf'] as const;
const MIN_QUALITY = 0 as const;
const MAX_QUALITY = 100 as const;
const MIN_SIZE = 1 as const;
const MAX_SIZE = 16383 as const;

// Runtime vars

let joi: PluginOptionsSchemaJoi | undefined = undefined;
let schemas: Schemas | undefined = undefined;

function validateOptions<T>(
	options: Partial<T>,
	fallbackOptions: DefaultOptions,
	schemaTransformFuncs: Partial<{
		[K in keyof Schemas]: (schema: Schemas[K]) => Schemas[K];
	}>,
) {
	assertIsDefined(joi);
	assertIsDefined(schemas);

	const resultMap: Partial<T> = {};

	for (const [optionName, schemaTransformFunc] of Object.entries(
		schemaTransformFuncs,
	)) {
		const value = options?.[optionName as keyof typeof options];
		const fallbackValue =
			fallbackOptions?.[optionName as keyof typeof fallbackOptions];
		const schema = schemas[optionName as keyof Schemas];
		const newSchema = schemaTransformFunc(schema);

		resultMap[optionName as keyof T] = joi.attempt(
			value ?? fallbackValue,
			newSchema,
		);
	}

	return resultMap as T;
}

export function setJoi(newJoi: PluginOptionsSchemaJoi) {
	joi = newJoi;

	schemas = {
		verbose: joi.boolean().label('verbose'),
		pagePath: joi.string().required().label('pagePath'),
		imagePath: joi.string().required().label('imagePath'),
		component: joi.string().label('component'),
		context: joi.object().label('context'),
		size: joi.object({
			width: joi.number().integer().min(MIN_SIZE).max(MAX_SIZE).label('width'),
			height: joi
				.number()
				.integer()
				.min(MIN_SIZE)
				.max(MAX_SIZE)
				.label('height'),
		}),
		type: joi
			.string()
			.valid(...FILE_TYPES)
			.label('type'),
		quality: joi
			.number()
			.integer()
			.min(MIN_QUALITY)
			.max(MAX_QUALITY)
			.label('quality'),
		optimizeForSpeed: joi.boolean().label('optimizeForSpeed'),
	};
}

export function getPluginOptionsSchema() {
	assertIsDefined(joi);
	assertIsDefined(schemas);

	return joi.object({
		verbose: schemas.verbose,
		component: schemas.component,
		context: schemas.context,
		size: schemas.size,
		type: schemas.type,
		quality: schemas.quality,
		optimizeForSpeed: schemas.optimizeForSpeed,
	});
}

export function validateDefaultOptions(
	newDefaultOptions: Partial<DefaultOptions>,
	defaultOptions: DefaultOptions,
): DefaultOptions {
	const schemaTransformFuncs: SchemaTransformFuncs = {
		verbose: (schema) => schema,
		component: (schema) => schema,
		context: (schema) => schema,
		size: (schema) => schema,
		type: (schema) => schema,
		quality: (schema) => schema,
		optimizeForSpeed: (schema) => schema,
	};

	return validateOptions<DefaultOptions>(
		newDefaultOptions,
		defaultOptions,
		schemaTransformFuncs,
	);
}

export function validateJobOptions(
	newJobOptions: Partial<JobOptions>,
	defaultOptions: DefaultOptions,
): JobOptions {
	const schemaTransformFuncs: SchemaTransformFuncs = {
		pagePath: (schema) => schema.required(),
		imagePath: (schema) => schema.required(),
		component: (schema) => schema.required(),
		context: (schema) => schema,
		size: (schema) => schema.required(),
		type: (schema) => schema.required(),
		quality: (schema) => schema.required(),
		optimizeForSpeed: (schema) => schema.required(),
	};

	return validateOptions<JobOptions>(
		newJobOptions,
		defaultOptions,
		schemaTransformFuncs,
	);
}
