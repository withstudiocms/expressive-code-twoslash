# expressive-code-twoslash

## 0.6.0

### Minor Changes

- [#52](https://github.com/withstudiocms/expressive-code-twoslash/pull/52) [`c2baab2`](https://github.com/withstudiocms/expressive-code-twoslash/commit/c2baab2a9955ff7efc5746800bb9c272b30b9976) Thanks [@ackzell](https://github.com/ackzell)! - # Adding support for Twoslash Vue

  A new `"vue"` entry to the `languages` option was added.
  The plugin will now determine which instance of `createTwoSlasher` to use: the TS one or the Vue one.

- [#67](https://github.com/withstudiocms/expressive-code-twoslash/pull/67) [`4d62166`](https://github.com/withstudiocms/expressive-code-twoslash/commit/4d6216693fb3bba29b75673277098db9f0e0220a) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Refactor tsconfig and module imports

- [#70](https://github.com/withstudiocms/expressive-code-twoslash/pull/70) [`42cefd7`](https://github.com/withstudiocms/expressive-code-twoslash/commit/42cefd78353769a5198c167a89f16ab96b6eb702) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Introduces new css-js-gen package for stylesheet creation, and improves CSS styles

- [#80](https://github.com/withstudiocms/expressive-code-twoslash/pull/80) [`00f9cad`](https://github.com/withstudiocms/expressive-code-twoslash/commit/00f9cadb93fc92ac8462ed824d6174747a7a9efb) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Adds support for Twoslash Eslint

  Adds a new Eslint option for defining types of codeblocks.

  Example usage:

  ````md
  ```ts eslint
  const unused = 1;

  type Foo = {
    bar: string;
  };
  ```
  ````

  This will cause two eslint errors as annotations in the code

- [#61](https://github.com/withstudiocms/expressive-code-twoslash/pull/61) [`405cc6d`](https://github.com/withstudiocms/expressive-code-twoslash/commit/405cc6d0aaa8f3b39b7b50409cb66534201f1ac0) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Moves to TSDown compiler

- [#58](https://github.com/withstudiocms/expressive-code-twoslash/pull/58) [`03e0848`](https://github.com/withstudiocms/expressive-code-twoslash/commit/03e08484a874104f0be87c5128081db3677d9b6b) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Cleans up defaults, and modernizes Twoslash config

### Patch Changes

- [#79](https://github.com/withstudiocms/expressive-code-twoslash/pull/79) [`b323683`](https://github.com/withstudiocms/expressive-code-twoslash/commit/b32368388de45d8af98d69410f0d5d9298ca24b1) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Extends support for Twoslash vue to allow passing custom options to the Vue Twoslasher function

- [#63](https://github.com/withstudiocms/expressive-code-twoslash/pull/63) [`3b579ff`](https://github.com/withstudiocms/expressive-code-twoslash/commit/3b579ff57db8a51ef2ea572991d5a7f44039cfab) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Reworks popup script generation

- [#69](https://github.com/withstudiocms/expressive-code-twoslash/pull/69) [`0c4c1d0`](https://github.com/withstudiocms/expressive-code-twoslash/commit/0c4c1d0245deef2f46f67d4b5989e6dbdf67fcfc) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Improves popup script for loading and handling popup event handlers

- [#59](https://github.com/withstudiocms/expressive-code-twoslash/pull/59) [`d2b34b4`](https://github.com/withstudiocms/expressive-code-twoslash/commit/d2b34b449679ce3433dd73c4ae2c8b1482580a65) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Updates dependency configuration to rely on pnpm catalogs

- [#60](https://github.com/withstudiocms/expressive-code-twoslash/pull/60) [`5e33470`](https://github.com/withstudiocms/expressive-code-twoslash/commit/5e3347073a88b9f94188139b3e90933b9a2ba5d9) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - lint

- Updated dependencies [[`21c4812`](https://github.com/withstudiocms/expressive-code-twoslash/commit/21c481202bf64bf2d8818db9a0ea9c862b8996fd), [`640d7dd`](https://github.com/withstudiocms/expressive-code-twoslash/commit/640d7dd84737dedebe5d98214e1ee1c21601ab46), [`8159e57`](https://github.com/withstudiocms/expressive-code-twoslash/commit/8159e574ed968a4210a04a5b9458452842a964f0), [`4d62166`](https://github.com/withstudiocms/expressive-code-twoslash/commit/4d6216693fb3bba29b75673277098db9f0e0220a), [`42cefd7`](https://github.com/withstudiocms/expressive-code-twoslash/commit/42cefd78353769a5198c167a89f16ab96b6eb702)]:
  - css-js-gen@1.1.0

## 0.5.3

### Patch Changes

- [#47](https://github.com/MatthiesenXYZ/EC-Plugins/pull/47) [`1d29cdb`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/1d29cdb58c6b5ac497b05325f4f7b995663301f4) Thanks [@lishaduck](https://github.com/lishaduck)! - fix: line on type extractions

## 0.5.2

### Patch Changes

- [#45](https://github.com/MatthiesenXYZ/EC-Plugins/pull/45) [`0f5af0a`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/0f5af0ab11334a9d60d1dd223508b4a12ca9e386) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update styles to allow error blocks with longer messages to actually wrap correctly

## 0.5.1

### Patch Changes

- [#43](https://github.com/MatthiesenXYZ/EC-Plugins/pull/43) [`b6ac7c2`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/b6ac7c2ccb48b33bded9c3518c09ec4db23b6410) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update styling for typescript errors.

## 0.5.0

### Minor Changes

- [#40](https://github.com/MatthiesenXYZ/EC-Plugins/pull/40) [`54112ed`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/54112ed4a280cb64c03c414b435426514bc223e6) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update Peer dependencies to allow newer versions

## 0.4.0

### Minor Changes

- [#37](https://github.com/MatthiesenXYZ/EC-Plugins/pull/37) [`73e28e2`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/73e28e2f163b72988bc8a0ffdf5891c5ec1be1f5) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update expressive-code to `0.40`

## 0.3.1

### Patch Changes

- [#32](https://github.com/MatthiesenXYZ/EC-Plugins/pull/32) [`b094bb2`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/b094bb2c5b035b66d287c5c57c548e7439d4f788) Thanks [@IMax153](https://github.com/IMax153)! - Ensure Twoslash popup documentation uses the configured code font-family for inline code

- [#35](https://github.com/MatthiesenXYZ/EC-Plugins/pull/35) [`68e8569`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/68e8569b46fec127ad9425381a96eba8a07cb0a5) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - fix line height size

- [#35](https://github.com/MatthiesenXYZ/EC-Plugins/pull/35) [`68e8569`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/68e8569b46fec127ad9425381a96eba8a07cb0a5) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Remove unused style that referenced Starlight

## 0.3.0

### Minor Changes

- [#28](https://github.com/MatthiesenXYZ/EC-Plugins/pull/28) [`f8d2c4c`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/f8d2c4cf5da8062e91ec0a4c936c0ef14cbc8ce9) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Move expressive-code from a normal dependency to a peerDependency

### Patch Changes

- [`1493d18`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/1493d18de2555a6503d748366c398f3900882238) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - fix styleoverrides type

## 0.2.6

### Patch Changes

- [#26](https://github.com/MatthiesenXYZ/EC-Plugins/pull/26) [`506b145`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/506b1451101e6ce8fb79022d3f0f0e308eb726b0) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Remove frame box shadow from docs popup

## 0.2.5

### Patch Changes

- [#24](https://github.com/MatthiesenXYZ/EC-Plugins/pull/24) [`a1644f7`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/a1644f71ad599c74a3786535364d46d11920a3a3) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Fix box shadow on twoslash code type info section

## 0.2.4

### Patch Changes

- [#23](https://github.com/MatthiesenXYZ/EC-Plugins/pull/23) [`171ae90`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/171ae90efaee993462d3e9f67cf0ac694b91558a) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - More CSS cleanup, and organize code

- [#21](https://github.com/MatthiesenXYZ/EC-Plugins/pull/21) [`178ae11`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/178ae117fd505e30cee8e40d0500f81c62378572) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Fix: Small CSS issue for mobile devices

## 0.2.3

### Patch Changes

- [#19](https://github.com/MatthiesenXYZ/EC-Plugins/pull/19) [`31a47d3`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/31a47d3abd1e3c08b3a28114ce342408ff90daf9) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Add codeblock and type processing to Hover/Static annotations

## 0.2.2

### Patch Changes

- [#17](https://github.com/MatthiesenXYZ/EC-Plugins/pull/17) [`8c1413a`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/8c1413a45f7477d36d6a1570fbfcfe03d5221b43) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Remove usage of CDN for FloatingUI

## 0.2.1

### Patch Changes

- [#14](https://github.com/MatthiesenXYZ/EC-Plugins/pull/14) [`596bfbf`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/596bfbfba26bef59ea3ee3e39bf7d1e6dd56954d) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update popups and popup script handling

## 0.2.0

### Minor Changes

- [#12](https://github.com/MatthiesenXYZ/EC-Plugins/pull/12) [`7e4711d`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/7e4711daebf5cc34d1e1aae9efd375203e8bcc96) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Refactor code to be simpiler and small CSS tweaks
  - Add Twoslash includes map
  - Pass user defined Twoslash options to `createTwoslasher()`
  - Remove excess functions and move code back to main EC function
  - Add link color styles inside of Hover/Static docs

## 0.1.6

### Patch Changes

- [#10](https://github.com/MatthiesenXYZ/EC-Plugins/pull/10) [`d761ccc`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/d761cccef66c9410d4c8ff5e6a44594b75a5ccc1) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - fix small css issue

## 0.1.5

### Patch Changes

- [#7](https://github.com/MatthiesenXYZ/EC-Plugins/pull/7) [`7f43232`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/7f43232b275c01c7d92d327383673a7c9343b10c) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Various CSS cleanup, and better annotation building

## 0.1.4

### Patch Changes

- [#4](https://github.com/MatthiesenXYZ/EC-Plugins/pull/4) [`e613aa9`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/e613aa93a6179b0eda0e3144080c7a3985f0eeb8) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Update readme, and package.json

## 0.1.3

### Patch Changes

- [#2](https://github.com/MatthiesenXYZ/EC-Plugins/pull/2) [`969e231`](https://github.com/MatthiesenXYZ/EC-Plugins/commit/969e2316630b111e3a35b96fa9540cd8ccc086e9) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Cleanup styles, apply bug fixes, and more cleanup!

## 0.1.2

### Patch Changes

- Add support for Code Completions and cleanup CSS and Code

## 0.1.1

### Patch Changes

- fix jsDoc

## 0.1.0

### Minor Changes

- Initial release
