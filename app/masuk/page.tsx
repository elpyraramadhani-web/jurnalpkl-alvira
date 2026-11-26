import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_MURID, bacaToken } from "@/lib/token";
import FormMasuk from "@/components/FormMasuk";
import { masukMurid } from "./actions";

export const metadata: Metadata = {title: "Masuk Murid"};

export default async function Masuk() {
    //sudah masuk? tidak perlu melihat formulir lagi
     if ((await bacaToken((await cookies()).get(COOKIE_MURID)?.value, "murid")) !== null) {
    redirect("/jurnal");
    }
    return(
        <FormMasuk
            judul="Masuk Murid"
            petunjuk="Masukan kode siswa dari guru pembimbingmu"
            label="Kode siswa"
            nama="kode"
            placeholder="PKL-A1N1"
            aksi={masukMurid}
        />
    );
}
