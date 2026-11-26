"use client";
import { useActionState } from "react";
import Link from "next/link";
import type { HasilJurnal } from "@/app/jurnal/actions";
import type { IsianJurnal } from "@/lib/aturan";

function Galat({ id, teks }: { id: string; teks?: string }) {
  return teks ? (
    <p id={id} className="mt-1 text-sm text-red-700">
      {teks}
    </p>
  ) : null;
}

export default function FormJurnal({
  aksi, awal, id, catatan, min, max, tombol, keterangan,
}: {
  aksi: (sebelum: HasilJurnal, formData: FormData) => Promise<HasilJurnal>;
  awal: IsianJurnal;
  id?: number;
  catatan?: string | null;
  min?: string;
  max?: string;
  tombol: string;
  keterangan?: string;
}) {
  const [hasil, kirim, sedangKirim] = useActionState<HasilJurnal, FormData>(aksi, {
    pesan: "",
    galat: {},
    isian: awal,
  });
  const i = hasil.isian;
  const g = hasil.galat;
  const kolom = (galat?: string) =>
    `block w-full rounded border px-3 py-2 ${galat ? "border-red-600" : ""}`;

  return (
    <form action={kirim} className="max-w-xl space-y-4 rounded-xl border bg-white p-6">
      {id !== undefined && <input type="hidden" name="id" value={id} />}
      {catatan && (
        <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-800">
          <strong>Catatan guru:</strong> {catatan}
        </div>
      )}

      <div>
        <label htmlFor="tanggal" className="mb-1 block text-sm font-semibold">Tanggal</label>
        <input
          id="tanggal" name="tanggal" type="date" min={min} max={max}
          defaultValue={i.tanggal} aria-describedby="g-tanggal" className={kolom(g.tanggal)}
        />
        <Galat id="g-tanggal" teks={g.tanggal} />
        <p className="mt-1 text-xs text-slate-600">
          Tidak boleh masa depan, paling jauh 7 hari ke belakang.
        </p>
      </div>

      <div>
        <label htmlFor="kegiatan" className="mb-1 block text-sm font-semibold">Kegiatan</label>
        <textarea
          id="kegiatan" name="kegiatan" rows={5} defaultValue={i.kegiatan}
          aria-describedby="g-kegiatan" className={kolom(g.kegiatan)}
        />
        <Galat id="g-kegiatan" teks={g.kegiatan} />
        <p className="mt-1 text-xs text-slate-600">30 sampai 500 huruf.</p>
      </div>

      <div>
        <label htmlFor="kompetensi" className="mb-1 block text-sm font-semibold">Kompetensi</label>
        <input
          id="kompetensi" name="kompetensi" defaultValue={i.kompetensi}
          placeholder="Contoh: Instalasi jaringan" aria-describedby="g-kompetensi"
          className={kolom(g.kompetensi)}
        />
        <Galat id="g-kompetensi" teks={g.kompetensi} />
      </div>

      <div>
        <label htmlFor="durasi" className="mb-1 block text-sm font-semibold">Durasi (jam)</label>
        <input
          id="durasi" name="durasi" type="number" min={1} max={10} defaultValue={i.durasi}
          placeholder="1 sampai 10" aria-describedby="g-durasi" className={kolom(g.durasi)}
        />
        <Galat id="g-durasi" teks={g.durasi} />
      </div>

      {keterangan && <p className="text-xs text-slate-600">{keterangan}</p>}
      {hasil.pesan && <p className="text-red-700">{hasil.pesan}</p>}

      <div className="flex gap-3">
        <button
          disabled={sedangKirim}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sedangKirim ? "Menyimpan..." : tombol}
        </button>
        <Link href="/jurnal" className="rounded border px-4 py-2 hover:bg-slate-100">
          Batal
        </Link>
      </div>
    </form>
  );
}