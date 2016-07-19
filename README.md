# boac-frontend

## Prerequisites

1. Clone the repository from https://gitlab.catalyst.net.nz/lef/boac-frontend
2. Install Node version *6.x* by following the instructions at [https://nodejs.org/](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
Note: Node is not required in production but it is required to make the build.
3. `cd boac-frontend`
4. `npm install`

## Development workflow

The source files are located within the `src/` directory. You need the run the
built in development webserver to serve the project. To run this, do:

`npm start`

The web page should automatically reload as you make changes. You can also check
sytax correctness by running:

`npm lint`

## Creating and deploying a build

You must have clean git tree in order to make the build. To create the build,
run `npm run build`. The build will be created in the `dist/` folder.

TODO: what else? cp the files to /www/ ??
