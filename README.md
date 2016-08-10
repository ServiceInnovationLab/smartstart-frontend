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
syntax correctness by running:

`npm lint`

## Creating and deploying a build

You must have a clean git tree in order to make the build. To create the build,
run `npm run build`. The build will be created in the `dist/` folder. A
`VERSION.txt` file will also be added, with the short hash of the most recent
git commit.

## Using local test data

Alternatively, you can run a variant of these commands to use a local data
fixture (as opposed to whatever the default API endpoint is).

For the devserver:

`npm start:local`

For the build:

`npm run build:local`

## Running with the backend too

You must use a cloud evenrinment to enable login and personalisation
functionality. Follow the instructions in the `README.md` in the [ops
repository](https://gitlab.catalyst.net.nz/lef/ops). Once ssh'd in to the
frontend server you can do `cd project` and then if you would like to run the
development server rather than the built version, run `run-dev`.
