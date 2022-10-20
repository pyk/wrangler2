// @ts-ignore entry point will get replaced
import worker from "__ENTRY_POINT__";
// @ts-ignore entry point will get replaced
export * from "__ENTRY_POINT__";

// @ts-ignore routes and transformRuleToRegExp are injected
const routes = __ROUTES__;

export default {
	fetch(request, env, context) {
		const { pathname } = new URL(request.url);

		for (const exclude of routes.exclude) {
			// @ts-ignore isRoutingRuleMatch is injected
			if (isRoutingRuleMatch(pathname, exclude)) {
				return env.ASSETS.fetch(request);
			}
		}

		for (const include of routes.include) {
			// @ts-ignore isRoutingRuleMatch is injected
			if (isRoutingRuleMatch(pathname, include)) {
				return worker.fetch(request, env, context);
			}
		}

		return env.ASSETS.fetch(request);
	},
};
