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
    module.exports = {
      plugins: [
        'gatsby-plugin-component-to-image',
      ],
    }
    ```


## Usage
...


## Contributing
Contributions, issues, and forks are welcome. [SemVer](http://semver.org/) is used for versioning.


## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. This project includes various resources which carry their own copyright notices and license terms. See [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md) for more details.


[Puppeteer]: https://pptr.dev/
[vercel/satori]: https://github.com/vercel/satori
[gatsby-plugin-open-graph-images]: https://github.com/squer-solutions/gatsby-plugin-open-graph-images/
[gatsby-plugin-satorare]: https://github.com/okaryo/gatsby-plugin-satorare
[gatsby-remark-twitter-cards]: https://github.com/alessbell/gatsby-remark-twitter-cards