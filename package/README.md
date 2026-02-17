# `expressive-code-twoslash`

[![NPM Version](https://img.shields.io/npm/v/expressive-code-twoslash)](https://npm.im/expressive-code-twoslash)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)

A Expressive Code plugin that adds Twoslash support to your Expressive Code TypeScript code blocks.

## Documentation

[Read the full documentation →](https://twoslash.studiocms.dev)

## Currently Supported Languages

| Language | Identifier |
| -------- | ---------- |
| TypeScript | `ts` |
| React TSX | `tsx` |
| Vue | `vue` |

## Currently Supported Features

| Feature                                                   | Supported Status |
|-----------------------------------------------------------|------------------|
| [JSDocs and Type Hover boxes](/getting-started/basic)     | ✅               |
| [Error Handling/Messages](/usage/banners/errors)          | ✅               |
| [Type Extraction](/usage/queries/extractions)             | ✅               |
| [Code Completions](/usage/queries/completions)            | ✅               |
| [Code Highlighting](/usage/queries/highlights)            | ✅               |
| [Code Cutting](/usage/code-cutting)                       | ✅               |
| [Callouts](/usage/banners/callouts)                       | ✅               |
| [TS Compiler Overrides](/usage/ts-compiler-flags)         | ✅               |
| [Show Emitted Files](/usage/show-emitted-files)           | ⛔️               |

### TODO
- [ ] Make Annotations accessible
- [ ] Use EC's Markdown processing system once released. (Requires support from EC (Planned))
- [ ] Figure out how to work with TwoslashVFS and setup support for "Showing Emitted Files"

## Licensing

[MIT Licensed](https://github.com/withstudiocms/expressive-code-twoslash/tree/main/package/LICENSE).

## Acknowledgements

- [GitHub: @Hippotastic](https://github.com/hippotastic) for providing/maintaining Expressive Code as well as being a huge help during the development of this plugin!
- [EffectTS Website](https://effect.website/docs) for showing the EC Community that Twoslash CAN be used with Expressive-Code. While they did have the first working version, this re-sparked interest in me building out a fully featured EC-Twoslash plugin for the community.
- [`shiki-twoslash`](https://github.com/shikijs/twoslash/tree/main/packages/shiki-twoslash) for being the example of how to implement the elements within codeblocks as well as providing the basic layouts of the elements.