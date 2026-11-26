"use sever";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "node:crypto";
import { COOKIE_ADMIN, UMUR_SESI, buatToken } from "@/lib/token";
import { create } from "node:domain";

export type HasilLogin = {pesan:string};

//hash dulu supaya panjangnya sama, lalu baddingkan dengan waktu tetap
function samaAman(a: string, b: string) {
    const ha = createHash("sha256").update(a).digest();
    const hb = createHash("sha256").update(b).digest();
    return timingSafeEqual(ha, hb)
}

export async function masukAdmin(_sebelum: HasilLogin,formData: FormData,): Promise<HasilLogin> {
    const sandi= String(formData.get("sandi") ?? "");
    const dari = String(formData.get("dari") ?? "");
    const benar = process.env.ADMIN_PASSWORD;
    if(!benar || !samaAman(sandi, benar)) return {pesan: "Kata sandi salah"};

    (await cookies()).set(COOKIE_ADMIN, await buatToken("admin"), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: UMUR_SESI
    });
    //hanya boleh kembali ke halaman admin(mencegah dilempat ke situs lain)
    redirect(dari.startsWith("/admin") ? dari : "/admin");
}

export async function keluarAdmin() {
    (await cookies()).delete(COOKIE_ADMIN);
    redirect("/login")
}