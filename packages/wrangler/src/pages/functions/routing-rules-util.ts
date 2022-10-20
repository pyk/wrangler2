export function transformRoutingRuleToRegExp(rule: string): RegExp {
	let transformedRule = rule;

	// /foo/* is a special case because it needs to match /foo/* and /foo
	if (rule.endsWith("/*") && rule.length > 2) {
		// /foo/* => /foo(/*)?
		// make `/*` an optional group so we can match both
		transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
	}

	// /foo* => /foo.* => ^/foo.*$
	transformedRule = `^${transformedRule.replace("*", ".*")}$`;

	// ^/foo.*$ => /^\/foo.*$/
	return new RegExp(transformedRule);
}

/**
 * @param pathname A pathname string, such as `/foo` or `/foo/bar`
 * @param routingRule The routing rule, such as `/foo/*`
 * @returns True if pathname matches the routing rule
 *
 * /       ->  /
 * /*      ->  /*
 * /foo    ->  /foo
 * /foo*   ->  /foo, /foo-bar, /foo/*
 * /foo/*  ->  /foo, /foo/bar
 */
export function isRoutingRuleMatch(
	pathname: string,
	routingRule: string
): boolean {
	// sanity checks
	if (!pathname) {
		throw new Error("Pathname is undefined.");
	}
	if (!routingRule) {
		throw new Error("Routing rule is undefined.");
	}

	const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
	return pathname.match(ruleRegExp) !== null;
}
