# smartstart-frontend

[SmartStart](https://smartstart.services.govt.nz) provides step-by-step
information and support to help users access the right services for them and
their baby.

This repository is the frontend. It users React, Redux and ES6. There is a
separate repository for `smartstart-backend`, a Django application that provides
user management and preferences.

## Folder structure

- src `the uncompiled project codebase`
  - actions `redux actions and action creators`
  - assets `static files that get copied over unchanged - need to build to make available`
  - components `react components`
  - containers `special parent react components that manage both redux setup and routes`
  - static-pages `standalone html error pages which are served directly by nginx`
  - layouts `page structures plus the header and footer`
  - store `redux data store setup and reducers`
  - index.html `basic html page that webpack writes the assets into`
  - index.js `entry point to the app`
  - index.scss `base styles`
  - utils.js `misc small reusable JS utilities`
  - variables.scss `style variables`
- build.js `prep script for running webpack build process`
- local-config.js.example `a local dev way of providing config, when copied to local-config.js`
- package.json `project manifest`
- README.md `you're reading it`
- webpack.config.js `both dev and production configuration for build process`

## Development environments and workflow

### Catalyst dev env

If you're not a Catalyst developer, see the [local
development](#local-development) instructions below.

1. Make sure you have a dedicated environment number assigned to you (e.g. dev09).
- If not ask someone to set it up for you (ask the lead dev).
- Your user package must have been uploaded to the repository, see the new staff instructions on the wiki.
2. Clone the ops repository from the [LEF ops
repo](https://gitlab.catalyst.net.nz/lef/ops)
3. Install your environment by following [the instructions](https://gitlab.catalyst.net.nz/lef/ops#setup-an-environment)

#### Development workflow

1. ssh to dev server `ssh ubuntu@frontend.dev[YOUR_ENV].smartstart.services.govt.nz`
2. Run `run-dev`. It starts the app on port 8080, watches files and automatically refreshes the browser.

You can do one of the following:
1. Modify files directly on web server
2. Mount remote folder `sshfs ubuntu@frontend.dev[YOUR_ENV].smartstart.services.govt.nz:/srv/frontend /home/[YOUR_LOCATION]/`
- Make sure you have a directory set up before running this command
3. Work locally and use rsync to push changes to dev server

The web page should automatically reload as you make changes.

### Local development

You will be unable to use functionality which requires the SmartStart backend,
e.g. logging in or using the BRO form, unless you've separately set up a working
`smartstart-backend` instance and a suitable reverse proxy.

1. Clone the repository from https://gitlab.catalyst.net.nz/lef/smartstart-frontend
2. If you don't already have Node installed, install Node version *8.x* by following the instructions at [https://nodejs.org/](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) or as appropriate for your OS.
3. `cd smartstart-frontend`
4. `npm install`
5. `cp local-config.js.example local-config.js`

You can edit `local-config.js` to add your own API keys.

#### Development workflow

1. `npm start` will watch files for changes as you edit them locally.

## Testing and linting

You can check syntax correctness by running:

`npm run lint`

There are also (currently a small amount of) unit tests that can be run via:

`npm run test`

The test files have the suffix `.test.js` and should be located alongside the
files they test.

### Using local test data

You can use a local data fixture (as opposed to whatever the default API endpoint
is):

`npm run start:snapshot`

## Creating a build for deployment

You must have a clean git tree in order to make the build. In the Catalyst
release process, build automation will run `npm run build` with its own
arguments directly.

The build will be created in the `dist/` folder. A `VERSION.txt` file will also
be added, with the short hash of the most recent git commit.

### Required command line arguments for the build

There are two required command line arguments that must be provided with the
`npm run build` command. A set of command line arguments specified to npm run
needs a preceding ` -- ` first.

#### endpoint

This specifies the path to the content API. It should be a local path, or an
URL.

For example for the govt.nz API endpoint:

`npm run build -- --endpoint https://www.govt.nz/BoacAPI/v1/all`

#### piwik_instance

Location of your Piwik analytics instance. If not supplied, analytics API calls
will just be sent to `/`.

#### piwik

This stipulates which Piwik site ID number to use. It should be a numeric value.

For example for the development servers Piwik ID number:

`npm run build -- --piwik 2`

#### google_api_key

API key for google maps/places. Normally supplied via configuration.

#### raap_instance

Location of your RaaP instance. If not supplied, RaaP API calls
will just be sent to `/`.

#### raap_api_key

API key for NZ RaaP (used for the entitlements section). Normally supplied via
configuration.

#### An example build command

`npm run build -- --endpoint /assets/snapshot-data.json`

### Building locally

If you want to mimic the automated build process locally, there is a shortcut
command for a common local configuration: `npm run build:remotecontent` which
points to govt.nz's API. Note that no other configuration is
supplied, so some functionality will not be available.

If your git tree is not clean, you can supply the --f flag to force a build.
