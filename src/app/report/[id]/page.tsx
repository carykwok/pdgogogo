import { supabase } from "@/lib/supabase";
import type { Report } from "@/lib/types";
import { reportTypeLabel, reportTypeColor } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 0;

async function getReport(id: number): Promise<Report | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Report;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(Number(id));

  if (!report) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-600 transition-colors mb-8"
      >
        ← 返回列表
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={reportTypeColor[report.type]}>
            {reportTypeLabel[report.type]}
          </Badge>
          <span className="text-sm text-zinc-400">{report.report_date}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight leading-snug">
          {report.title}
        </h1>
      </header>

      <Separator className="mb-8" />

      <article className="leading-relaxed text-zinc-700 space-y-4
        [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-zinc-900 [&_h1]:mt-8 [&_h1]:mb-4
        [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:mt-8 [&_h2]:mb-3
        [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_h3]:mt-6 [&_h3]:mb-2
        [&_p]:leading-relaxed [&_p]:mb-4
        [&_strong]:text-zinc-900 [&_strong]:font-semibold
        [&_a]:text-blue-600 [&_a]:underline
        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
        [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
        [&_li]:mb-1.5
        [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-200 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-500
        [&_hr]:border-zinc-200 [&_hr]:my-8
        [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
        [&_pre]:bg-zinc-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:mb-4
        [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
        [&_th]:border [&_th]:border-zinc-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-medium [&_th]:bg-zinc-50
        [&_td]:border [&_td]:border-zinc-200 [&_td]:px-3 [&_td]:py-2
      ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {report.content}
        </ReactMarkdown>
      </article>

      <Separator className="mt-12 mb-8" />

      <footer className="text-xs text-zinc-300">
        内容仅供参考，不构成投资建议
      </footer>
    </div>
  );
}
