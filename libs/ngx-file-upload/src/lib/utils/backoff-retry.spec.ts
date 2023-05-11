import { BackoffRetry } from './backoff-retry';

const DELAY = 100;
const MAX_DELAY = 3000;
const FACTOR = 2;

const RANDOM = 0.75;
const ADDITIONAL_DELAY = RANDOM * DELAY;
const SECOND_ATTEMPT_DELAY = Math.min(DELAY * FACTOR, MAX_DELAY);
Math.random = jest.fn().mockReturnValue(RANDOM);

jest.useFakeTimers();
jest.setTimeout(500);

describe('backoff retry', () => {
  let backOffRetry: BackoffRetry;
  let result: number;

  beforeEach(() => {
    backOffRetry = new BackoffRetry(DELAY, MAX_DELAY, FACTOR);
  });

  describe('reset ', () => {
    beforeEach(() => {
      backOffRetry['delay'] = 2000;
      backOffRetry['retryAttempts'] = 10;
      backOffRetry['code'] = 1;

      backOffRetry.reset();
    });

    it('should restore default values', () => {
      expect(backOffRetry['delay']).toEqual(DELAY);
      expect(backOffRetry['retryAttempts']).toEqual(1);
      expect(backOffRetry['code']).toEqual(-1);
    });
  });

  describe('wait', () => {
    describe('on first attempt', () => {
      beforeEach(async () => {
        Promise.resolve().then(() => {
          jest.advanceTimersByTime(DELAY + ADDITIONAL_DELAY);
        });
        result = await backOffRetry.wait(200);
      });

      it('should resolve after proper delay with retryAttempts set to 1', () => {
        expect(result).toEqual(1);
      });
    });

    describe('on second attempt', () => {
      beforeEach(async () => {
        backOffRetry['code'] = 200;

        Promise.resolve().then(() => {
          jest.advanceTimersByTime(SECOND_ATTEMPT_DELAY + ADDITIONAL_DELAY);
        });
        result = await backOffRetry.wait(200);
      });

      it('should resolve after proper delay with incremented retryAttempts', () => {
        expect(result).toEqual(2);
        expect(backOffRetry['code']).toEqual(200);
      });
    });

    describe('when delay will bust max value', () => {
      beforeEach(async () => {
        backOffRetry['delay'] = 2000;
        backOffRetry['code'] = 200;

        Promise.resolve().then(() => {
          jest.advanceTimersByTime(MAX_DELAY + ADDITIONAL_DELAY);
        });
        result = await backOffRetry.wait(200);
      });

      it('should resolve after the max delay', () => {
        expect(result).toEqual(2);
      });
    });
  });
});
