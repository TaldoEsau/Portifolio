import { cacheLife } from "next/cache";

export type TwitchStatus = {
  ok: boolean;
  live: boolean;
  mode: "live" | "offline" | "telemetry-offline";
};

const LOGIN = "taldosatis";

export async function getTwitchStatus(): Promise<TwitchStatus> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });

  const clientId = process.env.TWITCH_CLIENT_ID?.trim();
  const clientSecret = process.env.TWITCH_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return { ok: false, live: false, mode: "telemetry-offline" };
  }

  try {
    const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!tokenResponse.ok) {
      return { ok: false, live: false, mode: "telemetry-offline" };
    }
    const token = (await tokenResponse.json()) as { access_token?: string };
    if (!token.access_token) {
      return { ok: false, live: false, mode: "telemetry-offline" };
    }

    const streamResponse = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${LOGIN}`,
      {
        headers: {
          "Client-Id": clientId,
          Authorization: `Bearer ${token.access_token}`,
        },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!streamResponse.ok) {
      return { ok: false, live: false, mode: "telemetry-offline" };
    }
    const payload = (await streamResponse.json()) as {
      data?: { type?: string }[];
    };
    const live = (payload.data ?? []).some((row) => row.type === "live");
    return { ok: true, live, mode: live ? "live" : "offline" };
  } catch {
    return { ok: false, live: false, mode: "telemetry-offline" };
  }
}
