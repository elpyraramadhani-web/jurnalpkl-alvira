"use client";
import { useActionState } from "react";

export type HasilForm = { pesan: string};

export default function FormMasuk({
    judul, petunjuk, label, nama, placeholder, tipe="text", aksi, dari,
}: {
    judul: string,
    petunjuk: string,
    label: string,
    nama: string,
    placeholder: string,
    tipe?: "text" | "password";
    aksi: (sebelum: HasilForm, formdata: FormData) => Promise<HasilForm>;
    dari?: string
}) {
    const [hasil, kirim, sedangKirim] = useActionState(aksi, {pesan: ""});
    return(
        <form action={kirim} className="mx-auto mt-16 max-w-sm space-y-3 rounded-xl border bg-white p-6">
            <h1 className="text-xl font-bold">{judul}</h1>
            <p className="text-sm text-slate-600">{petunjuk}</p>
            {dari && <input type="hidden" name="dari" value={dari} />}
            <label htmlFor={nama} className="block text-sm font-semibold">{label}</label>
            <input
                id={nama}
                name={nama}
                type={tipe}
                placeholder={placeholder}
                autoComplete="off"
                className={`block w-full rounded border px-3 py-2 ${hasil.pesan ? "border-red-600" : ""}`}
                />
                {hasil.pesan && <p className="text-sm text-red-700">{hasil.pesan}</p>}
                <button
                    disabled={sedangKirim}
                    className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {sedangKirim ? "Memeriksa..." : "Masuk"}
                </button>
        </form>
    )
}