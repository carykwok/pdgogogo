import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Report, ReportType } from "./types";

const contentDir = path.join(process.cwd(), "content/reports");

export function getAllReports(): Report[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));

  const reports: Report[] = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(".md", ""),
        title: data.title as string,
        type: data.type as ReportType,
        content,
        report_date: formatDate(data.date),
      };
    })
    .sort((a, b) => b.report_date.localeCompare(a.report_date));

  return reports;
}

export function getReportBySlug(slug: string): Report | null {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    type: data.type as ReportType,
    content,
    report_date: formatDate(data.date),
  };
}

function formatDate(d: unknown): string {
  if (d instanceof Date) {
    return d.toISOString().slice(0, 10);
  }
  return String(d ?? "");
}

export function getReportsByType(type: ReportType): Report[] {
  return getAllReports().filter((r) => r.type === type);
}
