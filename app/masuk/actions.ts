"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_MURID, UMUR_SESI, buatToken } from "@/lib/token";
import { cariSiswaByKode } from "@/data/ambil";

export type HasilMasuk = {pesan: string};

export async function masukMurid(_sebelum: HasilMasuk,formData: FormData,): Promise<HasilMasuk>{
    const kode = String(formData.get("kode") ?? "").trim().toUpperCase();
    if (kode.length < 6 || kode.length > 12){
        return{pesan: "Kode siswa terdiri dari 6 sampai 12 karakter"};
    }
    const siswa = await cariSiswaByKode(kode);
    if (!siswa) return{ pesan: "Kode siswa tidak ditemukan, periksa lagi"};

    (await cookies()).set(COOKIE_MURID, await buatToken("murid", siswa.id), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: UMUR_SESI
    });
    redirect("/jurnal")
}

export async function keluarMurid() {
    (await cookies()).delete(COOKIE_MURID);
    redirect("/masuk")
}