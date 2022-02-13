import * as O from 'fp-ts/Option';
import * as F from 'fp-ts/Functor';
import * as Ap from 'fp-ts/Apply';
import { apply, pipe } from 'fp-ts/lib/function';
import { Monad1 } from 'fp-ts/lib/Monad';
import { Pointed1 } from 'fp-ts/lib/Pointed';
import { Applicative1 } from 'fp-ts/lib/Applicative';

export type Parser<T> = (s: string) => O.Option<readonly [T, string]>;

export const parse =
  <T>(parser: Parser<T>) =>
  (input: string): O.Option<readonly [T, string]> =>
    parser(input);

export const URI = 'Parser';

export type URI = typeof URI;

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Parser<A>;
  }
}

export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: Parser<A>): Parser<B> =>
  (input: string) =>
    pipe(
      fa,
      parse,
      apply(input),
      O.map(([value, out]) => [f(value), out] as const),
    );

export const _map: Monad1<URI>['map'] = (fa, f) => pipe(fa, map(f));

export const Functor: F.Functor1<URI> = {
  URI,
  map: _map,
};

export const ap: <A>(fa: Parser<A>) => <B>(fab: Parser<(a: A) => B>) => Parser<B> =
  (fa) => (fab) => (input: string) =>
    pipe(
      fab,
      parse,
      apply(input),
      O.chain(([g, output]) => map(g)(fa)(output)),
    );

export const _ap: Monad1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa));

export const Apply: Ap.Apply1<URI> = {
  ...Functor,
  ap: _ap,
};

export const of: Pointed1<URI>['of'] =
  <A>(a: A): Parser<A> =>
  (input: string) =>
    O.some([a, input]);

export const Applicative: Applicative1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
};

/**
 * Composes computations in sequence, using the return value of one computation to determine the next computation.
 */
export const chain: <A, B>(f: (a: A) => Parser<B>) => (ma: Parser<A>) => Parser<B> =
  (f) => (ma) => (input: string) =>
    pipe(
      parse(ma),
      apply(input),
      O.chain(([value, output]) => pipe(value, f, parse, apply(output))),
    );

export const _chain: Monad1<URI>['chain'] = (fa, f) => pipe(fa, chain(f));

export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: _chain,
};
