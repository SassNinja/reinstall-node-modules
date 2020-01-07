const getArgv = require('./utils/get-argv');
const compareHash = require('./compare-hash');
const getFilePath = require('./get-file-path');
const install = require('./install');
const getConfigFile = require('./get-config-file');

const argv = getArgv(process.argv.slice(2));

const defaultOptions = {
  file: argv.file || 'package.json',
  manager: argv.manager || 'npm',
  dry: argv.dry || 'false'
};

function run(options) {
  const opts = Object.assign({}, defaultOptions, getConfigFile(), options);

  getFilePath(opts.file)
    .then(filePath => compareHash(filePath, opts.dry !== 'true'))
    .then(({ hasChanged, fileName }) => {
      if (hasChanged === true) {
        try {
          console.log(`\n\x1b[31m${fileName} has changed – (re)installing node modules now\x1b[0m\n`);
          install(opts);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.log(`\n\x1b[32m${fileName} has not changed – no need to do anything\x1b[0m`);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = run;
