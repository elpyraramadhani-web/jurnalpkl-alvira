import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FormJurnal from "@/components/FormJurnal";
import { ubahJurnal } from "@/app/jurnal/actions";
import { ambilJurnal } from "@/data/ambil";
import { pastikanMurid } from "@/lib/sesi";

export const metadata: Metadata = { title: "Ubah Jurnal" };

export default async function Ubah({ params }: { params: Promise<{ id: string }> }) {
  const siswaId = await pastikanMurid();
  const { id } = await params;
  const jurnal = await ambilJurnal(Number(id), siswaId);
  if (!jurnal) notFound(); // bukan milikmu atau tidak ada: sama-sama 404

  if (jurnal.status === "disetujui") {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-8 text-center">
        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          Disetujui
        </span>
        <h1 className="mb-2 mt-4 text-xl font-bold">Jurnal ini terkunci</h1>
        <p className="mb-5 text-sm text-slate-600">
          Jurnal yang sudah disetujui guru tidak bisa diubah lagi.
        </p>
        <Link href="/jurnal" className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Kembali ke jurnal saya
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Ubah Jurnal</h1>
      <FormJurnal
        aksi={ubahJurnal}
        id={jurnal.id}
        catatan={jurnal.status === "revisi" ? jurnal.catatan : null}
        awal={{
          tanggal: jurnal.tanggal,
          kegiatan: jurnal.kegiatan,
          kompetensi: jurnal.kompetensi,
          durasi: String(jurnal.durasi_jam),
        }}
        tombol="Simpan perubahan"
        keterangan="Setelah disimpan, status kembali menjadi Diajukan dan catatan guru dihapus."
      />
    </div>
  );
}