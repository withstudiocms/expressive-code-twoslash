import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export type CacheReadResult<T> =
	| { status: "hit"; value: T }
	| { status: "miss" }
	| { status: "error"; error: unknown };

function getCacheFilePath(dir: string, key: string) {
	return path.join(dir, key.slice(0, 2), `${key}.json`);
}

export async function readCacheEntry<T>(dir: string, key: string) {
	const filePath = getCacheFilePath(dir, key);

	try {
		const serialized = await readFile(filePath, "utf8");
		return {
			status: "hit",
			value: JSON.parse(serialized),
		} satisfies CacheReadResult<T>;
	} catch (error) {
		if (error instanceof Error && "code" in error && error.code === "ENOENT") {
			return {
				status: "miss",
			} satisfies CacheReadResult<T>;
		}

		return {
			status: "error",
			error,
		} satisfies CacheReadResult<T>;
	}
}

export async function writeCacheEntry(dir: string, key: string, value: unknown) {
	const filePath = getCacheFilePath(dir, key);
	const cacheDir = path.dirname(filePath);
	const tempFilePath = path.join(cacheDir, `${key}.${randomUUID()}.tmp`);

	await mkdir(cacheDir, { recursive: true });
	await writeFile(tempFilePath, JSON.stringify(value));

	try {
		await rename(tempFilePath, filePath);
	} catch (error) {
		await rm(tempFilePath, { force: true });
		throw error;
	}
	return filePath;
}
