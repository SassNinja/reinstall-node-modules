const { execSync } = require('child_process');

/**
 * Executes the (re)install command using specified manager
 *
 * @param {Object} opts installer options
 */
function install(opts) {
  if (opts.install !== false) {
    execSync(opts.manager === 'npm' && opts.file.endsWith('package-lock.json') ? 'npm ci' : `${opts.manager} install`, { stdio: 'inherit' });
  }
}

module.exports = install;
