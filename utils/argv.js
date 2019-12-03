/**
 * Super lightweight cli arguments parser
 * Supports `--key=val` and `--key val`
 */

const processArgv = process.argv.slice(2);
const argv = {};

processArgv.forEach((arg, idx) => {
    if (arg.startsWith('--')) {
        const splitted = arg.split('=');
        const key = splitted[0].slice(2);
        let val = 'true';

        if (splitted.length > 1) {
            val = splitted[1];
        } else if (processArgv[idx + 1] && !processArgv[idx + 1].startsWith('--')) {
            val = processArgv[idx + 1];
        }
        argv[key] = val;
    }
});

module.exports = argv;