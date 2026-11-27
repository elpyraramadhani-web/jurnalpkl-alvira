"use client";
import { useActionState } from "react";
import { tambahSiswa, type HasilSiswa, type KolomSiswa } from "@/app/admin/actions";

const KOLOM: {nama: KolomSiswa; label: string; placeholder: string} [] =[
    {nama: "nama", label: "Nama", placeholder: "Nama lengkap"},
    {nama: "kelas", label: "Kelas", placeholder: "Contoh: XII TKJ 1"},
    {nama: "tempat_pkl", label: "Tempat PKL", placeholder: "Nama perusahaan atau instansi"},
    {nama: "pembimbing", label: "Pembimbing", placeholder: "Nama guru pembimbing"}
];

export default function FormSiswa() {
    const awal: HasilSiswa = {
        pesan: "",
        galat: {},
        isian: { nama: "", kelas: "", tempat_pkl: "", pembimbing: ""}
    };
    const [hasil, kirim, sedangKirim] = useActionState(tambahSiswa, awal);

     return (
    <form action={kirim} className="mb-6 space-y-3 rounded-xl border bg-white p-6">
      <h2 className="text-lg font-semibold">Tambah siswa</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {KOLOM.map((k) => (
          <div key={k.nama}>
            <label htmlFor={k.nama} className="mb-1 block text-sm font-semibold">{k.label}</label>
            <input
              id={k.nama}
              name={k.nama}
              defaultValue={hasil.isian[k.nama]}
              placeholder={k.placeholder}
              className={`block w-full rounded border px-3 py-2 ${hasil.galat[k.nama] ? "border-red-600" : ""}`}
            />
            {hasil.galat[k.nama] && (
              <p className="mt-1 text-sm text-red-700">{hasil.galat[k.nama]}</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600">Kode siswa dibuat otomatis setelah disimpan.</p>
      {hasil.pesan && <p className="text-red-700">{hasil.pesan}</p>}
      <button
        disabled={sedangKirim}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {sedangKirim ? "Menyimpan..." : "Tambah siswa"}
      </button>
    </form>
  );
}