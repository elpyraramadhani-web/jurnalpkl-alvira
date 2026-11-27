"use server";
import { revalidatePath } from "next/cache";
import { permanentRedirect, redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { pastikanAdmin } from "@/lib/sesi";
import { buatKode } from "@/lib/kode";

function kembaliDengan(kembali: string, kunci: "info" | "galat", pesan: string): never {
    const u = new URL(kembali.startsWith("/admin") ? kembali: "/admin", "http://lokal");
    u.searchParams.delete("info");
    u.searchParams.delete("galat");
    u.searchParams.set(kunci, pesan);
    redirect(u.pathname + u.search)
}

function segarkan() {
    revalidatePath("/admin");
    revalidatePath("/admin/siswa");
    revalidatePath("/jurnal");
}

export async function nilaiJurnal(formData: FormData) {
    await pastikanAdmin();
    const id = Number(formData.get("id"));
    const aksi = String(formData.get("aksi") ?? "");
    const catatan = String(formData.get("catatan") ?? "").trim();
    const kembali = String(formData.get("kembali") ?? "")

    if (!Number.isInteger(id) || (aksi !== "setujui" && aksi !== "revisi")) {
        kembaliDengan(kembali, "galat", "Permintaan tidak valid");
    }
    if (aksi === "revisi" && (catatan.length < 5 || catatan.length > 300)) {
        kembaliDengan(kembali, "galat", "Catatan revisi 5 sampai 300 huruf")
    }

    const ubah =
        aksi === "setujui"
            ? {status: "disetujui", catatan: null}
            : {status: "revisi", catatan};

    const { data, error } = await supabaseAdmin
        .from("jurnal")
        .update(ubah)
        .eq("id", id)
        .eq("status", "diajukan")
        .select("id")
        .maybeSingle();
    if (error) kembaliDengan(kembali, "galat", "Penilaian gagal disimpan. Coba lagi")
    if (!data) kembaliDengan(kembali, "galat", "Jurnal ini sudah tidak berstatus Diajukan");

    segarkan();
    kembaliDengan(
        kembali,
        "info",
        aksi === "setujui" ? "Jurnal disetujui" : "Jurnal dikembalikan untuk direvisi"
    );
}

export type KolomSiswa = "nama" | "kelas" | "tempat_pkl" | "pembimbing";
export type HasilSiswa ={
    pesan: string;
    galat: Partial<Record<KolomSiswa,string>>;
    isian: Record<KolomSiswa, string>;
};

export async function tambahSiswa(
    _sebelum: HasilSiswa,
    formData: FormData,
): Promise<HasilSiswa>{
    await pastikanAdmin();
    const teks = (k: string) => String(formData.get(k) ?? "").trim();
    const isian = {
        nama: teks("nama"),
        kelas: teks("kelas"),
        tempat_pkl: teks("tempat_pkl"),
        pembimbing: teks("pembimbing")
    };

    const galat: HasilSiswa["galat"] = {};
    if (isian.nama.length < 3 || isian.nama.length > 40) galat.nama = "Nama 3 sampai 40 huruf";
    if (isian.kelas.length < 2 || isian.kelas.length > 20) galat.kelas = " Kelas 2 smapai 20 huruf";
    if (isian.tempat_pkl.length < 2 || isian.tempat_pkl.length > 60) {
        galat.tempat_pkl= "Tempat PKL 2 sampai 60 huruf";
    }
    if (isian.pembimbing.length < 2 || isian.pembimbing.length > 40) {
        galat.pembimbing = "Pembimbing 2 sampai 40 huruf";
    }
    if (Object.keys(galat).length > 0) {
        return { pesan: "Periksa lagi isian yang merah", galat, isian};
    }

    for (let percobaan = 0; percobaan < 5; percobaan++) {
        const { error } = await supabaseAdmin.from("siswa").insert({...isian, kode: buatKode()});
        if (!error) {
            segarkan();
            kembaliDengan("/admin/siswa", "info", "SIswa ditambahkan, Kode ada di daftar")
        }
        if ( error.code !== "23505") break;
    }
    return { pesan: "Siswa gagal disimpan. Coba lagi", galat: {}, isian};
}

export async function hapusSiswa(formData: FormData) {
  await pastikanAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) kembaliDengan("/admin/siswa", "galat", "Permintaan tidak valid.");

  const { error } = await supabaseAdmin.from("siswa").delete().eq("id", id);
  if (error) {
    const pesan =
      error.code === "23503"
        ? "Siswa ini sudah punya jurnal, jadi tidak bisa dihapus."
        : "Siswa gagal dihapus. Coba lagi.";
    kembaliDengan("/admin/siswa", "galat", pesan);
  }
  segarkan();
  kembaliDengan("/admin/siswa", "info", "Siswa dihapus.");
}