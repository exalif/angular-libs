import { noop } from './noop';

describe('no op method', () => {
  it('should return undefined', () => {
    expect(noop()).toBeUndefined();
  });
});
