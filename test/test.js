import {assert} from 'chai';
import {cronParser} from '../index.js';

describe('Testing Parser', () => {
    it('Testing with valid Input : */15 0 1,5 * 1-5 /usr/bind/find', () => {
        const inputCron = '*/15 0 1,5 * 1-5 /usr/bind/find';
        const expectedOutput = {
            minute: "0 15 30 45",
            hour: "0",
            dayOfMonth: "1 5",
            month: "1 2 3 4 5 6 7 8 9 10 11 12",
            dayOfWeek: "1 2 3 4 5",
            command: "/usr/bind/find"
        }
        const output = cronParser(inputCron);
        assert.deepEqual(output, expectedOutput);
    });

    it('Testing for Invalid Input: * *', () => {
        const inputCron = '* *';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Invalid cron input");
    });

    it('Testing for Invalid Input: a b c d e f', () => {
        const inputCron = 'a b c d e f';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Please check input field: a");
    });

    it('Testing for Invalid Input: */a b c d e f', () => {
        const inputCron = '*/a b c d e f';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Please check input field: */a");
    });

    it('Testing for Invalid Input: * b c d e f', () => {
        const inputCron = '* b c d e f';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Please check input field: b");
    });

    it('Testing for Invalid Input: * * c d e f', () => {
        const inputCron = '* * c d e f';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Please check input field: c");
    });

    it('Testing for Invalid Input: * * * d e f', () => {
        const inputCron = '* * * d e f';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Please check input field: d");
    });

    it('Testing for Invalid Input: * * * * / f', () => {
        const inputCron = '* * * * / f';
        assert.throws(() => {
            cronParser(inputCron);
          }, "Please check input field: /");
    });

    describe('Testing Star Parser', () => {
        it('Testing for Valid Input: * * * * * /path', () => {
            const inputCron = '* * * * * /path';
            const res = cronParser(inputCron)
            const expectedOutput = {
                minute: "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59",
                hour: "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23",
                dayOfMonth: "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31",
                month: "1 2 3 4 5 6 7 8 9 10 11 12",
                dayOfWeek: "0 1 2 3 4 5 6",
                command: "/path"
            }
        
            assert.deepEqual(res, expectedOutput);
        });
    });

    describe('Testing Comma Parser', () => {
        it('Testing for Valid Input: 1,2 * * * * /path', () => {
            const inputCron = '1,2 * * * * /path';
            const res = cronParser(inputCron)
            const expectedOutput = '1 2'
        
            assert.deepEqual(res.minute, expectedOutput);
        });

        it('Testing for InValid Input: -1,2 * * * * /path', () => {
            const inputCron = '-1,2 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Please check input field: -1,2");
        });

        it('Testing for InValid Input: 1,60 * * * * /path', () => {
            const inputCron = '1,60 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Invalid range: 60");
        });
    });

    describe('Testing Range Parser', () => {
        it('Testing for Valid Input: 1-2 * * * * /path', () => {
            const inputCron = '1-2 * * * * /path';
            const res = cronParser(inputCron)
            const expectedOutput = '1 2'
        
            assert.deepEqual(res.minute, expectedOutput);
        });

        it('Testing for InValid Input: -1,2 * * * * /path', () => {
            const inputCron = '-1,2 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Please check input field: -1,2");
        });

        it('Testing for InValid Input: 1-60 * * * * /path', () => {
            const inputCron = '1-60 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Invalid End Range format: 60");
        });

        it('Testing if start is greater than end: 7-6 * * * * /path', () => {
            const inputCron = '7-6 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Invalid Start Range format: 7");
        });
    });

    describe('Testing Increment Parser', () => {
        it('Testing Valid Input: */10 * * * * /path', () => {
            const inputCron = '*/10 * * * * /path';
            const res = cronParser(inputCron)
            const expectedOutput = '0 10 20 30 40 50';
            assert.deepEqual(res.minute, expectedOutput);
        });

        it('Testing Invalid Input: */0 * * * * /path', () => {
            const inputCron = '*/0 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Please check input field: */0");
        });

        it('Testing Invalid Input: -80/10 * * * * /path', () => {
            const inputCron = '-80/10 * * * * /path';
            assert.throws(() => {
                cronParser(inputCron);
              }, "Check the input pattern: -80");
        });
    });
});