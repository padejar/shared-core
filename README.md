# Quest Introducer Portal

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

```bash
$> npm install
```

If you upgrade from previous versions of node or npm you may have to clear out your `node_modules` and the npm caches:

```bash
$> rm -rf node_modules
$> npm cache clean --force
```

**IMPORTANT STEPS**

1. [Create an access token](https://gitlab.com/-/profile/personal_access_tokens), call it `GITLAB_TOKEN` and give it api, read, write and registry scopes
2. Add `GITLAB_TOKEN` to your OS environment variables

> Without the above step your will not be able to publish this package to gitlab private npm registry

# Manually publish package

1. Make necessary changes
2. Don't forget to update the package's version inside the `package.json`
3. Run the following commands:

```bash
$> npm run compile
$> npm publish
```

# Semantic relase

We're using `semantic-release` to automatically bump the version number and publish the package to the GitLab package registry. It analyzes commit messages to determine the version number, so it has to follow certain formats. For Example:

1. For patch release the commit message should follow the following format:

```bash
fix: [commit message]
```

Example:

```bash
fix: changed label for serial number field on security screen
```

2. For Minor, non-breaking changes (or feature release), we should follow the following format:

```bash
feat([feature name]): [commit message]
```

Example:

```bash
feat(assessment audit log): added audit log on assessment
```

3. For BREAKING CHANGES, we should follow the following format:

```bash
perf([feature]): [commit message]

BREAKING CHANGE: [what will break]
```

Example:

```bash
perf(LMS module): move submit to lms function to its own module

BREAKING CHANGE: the `submitToLms` function has been removed to its own module so it's no longer on the application module
```

Reference:
https://github.com/semantic-release/semantic-release

# Directory structure

- Reference: https://docs.google.com/spreadsheets/d/1U02ldFdsUyob5De0jQBDmFW6wOwFAf0gezlHMsgPcqY/edit#gid=1894511832
- Domain-Driven Design is used for code architecture
- All functional codes are stored in `src` directory
- Directories within `src` are separeted modularly
- `shared` dir contains core modules usable by others
- Anything (e.g. components, etc) that are going to be imported in other domains need to be re-exported via `index` files

# Routing structure

- Each module that have `pages` component will have its own routes under `[module_name]/routes/index.ts`;
- Each module will have `App.tsx`, in case we want to separate the modules into different repos in the future
- Inside the above `App.tsx` is a component that contains `Router` and `Switch` component from `react-router-dom` package, this is import and use our routes to be iterated using `Route` component also from `react-router-dom`, Example:

```
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ErrorHandler from "../shared/common/components/ErrorHandler";
import Loading from "../shared/common/components/Loading";
import routes from "./routes";

const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Switch>
        {routes.map((route, index) => (
            <Route
            key={index}
            exact={route.exact}
            path={route.path}
            render={(props) => <route.component {...props} />}
            />
        ))}
      </Switch>
    </Router>
  );
};
export default App;
```

- All the routes that need files inside the `[module_name]/routes/index.ts` will be combined in the `app/routes.ts`, and will be separated into two categories: private routes and public routes.
- Inside the `app/App.tsx`, the routes from `app/routes.ts` will be iterated depending its category, for example:

```
<Router>
    <React.Suspense fallback={<Loading />}>
    <ErrorHandler>
        <Switch>
        {publicRoutes.map((route, index) => (
            <Route
            key={index}
            exact={route.exact}
            path={route.path}
            render={(props) => <route.component {...props} />}
            />
        ))}
        {isAuthenticated ? (
            <Route
            path="/"
            render={(props) => (
                <BaseLayout {...props} routes={privateRoutes} />
            )}
            />
        ) : (
            <Redirect to="/iam/login" />
        )}
        </Switch>
    </ErrorHandler>
    </React.Suspense>
</Router>
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Testing - Jest

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test -- --coverage --watchAll`

Launches the test runner in the interactive watch mode with table of code coverage

### `npm test [path_to_file]`

Launches the test runner for a single file in the interactive watch mode.<br />
Example: `npm test src/app/App.test.tsx`

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Development "Rules of Thumb" 👍

- Always go for simplicity (see KISS, YAGNI)
- Embrace the separation of concerns (see SOLID principles)
  - [Uncle Bob SOLID principles](https://www.youtube.com/watch?v=zHiWqnTWsn4)
  - [React Folder Structure in 5 Steps](https://www.robinwieruch.de/react-folder-structure/)
  - [File Structure for React Applications Created with create-react-app](https://www.pluralsight.com/guides/file-structure-react-applications-created-create-react-app)
  - [How to structure your React app 2](https://itnext.io/how-to-structure-your-react-app-2-2cf3b8040634)
- Be consistent
- Do everything you can to make the life of other developers looking at your code easier (either by following the above points or add comments where you can't), because most of the time, that developer is going to be you six months later.
