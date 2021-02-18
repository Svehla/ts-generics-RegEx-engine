// Minimum TypeScript Version: 4.1

// -------------------------------------------------------
// ----------------- Math operations ---------------------
// -------------------------------------------------------
type IterationMap = {
  '-11': [-11, '-', '-12', '-10', '11']
  '-10': [-10, '-', '-11', '-9', '10']
  '-9': [-9, '-', '-10', '-8', '9']
  '-8': [-8, '-', '-9', '-7', '8']
  '-7': [-7, '-', '-8', '-6', '7']
  '-6': [-6, '-', '-7', '-5', '6']
  '-5': [-5, '-', '-6', '-4', '5']
  '-4': [-4, '-', '-5', '-3', '4']
  '-3': [-3, '-', '-4', '-2', '3']
  '-2': [-2, '-', '-3', '-1', '2']
  '-1': [-1, '-', '-2', '0', '1']
  '0': [0, '0', '-1', '1', '0']
  '1': [1, '+', '0', '2', '-1']
  '2': [2, '+', '1', '3', '-2']
  '3': [3, '+', '2', '4', '-3']
  '4': [4, '+', '3', '5', '-4']
  '5': [5, '+', '4', '6', '-5']
  '6': [6, '+', '5', '7', '-6']
  '7': [7, '+', '6', '8', '-7']
  '8': [8, '+', '7', '9', '-8']
  '9': [9, '+', '8', '10', '-9']
  '10': [10, '+', '9', '11', '-10']
  '11': [11, '+', '10', '12', '-11']
  '12': [12, '+', '11', '13', '-12']
  '13': [13, '+', '12', '14', '-13']
  '14': [14, '+', '13', '15', '-14']
  '15': [15, '+', '14', '16', '-15']
  '16': [16, '+', '15', '17', '-16']
  '17': [17, '+', '16', '18', '-17']
  '18': [18, '+', '17', '19', '-18']
  '19': [19, '+', '18', '20', '-19']
  '20': [20, '+', '19', '21', '-20']
  '21': [21, '+', '20', '22', '-21']
  '22': [22, '+', '21', '23', '-22']
  '23': [23, '+', '22', '24', '-23']
  '24': [24, '+', '23', '25', '-24']
  '25': [25, '+', '24', '26', '-25']
  '26': [26, '+', '25', '27', '-26']
  '27': [27, '+', '26', '28', '-27']
  '28': [28, '+', '27', '29', '-28']
  '29': [29, '+', '28', '30', '-29']
  '30': [30, '+', '29', '31', '-30']
  '31': [31, '+', '30', '32', '-31']
  '32': [32, '+', '31', '33', '-32']
  '33': [33, '+', '32', '34', '-33']
  '34': [34, '+', '33', '35', '-34']
  '35': [35, '+', '34', '36', '-35']
  '36': [36, '+', '35', '37', '-36']
  '37': [37, '+', '36', '38', '-37']
  '38': [38, '+', '37', '39', '-38']
  '39': [39, '+', '38', '40', '-39']
  '40': [40, '+', '39', '41', '-40']
}

// @ts-expect-error
type Add1<T> = IterationMap[T][3]
// @ts-expect-error
type Sub1<T> = IterationMap[T][2]

type _Add<T, U, Res = T> = ParseInt<U> extends 0 ? Res : _Add<Add1<T>, Sub1<U>, Add1<Res>>

type _Sub<T, U, Res = T> = ParseInt<U> extends 0 ? Res : _Sub<Sub1<T>, Sub1<U>, Sub1<Res>>

// @ts-expect-error
type ParseInt<T> = IterationMap[T][0]

type Add<T, U> = ParseInt<_Add<ParseInt<T>, ParseInt<U>>>
type Sub<T, U> = ParseInt<_Sub<ParseInt<T>, ParseInt<U>>>

// --------------------------------------------------
// ----------------- StdLib -------------------------
// --------------------------------------------------

// --- Arrays utils
type Head<T> = T extends [infer FirstItem, ...infer _Rest] ? FirstItem : never
type Tail<T> = T extends [infer _FirstItem, ...infer Rest] ? Rest : never
type RemoveLast<T> = T extends [...infer Rest, infer _LastIem] ? Rest : never
type Last<T> = T extends [...infer _Rest, infer Last] ? Last : never

type RemoveFirstsNItems<T, Count> = Count extends 0 ? T : RemoveFirstsNItems<Tail<T>, Sub<Count, 1>>

type ReplaceLastItem<T, NewLastItem> = [...RemoveLast<T>, NewLastItem]

type Push<Arr extends any[], Item> = [...Arr, Item]

type EditLastItemAttr<
  Arr extends any[],
  Key extends string,
  Value extends any,
  T0 = Omit<Last<Arr>, Key> & { [key in Key]: Value },
  T1 = {
    [K in keyof T0]: T0[K]
  }
> = ReplaceLastItem<Arr, T1>

type EditLastItemOfLastItemAttr<
  Arr extends any[][],
  Key extends string,
  Value extends any
> = ReplaceLastItem<Arr, EditLastItemAttr<Last<Arr>, Key, Value>>

type PushToLastItem<Arr extends any[][], Item> = ReplaceLastItem<Arr, Push<Last<Arr>, Item>>

// --- strings utils
type SplitText<T extends string> = T extends ''
  ? []
  : T extends `${infer First}${infer Rest}`
  ? // @ts-expect-error
    [First, ...TokenizeString<Rest>]
  : T

// --------------- regex parser ------------------
// Stack based parser inspired by this awesome source
// > https://www.youtube.com/watch?v=u01jb8YN2Lw

export type TokenizeString<T> = T extends ''
  ? []
  : T extends `\\${infer Rest}`
  ? // @ts-expect-error
    ['\\', ...TokenizeString<Rest>]
  : T extends `${infer First}${infer Rest}`
  ? // @ts-expect-error
    [First, ...TokenizeString<Rest>]
  : T

export type ParseRegExTokens<T /*extends string[]*/, Stack extends any[] = [[]]> = T extends []
  ? Stack
  : Head<T> extends '.'
  ? ParseRegExTokens<Tail<T>, PushToLastItem<Stack, { type: 'wildcard'; quantifier: 'exactlyOne' }>>
  : Head<T> extends '?'
  ? ParseRegExTokens<Tail<T>, EditLastItemOfLastItemAttr<Stack, 'quantifier', 'zeroOrOne'>>
  : Head<T> extends '*'
  ? ParseRegExTokens<Tail<T>, EditLastItemOfLastItemAttr<Stack, 'quantifier', 'zeroOrMore'>>
  : Head<T> extends '+'
  ? ParseRegExTokens<
      Tail<T>,
      PushToLastItem<
        Stack,
        // copy last element and update nested key `quantifier`
        Last<EditLastItemAttr<Last<Stack>, 'quantifier', 'zeroOrMore'>>
      >
    >
  : Head<T> extends '('
  ? ParseRegExTokens<Tail<T>, Push<Stack, []>>
  : Head<T> extends ')'
  ? ParseRegExTokens<
      Tail<T>,
      PushToLastItem<
        // TODO:rename tail into pop???
        RemoveLast<Stack>,
        {
          type: 'groupElement'
          states: Last<Stack>
          quantifier: 'exactlyOne'
        }
      >
    >
  : Head<T> extends '\\'
  ? ParseRegExTokens<
      // iterate over 2 items at once
      Tail<Tail<T>>,
      PushToLastItem<
        Stack,
        {
          type: 'element'
          // @ts-expect-error
          value: T[1]
          quantifier: 'exactlyOne'
        }
      >
    >
  : ParseRegExTokens<
      Tail<T>,
      PushToLastItem<Stack, { type: 'element'; value: Head<T>; quantifier: 'exactlyOne' }>
    >

// @ts-expect-error
type ParsedRegEx<T> = ParseRegExTokens<TokenizeString<T>>[0]

// ------------- regex interpreter ----------------
type ApplyMultipleZeroOrMore<
  // TODO: rename to Node
  State extends { value: any; type: any; states: any },
  Text extends string[],
  Index extends number,
  Val = StateMatchesStringAtIndex<State, Text, Index>,
  // @ts-expect-error
  Consumed = Val[1]
> = Consumed extends 0
  ? [Consumed]
  : [
      Add<
        Consumed,
        // @ts-expect-error ts-toolbelt Add works good for some reason
        ApplyMultipleZeroOrMore<State, Text, Add<Index, Consumed>>[0]
      >
    ]

type StateMatchesStringAtIndex<
  State extends { value: any; type: any; states: any },
  Text extends string[],
  Index extends number
> =
  // Text
  State['type'] extends 'wildcard'
    ? [true, 1]
    : State['type'] extends 'element'
    ? State['value'] extends Text[Index]
      ? [true, 1]
      : [false, 0]
    : State['type'] extends 'groupElement'
    ? TestRegExp<State['states'], RemoveFirstsNItems<Text, Index>> extends [
        infer IsMatched,
        infer Consumed
      ]
      ? IsMatched extends true
        ? [true, Consumed]
        : [false, Consumed]
      : // nested error ?
        [false, 0]
    : never 

type TestRegExp<RegExpAST, Text, Index = 0> = RegExpAST extends []
  ? [true, Index]
  : // @ts-expect-error
  Head<RegExpAST>['quantifier'] extends 'exactlyOne'
  ? // TIP: infer is another option how to save value while processing data type
    // @ts-expect-error
    StateMatchesStringAtIndex<Head<RegExpAST>, Text, Index> extends [
      infer IsMatched,
      infer Consumed
    ]
    ? IsMatched extends true
      ? TestRegExp<Tail<RegExpAST>, Text, Add<Index, Consumed>>
      : [
          false,
          Index,
          {
            index: Index
            ast: Head<RegExpAST>
            text: Text
            consumed: Consumed
          }
        ]
    : never
  : // @ts-expect-error
  Head<RegExpAST>['quantifier'] extends 'zeroOrOne'
  ? StateMatchesStringAtIndex<
      // @ts-expect-error
      Head<RegExpAST>,
      Text,
      Index
    > extends [infer IsMatched, infer Consumed]
    ? IsMatched extends true
      ? TestRegExp<Tail<RegExpAST>, Text, Add<Index, Consumed>>
      : TestRegExp<Tail<RegExpAST>, Text, Index>
    : never
  : // @ts-expect-error
  Head<RegExpAST>['quantifier'] extends 'zeroOrMore'
  ? ApplyMultipleZeroOrMore<
      // @ts-expect-error
      Head<RegExpAST>,
      Text,
      Index
    > extends [infer Consumed]
    ? TestRegExp<Tail<RegExpAST>, Text, Add<Index, Consumed>>
    : TestRegExp<Tail<RegExpAST>, Text, Index>
  : '!!! error!!!'

export type DebugTest<
  RegExp extends string,
  Text extends string,
  ParsedText = SplitText<Text>,
  Res = TestRegExp<ParsedRegEx<RegExp>, ParsedText>
> =
  // @ts-expect-error
  Res[0] extends true
    ? // check if the TestRegExp iterate over whole string
      // @ts-expect-error
      Res[1] extends ParsedText['length']
      ? { isValid: true; log: Res }
      : { isValid: false; errorLog: Res; info: 'string does not match till the end' }
    : { isValid: false; errorLog: Res }

export type Test<RegExp extends string, Text extends string> = DebugTest<RegExp, Text>['isValid']


