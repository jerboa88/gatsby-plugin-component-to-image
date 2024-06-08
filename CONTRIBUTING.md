# Contributing

Thank you for your interest in gatsby-plugin-component-to-image! This document outlines the guidelines for contributing to this project, including the development workflow and style guide.

By contributing to this project, you agree to release your contributions under the [MIT License](LICENSE).


## Bug Reports and Feature Requests
If you encounter any bugs or would like to request a new feature, please [open an issue] on GitHub.

Please include as much detail as possible, including the version of the project you are using, the steps to reproduce the issue, and any relevant error messages.


## Semantic Versioning
This project follows [semantic versioning] to better communicate the impact of changes to users.


## Style Guide
[Biome.js] is used to enforce a consistent code style across the project. You can format the code by running `pnpm biome format` or lint the code by running `pnpm biome lint`, but the easiest way to ensure that your code is properly formatted is to install a [Biome.js plugin for your code editor].


##  Development Workflow

### Prerequisites
To contribute to this project, you will need to have the following tools installed on your machine:
- [Node.js] 20.0.0+
- [Git]
- [Pnpm]

### Installation
After installing the prerequisites and cloning the repository, you can install the project dependencies by running `pnpm install`.

### Building
This project is built using [TypeScript]. Running `pnpm build` will compile source code in the `src/` directory and output the compiled JavaScript files to the `lib/` directory, along with type definitions.

When developing locally, keep in mind that the project will not automatically recompile when changes are made to the source code. You can run `pnpm watch` to automatically recompile the project when you save changes to a file.

### Testing
While developing, you can run `pnpm test` to run the test suite. This will also generate a coverage report in the `coverage/` directory.

Tests are run on the source `.ts` files, so there is no need to build the project before running tests.

Please ensure that all tests pass and that the coverage does not decrease before opening a pull request.

### Cleaning
If you need to clean the project directory, you can run `pnpm clean` to remove the `dist/` directory and any other generated files.

### Publishing (Maintainers Only)
To create a new release:
1. Update the version number in `package.json` according to the [semantic versioning] guidelines.
2. Run `pnpm pack` to create a tarball of the project.
3. Create a new release on GitHub and upload the tarball as an asset. This will trigger the publish workflow, which will automatically publish the package to npm.


[Biome.js plugin for your code editor]: https://biomejs.dev/guides/integrate-in-editor/
[Biome.js]: https://biomejs.dev/
[Git]: https://git-scm.com/
[Node.js]: https://nodejs.org/
[open an issue]: https://github.com/jerboa88/gatsby-plugin-component-to-image/issues
[Pnpm]: https://pnpm.io/
[semantic versioning]: https://semver.org/
[TypeScript]: https://www.typescriptlang.org/