import type { ArgumentsCamelCase, Argv } from "yargs";

export type YargvToInterface<T> = T extends Argv<infer P>
	? ArgumentsCamelCase<P>
	: never;

/**
 * Given some Yargs Options function factory, extract the interface
 * that corresponds to the yargs arguments
 */
export type YargsOptionsToInterface<T extends (yargs: Argv) => Argv> =
	T extends (yargs: Argv) => Argv<infer P> ? ArgumentsCamelCase<P> : never;
