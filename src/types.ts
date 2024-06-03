type FileType = 'png' | 'jpeg' | 'webp' | 'pdf';

type Size = {
	width: number;
	height: number;
};

// Common options
type CommonOptions = {
	context: object;
	size: Size;
	type: FileType;
	quality: number | undefined;
	optimizeForSpeed: boolean;
};

// Validated default options
export type DefaultOptions = CommonOptions & {
	component: string | undefined;
	verbose: boolean;
};

// Validated job options
export type JobOptions = CommonOptions & {
	component: string;
	pagePath: string;
	imagePath: string;
};
