import type { VirtualTypeScriptEnvironment } from "@ec-ts/vfs";
import type { TwoslashExecuteOptions } from "./options.ts";
import type { TwoslashReturn } from "./returns.ts";

export type TwoslashFunction = (
	code: string,
	extension?: string,
	options?: TwoslashExecuteOptions,
) => TwoslashReturn;

export interface TwoslashInstance {
	/**
	 * Run Twoslash on a string of code, with a particular extension
	 */
	(code: string, extension?: string, options?: TwoslashExecuteOptions): TwoslashReturn;
	/**
	 * Get the internal cache map
	 */
	getCacheMap: () => Map<string, VirtualTypeScriptEnvironment> | undefined;
}
