const getArgv = require('./utils/get-argv');
const compareHash = require('./compare-hash');
const getFilePath = require('./get-file-path');
const install = require('./install');
const getConfigFile = require('./get-config-file');
const notifier = require('node-notifier');

const argv = getArgv(process.argv.slice(2));

const defaultOptions = {
  manager: argv.manager || 'npm',
  file: argv.file || 'package.json',
  install: argv.install !== false,
  updateHash: argv.update !== false,
  notify: argv.notify === true,
};

function run(options) {
  const opts = Object.assign({}, defaultOptions, getConfigFile(), options);

  getFilePath(opts.file)
    .then((filePath) => compareHash(filePath, opts.updateHash === true))
    .then(({ hasChanged, fileName }) => {
      if (hasChanged === true) {
        if (opts.install !== false) {
          try {
            console.log(`\n\x1b[31m${fileName} has changed – (re)installing node modules now\x1b[0m\n`);
            install(opts);
          } catch (err) {
            console.error(err);
          }
        } else {
          console.log(`\n\x1b[31m${fileName} has changed – you should (re)install node modules\x1b[0m\n`);
        }
        if (opts.notify) {
          notifier.notify({
            title: `${fileName} has changed`,
            message: 'you should (re)install node modules',
            timeout: 8,
          });
        }
      } else {
        console.log(`\n\x1b[32m${fileName} has not changed – no need to do anything\x1b[0m`);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = run;
