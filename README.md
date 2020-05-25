# (re)install-node-modules

[![Build Status](https://travis-ci.com/SassNinja/reinstall-node-modules.svg?branch=master)](https://travis-ci.com/SassNinja/reinstall-node-modules) [![codecov](https://codecov.io/gh/SassNinja/reinstall-node-modules/branch/master/graph/badge.svg)](https://codecov.io/gh/SassNinja/reinstall-node-modules)

Have you ever been in the situation you were facing an issue that was simply caused by not having (re)installed node modules after someone had changed it?

Are you tired of telling people to (re)install their node modules when they ask you why something is not working?

This lightweight package might be the perfect solution for you! It (re)installs node modules whenever the target package file has changed!

## Installation

Install the package with your favorite manager

```bash
npm install reinstall-node-modules --save-dev
```

```bash
yarn add reinstall-node-modules --dev
```

## Usage

You may use it in the `scripts` field of your `package.json`

```json
{
  "scripts": {
    "reinstall": "reinstall-node-modules"
  }
}
```

However it's highly recommended to use a **git hook** to run it! There's no other way to make sure everybody has the correct node modules!

### Hook

If you wanna use a hook for this it's recommended to use `post-merge`. An easy way to use git hooks is the [husky](https://github.com/typicode/husky) package what would require to add the following to your `package.json`

```json
{
  "husky": {
    "hooks": {
      "post-merge": "reinstall-node-modules"
    }
  }
}
```

### Import

It's also possible import the package and use it programmatically though most of the time an npm-script or hook makes more sense.

```javascript
const installer = require('reinstall-node-modules');
const options = {};

installer(options);
```

## Options

| Option     | Type    | Default        |
| ---------- | ------- | -------------- |
| manager    | string  | 'npm'          |
| file       | string  | 'package.json' |
| install    | boolean | true           |
| updateHash | boolean | true           |
| notify     | boolean | false          |

### manager

The manager option defines the package manager that gets used to (re)install the node modules. By default it's `npm` but you can use whatever you like (as long as it supports the `install` command).

If you wanna e.g. use `yarn` instead of `npm` you only need to pass it as option

```
reinstall-node-modules --manager yarn
```

### file

The file option defines the path to the target package file that gets used to determine whether it's necessary to (re)install node modules or not (based on its content). You can use either a relative or an absolute path here. By default it's `package.json` assuming there's such a file in your current working directory.

If you wanna e.g. use `package-lock.json` instead of `package.json` you only need to pass it as option

```
reinstall-node-modules --file package-lock.json
```

### install

The install option defines if an actual (re)install is executed.
So to disable it you only need to set it `false`

```
reinstall-node-modules --install false
```

### updateHash

The updateHash option defines if a \*.hash file is written to disk.
Be careful with disabling this because your target package file will be considered as changed then every time.

```
reinstall-node-modules --update false
```

### notify

The notify option defines if a [notification](https://github.com/mikaelbr/node-notifier) gets sent in case the target package file has changed. This is in particular useful if you have disabled `install` to gently inform your colleagues they should (re)install their node modules.

```
reinstall-node-modules --notify true
```

## Config

Usually you set the options via command line arguments (e.g. `--install false`).
If you prefer a config file instead just create a `reinstall-node-modules.json` file in your process cwd.

## Credits

This package is inspired by [install-changed](https://github.com/ninesalt/install-changed).

Last but not least, if this package is helpful to you it'll be great when you give me a star on github and share it. Keeps me motivated to continue the development.
