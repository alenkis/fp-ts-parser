import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as P from './parser';

/**
 * Succeeds without consuming any of the input string, and returns the single result
 */
export const result =
  <A>(value: A): P.Parser<A> =>
  (input: string) =>
    O.some([value, input]);

/**
 * always fails, regardless of the input string
 */
export const zero = (_: string) => O.none;

/*
 * successfully consumes the first character if the input string is
 * non-empty, and fails otherwise.
 */
export const item: P.Parser<string> = (input) =>
  input.length > 0 ? O.some([input[0], input.slice(1)]) : O.none;

export const dropMiddle: P.Parser<string> = pipe(
  (s1: string) => (_: string) => (s3: string) => s1 + s3,
  P.of,
  P.ap(item),
  P.ap(item),
  P.ap(item),
);
