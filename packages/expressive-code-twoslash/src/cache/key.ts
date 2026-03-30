import { createHash } from "node:crypto";
import type { TwoslashCacheEnvironment, TwoslashCacheKeyInput } from "./types.ts";

type JsonPrimitive = boolean | null | number | string;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const cacheSchemaVersion = 1;

function normalizeJson(value: unknown): JsonValue {
	if (
		value === null ||
		typeof value === "boolean" ||
		typeof value === "number" ||
		typeof value === "string"
	) {
		return value;
	}

	if (typeof value === "bigint") {
		return value.toString();
	}

	if (value === undefined || typeof value === "function" || typeof value === "symbol") {
		return null;
	}

	if (Array.isArray(value)) {
		return value.map(normalizeJson);
	}

	if (value instanceof Map) {
		return [...value.entries()]
			.map(([key, entryValue]) => ({
				key: String(key),
				value: normalizeJson(entryValue),
			}))
			.sort((left, right) => left.key.localeCompare(right.key));
	}

	if (value instanceof Set) {
		return [...value.values()].map(normalizeJson);
	}

	if (value instanceof Date) {
		return value.toISOString();
	}

	if (typeof value === "object") {
		return Object.entries(value)
			.sort(([left], [right]) => left.localeCompare(right))
			.reduce<Record<string, JsonValue>>((record, [key, entryValue]) => {
				record[key] = normalizeJson(entryValue);
				return record;
			}, {});
	}

	return String(value);
}

export function createTwoslashCacheKey(
	environment: TwoslashCacheEnvironment,
	input: TwoslashCacheKeyInput,
) {
	return createHash("sha256")
		.update(
			JSON.stringify(
				normalizeJson({
					cacheSchemaVersion,
					environment,
					input,
				}),
			),
		)
		.digest("hex");
}
