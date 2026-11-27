import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ambilJurnalSiswa } from "@/data/ambil";
import { pastikanMurid } from "@/lib/sesi";
import { BADGE, NAMA_STATUS, tanggalIndo } from "@/lib/tampilan";

export const metadata: Metadata = { title: "Jurnal Saya" };

type Params = Promise<{ [kunci: string]: string | string[] | undefined }>;

function Kartu({ judul, nilai }: { judul: string; nilai: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="text-sm text-slate-600">{judul}</div>
      <div className="text-3xl font-bold">{nilai}</div>
    </div>
  );
}

// bagian yang membaca cookie, URL, dan database
async function IsiJurnal({ searchParams }: { searchParams: Params }) {
  const siswaId = await pastikanMurid();
  const { info } = await searchParams;
  const daftar = await ambilJurnalSiswa(siswaId);

  const totalJam = daftar.reduce((t, j) => t + j.durasi_jam, 0);
  const menunggu = daftar.filter((j) => j.status === "diajukan").length;
  const revisi = daftar.filter((j) => j.status === "revisi").length;

  return (
    <>
      {typeof info === "string" && (
        <p className="mb-4 rounded bg-green-100 px-3 py-2 text-green-800">{info}</p>
      )}

      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kartu judul="Total jam" nilai={totalJam} />
        <Kartu judul="Jurnal" nilai={daftar.length} />
        <Kartu judul="Menunggu" nilai={menunggu} />
        <Kartu judul="Perlu revisi" nilai={revisi} />
      </div>

      {daftar.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <h2 className="mb-2 text-lg font-semibold">Belum ada jurnal</h2>
          <p className="mb-5 text-sm text-slate-600">Catat kegiatan PKL-mu hari ini.</p>
          <Link href="/jurnal/baru" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            + Jurnal baru
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-600">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Kegiatan</th>
                <th className="p-3">Kompetensi</th>
                <th className="p-3">Jam</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((j) => (
                <tr key={j.id} className="border-t align-top">
                  <td className="p-3 whitespace-nowrap">{tanggalIndo(j.tanggal)}</td>
                  <td className="p-3">
                    {j.kegiatan}
                    {j.status === "revisi" && j.catatan && (
                      <div className="mt-1 text-xs text-red-800">Catatan guru: {j.catatan}</div>
                    )}
                  </td>
                  <td className="p-3">{j.kompetensi}</td>
                  <td className="p-3">{j.durasi_jam}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[j.status]}`}>
                      {NAMA_STATUS[j.status]}
                    </span>
                  </td>
                  <td className="p-3">
                    {j.status === "disetujui" ? (
                      <span className="text-slate-600">Terkunci</span>
                    ) : (
                      <Link href={`/jurnal/${j.id}/ubah`} className="text-blue-700 underline">
                        Ubah
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function Jurnal({ searchParams }: { searchParams: Params }) {
  return (
    <div>
      <div className="mb-5 flex items-center">
        <h1 className="flex-1 text-2xl font-bold">Jurnal Saya</h1>
        <Link href="/jurnal/baru" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          + Jurnal baru
        </Link>
      </div>
      <Suspense fallback={<p className="text-slate-500">Memuat jurnal...</p>}>
        <IsiJurnal searchParams={searchParams} />
      </Suspense>
    </div>
  );
}