import {
	isRoutingRuleMatch,
	transformRoutingRuleToRegExp,
} from "./routing-rules-util";

describe("isRoutingRuleMatch", () => {
	it("should match rules referencing root level correctly", () => {
		const routingRule = "/";

		expect(isRoutingRuleMatch("/", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/foo/bar", routingRule)).toBeFalsy();
	});

	it("should match include-all rules correctly", () => {
		const routingRule = "/*";

		expect(isRoutingRuleMatch("/", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/bar", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/bar/baz", routingRule)).toBeTruthy();
	});

	it("should match `/*` suffix-ed rules correctly", () => {
		let routingRule = "/foo/*";

		expect(isRoutingRuleMatch("/foo", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foobar", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/foo/bar", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/bar/baz", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/bar/foo", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/bar/foo/baz", routingRule)).toBeFalsy();

		routingRule = "/foo/bar/*";

		expect(isRoutingRuleMatch("/foo", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/foo/", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/foo/bar", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/bar/baz", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/barfoo", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("baz/foo/bar", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("baz/foo/bar/", routingRule)).toBeFalsy();
	});

	it("should match rules without wildcards correctly", () => {
		let routingRule = "/foo";

		expect(isRoutingRuleMatch("/foo", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/bar", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/bar/foo", routingRule)).toBeFalsy();

		routingRule = "/foo/bar";
		expect(isRoutingRuleMatch("/foo/bar", routingRule)).toBeTruthy();
		expect(isRoutingRuleMatch("/foo/bar/baz", routingRule)).toBeFalsy();
		expect(isRoutingRuleMatch("/baz/foo/bar", routingRule)).toBeFalsy();
	});

	it("should throw an error if pathname or routing rule params are missing", () => {
		// MISSING PATHNAME
		expect(() =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: sanity check
			isRoutingRuleMatch(undefined, "/*")
		).toThrow("Pathname is undefined.");

		expect(() =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: sanity check
			isRoutingRuleMatch(null, "/*")
		).toThrow("Pathname is undefined.");

		expect(() => isRoutingRuleMatch("", "/*")).toThrow(
			"Pathname is undefined."
		);

		// MISSING ROUTING RULE
		expect(() =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: sanity check
			isRoutingRuleMatch("/foo", undefined)
		).toThrow("Routing rule is undefined.");

		expect(() =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore: sanity check
			isRoutingRuleMatch("/foo", null)
		).toThrow("Routing rule is undefined.");

		expect(() => isRoutingRuleMatch("/foo", "")).toThrow(
			"Routing rule is undefined."
		);
	});
});

describe("transformRoutingRuleToRegExp", () => {
	it("should convert rules referencing root level correctly", () => {
		expect(transformRoutingRuleToRegExp("/")).toEqual(/^\/$/);
	});

	it("should convert include-all rules correctly", () => {
		expect(transformRoutingRuleToRegExp("/*")).toEqual(/^\/.*$/);
	});

	it("should convert `/*` suffix-ed rules correctly", () => {
		expect(transformRoutingRuleToRegExp("/foo/*")).toEqual(/^\/foo(\/.*)?$/);
		expect(transformRoutingRuleToRegExp("/foo/bar/*")).toEqual(
			/^\/foo\/bar(\/.*)?$/
		);
	});

	it("should convert any other rules correctly", () => {
		expect(transformRoutingRuleToRegExp("/foo")).toEqual(/^\/foo$/);
		expect(transformRoutingRuleToRegExp("/foo*")).toEqual(/^\/foo.*$/);
		expect(transformRoutingRuleToRegExp("/foo/bar")).toEqual(/^\/foo\/bar$/);
	});
});
