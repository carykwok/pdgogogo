export async function GET() {
  const ref = "kodqbijxbkojgreykxwtt";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const urls = [
    `https://${ref}.supabase.co`,
    `https://${ref}.supabase.red`,
    `https://db.${ref}.supabase.co`,
    `https://api.supabase.com`,
  ];

  const results: Record<string, unknown> = {};

  for (const baseUrl of urls) {
    try {
      const url = baseUrl.includes("api.supabase.com")
        ? `${baseUrl}/v1/projects/${ref}`
        : `${baseUrl}/rest/v1/reports?select=count`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        headers: baseUrl.includes("api.supabase.com")
          ? { Authorization: `Bearer ${anonKey}` }
          : { apikey: anonKey },
        signal: controller.signal,
      });
      clearTimeout(timer);

      results[baseUrl] = {
        status: res.status,
        ok: res.ok,
        text: await res.text().then((t) => t.slice(0, 200)),
      };
    } catch (e: unknown) {
      const err = e as Error;
      results[baseUrl] = { error: err.message };
    }
  }

  // Also try DNS resolution
  let dnsResult = "unknown";
  try {
    const dnsRes = await fetch(`https://dns.google/resolve?name=${ref}.supabase.co&type=A`);
    dnsResult = await dnsRes.text();
  } catch {
    dnsResult = "dns query failed";
  }

  return Response.json({ ref, dns: dnsResult.slice(0, 300), urls: results });
}
