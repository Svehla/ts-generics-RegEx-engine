import {DebugTest, Test} from "./index";

type T1 = DebugTest<'a?(b(zz)*c)+(zy)+x', 'bzzzzzzcbcbczyx'>

// $ExpectType true
type T2 = Test<'a?(b(xy)*c)*c', 'abxyxycc'>

// $ExpectType true
type T3 = Test<'(\\(\\.\\))*', '(.)(.)(.)'>
