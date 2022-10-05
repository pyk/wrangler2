import { spawnSync } from "child_process";
import commandExists from "command-exists";
import { fetch } from "undici";

const cache: Record<string, string> = {};

async function requireCloudflared(): Promise<void> {
	try {
		await commandExists("cloudflared");
	} catch (e) {
		throw new Error(
			"To use Wrangler with Cloudflare Access, please install `cloudflared` from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation"
		);
	}
}

export async function domainUsesAccess(domain: string): Promise<boolean> {
	const output = await fetch(`https:${domain}`, { redirect: "manual" });
	if (
		output.status === 302 &&
		output.headers.get("location")?.includes("cloudflareaccess.com")
	) {
		return true;
	}
	return false;
}
export async function getAccessToken(domain: string) {
	await requireCloudflared();
	if (cache[domain]) {
		return cache[domain];
	}
	const output = await spawnSync("cloudflared", ["access", "login", domain]);
	const stringOutput = output.stdout.toString();
	const matches = stringOutput.match(/fetched your token:\n\n(.*)/m);
	if (matches && matches.length >= 2) {
		cache[domain] = matches[1];
		return matches[1];
	}
	throw new Error("Failed to authenticate with Cloudflare Access");
}
