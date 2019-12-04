const argv = require('./utils/get-argv');
const compareHash = require('./compare-hash');
const getFilePath = require('./get-file-path');
const install = require('./install');

const defaultOptions = {
  file: argv.file || 'package.json',
  manager: argv.manager || 'npm'
};

function run(options) {
  const opts = Object.assign({}, defaultOptions, options);

  getFilePath(opts.file)
    .then(filePath => compareHash(filePath))
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
