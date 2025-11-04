import { register } from "./core/register";
import { call } from "./core/call";
import type { SipCredentials, CallOptions, SipRegisterResult } from "./core/types";

export class SipClient {
    private userAgent?: SipRegisterResult["userAgent"];
    private registerer?: SipRegisterResult["registerer"];

    constructor(private credentials: SipCredentials) { }

    async register(): Promise<SipRegisterResult> {
        const result = await register(this.credentials);
        this.userAgent = result.userAgent;
        this.registerer = result.registerer;
        return result;
    }

    async call(options: Omit<CallOptions, "userAgent">) {
        if (!this.userAgent) throw new Error("UserAgent not initialized. Call register() first.");
        return call(this.userAgent, options);
    }

    async unregister() {
        if (this.registerer) {
            await this.registerer.unregister();
            this.registerer = undefined;
        }
        if (this.userAgent) {
            await this.userAgent.stop();
            this.userAgent = undefined;
        }
    }
}

export * from "./core/types";
