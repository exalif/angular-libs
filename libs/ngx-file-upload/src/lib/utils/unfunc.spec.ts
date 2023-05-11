import { unfunc } from './unfunc';

const FILE = new File([], 'someName');

const FUNC = (file: File) => file;

const OBJ = {
  some: 'key'
};

describe('when passing function', () => {
  it('should execute function with file argument', () => {
    expect(unfunc(FUNC, FILE)).toEqual(FILE);
  });
});

describe('when passing an item which is not a function', () => {
  it('should return the item', () => {
    expect(unfunc(OBJ, FILE)).toEqual(OBJ);
  });

  it('should return the item', () => {
    expect(unfunc(OBJ)).toEqual(OBJ);
  });
});
