/** biome-ignore-all assist/source/organizeImports: Example Snippet */
/// <reference types="node" />
// ---cut---
import { writeFileSync } from "node:fs";
writeFileSync("myfile.txt", "// TODO");
