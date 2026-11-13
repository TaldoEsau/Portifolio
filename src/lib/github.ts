import { cacheLife } from "next/cache";

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type GithubYear = {
  year: number;
  total: number;
  streak: number;
  peak: number;
  days: ContributionDay[];
};

export type GithubContributions =
  | { ok: true; years: GithubYear[] }
  | { ok: false; mode: "telemetry-offline" };

const LEVEL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const FIRST_YEAR = 2020;

type Calendar = {
  totalContributions?: number;
  weeks?: {
    contributionDays?: {
      date: string;
      contributionCount: number;
      contributionLevel: string;
    }[];
  }[];
};

function readYear(year: number, calendar: Calendar | undefined): GithubYear {
  const days: ContributionDay[] = [];
  for (const week of calendar?.weeks ?? []) {
    for (const day of week.contributionDays ?? []) {
      days.push({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL[day.contributionLevel] ?? 0,
      });
    }
  }

  let streak = 0;
  let run = 0;
  let peak = 0;
  for (const day of days) {
    peak = Math.max(peak, day.count);
    if (day.count > 0) {
      run += 1;
      streak = Math.max(streak, run);
    } else {
      run = 0;
    }
  }

  return {
    year,
    total: calendar?.totalContributions ?? days.reduce((sum, day) => sum + day.count, 0),
    streak,
    peak,
    days,
  };
}

export async function getGithubContributions(): Promise<GithubContributions> {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 21600, expire: 86400 });

  const token = process.env.GITHUB_TOKEN?.trim();
  const login = process.env.GITHUB_USERNAME?.trim();
  if (!token || !login) return { ok: false, mode: "telemetry-offline" };

  const current = new Date().getUTCFullYear();
  const years = Array.from(
    { length: current - FIRST_YEAR + 1 },
    (_, index) => FIRST_YEAR + index,
  );
  const fields = years
    .map((year) => {
      const from = `${year}-01-01T00:00:00Z`;
      const to = `${year + 1}-01-01T00:00:00Z`;
      return `
        y${year}: contributionsCollection(from: "${from}", to: "${to}") {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays { date contributionCount contributionLevel }
            }
          }
        }
      `;
    })
    .join("\n");
  const query = `query($login: String!) { user(login: $login) { ${fields} } }`;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { ok: false, mode: "telemetry-offline" };
    const payload = (await response.json()) as {
      data?: { user?: Record<string, { contributionCalendar?: Calendar }> };
    };
    const user = payload.data?.user;
    if (!user) return { ok: false, mode: "telemetry-offline" };

    const parsed = years.map((year) =>
      readYear(year, user[`y${year}`]?.contributionCalendar),
    );
    const first = parsed.findIndex((item) => item.total > 0);
    const visible = first === -1 ? parsed.slice(-1) : parsed.slice(first);

    return { ok: true, years: visible };
  } catch {
    return { ok: false, mode: "telemetry-offline" };
  }
}
