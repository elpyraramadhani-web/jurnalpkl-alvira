import Link from "next/link";

const fitur = [
  { judul: "Isi jurnal harian", isi: "Tanggal, kegiatan, kompetensi, dan durasi jam." },
  { judul: "Pantau status", isi: "Diajukan, disetujui, atau perlu revisi." },
  { judul: "Catatan revisi", isi: "Lihat masukan guru lalu perbaiki jurnalmu." },
];

export default function Beranda() {
  return (
    <div>
      <section className="py-10 text-center">
        <h1 className="text-4xl font-bold">Catat jurnal PKL-mu setiap hari</h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Isi kegiatan, pantau status persetujuan, dan lihat catatan revisi dari guru pembimbing dalam satu tempat.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/masuk" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Masuk dengan kode siswa
          </Link>
          <Link href="/login" className="rounded border bg-white px-4 py-2 hover:bg-slate-100">
            Masuk admin
          </Link>
        </div>
      </section>
      <section className="grid gap-5 md:grid-cols-3">
        {fitur.map((f) => (
          <div key={f.judul} className="rounded-xl border bg-white p-6">
            <h2 className="mb-2 text-lg font-bold">{f.judul}</h2>
            <p className="text-sm text-slate-600">{f.isi}</p>
          </div>
        ))}
      </section>
    </div>
  );
}