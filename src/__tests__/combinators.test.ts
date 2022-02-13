import { dropMiddle, item, satisfy } from '../combinators';
import * as P from '../parser';

describe('item', () => {
  it('Should parse first char of the input', () => {
    const input = 'hello';
    const result = P.parse(item)(input);

    expect(result).toEqualRight(['h', 'ello']);
  });

  it('Should parse the only char in the input', () => {
    const input = 'h';
    const result = P.parse(item)(input);

    expect(result).toEqualRight(['h', '']);
  });

  it('Should return empty array when given empty string', () => {
    const input = '';
    const result = P.parse(item)(input);
    expect(result).toBeLeft();
  });
});

describe('dropMiddle', () => {
  it('Should parse 3 characters and drop the middle character', () => {
    const input = 'abcd';
    const result = P.parse(dropMiddle)(input);

    expect(result).toEqualRight(['ac', 'd']);
  });
});

describe('satisfy', () => {
  it('Should parse if input satisfies predicate', () => {
    const isH = (s: string) => s === 'h';
    const isHParser = satisfy(isH);

    const result = P.parse(isHParser)('hello');

    expect(result).toEqualRight(['h', 'ello']);
  });
});
