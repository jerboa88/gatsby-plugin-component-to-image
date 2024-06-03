type FileType = 'png' | 'jpeg' | 'webp' | 'pdf';

type Size = {
	width: number;
	height: number;
};

// Common options
export type CommonOptions = {
	component: string | undefined;
	context: object;
	size: Size;
	type: FileType;
	quality: number | undefined;
	optimizeForSpeed: boolean;
};

// Validated default options
export type DefaultOptions = CommonOptions & {
	verbose: boolean;
};

// Validated job options
export type JobOptions = Required<CommonOptions> & {
	pagePath: string;
	imagePath: string;
};
