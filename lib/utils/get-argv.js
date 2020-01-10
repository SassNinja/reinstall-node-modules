/**
 * Finds key-val groups in the argv and returns them
 * as clear object
 * Supports `--key=val` and `--key val`
 *
 * @param {Array} argvRaw process.argv.slice(2)
 * @returns {Object}
 */
function getArgv(argvRaw) {
  const argv = {};

  argvRaw.forEach((arg, idx) => {
    if (arg.startsWith('--')) {
      const splitted = arg.split('=');
      const key = splitted[0].slice(2);
      let val = true;

      if (splitted.length > 1) {
        val = splitted[1];
      } else if (argvRaw[idx + 1] && !argvRaw[idx + 1].startsWith('--')) {
        val = argvRaw[idx + 1];
      }

      if (val === 'true') {
        val = true;
      } else if (val === 'false') {
        val = false;
      }

      argv[key] = val;
    }
  });

  return argv;
}

module.exports = getArgv;
