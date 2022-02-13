import * as E from 'fp-ts/Either';
import * as F from 'fp-ts/Functor';
import * as Ap from 'fp-ts/Apply';
import * as Ch from 'fp-ts/Chain';
import { apply, pipe } from 'fp-ts/lib/function';
import { Monad1 } from 'fp-ts/lib/Monad';
import { Pointed1 } from 'fp-ts/lib/Pointed';
import { Applicative1 } from 'fp-ts/lib/Applicative';

export const URI = 'Parser';

export type URI = typeof URI;

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Parser<A>;
  }
}

export type ParseError = {
  message: string;
  position: number;
};
export type Parser<T> = (s: string) => E.Either<ParseError, readonly [T, string]>;

export const parse =
  <T>(parser: Parser<T>) =>
  (input: string): E.Either<ParseError, readonly [T, string]> =>
    parser(input);

export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: Parser<A>): Parser<B> =>
  (input: string) =>
    pipe(
      fa,
      parse,
      apply(input),
      E.map(([value, out]) => [f(value), out] as const),
    );

const _map: Monad1<URI>['map'] = (fa, f) => pipe(fa, map(f));

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
      E.chain(([g, output]) => map(g)(fa)(output)),
    );

const _ap: Monad1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa));

export const Apply: Ap.Apply1<URI> = {
  ...Functor,
  ap: _ap,
};

export const of: Pointed1<URI>['of'] =
  <A>(a: A): Parser<A> =>
  (input: string) =>
    E.right([a, input]);

export const empty =
  <A>(): Parser<A> =>
  () =>
    E.left({ position: 0, message: 'empty' });

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
      E.chain(([value, output]) => pipe(value, f, parse, apply(output))),
    );

const _chain: Monad1<URI>['chain'] = (fa, f) => pipe(fa, chain(f));

export const Chain: Ch.Chain1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  chain: _chain,
};

export const Monad: Monad1<URI> = {
  URI,
  map: _map,
  ap: _ap,
  of,
  chain: _chain,
};

export const Do: Parser<{}> = of({});

export const bindTo = F.bindTo(Functor);

export const bind = Ch.bind(Chain);
