import type { Metadata } from "next";
import FormJurnal from "@/components/FormJurnal";
import { simpanJurnal } from "@/app/jurnal/actions";
import { pastikanMurid } from "@/lib/sesi";
import { batasTanggal } from "@/lib/aturan";

export const metadata: Metadata = { title: "Jurnal Baru" };

export default async function Baru() {
  await pastikanMurid(); // membaca cookie: halaman dibuat saat dibuka, jadi "hari ini" tidak membeku saat build
  const { min, max } = batasTanggal();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Jurnal Baru</h1>
      <FormJurnal
        aksi={simpanJurnal}
        awal={{ tanggal: max, kegiatan: "", kompetensi: "", durasi: "" }}
        min={min}
        max={max}
        tombol="Simpan jurnal"
      />
    </div>
  );
}