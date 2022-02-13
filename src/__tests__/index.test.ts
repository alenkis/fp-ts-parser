import { dropMiddle, item } from '../index';
import * as P from '../parser';

describe('item', () => {
  it('Should parse first char of the input', () => {
    const input = 'hello';
    const result = P.parse(item)(input);

    expect(result).toEqualSome(['h', 'ello']);
  });

  it('Should parse the only char in the input', () => {
    const input = 'h';
    const result = P.parse(item)(input);

    expect(result).toEqualSome(['h', '']);
  });

  it('Should return empty array when given empty string', () => {
    const input = '';
    const result = P.parse(item)(input);
    expect(result).toBeNone();
  });
});

describe('dropMiddle', () => {
  it('Should parse 3 characters and drop the middle character', () => {
    const input = 'abcd';
    const result = P.parse(dropMiddle)(input);

    expect(result).toEqualSome(['ac', 'd']);
  });
});
