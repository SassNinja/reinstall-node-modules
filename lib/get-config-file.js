const fs = require('fs');
const path = require('path');

/**
 * Returns parsed JSON of a dedicated config file if it exists
 *
 * @param {string} fileName
 * @returns {Object}
 */
function getConfigFile(fileName = 'reinstall-node-modules.json') {
  if (fs.existsSync(path.join(process.cwd(), fileName))) {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), fileName)));
  }
  return {};
}

module.exports = getConfigFile;
