import { Suspense } from "react";
import { connection } from "next/server";
import { hitungTabel } from "@/data/ambil";

async function Hasil() {
  await connection(); // dibuat saat dibuka, bukan saat build
  const { siswa, jurnal } = await hitungTabel();
  return (
    <>
      <p>Siswa: {siswa}</p>
      <p>Jurnal: {jurnal}</p>
    </>
  );
}

export default function Uji() {
  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Uji koneksi</h1>
      <Suspense fallback={<p className="text-slate-500">Memuat...</p>}>
        <Hasil />
      </Suspense>
    </main>
  );
}