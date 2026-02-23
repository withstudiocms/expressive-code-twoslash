// @ts-nocheck
/** biome-ignore-all lint/correctness/noUnusedVariables: Example Snippet */
// @noImplicitAny: false
// @target: esnext
// @lib: esnext
// This suppose to throw an error,
// but it won't because we disabled noImplicitAny.
const fn = (a) => a + 1;
