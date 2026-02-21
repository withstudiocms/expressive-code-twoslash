---
"expressive-code-twoslash": minor
---

Adds support for Twoslash Eslint

Adds a new Eslint option for defining types of codeblocks.

Example usage:

``````md

```ts eslint
const unused = 1

type Foo = {
  bar: string
}
```

``````

This will cause two eslint errors as annotations in the code