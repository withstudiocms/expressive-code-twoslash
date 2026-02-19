/**
 * Test the converted styles from styles.ts
 */

import { allStyles, styles } from "./styles.mjs";

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

// Write to a file for inspection
import { writeFileSync } from "fs";

writeFileSync("output-styles.css", allStyles);
console.log("\n✅ Full CSS written to output-styles.css");
