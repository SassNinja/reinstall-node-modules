const path = require('path');
const fs = jest.genMockFromModule('fs');

// Inspired by https://jestjs.io/docs/en/manual-mocks
// but with support for more than just readdirSync
// { dir: [{ name, content }] }
let mockFiles = {};

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
function __setMockFiles(newMockFiles) {
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push({
      name: path.basename(file),
      content: String(newMockFiles[file])
    });
  }
}

// This is a custom function that our tests can use to delete all files
// on the "mock" filesystem (e.g. after each test)
function __resetMockFiles() {
  mockFiles = {};
}

function readFileSync(filePath) {
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);

  if (!mockFiles[dir]) {
    throw new Error(`ENOENT: no such file or directory, open '${name}'`);
  }
  return mockFiles[dir].find(file => file.name === name).content;
}

function existsSync(filePath) {
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);

  return mockFiles[dir] && mockFiles[dir].map(file => file.name).indexOf(name) > -1;
}

function writeFileSync(filePath, content) {
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);

  if (!mockFiles[dir]) {
    mockFiles[dir] = [];
  }

  const idx = mockFiles[dir].map(file => file.name).indexOf(name);

  if (idx > -1) {
    // overwrite existing
    mockFiles[dir][idx].content = String(content);
  } else {
    // create new
    mockFiles[dir].push({
      name,
      content
    });
  }
}

function unlinkSync(filePath) {
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);

  if (!mockFiles[dir]) {
    return;
  }

  const idx = mockFiles[dir].map(file => file.name).indexOf(name);

  if (idx > -1) {
    mockFiles[dir].splice(idx, 1);
  }
  if (mockFiles[dir].length === 0) {
    delete mockFiles[dir];
  }
}

fs.__setMockFiles = __setMockFiles;
fs.__resetMockFiles = __resetMockFiles;
fs.readFileSync = readFileSync;
fs.existsSync = existsSync;
fs.writeFileSync = writeFileSync;
fs.unlinkSync = unlinkSync;

module.exports = fs;
