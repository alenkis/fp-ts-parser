import * as O from 'fp-ts/Option';
import * as P from './parser';

export const firstChar: P.Parser<string> = (input) =>
  input.length > 0 ? O.some([input[0], input.slice(1)]) : O.none;
