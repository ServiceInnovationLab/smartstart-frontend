# smartstart-frontend

## Prerequisites

1. Make sure you have a dedicated environment number assigned to you (e.g. dev09).
- If not ask someone to set it up for you (e.g. Donovan Jones)
- You will need to ensure that your debian package has been uploaded to the repository, sysops will take care of this.
2. Clone the ops repository from [https://gitlab.catalyst.net.nz/lef/ops](https://gitlab.catalyst.net.nz/lef/ops
)
3. Install your environment `./make_smartstart_environment`
4. It would ask you for a vault password, in separate terminal run `ssh cat-prod-secret pview -d lefdev ansible-vault`
- If you have access, you will see the password
- If you don't have access, ask a sysadmin to be added to the `lefdev` group on `cat-prod-secret`
5. Copy paste password to terminal with ansible script that asked for it
If everything goes successfully, you should have your environment.

## Folder structure

- src `the uncompiled project codebase`
  - actions `redux actions and action creators`
  - assets `static files that get copied over unchanged`
  - components `react components`
  - containers `special parent react component that manages redux setup`
  - static-pages `standalone html error pages which are served directly by nginx`
  - layouts `page structures plus the header and footer`
  - store `redux data store setup and reducers`
  - index.html `basic html page that webpack writes the assets into`
  - index.js `entry point to the app`
  - index.scss `base styles`
  - utils.js `misc small reusable JS utilities`
  - variables.scss `style variables`
- build.js `prep script for running webpack build process`
- package.json `project manifest`
- README.md `you're reading it`
- webpack.config.js `both dev and production configuration for build process`

## Development workflow
1. ssh to dev server `ssh ubuntu@frontend.dev[YOUR_ENV].smartstart.services.govt.nz`
2. Run `run-dev`. It starts app on port 8080, watches files and automatically refreshes the browser.

You can do one of the following:
1. modify files directly on web server
2. mount remote folder `sshfs ubuntu@frontend.dev[YOUR_ENV].smartstart.services.govt.nz:/srv/frontend /home/[YOUR_LOCATION]/`
- Make sure you have a directory set up before running this command
3. work locally and use rsync to push changes to dev server

The web page should automatically reload as you make changes. You can also check
syntax correctness by running:

`npm run lint`

There are also (currently a small amount of) unit tests that can be run via:

`npm run test`

The test files have the suffix `.test.js` and should be located alongside the files they test.

## Local development

You will be unable to use functionality which requires the SmartStart backend, e.g. logging in or using the BRO form.

1. Clone the repository from https://gitlab.catalyst.net.nz/lef/smartstart-frontend
2. Install Node version *6.x* by following the instructions at [https://nodejs.org/](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
Note: Node is not required in production but it is required to make the build.
3. `cd smartstart-frontend`
4. `npm install`

## Using local test data

Alternatively, you can run a variant of these commands to use a local data
fixture (as opposed to whatever the default API endpoint is):

`npm run start:testdata`

This is also a recent snapshot of the govt.nz content available locally by
using:

`npm run start:snapshot`

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
build:externalprod` which point to the local test data and govt.nz's API
respectively.
