import * as path from 'path';
import * as fse from 'fs-extra';
import * as glob from 'glob';
import 'mocha';
import { expect } from 'chai';

import * as coverageIstanbul from '../../src/index';
import { createE2ECoverage, IE2ECoverageResult } from '../../src';

describe('./index.ts', () => {
  describe('basic check ', () => {
    it('export should be correct', () => {
      expect(coverageIstanbul).to.have.all.keys(
        'createE2ECoverage',
      );
    });

    it('createE2ECoverage should be function', () => {
      expect(createE2ECoverage).to.be.a('function');
    });
  });

  describe('createE2ECoverage() for demo01', () => {
    const demoFixtures = path.join(__dirname, '../data/fixtures/demo01');
    const demoExpects = path.join(__dirname, '../data/expects/demo01_coverage');
    const demoTmpOutput = path.join(__dirname, '../tmp/demo01_coverage');

    let result: IE2ECoverageResult;

    before(async () => {
      fse.removeSync(demoTmpOutput);

      const globPattern = path.join(demoFixtures, '/**/*.json');
      const reporterDir = path.join(demoTmpOutput);

      result = await createE2ECoverage(globPattern, {
        dir: reporterDir,
      });
    });

    after(() => {
      fse.removeSync(demoTmpOutput);
    });

    it('demo01 result 结果符合预期', () => {
      expect(result).to.eql({
        'data': {
          'branches': 60,
          'functions': 85.71,
          'lines': 72.73,
          'statements': 72.73,
        },
        'reporterDir': demoTmpOutput,
      });
    });

    it('demo01 输出文件数量符合预期，为 17 个文件', () => {
      const expectsList = glob.sync(`${demoExpects}/**`);
      const tmpList = glob.sync(`${demoTmpOutput}/**`);

      expect(expectsList.length).to.equal(tmpList.length);
      expect(tmpList).to.have.lengthOf(17);
    });
  });
});
