"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { pastikanMurid } from "@/lib/sesi";
import { ambilJurnal } from "@/data/ambil";
import { periksaJurnal, type GalatJurnal, type IsianJurnal } from "@/lib/aturan";

export type HasilJurnal = { pesan: string; galat: GalatJurnal; isian: IsianJurnal};

const PERIKSA = "Periksa lagi isian yang merah";
const KEMBAR = "Kamu sudah punya jurnal untuk tanggal ini";
const TERKUNCI = "Jurnal yang sudah disetujui tidak bisa diubah";

function bacaIsian(f: FormData): IsianJurnal {
    const teks = (k: string) => String(f.get(k) ?? "").trim();
    return{
        tanggal: teks("tanggal"),
        kegiatan: teks("kegiatan"),
        kompetensi: teks("kompetensi"),
        durasi: teks("durasi")
    };
}

export async function simpanJurnal(
    _sebelum: HasilJurnal,
    formData: FormData,
): Promise<HasilJurnal>{
    const siswaId = await pastikanMurid();
    const isian = bacaIsian(formData);
    const galat = periksaJurnal(isian);
    if (Object.keys(galat).length > 0) return {pesan: PERIKSA, galat, isian};

    const { error } = await supabaseAdmin.from("jurnal").insert({
        siswa_id: siswaId,
        tanggal: isian.tanggal,
        kegiatan: isian.kegiatan,
        kompetensi: isian.kompetensi,
        durasi_jam: Number(isian.durasi)
    });
    if (error) {
        if (error.code === "23505") return { pesan: PERIKSA, galat: { tanggal: KEMBAR}, isian};
        return { pesan: "Jurnal gagal disimpan. Coba lagi", galat: {}, isian};
    }

    revalidatePath("/jurnal");
    redirect("/jurnal?info=" + encodeURIComponent("Jurnal tersimpan"))
}

export async function ubahJurnal(
    _sebelum: HasilJurnal,
    formData: FormData,
): Promise<HasilJurnal> {
    const siswaId = await pastikanMurid();
    const id = Number(formData.get("id"));
    const lama = await ambilJurnal(id, siswaId);
    if(!lama) redirect("jurnal")

    const isian = bacaIsian(formData);
    if (lama.status === "disetujui") return { pesan: TERKUNCI, galat: {}, isian };

    const galat = periksaJurnal(isian, lama.tanggal);
    if (Object.keys(galat).length > 0) return { pesan: PERIKSA, galat, isian};

    const { data, error } = await supabaseAdmin
        .from("jurnal")
        .update({
            tanggal: isian.tanggal,
            kegiatan: isian.kegiatan,
            kompetensi: isian.kompetensi,
            durasi_jam: Number(isian.durasi),
            status: "diajukan",
            catatan: null,
        })
        .eq("id", id)
        .eq("siswa_id", siswaId)
        .neq("status", "disetujui")
        .select("id")
        .maybeSingle();
       if (error) {
        if (error.code === "23505") return { pesan: PERIKSA, galat: {tanggal: KEMBAR}, isian};
        return { pesan: "Perubahan gagal disimpan. Coba lagi", galat: {}, isian};
       }
       if (!data) return {pesan: TERKUNCI, galat: {}, isian};

       revalidatePath("/jurnal");
       redirect("jurnal?info=" + encodeURIComponent("Perubahan disimpan"))
}