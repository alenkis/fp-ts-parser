import * as O from 'fp-ts/Option';
import * as F from 'fp-ts/Functor';
import { apply, pipe } from 'fp-ts/lib/function';

type ParseResult<T> = O.Option<readonly [T, string]>;
type Parser<T> = (s: string) => ParseResult<T>;

export const parse =
  <T>(parser: Parser<T>) =>
  (input: string): ParseResult<T> =>
    parser(input);

export const firstChar: Parser<string> = (input) =>
  input.length > 0 ? O.some([input[0], input.slice(1)]) : O.none;

export const URI = 'Parser';

export type URI = typeof URI;

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Parser<A>;
  }
}

export const map =
  <A, B>(fa: Parser<A>, f: (a: A) => B): Parser<B> =>
  (input: string) =>
    pipe(
      fa,
      parse,
      apply(input),
      O.map(([value, out]) => [f(value), out] as const),
    );

export const Functor: F.Functor1<URI> = {
  URI,
  map,
};
