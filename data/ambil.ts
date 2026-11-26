import type { Siswa } from "@/data/tipe";
import { supabaseAdmin } from "@/lib/supabase-admin";

const KOLOM_SISWA = "id, nama, kelas, tempat_pkl, pembimbing";

export async function cariSiswaByKode(kode: string): Promise<Siswa | null> {
    const {data, error} = await supabaseAdmin
        .from("siswa")
        .select(KOLOM_SISWA)
        .eq("kode", kode)
        .maybeSingle();
    if (error) throw new Error("Gagal memeriksa kode:" + error.message);
    return data;
}

export async function ambilSiswa(id: number): Promise<Siswa | null> {
    const { data, error } = await supabaseAdmin
        .from("siswa")
        .select(KOLOM_SISWA)
        .eq("id", id)
        .maybeSingle();
    if (error) throw new Error("Gagal memuat siswa: " + error.message)
    return data;
}

export async function hitungTabel(): Promise<{ siswa: number; jurnal: number }> {
  const [s, j] = await Promise.all([
    supabaseAdmin.from("siswa").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("jurnal").select("*", { count: "exact", head: true }),
  ]);
  if (s.error) throw new Error("Gagal menghitung siswa: " + s.error.message);
  if (j.error) throw new Error("Gagal menghitung jurnal: " + j.error.message);
  return { siswa: s.count ?? 0, jurnal: j.count ?? 0 };
}