export type ReportType = "morning" | "midday" | "close";

export interface Report {
  id: number;
  title: string;
  type: ReportType;
  content: string;
  report_date: string;
  created_at: string;
}

export const reportTypeLabel: Record<ReportType, string> = {
  morning: "早报",
  midday: "午报",
  close: "晚报",
};

export const reportTypeColor: Record<ReportType, string> = {
  morning: "bg-amber-100 text-amber-800",
  midday: "bg-sky-100 text-sky-800",
  close: "bg-indigo-100 text-indigo-800",
};
