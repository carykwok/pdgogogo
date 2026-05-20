import { supabase } from "@/lib/supabase";
import type { Report, ReportType } from "@/lib/types";
import { reportTypeLabel, reportTypeColor } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const revalidate = 60;

async function getReports(type?: ReportType): Promise<Report[]> {
  let query = supabase
    .from("reports")
    .select("*")
    .order("report_date", { ascending: false })
    .limit(50);

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch reports:", error);
    return [];
  }
  return data as Report[];
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const activeType = (sp.type as ReportType) || undefined;
  const reports = await getReports(activeType);

  const tabs: { label: string; type: ReportType | "all" }[] = [
    { label: "全部", type: "all" },
    { label: "早报", type: "morning" },
    { label: "午报", type: "midday" },
    { label: "晚报", type: "close" },
  ];

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <header className="mb-10">
        <h1 className="font-semibold text-3xl tracking-tight">pdgogogo</h1>
        <p className="mt-2 text-zinc-500">每日财经简报</p>
      </header>

      <nav className="flex gap-2 mb-8">
        {tabs.map((t) => {
          const isActive = activeType
            ? t.type === activeType
            : t.type === "all";
          const href = t.type === "all" ? "/" : `/?type=${t.type}`;
          return (
            <Link
              key={t.type}
              href={href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {reports.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-lg">暂无报告</p>
          <p className="text-sm mt-2">等待第一篇内容上线</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((r) => (
            <Link key={r.id} href={`/report/${r.id}`}>
              <Card className="hover:shadow-md transition-shadow border-zinc-200">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={reportTypeColor[r.type]}>
                      {reportTypeLabel[r.type]}
                    </Badge>
                    <span className="text-sm text-zinc-400">
                      {r.report_date}
                    </span>
                  </div>
                  <CardTitle className="text-base font-medium leading-snug">
                    {r.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-zinc-400 line-clamp-2">
                    {r.content.slice(0, 120)}...
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <footer className="mt-20 text-center text-xs text-zinc-300">
        pdgogogo · 内容仅供参考，不构成投资建议
      </footer>
    </div>
  );
}
