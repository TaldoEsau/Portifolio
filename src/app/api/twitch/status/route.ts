import { getTwitchStatus } from "@/lib/twitch";

export async function GET() {
  const status = await getTwitchStatus();
  return Response.json(status);
}
