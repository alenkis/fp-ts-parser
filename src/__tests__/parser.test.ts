import { apply, flow, pipe } from 'fp-ts/lib/function';
import { toUpperCase } from 'fp-ts/lib/string';
import { satisfy, item } from '../combinators';
import * as P from '../parser';

describe('Instances', () => {
  describe('Functor', () => {
    it('Should create a new parser with a function applied to its output', () => {
      const input = 'hello';
      const toUpperCase = (s: string) => s.toUpperCase();

      const result = P.parse(P.map(toUpperCase)(item))(input);
      expect(result).toEqualRight(['H', 'ello']);
    });

    it('Should respect first functor law (identity)', () => {
      const identity = <A>(a: A): A => a;

      const input = 'hello';

      const result = P.parse(P.map(identity)(item))(input);
      expect(result).toEqualRight(['h', 'ello']);
    });

    it('Should respect second functor law (composition)', () => {
      // Mapping over a _composition_ of functions should give the same result
      // as successive mapping over given functions
      const input = 'hello';
      const f = (s: string) => s.toUpperCase();
      const g = (s: string) => `*${s}*`;

      const fog = flow(f, g);
      const result1 = P.parse(P.map(fog)(item))(input);

      const result2 = P.parse(P.map(g)(P.map(f)(item)))(input);

      expect(result1).toStrictEqual(result2);
      expect(result1).toEqualRight(['*H*', 'ello']);
    });
  });

  describe('Apply', () => {
    it('Should apply a function to an argument under a type constructor', () => {
      const input = 'hello world';
      const joinWithColon = (s1: string) => (s2: string) => (s3: string) => `${s1}:${s2}:${s3}`;
      const liftedF = P.map(joinWithColon)(item);
      const result = pipe(liftedF, P.ap(item), P.ap(item), P.parse, apply(input));

      expect(result).toEqualRight(['h:e:l', 'lo world']);
    });
  });

  describe('Applicative', () => {
    it('Should create a new parser by lifting a function and applying argument to it', () => {
      const result = pipe(P.of(toUpperCase), P.ap(item), P.parse, apply('hello'));

      expect(result).toEqualRight(['H', 'ello']);
    });
  });

  describe('Monad', () => {
    it('Should correctly implement chain', () => {
      const result = pipe(
        P.chain((x: string) => P.of(toUpperCase(x))),
        apply(item),
        P.parse,
        apply('hello'),
      );

      expect(result).toEqualRight(['H', 'ello']);
    });

    it('Should satify left identity law', () => {
      const f = (s: string) => P.of(`${s}!`);
      const a = 'hello';
      const input = 'hello world';

      const result = pipe(P.chain(f), apply(P.of(a)), P.parse, apply(input));

      expect(result).toStrictEqual(pipe(f(a), P.parse, apply(input)));
    });

    it('Should satify right identity law', () => {
      const input = 'hello world';
      const fa = P.of('hello');

      const result = pipe(P.chain(P.of), apply(fa), P.parse, apply(input));

      expect(result).toStrictEqual(pipe(fa, P.parse, apply(input)));
    });
  });

  describe('Alternative', () => {
    it('Should correctly choose alternative', () => {
      const p1 = satisfy((c) => c === 'h');
      const p2 = satisfy((c) => c === 'w');
      const p3 = satisfy((c) => c === 'e');
      const input = 'world';

      const result = pipe(
        p1,
        P.alt(() => p2),
        P.alt(() => p3),
        P.parse,
        apply(input),
      );

      expect(result).toEqualRight(['w', 'orld']);
    });
  });
});
