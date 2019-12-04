const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Computes hash of target package file and compares it
 * with existing *.hash file if present
 *
 * @param {string} filePath path to package file
 * @param {boolean} writeToDisk write *.hash to disk
 * @returns {Promise<Object.<boolean, string>>}
 */
function compareHash(filePath, writeToDisk) {
  return new Promise(resolve => {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const hash = crypto
      .createHash('md5')
      .update(fileContent)
      .digest('hex');
    const hashFilePath = `${filePath}.hash`;
    const hasChanged = !fs.existsSync(hashFilePath) || fs.readFileSync(hashFilePath, 'utf-8') !== hash;

    if (writeToDisk !== false) {
      fs.writeFileSync(`${filePath}.hash`, hash);
    }
    resolve({ hasChanged, fileName });
  });
}

module.exports = compareHash;
