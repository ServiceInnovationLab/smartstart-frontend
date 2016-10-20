# boac-frontend

## Prerequisites

1. Clone the repository from https://gitlab.catalyst.net.nz/lef/boac-frontend
2. Install Node version *6.x* by following the instructions at [https://nodejs.org/](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
Note: Node is not required in production but it is required to make the build.
3. `cd boac-frontend`
4. `npm install`

## Folder structure

- src `the uncompiled project codebase`
-- actions `redux actions and action creators`
-- assets `static files that get copied over unchanged`
-- components `react components`
-- containers `special parent react component that manages redux setup`
-- error-pages `standalone html error pages which are served directly by nginx`
-- layouts `page structures plus the header and footer`
-- store `redux data store setup and reducers`
-- index.html `basic html page that webpack writes the assets into`
-- index.js `entry point to the app`
-- index.scss `base styles`
-- utils.js `misc small reusable JS utilities`
-- variables.scss `style variables`
- build.js `prep script for running webpack build process`
- package.json `project manifest`
- README.md `you're reading it`
- webpack.config.js `both dev and production configuration for build process`

## Development workflow

The source files are located within the `src/` directory. You need the run the
built in development webserver to serve the project. To run this, do:

`npm start`

Note that some functionality requires that the backend server is there to talk
to, see the 'Developing with the backend too' section.

The web page should automatically reload as you make changes. You can also check
syntax correctness by running:

`npm lint`

## Using local test data

Alternatively, you can run a variant of these commands to use a local data
fixture (as opposed to whatever the default API endpoint is):

`npm run start:testdata`

This is also a recent snapshot of the govt.nz content available locally by
using:

`npm run start:snapshot`

## Developing with the backend too

You must use a cloud environment to enable login and personalisation
functionality. Follow the instructions in the `README.md` in the [ops
repository](https://gitlab.catalyst.net.nz/lef/ops). Once ssh'd in to the
frontend server you can do `cd project` and then if you would like to run the
development server rather than the built version, run `run-dev`.

## Creating a build for deployment

You must have a clean git tree in order to make the build. To create the build,
Ansible from the ops repository will run `npm run build`.

The build will be created in the `dist/` folder. A `VERSION.txt` file will also
be added, with the short hash of the most recent git commit.

### Required command line arguments for the build

There are two required command line arguements that must be provided with the
`npm run build` command. A set of command line arguments specified to npm run
needs a preceeding ` -- ` first.

#### endpoint

This specifies the path to the content API. It should be a local path, or an
URL.

For example for the govt.nz test API endpoint:

`npm run build -- --endpoint https://govtnz-test1.cwp.govt.nz/BoacAPI/v1/all`

#### piwik

This stipulates which Piwik site ID number to use. It should be a numeric value.

For example for the development servers Piwik ID number:

`npm run build -- --piwik 2`

#### A full example

`npm run build -- --piwik 1 --endpoint /assets/test-data.json`

### Building locally

If you want to mimic the Ansible build process locally, there are two shortcut
commands for common local configuration: `npm run build:testdata` and `npm run
build:externaltest` which point to the local test data and govt.nz's test API
respectively.
