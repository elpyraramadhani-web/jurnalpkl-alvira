import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function hitungTabel(): Promise<{ siswa: number; jurnal: number }> {
  const [s, j] = await Promise.all([
    supabaseAdmin.from("siswa").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("jurnal").select("*", { count: "exact", head: true }),
  ]);
  if (s.error) throw new Error("Gagal menghitung siswa: " + s.error.message);
  if (j.error) throw new Error("Gagal menghitung jurnal: " + j.error.message);
  return { siswa: s.count ?? 0, jurnal: j.count ?? 0 };
}