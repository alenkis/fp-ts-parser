import { flow } from 'fp-ts/lib/function';
import { firstChar } from '../index';
import * as P from '../parser';

describe('Functor', () => {
  it('Should create a new parser with a function applied to its output', () => {
    const input = 'hello';
    const toUpperCase = (s: string) => s.toUpperCase();

    const result = P.parse(P.map(firstChar, toUpperCase))(input);
    expect(result).toEqualSome(['H', 'ello']);
  });

  it('Should respect first functor law', () => {
    const identity = <A>(a: A): A => a;

    const input = 'hello';

    const result = P.parse(P.map(firstChar, identity))(input);
    expect(result).toEqualSome(['h', 'ello']);
  });

  it('Should respect second functor law', () => {
    // Mapping over a _composition_ of functions should give the same result
    // as successive mapping over given functions
    const input = 'hello';
    const f = (s: string) => s.toUpperCase();
    const g = (s: string) => `*${s}*`;

    const fog = flow(f, g);
    const result1 = P.parse(P.map(firstChar, fog))(input);

    const result2 = P.parse(P.map(P.map(firstChar, f), g))(input);

    expect(result1).toStrictEqual(result2);
    expect(result1).toEqualSome(['*H*', 'ello']);
  });
});
