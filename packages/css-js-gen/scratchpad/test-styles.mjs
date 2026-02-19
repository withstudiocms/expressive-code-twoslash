/**
 * Test the converted styles from styles.ts
 */

import { allStyles, styles, stylesheetString } from "./styles.mjs";

// Output a sample of the styles
console.log("=== Base CSS (first 500 chars) ===");
console.log(styles.base.substring(0, 500));
console.log("...\n");

console.log("=== Completion CSS (first 500 chars) ===");
console.log(styles.completion.substring(0, 500));
console.log("...\n");

console.log("=== All Styles Length ===");
console.log(`Total CSS length: ${allStyles.length} characters`);
console.log(`Number of lines: ${allStyles.split("\n").length}`);
console.log("...\n");

console.log("=== Stylesheet String (first 500 chars) ===");
console.log(stylesheetString.substring(0, 500));
console.log("...\n");

// Write to a file for inspection
import { writeFileSync } from "fs";

writeFileSync("./scratchpad/output-styles.css", allStyles);
console.log("\n✅ Full CSS written to scratchpad/output-styles.css");
