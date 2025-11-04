import { UserAgent, Registerer } from "sip.js";
import type { SipCredentials, SipRegisterResult } from "./types";

export async function register({
    domain,
    phone,
    secret,
    nameexten,
    server = "wss://phone-rtc.pxtalk.com.br:4443/ws",
}: SipCredentials): Promise<SipRegisterResult> {
    const uri = UserAgent.makeURI(`sip:${phone}@${domain}`);
    if (!uri) throw new Error("Invalid SIP URI");

    const userAgent = new UserAgent({
        displayName: nameexten ?? phone,
        authorizationUsername: phone,
        authorizationPassword: secret,
        uri,
        transportOptions: { server, traceSip: true },
        userAgentString: "InterTalk",
        logLevel: "error",
    });

    await userAgent.start();

    const registerer = new Registerer(userAgent, {
        expires: 3600,
        extraHeaders: ["Organization: PxTalk", "Px-Agent: 1.0"],
    });

    await registerer.register();

    return { userAgent, registerer };
}
