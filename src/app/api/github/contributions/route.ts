import { getGithubContributions } from "@/lib/github";

export async function GET() {
  const contributions = await getGithubContributions();
  return Response.json(contributions);
}
