<!-- Project Header -->
<div align="center"> 
<img class="projectLogo" src="icon.svg" alt="Project logo" title="Project logo" width="256">

<h1 class="projectName">Gatsby Plugin: Component to Image</h1>

<p class="projectBadges">
	<img src="https://img.shields.io/badge/type-Gatsby_Plugin-8a4baf.svg" alt="Project type" title="Project type">
	<img src="https://img.shields.io/github/languages/top/jerboa88/gatsby-plugin-component-to-image.svg" alt="Language" title="Language">
	<img src="https://img.shields.io/github/repo-size/jerboa88/gatsby-plugin-component-to-image.svg" alt="Repository size" title="Repository size">
	<a href="LICENSE">
		<img src="https://img.shields.io/github/license/jerboa88/gatsby-plugin-component-to-image.svg" alt="Project license" title="Project license"/>
	</a>
</p>

<p class="projectDesc">
	A Gatsby plugin to generate images from React components. Useful for dynamically generating Open Graph images or favicons
</p>

<br/>
</div>


## About

### Why?

This plugin was inspired by similar plugins for generating Open Graph images like [gatsby-plugin-open-graph-images], [gatsby-plugin-satorare], and [gatsby-remark-twitter-cards], but is designed to be more flexible:
- Unlike [gatsby-remark-twitter-cards], the card style is not limited by the plugin options. You can create a component for your Open Graph image with the exact style you want, and then use this plugin to generate the image
- [gatsby-plugin-satorare] used [vercel/satori] internally to generate SVG images from your JSX markup, which is very cool, but there are some limitations with this approach:
	- Satori only accepts JSX elements that are pure and stateless, which will cause issues if you use hooks or context in your component
	- Satori only supports a subset of the CSS spec, so your component may not render as expected if you use unsupported CSS properties
	- Using CSS-in-JS libraries like Tailwind CSS or Styled Components requires complex setup to get working with Satori, and rewriting your component with inline styles is not always feasible
	
	This plugin uses [Puppeteer] to render your component in a headless browser, so any React component should work with this plugin
- Unlike [gatsby-plugin-open-graph-images], you have full control over the output path and file type of the generated images. The path of the generated pages can also be set so that you can exclude them from your sitemap, or reuse them for other purposes. Because of this, you can use this plugin to generate images for any purpose, not just Open Graph images

### How?
1. When you call the `createImage` function from `gatsby-node.js`, we save the options for that image and generate a regular Gatsby page from the component you provided
2. When the page is built, we use Puppeteer to render the page in a headless browser and save a screenshot of the rendered component as an image, according to the options you provided


## Installation
1. Install the plugin with your favorite package manager:
	- `npm install jerboa88/gatsby-plugin-component-to-image` or
	- `yarn add jerboa88/gatsby-plugin-component-to-image` or
	- `pnpm add jerboa88/gatsby-plugin-component-to-image` or
	- `bun add github:jerboa88/gatsby-plugin-component-to-image`
2. Add the plugin to your `gatsby-config.js` file:
	```js
	// gatsby-config.js

	module.exports = {
		plugins: [
			'gatsby-plugin-component-to-image',
		],
	}
	```


## Usage

This plugin can be used for a variety of purposes, but we will show you how to use it to generate Open Graph images for your blog posts as an example:

1. Create a component that renders the content you want to appear in the image:
	```tsx
	// src/templates/og-image/blog-post.tsx

	import React from 'react';
	import { graphql } from 'gatsby';

	const BlogPostOGImage = ({ pageContext }) => {
		// Props passed to the createImage function with the `context` option
		const { title, description, postDate } = pageContext;
		// Props automatically added by `gatsby-plugin-component-to-image`
		const { size } = pageContext.imageMetadata;

		// Limit the size of the page to the size of the image
		return (
			<div style={{
				maxWidth: size.width,
				maxHeight: size.height,
				padding: '1rem',
				backgroundColor: 'white',
				textAlign: 'center',
			}}>
				<h1>{title}</h1>
				<p>{description}</p>
				<p>Published on {postDate}</p>
			</div>
		);
	};

	export default BlogPostOGImage;
	```

	The `pageContext` prop is passed to the component by Gatsby when the image is generated. It contains details about the generated image in `imageMetadata` that you can use to style your component, as well as any other data you passed to the `createImage()` function via the `context` prop.
	
	In this example, we use the `size` property from `imageMetadata` to set the maximum width and height of the image, and we use the `title`, `description`, and `postDate` properties from `pageContext` to customize the content of the image for each blog post.

2. Call the `createImage()` function from `gatsby-node.js` with your desired options:
	```js
	// gatsby-node.js

	import { resolve, join } from 'path';
	import { createImage } from 'gatsby-plugin-component-to-image';

	export const createPages = async ({ actions }) => {

		// ...

		// Example blog post details. You could get this data from a CMS or other source
		const blogPostDetails = {
			title: 'Blog Post 1',
			description: 'This is a blog post',
			postDate: '2022-01-01',
		};

		// Generate an Open Graph image for the blog post. Pass the blog post details to the page template so that we can use them in the image
		const imageMetadata = createImage({
			pagePath: join('/', '__generated', 'open-graph', 'blog-post-1'),
			imagePath: join('/', 'images', 'open-graph', `blog-post-1.png`),
			component: resolve('./src/templates/og-image/blog-post.tsx'),
			size: {
				width: 1200,
				height: 630,
			},
			context: blogPostDetails,
		});

		// Create a page for the blog post. Pass the image metadata to the page template so that we can use the image URL in our Open Graph meta tags
		actions.createPage({
			path: join('/', 'blog', 'blog-post-1')
			component: resolve('./src/templates/blog-post.tsx'),
			context: {
				...blogPostDetails,
				imageMetadata: imageMetadata,
			}
		});

		// ...

	};
	```
	The function will return an object with the metadata for the image. If you don't specify certain options, the plugin will use default values which will be returned here.

	For example, the metadata object can be used to:
	- Pass the image URL to your page template so that you can use the image in your Open Graph meta tags
	- Add nodes to the GraphQL schema so that you can query the image metadata in your components

3. Run `gatsby build` to generate the image. The image will be saved to the path you specified with the `imagePath` option


### Options

| **Option**         | **Description**                                                                                                                                                                                                                 | **Type**     | **Default** |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|-------------|
| `pagePage`         | The destination path where the image component will be generated, relative to the `/public` directory. You may want to exclude this path from other plugins so that these components are not included in sitemaps, for example. | **required** |             |
| `imagePath`        | The destination path of the image itself, relative to the `/public` directory. Include the file extension in the path.                                                                                                          | **required** |             |
| `component`        | A path to the component used to generate the image.                                                                                                                                                                             | **required** |             |
| `context`          | Additional context to pass to the image component. You can include any kind of data here that you want to include in your image so that you can access it later from the image component.                                       | _optional_   | {}          |
| `size.width`       | The width of the image in pixels. This value must be between 1 and 16383.                                                                                                                                                       | _optional_   | 1200        |
| `size.height`      | The height of the image in pixels. This value must be between 1 and 16383.                                                                                                                                                      | _optional_   | 630         |
| `type`             | The file type of the image. This can be one of 'png', 'jpeg', or 'webp'.                                                                                                                                                        | _optional_   | 'png'       |
| `quality`          | The quality of the image. The has no effect on PNG images. This value must be between 0 and 100.                                                                                                                                | _optional_   | undefined   |
| `optimizeForSpeed` | Whether Puppeteer should optimize image encoding for speed instead of file size.                                                                                                                                                | _optional_   | false       |


## Contributing
Contributions, issues, and forks are welcome. [SemVer](http://semver.org/) is used for versioning.


## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. This project includes various resources which carry their own copyright notices and license terms. See [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md) for more details.


[Puppeteer]: https://pptr.dev/
[vercel/satori]: https://github.com/vercel/satori
[gatsby-plugin-open-graph-images]: https://github.com/squer-solutions/gatsby-plugin-open-graph-images/
[gatsby-plugin-satorare]: https://github.com/okaryo/gatsby-plugin-satorare
[gatsby-remark-twitter-cards]: https://github.com/alessbell/gatsby-remark-twitter-cards