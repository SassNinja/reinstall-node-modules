const fs = require('fs');
const path = require('path');

/**
 * Resolves path and check if it exists
 *
 * @param {string} file
 * @returns {Promise<string>}
 */
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

module.exports = getFilePath;
