import { firstChar } from '../index';
import * as P from '../parser';

describe('firstChar', () => {
  it('Should parse first char of the input', () => {
    const input = 'hello';
    const result = P.parse(firstChar)(input);

    expect(result).toEqualSome(['h', 'ello']);
  });

  it('Should parse the only char in the input', () => {
    const input = 'h';
    const result = P.parse(firstChar)(input);

    expect(result).toEqualSome(['h', '']);
  });

  it('Should return empty array when given empty string', () => {
    const input = '';
    const result = P.parse(firstChar)(input);
    expect(result).toBeNone();
  });
});
