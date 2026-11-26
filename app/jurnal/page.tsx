import { keluarMurid } from "@/app/masuk/actions";
import { ambilSiswa } from "@/data/ambil";
import { pastikanMurid } from "@/lib/sesi";

export default async function Jurnal() {
  const siswaId = await pastikanMurid();
  const siswa = await ambilSiswa(siswaId);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Jurnal Saya (sementara)</h1>
      <p className="mt-2">Masuk sebagai {siswa?.nama}</p>
      <form action={keluarMurid} className="mt-4">
        <button className="text-red-600 underline">Keluar</button>
      </form>
    </main>
  );
}