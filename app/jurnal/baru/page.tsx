import type { Metadata } from "next";
import { Suspense } from "react";
import FormJurnal from "@/components/FormJurnal";
import { simpanJurnal } from "@/app/jurnal/actions";
import { pastikanMurid } from "@/lib/sesi";
import { batasTanggal } from "@/lib/aturan";

export const metadata: Metadata = { title: "Jurnal Baru" };

async function IsiForm() {
  await pastikanMurid(); // dulu: membaca cookie, supaya "hari ini" tidak membeku saat build
  const { min, max } = batasTanggal();
  return (
    <FormJurnal
      aksi={simpanJurnal}
      awal={{ tanggal: max, kegiatan: "", kompetensi: "", durasi: "" }}
      min={min}
      max={max}
      tombol="Simpan jurnal"
    />
  );
}

export default function Baru() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Jurnal Baru</h1>
      <Suspense fallback={<p className="text-slate-500">Memuat...</p>}>
        <IsiForm />
      </Suspense>
    </div>
  );
}