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
		// @ts-expect-error: TODO: Fix this type error in #15
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
		verbose: joi.boolean().label('verbose').example(false),
		pagePath: joi
			.string()
			.required()
			.label('pagePath')
			.example('/__generated/open-graph/blog-post-1'),
		imagePath: joi
			.string()
			.required()
			.label('imagePath')
			.example('/images/open-graph/blog-post-1.png'),
		component: joi
			.string()
			.label('component')
			.example('./src/templates/blog-post.tsx'),
		context: joi.object().label('context').example({
			title: 'Blog Post 1',
			description: 'This is a blog post',
			postDate: '2022-01-01',
		}),
		size: joi
			.object({
				width: joi
					.number()
					.integer()
					.min(MIN_SIZE)
					.max(MAX_SIZE)
					.label('width')
					.example(1200),
				height: joi
					.number()
					.integer()
					.min(MIN_SIZE)
					.max(MAX_SIZE)
					.label('height')
					.example(630),
			})
			.label('size')
			.example({ width: 1200, height: 630 }),
		type: joi
			.string()
			.valid(...FILE_TYPES)
			.lowercase()
			.label('type')
			.example('png'),
		quality: joi
			.number()
			.integer()
			.min(MIN_QUALITY)
			.max(MAX_QUALITY)
			.label('quality')
			.example(95),
		optimizeForSpeed: joi.boolean().label('optimizeForSpeed').example(false),
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
		quality: (schema) => schema,
		optimizeForSpeed: (schema) => schema.required(),
	};

	return validateOptions<JobOptions>(
		newJobOptions,
		defaultOptions,
		schemaTransformFuncs,
	);
}
