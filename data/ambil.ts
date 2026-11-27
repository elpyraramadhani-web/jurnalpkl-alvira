import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BarisJurnal, BarisRekap, Jurnal, Siswa, SiswaAdmin, Status } from "@/data/tipe";

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

export async function ambilJurnalSiswa(siswaId: number): Promise<Jurnal[]> {
    const { data, error } = await supabaseAdmin
        .from("jurnal")
        .select("*")
        .eq("siswa_id", siswaId)
        .order("tanggal", {ascending: false});
    if (error) throw new Error ("Gagal memuat jurnal: " + error.message);
    return data as Jurnal[];
}

//tidak bisa membuka jurnal siswa lain
export async function ambilJurnal(id: number, siswaId: number): Promise<Jurnal | null>{
    if (!Number.isInteger(id)) return null;
    const {data, error} = await supabaseAdmin
        .from("jurnal")
        .select("*")
        .eq("id", id)
        .eq("siswa_id", siswaId)
        .maybeSingle();
    if (error) throw new Error("Gagal memuat jurnal: " + error.message);
    return data as Jurnal | null;
}

export async function ambilRekap(): Promise<BarisRekap[]> {
    const [s, j] = await Promise.all([
        supabaseAdmin.from("siswa").select("id, nama, kelas").order("nama"),
        supabaseAdmin.from("jurnal").select("siswa_id, durasi_jam, status"),
    ]);
    if (s.error) throw new Error("Gagal memuat siswa: " + s.error.message);
    if (j.error) throw new Error("Gagal memuat jurnal : " + j.error.message);

    const semua = j.data as { siswa_id: number; durasi_jam: number; status: Status}[];
    return (s.data as { id: number; nama: string; kelas: string}[]).map((x) => {
        const milik = semua.filter((y) => y.siswa_id === x.id);
        return {
        id: x.id,
        nama: x.nama,
        kelas: x.kelas,
        jurnal: milik.length,
        jam: milik.reduce((t, y) => t + y.durasi_jam, 0),
        menunggu: milik.filter((y) => y.status === "diajukan").length
        }
    })
}

export async function ambilSemuaJurnal(f: {
    status: Status | "";
    siswa: number | null;
}): Promise<BarisJurnal[]> {
    let q = supabaseAdmin
        .from("jurnal")
        .select("*, siswa(nama, kelas)")
        .order("tanggal", { ascending: false});
    if (f.status) q = q.eq("status", f.status);
    if (f.siswa !== null) q = q.eq("siswa_id", f.siswa);
    const { data, error} = await q;
    if (error) throw new Error("Gagal memuat jurnal: " + error.message);
    return data as BarisJurnal[];
}

export async function ambilSiswaAdmin(): Promise<SiswaAdmin[]> {
    const { data, error } = await supabaseAdmin 
        .from("siswa")
        .select("id, nama, kelas, tempat_pkl, pembimbing, kode")
        .order("nama");
    if (error) throw new Error("Gagal memuat siswa: " + error.message);
    return data as SiswaAdmin[];
}