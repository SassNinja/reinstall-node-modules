/**
 * Main module that reads the source file, generated the hash file
 * and (re)installs node modules if hash changed
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');
const argv = require('./utils/argv');

const defaultOptions = {
    file: argv.file || 'package.json',
    manager: argv.manager || 'npm'
}

function compareHash(filePath) {
    return new Promise(resolve => {
        const fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const hash = crypto.createHash('md5').update(fileContent).digest('hex');
        const hashFilePath = `${filePath}.hash`;
        const hasChanged = !fs.existsSync(hashFilePath) || fs.readFileSync(hashFilePath, 'utf-8') !== hash;

        fs.writeFileSync(`${filePath}.hash`, hash);
        resolve({ hasChanged, fileName });
    });
}

function getFilePath(file) {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(process.cwd(), file);

        if (fs.existsSync(filePath)) {
            resolve(filePath);
        } else {
            reject(`ERROR: unable to find ${filePath}`);
        }
    });
}

function install(opts) {
    execSync(opts.manager === 'npm' && opts.file.endsWith('package-lock.json') ? 'npm ci' : `${opts.manager} install`);
}

function run(options) {
    const opts = Object.assign({}, defaultOptions, options);

    getFilePath(opts.file)
        .then(filePath => compareHash(filePath))
        .then(({ hasChanged, fileName }) => {
            if (hasChanged === true) {
                try {
                    console.log(`${fileName} has changed – (re)installing node modules now`);
                    install(opts);
                } catch (err) {
                    console.error(err);
                    process.exit(0);
                }
            } else {
                console.log(`${fileName} has not changed – no need to do anything`);
            }
            process.exit(1);
        })
        .catch(err => {
            console.error(err);
            process.exit(0);
        });
}

module.exports = run;