import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("reports").select("*");
  if (error) {
    return Response.json({ ok: false, error: error.message, details: error });
  }
  return Response.json({ ok: true, count: data.length, rows: data });
}
