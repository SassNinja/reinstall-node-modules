jest.mock('child_process');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const compareHash = require('../lib/compare-hash');
const getFilePath = require('../lib/get-file-path');
const install = require('../lib/install');
const getArgv = require('../lib/utils/get-argv');

describe('main', () => {
  describe('compare-hash', () => {
    it('should assume package change but not write to disk', () => {
      const filePath = path.join(process.cwd(), 'package.json');

      return compareHash(filePath, false).then(({ hasChanged }) => {
        expect(hasChanged).toBe(true);
        expect(fs.existsSync(`${filePath}.hash`)).toBe(false);
      });
    });
    it('should assume package change and write to disk', () => {
      const filePath = path.join(process.cwd(), 'package.json');

      return compareHash(filePath, true).then(({ hasChanged }) => {
        expect(hasChanged).toBe(true);
        expect(fs.existsSync(`${filePath}.hash`)).toBe(true);
      });
    });
    it('should not do anything if hash file exists and has not changed', () => {
      const filePath = path.join(process.cwd(), 'package.json');

      return compareHash(filePath).then(({ hasChanged }) => {
        expect(hasChanged).toBe(false);
      });
    });
    afterAll(() => {
      fs.unlinkSync(path.join(process.cwd(), 'package.json.hash'));
    });
  });
  describe('get-file-path', () => {
    it('should always return absolute path if exits', () => {
      const relPath = 'package.json';

      return getFilePath(relPath).then(filePath => {
        expect(filePath).toMatch(/package\.json$/);
        expect(path.isAbsolute(filePath)).toBe(true);
      });
    });
    it('should reject if path not exits', () => {
      const badPath = 'paaaaackage.json';

      expect(getFilePath(badPath)).rejects.toContain('ERROR');
    });
  });
  describe('install', () => {
    beforeEach(() => {
      execSync.mockClear();
    });
    it('should respect custom manager', () => {
      install({ manager: 'yarn' });
      expect(execSync.mock.calls[0][0]).toBe('yarn install');
    });
    it('should (re)install faster when using npm and package-lock.json', () => {
      install({ manager: 'npm', file: 'package-lock.json' });
      expect(execSync.mock.calls[0][0]).toBe('npm ci');
    });
    it('should not install if running dry', () => {
      install({ dry: 'true' });
      expect(execSync.mock.calls.length).toBe(0);
    });
  });
});
describe('utils', () => {
  describe('get-argv', () => {
    it('should work with --key=val', () => {
      const argv = getArgv(['--manager=yarn', '--file=yarn.lock']);

      expect(argv).toEqual({ manager: 'yarn', file: 'yarn.lock' });
    });
    it('should work with --key val', () => {
      const argv = getArgv(['--manager', 'yarn', '--file', 'yarn.lock']);

      expect(argv).toEqual({ manager: 'yarn', file: 'yarn.lock' });
    });
    it('should work with with mixed syntax', () => {
      const argv = getArgv(['--manager', 'yarn', '--file=yarn.lock']);

      expect(argv).toEqual({ manager: 'yarn', file: 'yarn.lock' });
    });
    it('should be true if only --key is set without val', () => {
      const argv = getArgv(['--production']);

      expect(argv).toEqual({ production: 'true' });
    });
  });
});
