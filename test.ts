import {DebugTest, Test} from "./index";

/**
 * Successful tests
 */

/**
 * Exact match
 */
// $ExpectType true
type T1 = Test<'hello', 'hello'>
// $ExpectType false
type T2 = Test<'goodbye', 'hello'>


/**
 * Any character
 */
// $ExpectType true
type AC1 = Test<'.', '4'>
// $ExpectType false
type AC2 = Test<'.', ''>


/**
 * Zero or one
 */
// $ExpectType true
type ZOO1 = Test<'2?', '2'>
// $ExpectType true
type ZOO2 = Test<'2?', ''>
// $ExpectType false
type ZOO3 = Test<'2?', '3'>

/**
 * Zero Or More
 */
// $ExpectType true
type ZOM1 = Test<'1*', '111'>
// $ExpectType true
type ZOM2 = Test<'1*', '1'>
// $ExpectType true
type ZOM3 = Test<'1*', ''>
// $ExpectType false
type ZOM4 = Test<'1*', '2'>


/**
 * One Or More
 */
// $ExpectType true
type OOM1 = Test<'4+', '444'>
// $ExpectType true
type OOM2 = Test<'4+', '4'>
// $ExpectType false
type OOM3 = Test<'4+', ''>
// $ExpectType false
type OOM4 = Test<'4+', '8'>


/**
 * Group tests
 */
// $ExpectType true
type GRP1 = Test<'(2)', '2'>
// $ExpectType false
type GRP2 = Test<'(2)', ''>

/**
 * Escape character
 */
// $ExpectType true
type EC1 = Test<'\\\\', '\\'>;
// $ExpectType true
type EC2 = Test<'\\(', '('>
// $ExpectType false
type EC3 = Test<'\\)', '('>


/**
 * Complex tests
 */
// $ExpectType true
type T3123 = Test<'a?(b(xy)*c)*c', 'abxyxycc'>
// $ExpectType true
type T4123123 = Test<'(\\(\\.\\))*', '(.)(.)(.)'>

/**
 * Debug tests - just test to make sure no errors
 */
type DEBUG1 = DebugTest<'a?(b(zz)*c)+(zy)+x', 'bzzzzzzcbcbczyx'>


/**
 * Failing tests
 */

/**
 * Partial matches
 */
// $ExpectType true
type T1000 = Test<'h', 'hello'>

// $ExpectType true
type FT2 = Test<'.', '44'>
